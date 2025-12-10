import { useState, useMemo, useEffect } from 'react';
import { PackageSearch, CheckCircle, AlertCircle, MapPin, Box, Clock, TrendingUp, ArrowRight, Truck, ClipboardList, Package } from 'lucide-react';
import { toast } from 'sonner';
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
  
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemSlotMap, setItemSlotMap] = useState({});
  const [itemZoneMap, setItemZoneMap] = useState({}); // New: Map Item -> Zone

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
    if (articleToPick && itemZoneMap[articleToPick.tagId]) {
      const targetZone = itemZoneMap[articleToPick.tagId];
      if(targetZone !== currentZone) setCurrentZone(targetZone);
    }
  }, [articleToPick, selectedCommande, itemZoneMap]);

  // Mapping logic: Assign real slots to order items (Demo Simulation)
  useEffect(() => {
      if (selectedCommande) {
          // Flatten all items first
          let allItems = [];
          selectedCommande.articles.forEach(article => {
             if (article.isMultiPiece && article.pieces) {
                  // Complex items (Salon)
                  article.pieces.forEach(p => allItems.push(p.tagId));
             } else if (article.tagIds && article.tagIds.length > 0) {
                  // Standard items with multiple quantities (e.g. 6 cushions)
                  // Push ALL tagIds, not just the first one
                  article.tagIds.forEach(tag => allItems.push(tag));
             } else {
                  // Fallback for single legacy items
                  allItems.push(article.id);
             }
          });

          const newSlotMap = {};
          const newZoneMap = {};
          
          // Helper to get slots
          const getZoneSlots = (z) => emplacementsByZone[z].slots.filter(s => s.status === 'occupied');
          const slotsSTK1 = getZoneSlots('STK-1')[0] ? getZoneSlots('STK-1') : []; // Safety check
          const slotsSTK2 = getZoneSlots('STK-2')[0] ? getZoneSlots('STK-2') : [];
          const slotsSTK3 = getZoneSlots('STK-3')[0] ? getZoneSlots('STK-3') : [];
          
          // Debug logs/fallbacks if slots empty
          const fallbackSlots = [...slotsSTK1, ...slotsSTK2, ...slotsSTK3];

          // Distribution Logic for Demo
          allItems.forEach((tagId, index) => {
              let targetZone = 'STK-1';
              let targetSlot = null;

              // Custom distribution for specific mocked orders to show multi-zone features
              if (selectedCommande.id === 'CMD-2024-0160') {
                  // Youssef: Mix of Zones (Simulate distributed stock)
                  // 8 items total
                  if (index < 2) { 
                      targetZone = 'STK-1'; 
                      targetSlot = slotsSTK1[index]; 
                  } else if (index < 5) { 
                      targetZone = 'STK-2'; 
                      targetSlot = slotsSTK2[index - 2]; 
                  } else { 
                      targetZone = 'STK-3'; 
                      targetSlot = slotsSTK3[index - 5]; 
                  }
              } 
              else if (selectedCommande.id === 'CMD-2024-0175') {
                  // Aicha: All in STK-3
                  targetZone = 'STK-3'; 
                  targetSlot = slotsSTK3[index];
              } 
              else {
                  // Default (Leila / Others): STK-1
                  targetZone = 'STK-1';
                  targetSlot = slotsSTK1[index];
              }

              // Assign Slot
              if (targetSlot) {
                  newSlotMap[tagId] = targetSlot.id;
                  newZoneMap[tagId] = targetZone;
              } else {
                  // Fallback if we run out of slots in a zone (shouldn't happen in demo but safety first)
                  newSlotMap[tagId] = fallbackSlots[index]?.id || `UNK-${index}`;
                  newZoneMap[tagId] = fallbackSlots[index]?.zone || 'STK-1';
              }
          });

          setItemSlotMap(newSlotMap);
          setItemZoneMap(newZoneMap);
      } else {
          setItemSlotMap({});
          setItemZoneMap({});
          setActiveItemId(null);
      }
  }, [selectedCommandeId]);

  // ... (existing helper logic)

  const handleConfirmPicking = (item) => {
    // 1. Interaction Logic: "Click selectionne, Click again confirms"
    if (activeItemId !== item.tagId) {
        setActiveItemId(item.tagId);
        
        // AUTO-NAVIGATE: If item is in another zone, switch to it
        const itemZone = itemZoneMap[item.tagId];
        if (itemZone && itemZone !== currentZone) {
            setCurrentZone(itemZone);
            toast.info(`Navigation vers ${itemZone}`, { duration: 1500 });
        }
        return; 
    }

    // 2. Confirmation Logic (Active Item Clicked Again)
    const targetItem = item;
    const realSlotId = itemSlotMap[targetItem.tagId] || "Unknown";

    // Add to picking history
    const historyEntry = {
      time: new Date().toLocaleTimeString('fr-FR'),
      tagId: targetItem.tagId || targetItem.article?.tagId,
      designation: targetItem.designation || targetItem.article?.designation,
      slot: realSlotId,
      zone: currentZone,
    };

    setPickingHistory([historyEntry, ...pickingHistory.slice(0, 4)]);
    setPickedItems(prev => [...prev, targetItem.tagId]);

    // Show success toast
    toast.success('Article confirmé', {
      description: `${targetItem.designation || targetItem.article?.designation}`,
    });

    // Update the local mock state for the order (Visual progress)
    selectedCommande.pickedArticles += 1; 

    // Auto-reset selection to allow focusing next item cleanly
    setActiveItemId(null);

    // Check if commande is complete
    if (selectedCommande.pickedArticles >= selectedCommande.totalArticles) {
       // Order complete
       setCompletedOrders([...completedOrders, selectedCommande.id]);
       toast.success("Commande Terminée !", { description: "Tous les articles ont été collectés." });
       // Reset Focus/Grid
       setItemSlotMap({});
       setActiveItemId(null);
    }
  };

  // ...

  // RENDER UPDATES:
  // List Item onClick -> setActiveItemId(item.tagId)
  // Grid Props:
  /*
     targetSlots={Object.values(itemSlotMap)} 
     activeTargetSlot={itemSlotMap[activeItemId]}
     pickedSlots={pickedItems.map(tag => itemSlotMap[tag])} // Map tags to slots!
  */



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
            Préparez les commandes client en collectant les produits en stock
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

        {/* Middle Panel - Picking List */}
        <div className="xl:col-span-1 space-y-4">
            {selectedCommande ? (
                isOrderComplete ? (
                    <Card className="border-green-500/50 h-full flex flex-col items-center justify-center text-center p-8 bg-green-50/50 dark:bg-green-900/10">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Commande Prête !</h2>
                        <p className="text-muted-foreground mb-6">Tous les produits ont été collectés pour {selectedCommande.client.name}.</p>
                        <Button variant="outline" onClick={() => setSelectedCommandeId('')}>
                            Retour à la liste
                        </Button>
                    </Card>
                ) : (
                <Card className="flex flex-col h-full pt-0 gap-1">
                    <CardHeader className="py-3 bg-primary/5 rounded-t-xl">
                         <CardTitle className="flex items-center gap-2 text-base">
                            <PackageSearch className="w-5 h-5 text-primary" />
                            Liste de Picking ({selectedCommande.pickedArticles}/{selectedCommande.totalArticles})
                        </CardTitle>
                    </CardHeader>
                    {/* SCROLLABLE LIST CONTAINER (Max height 400px as requested) */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[450px]">
                        {/* Access all picking items from the mock data helpers which we'll assume extracts flat list */}
                        {/* We need to extract all items from the order here. For now, we reuse the structure but flatten it in render */}
                        {(() => {
                           // Quick helper to flatten order items for display
                           // In a real app this would be a clean selector
                           let allItems = [];
                           selectedCommande.articles.forEach(article => {
                               if(article.isMultiPiece && article.pieces) {
                                   article.pieces.forEach(p => {
                                       allItems.push({...p, designation: p.name, parentName: article.designation, isPiece: true, articleId: article.id });
                                   });
                               } else if (article.tagIds && article.tagIds.length > 0) {
                                   // Split multi-quantity articles into individual picking tasks
                                   article.tagIds.forEach((tagId, i) => {
                                        allItems.push({
                                            ...article,
                                            designation: `${article.designation} (${i+1}/${article.quantity})`,
                                            tagId: tagId,
                                            isPiece: false
                                        });
                                   });
                               } else {
                                   // Fallback for single legacy items
                                    allItems.push({...article, designation: article.designation, isPiece: false });
                               }
                           });

                           return allItems.map((item, idx) => {
                               const slotId = itemSlotMap[item.tagId] || "???";
                               const zoneId = itemZoneMap[item.tagId] || "STK-1";
                               const isPicked = pickedItems.includes(item.tagId);
                               const isActive = activeItemId === item.tagId;
                               
                               return (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        setActiveItemId(item.tagId);
                                        if (zoneId !== currentZone) {
                                            setCurrentZone(zoneId);
                                            toast.info(`Navigation vers ${zoneId}`);
                                        }
                                    }}
                                    className={`p-3 rounded-lg border flex flex-col gap-2 transition-all cursor-pointer ${
                                        isPicked 
                                            ? "bg-green-50 border-green-200 opacity-60" 
                                            : isActive 
                                                ? "bg-primary/5 border-primary ring-1 ring-primary/20 shadow-md scale-[1.02]" 
                                                : "bg-card hover:border-primary/50"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-sm leading-tight">{item.designation}</p>
                                            <p className="text-xs text-muted-foreground">{item.tagId}</p>
                                        </div>
                                        {item.ml && <Badge variant="secondary" className="h-5">{item.ml} ml</Badge>}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-1">
                                         <div className={`flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-primary/10 text-primary font-bold" : "bg-muted"}`}>
                                            <MapPin className="w-3 h-3" />
                                            <span>{zoneId} - {slotId}</span> 
                                         </div>
                                         
                                         <Button 
                                            size="sm" 
                                            variant={isPicked ? "outline" : (isActive ? "default" : "secondary")}
                                            className={`h-7 text-xs ${isPicked ? "text-green-600 border-green-200" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Don't trigger select
                                                handleConfirmPicking(item);
                                            }}
                                            disabled={isPicked}
                                         >
                                            {isPicked ? <><CheckCircle className="w-3 h-3 mr-1"/> Fait</> : "Confirmer"}
                                         </Button>
                                    </div>
                                </div>
                               );
                           });
                        })()}
                    </div>
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

        {/* Right Panel - Full Grid */}
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
                            pickedSlots={pickedItems.map(tag => itemSlotMap[tag]).filter(slot => slot)} 
                            targetSlots={Object.keys(itemSlotMap)
                                .filter(tag => itemZoneMap[tag] === currentZone)
                                .map(tag => itemSlotMap[tag])}
                            activeTargetSlot={itemZoneMap[activeItemId] === currentZone ? itemSlotMap[activeItemId] : null}
                            mode="picking"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-accent/20 rounded-lg">
                            <p className="text-muted-foreground text-sm">Sélectionnez une commande pour voir le plan</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
