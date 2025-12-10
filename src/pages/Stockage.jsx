import { useState, useMemo } from 'react';
import { Warehouse, Search, CheckCircle, MapPin, Tag, Package, ArrowRight, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StorageGrid from '../components/operations/StorageGrid';
import { mockArticles } from '../data/mockData';
import { emplacementsByZone, suggestOptimalSlot, getZoneStats, getInboundArticles } from '../data/mockEmplacements';

export default function Stockage() {
  const [tagInput, setTagInput] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [selectedZone, setSelectedZone] = useState('STK-1');
  const [recentStorageHistory, setRecentStorageHistory] = useState([]);
  
  // Get inbound articles (ready to store)
  const inboundArticles = useMemo(() => getInboundArticles(), []);

  const handleSearchTag = (searchTag = tagInput) => {
    const article = mockArticles.find(a => 
      a.tagId.toLowerCase() === searchTag.toLowerCase() && 
      (a.status === 'En production' || a.status === 'En réception')
    );

    if (article) {
      selectArticleForStorage(article);
    } else {
      alert('Tag non trouvé ou produit déjà stocké');
      setCurrentArticle(null);
      setSuggestion(null);
    }
  };

  const selectArticleForStorage = (article) => {
    setCurrentArticle(article);
    setTagInput(article.tagId);
    
    // Get suggestion
    const optimalSlot = suggestOptimalSlot(article);
    setSuggestion(optimalSlot);
    
    if (optimalSlot && optimalSlot.suggested) {
      setSelectedZone(optimalSlot.suggested.zone);
    }
  };

  const handleConfirmStorage = () => {
    if (!currentArticle || !suggestion) return;

    const timestamp = new Date().toLocaleTimeString('fr-FR');
    const newEntry = {
      time: timestamp,
      tagId: currentArticle.tagId,
      designation: currentArticle.designation,
      slot: suggestion.suggested.id,
      zone: suggestion.suggested.zone,
    };

    setRecentStorageHistory([newEntry, ...recentStorageHistory.slice(0, 4)]);

    // Simulation Update (In a real app, this would update the backend)
    currentArticle.status = 'En stock';
    currentArticle.currentZone = suggestion.suggested.zone;

    // Show success toast
    toast.success('Article stocké avec succès!', {
      description: `${currentArticle.designation} → ${suggestion.suggested.zone}-${suggestion.suggested.id}`,
    });

    // Reset
    setCurrentArticle(null);
    setSuggestion(null);
    setTagInput('');
  };

  const handleSlotClick = (slot, status) => {
    if (status === 'suggested' || status === 'alternative') {
      setSuggestion({
        ...suggestion,
        suggested: slot,
      });
    }
  };

  const zoneStats = {
    'STK-1': getZoneStats('STK-1'),
    'STK-2': getZoneStats('STK-2'),
    'STK-3': getZoneStats('STK-3'),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-primary" />
          Stockage & Rangement
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez l'entrée en stock des produits depuis la production
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Inbound List & Search */}
        <div className="xl:col-span-1 space-y-3">
            
          {/* Manual Search */}
          <Card  className="pt-0 gap-0">
            <CardHeader className="py-2">
              <CardTitle className="text-base">Scanner un Produit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Scannez Tag RFID..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchTag()}
                  className="font-mono"
                />
                <Button size="icon" onClick={() => handleSearchTag()}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inbound List */}
          <Card className="pt-0 flex flex-col max-h-[450px] gap-1">
            <CardHeader className="py-3 bg-muted/30">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Produits en Attente ({inboundArticles.filter(a => a.status === 'En production').length})
              </CardTitle>
            </CardHeader>
            <div className="flex-1 px-4  h-[350px] overflow-y-auto">
              <div className="space-y-2">
                {inboundArticles.filter(a => a.status === 'En production').map((article) => (
                  <div 
                    key={article.id}
                    onClick={() => selectArticleForStorage(article)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary group ${
                      currentArticle?.id === article.id 
                        ? 'bg-primary/5 border-primary ring-1 ring-primary/20' 
                        : 'bg-card border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm line-clamp-1">{article.designation}</span>
                      {currentArticle?.id === article.id && <CheckCircle className="w-3 h-3 text-primary" />}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="font-mono bg-muted px-1 rounded">{article.tagId}</span>
                      <Badge variant="outline" className="text-[10px] h-5">{article.category}</Badge>
                    </div>
                  </div>
                ))}
                {inboundArticles.filter(a => a.status === 'En production').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucun produit en attente
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Column: Current Article Action */}
        <div className="xl:col-span-1 space-y-4">
           {currentArticle ? (
            <Card className=" pt-0 border-primary/50 shadow-lg h-full flex flex-col ">
              <CardHeader className="bg-primary/5 py-2 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-primary" />
                  Produit Sélectionné
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 flex-1">
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-muted rounded-2xl mx-auto flex items-center justify-center mb-2">
                      <Package className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <h3 className="font-bold text-lg leading-tight">{currentArticle.designation}</h3>
                   <div className="flex gap-2 justify-center flex-wrap">
                      <Badge variant="secondary">{currentArticle.category}</Badge>
                      <Badge variant="outline">{currentArticle.size}</Badge>
                   </div>
                </div>

                <div className="space-y-3 bg-muted/40 p-4 rounded-xl border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tag ID</span>
                    <span className="font-mono font-bold text-foreground">{currentArticle.tagId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lot (OF)</span>
                    <span className="font-mono">{currentArticle.lot}</span>
                  </div>
                </div>

                {suggestion && suggestion.suggested ? (
                   <div className="space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full" />
                        <div className="relative bg-background border-2 border-green-500 rounded-xl p-4 text-center">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Emplacement Suggéré</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <span className="text-3xl font-black text-green-700 dark:text-green-400 font-mono">
                                  {suggestion.suggested.zone}-{suggestion.suggested.id}
                                </span>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-none">
                              Zone Optimale
                            </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-base shadow-lg shadow-green-600/20"
                        onClick={handleConfirmStorage}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmer le Stockage
                      </Button>
                   </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50 text-center">
                    <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">Recherche d'emplacement...</p>
                  </div>
                )}
              </CardContent>
            </Card>
           ) : (
             <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
               <div>
                 <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p className="font-medium">Aucun produit sélectionné</p>
                 <p className="text-sm opacity-70">Sélectionnez un produit dans la liste ou scannez un tag</p>
               </div>
             </div>
           )}
        </div>

        {/* Right Column: Visual Grid */}
        <div className="xl:col-span-2 space-y-4">
           
           <Card className="pt-2 h-full flex flex-col gap-2">
              <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Cartographie Stockage</CardTitle>
                    <div className="flex bg-muted p-1 rounded-lg">
                       {['STK-1', 'STK-2', 'STK-3'].map(zone => (
                         <button
                           key={zone}
                           onClick={() => setSelectedZone(zone)}
                           className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                             selectedZone === zone 
                               ? 'bg-background shadow-sm text-foreground' 
                               : 'text-muted-foreground hover:text-foreground'
                           }`}
                         >
                           {zone}
                         </button>
                       ))}
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-[400px]">
                 <StorageGrid 
                    zone={selectedZone}
                    emplacements={emplacementsByZone[selectedZone]}
                    highlightSlot={suggestion?.suggested?.zone === selectedZone ? suggestion.suggested.id : null}
                    alternativeSlots={suggestion?.alternatives?.filter(a => a.zone === selectedZone) || []}
                    mode="stockage"
                    onSlotClick={handleSlotClick}
                    hideOccupied={true}
                 />
              </CardContent>
           </Card>

           {/* Recent History */}
           {/* {recentStorageHistory.length > 0 && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {recentStorageHistory.map((item, i) => (
                 <div key={i} className="bg-card border rounded-lg p-3 text-xs shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-bold">Stocké</span>
                    </div>
                    <div className="font-medium truncate">{item.designation}</div>
                    <div className="text-muted-foreground mt-1 flex justify-between">
                       <span>{item.zone}-{item.slot}</span>
                       <span>{item.time}</span>
                    </div>
                 </div>
               ))}
             </div>
           )} */}

        </div>

      </div>
    </div>
  );
}
