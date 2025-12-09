import { useState, useMemo, useEffect } from 'react';
import { PackageSearch, CheckCircle, AlertCircle, MapPin, Box, Clock, TrendingUp, ArrowRight, Truck, ClipboardList, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StorageGrid from '../components/operations/StorageGrid';
import { getPickableCommandes, getCommandeProgress, getNextArticleToPick, getCommandeById } from '../data/mockCommandes';
import { emplacementsByZone } from '../data/mockEmplacements';

export default function Picking() {
  const [selectedCommandeId, setSelectedCommandeId] = useState('');
  const [pickedItems, setPickedItems] = useState([]);
  const [currentZone, setCurrentZone] = useState('STK-1');
  const [pickingHistory, setPickingHistory] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  // Get orders ready for picking (industrial flux: Stock -> Picking)
  const pickableCommandes = useMemo(() => getPickableCommandes(), [completedOrders]);

  const selectedCommande = useMemo(() => {
    return getCommandeById(selectedCommandeId);
  }, [selectedCommandeId]);

  const articleToPick = useMemo(() => {
    if (!selectedCommande) return null;
    return getNextArticleToPick(selectedCommande.id);
  }, [selectedCommande, pickedItems]); // Re-calculate when pickedItems changes

  const progress = selectedCommande ? getCommandeProgress(selectedCommande) : 0;

  // Auto-switch zone when article to pick is in a different zone
  useEffect(() => {
    if (articleToPick && articleToPick.zone) {
      setCurrentZone(pickableCommandes.length > 0 && selectedCommande ? articleToPick.zone : 'STK-1');
    }
  }, [articleToPick, selectedCommande]);

  const handleConfirmPicking = () => {
    if (!articleToPick || !articleToPick.slot) {
      alert('Aucun article à picker ou emplacement introuvable');
      return;
    }

    // Add to picking history
    const historyEntry = {
      time: new Date().toLocaleTimeString('fr-FR'),
      tagId: articleToPick.article.tagId,
      designation: articleToPick.article.designation,
      slot: articleToPick.slot.id,
      zone: articleToPick.zone,
    };

    setPickingHistory([historyEntry, ...pickingHistory.slice(0, 4)]);
    setPickedItems([...pickedItems, articleToPick.article.id]);

    // Update the article line picked count (simulate backend update)
    if (articleToPick.articleLine) {
        if (articleToPick.piece) {
            articleToPick.piece.picked = true;
            // Also increment total picked count for the order if desired, or relying on piece logic
            // For now, let's increment the order total to show progress
            selectedCommande.pickedArticles += 1;
        } else {
            articleToPick.articleLine.picked += 1;
            selectedCommande.pickedArticles += 1;
        }
    }

    // Check if commande is complete
    const nextArticle = getNextArticleToPick(selectedCommande.id);
    if (!nextArticle) {
       // Order complete
       setCompletedOrders([...completedOrders, selectedCommande.id]);
    }
  };

  const handleCommandeSelect = (commande) => {
    setSelectedCommandeId(commande.id);
    setPickedItems([]); // Reset local session picks (in real app, fetch from backend)
    setPickingHistory([]);
  };

  const isOrderComplete = selectedCommande && selectedCommande.pickedArticles === selectedCommande.totalArticles;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Stats */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" />
            Picking & Préparation
        </h1>
        <p className="text-muted-foreground mt-1">
            Préparez les commandes client en collectant les articles en stock
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Panel - Commandes List */}
        <div className="xl:col-span-1 space-y-4">
          <Card className="flex flex-col h-full pt-0 gap-1">
            <CardHeader className="py-3 bg-muted/30">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Commandes à Préparer ({pickableCommandes.filter(c => !completedOrders.includes(c.id)).length})
              </CardTitle>
            </CardHeader>
            <div className="flex-1 px-4 py-2 overflow-y-auto">
                <div className="space-y-2">
                    {pickableCommandes.map(commande => {
                        const isComplete = completedOrders.includes(commande.id) || commande.pickedArticles === commande.totalArticles;
                        if (isComplete && commande.id !== selectedCommandeId) return null; // Hide completed unless selected

                        return (
                            <div 
                                key={commande.id}
                                onClick={() => handleCommandeSelect(commande)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary group ${
                                    selectedCommandeId === commande.id 
                                    ? 'bg-primary/5 border-primary ring-1 ring-primary/20' 
                                    : 'bg-card border-border hover:shadow-md'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm">{commande.client.name}</span>
                                    {selectedCommandeId === commande.id && <ArrowRight className="w-4 h-4 text-primary" />}
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                    <span className="font-mono bg-muted px-1 rounded">{commande.id}</span>
                                    <Badge variant={commande.priority === 'high' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                        {commande.priority === 'high' ? 'Urgent' : 'Normal'}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span>Progression</span>
                                        <span className={isComplete ? "text-green-600 font-bold" : ""}>
                                            {commande.pickedArticles}/{commande.totalArticles}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[10px] items-center mb-1">
                                        <span className="text-muted-foreground">Dispo. Stock</span>
                                        <Badge variant="outline" className="h-4 text-[9px] bg-green-50 text-green-700 border-green-200">100%</Badge>
                                    </div>
                                    <Progress value={getCommandeProgress(commande)} className="h-1.5" />
                                </div>
                            </div>
                        );
                    })}
                    {pickableCommandes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Toutes les commandes sont traitées.
                        </div>
                    )}
                </div>
            </div>
          </Card>
        </div>

        {/* Middle Panel - Current Task */}
        <div className="xl:col-span-1 space-y-4">
            {selectedCommande ? (
                isOrderComplete ? (
                    <Card className="border-green-500/50 h-full flex flex-col items-center justify-center text-center p-8 bg-green-50/50 dark:bg-green-900/10">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Commande Prête !</h2>
                        <p className="text-muted-foreground mb-6">Tous les articles ont été collectés pour {selectedCommande.client.name}.</p>
                        <Button variant="outline" onClick={() => setSelectedCommandeId('')}>
                            Retour à la liste
                        </Button>
                    </Card>
                ) : (
                <Card className="border-primary/50 shadow-lg h-full flex flex-col pt-0 gap-0">
                    <CardHeader className="bg-primary/5 py-3 rounded-t-xl">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <PackageSearch className="w-5 h-5 text-primary" />
                            Article à Picker ({selectedCommande.pickedArticles + 1}/{selectedCommande.totalArticles})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 flex-1">
                        {articleToPick ? (
                            <>
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-muted rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner">
                                        <Box className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight px-2">{articleToPick.article.designation}</h3>
                                    <div className="flex gap-2 justify-center flex-wrap">
                                        <Badge variant="secondary">{articleToPick.article.category}</Badge>
                                        <Badge variant="outline" className="font-mono">{articleToPick.article.tagId}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
                                        <div className="relative bg-background border-2 border-indigo-500/30 rounded-xl p-4 text-center">
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Localisation Cible</p>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-muted/50 p-2 rounded">
                                                    <div className="text-[10px] text-muted-foreground">Zone</div>
                                                    <div className="font-bold text-indigo-700 dark:text-indigo-400">{articleToPick.zone}</div>
                                                </div>
                                                <div className="bg-muted/50 p-2 rounded">
                                                    <div className="text-[10px] text-muted-foreground">Allée</div>
                                                    <div className="font-bold text-indigo-700 dark:text-indigo-400">{articleToPick.slot?.row || '-'}</div>
                                                </div>
                                                <div className="bg-muted/50 p-2 rounded">
                                                    <div className="text-[10px] text-muted-foreground">Niveau</div>
                                                    <div className="font-bold text-indigo-700 dark:text-indigo-400">{articleToPick.slot?.col || '-'}</div>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-2 border-t flex justify-center items-center gap-2">
                                                <MapPin className="w-4 h-4 text-indigo-600" />
                                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                                                    {articleToPick.slot?.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        size="lg" 
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 text-base shadow-lg shadow-indigo-600/20"
                                        onClick={handleConfirmPicking}
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Confirmer le Picking
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Scannez le tag ou confirmez manuellement
                                    </p>
                                </div>
                            </>
                        ) : (
                           <div className="text-center py-10">Chargement...</div> 
                        )}
                    </CardContent>
                </Card>
                )
            ) : (
                <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
                    <div>
                        <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Aucune commande sélectionnée</p>
                        <p className="text-sm opacity-70">Sélectionnez une commande dans la liste pour commencer le picking</p>
                    </div>
                </div>
            )}
        </div>

        {/* Right Panel - Grid */}
        <div className="xl:col-span-2 space-y-4">
             <Card className="pt-2 h-full flex flex-col gap-2">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Plan de Navigation</CardTitle>
                    <div className="flex bg-muted p-1 rounded-lg">
                        {['STK-1', 'STK-2', 'STK-3'].map(zone => (
                            <button
                            key={zone}
                            onClick={() => setCurrentZone(zone)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                currentZone === zone 
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
                     {selectedCommande ? (
                        <StorageGrid
                            zone={currentZone}
                            emplacements={emplacementsByZone[currentZone]}
                            highlightSlot={articleToPick && articleToPick.zone === currentZone ? articleToPick.slot?.id : null}
                            pickedSlots={[]} 
                            mode="picking"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-accent/20 rounded-lg">
                            <p className="text-muted-foreground text-sm">Sélectionnez une commande pour voir le plan</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Picking History (Bottom or within same column) */}
            {pickingHistory.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pickingHistory.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-500/30">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <div>
                                    <p className="text-xs font-semibold truncate max-w-[150px]">{entry.designation}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{entry.tagId}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono font-semibold text-primary">{entry.zone}-{entry.slot}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
