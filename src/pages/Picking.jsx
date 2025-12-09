import { useState, useMemo, useEffect } from 'react';
import { PackageSearch, CheckCircle, AlertCircle, MapPin, Box, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StorageGrid from '../components/operations/StorageGrid';
import { getPickableCommandes, getCommandeProgress, getNextArticleToPick, getCommandeById } from '../data/mockCommandes';
import { emplacementsByZone } from '../data/mockEmplacements';

export default function Picking() {
  const [selectedCommandeId, setSelectedCommandeId] = useState('');
  const [pickedItems, setPickedItems] = useState([]);
  const [currentZone, setCurrentZone] = useState('STK-1');
  const [pickingHistory, setPickingHistory] = useState([]);

  const pickableCommandes = getPickableCommandes();

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
      setCurrentZone(articleToPick.zone);
    }
  }, [articleToPick]);

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
    articleToPick.articleLine.picked += 1;

    // Check if commande is complete
    const nextArticle = getNextArticleToPick(selectedCommande.id);
    if (!nextArticle) {
      setTimeout(() => {
        alert(`✅ Commande ${selectedCommande.id} terminée!\nTous les articles ont été pickés avec succès.`);
      }, 100);
    }
  };

  const handleCommandeChange = (commandeId) => {
    setSelectedCommandeId(commandeId);
    setPickedItems([]);
    setPickingHistory([]);
    setCurrentZone('STK-1');
  };

  const getTotalItemsToPick = () => {
    if (!selectedCommande) return 0;
    return selectedCommande.articles.reduce((sum, art) => sum + art.quantity, 0);
  };

  const getPickedItemsCount = () => {
    if (!selectedCommande) return 0;
    return selectedCommande.articles.reduce((sum, art) => sum + art.picked, 0);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
            <PackageSearch className="w-8 h-8 text-primary" />
            Picking - Préparation Commandes
          </h1>
          <p className="text-muted-foreground mt-1">
            Localisez et collectez les articles pour chaque commande
          </p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Commande Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Sélecteur de commande */}
          <Card className="py-2 gap-3">
            <CardHeader className="">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sélectionner une Commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCommandeId} onValueChange={handleCommandeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une commande..."/>
                </SelectTrigger>
                <SelectContent>
                  {pickableCommandes.length === 0 ? (
                    <SelectItem value="none" disabled>Aucune commande disponible</SelectItem>
                  ) : (
                    pickableCommandes.map(commande => (
                      <SelectItem key={commande.id} value={commande.id}>
                        {commande.id} - {commande.client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCommande && (
            <>
              {/* Commande en cours */}
              <Card className="border-primary/30 pt-0 gap-2">
                <CardHeader className="py-2 bg-primary/5 rounded-t-xl">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Commande en Cours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">N° Commande</p>
                      <p className="font-mono font-semibold text-sm text-primary">{selectedCommande.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Priorité</p>
                      <Badge variant={selectedCommande.priority === 'high' ? 'destructive' : 'default'} className="text-xs">
                        {selectedCommande.priority === 'high' ? 'Haute' : selectedCommande.priority === 'low' ? 'Basse' : 'Normale'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="font-semibold text-sm">{selectedCommande.client.name}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Progression</p>
                      <p className="text-xs font-semibold text-primary">{progress}%</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Article à picker */}
              {articleToPick ? (
                <Card className="border-2 border-red-500/50 shadow-lg pt-0 gap-2">
                  <CardHeader className="py-2 bg-red-500/10 rounded-t-xl">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PackageSearch className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 dark:text-red-400">Article à Picker Maintenant</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="text-center pb-3 border-b">

                      <p className="font-bold text-lg text-card-foreground">{articleToPick.article.designation}</p>
                      <Badge variant="outline" className="mt-1">{articleToPick.article.category}</Badge>
                    </div>

                    <div className="space-y-3 bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-2 border-red-500/30">
                      <div className="text-center pb-2 border-b border-red-500/20">
                        <p className="text-xs text-muted-foreground mb-1">📍 LOCALISATION</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Zone:</span>
                            <Badge variant="destructive" className="font-mono font-bold text-sm">
                              {articleToPick.zone || 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Allée:</span>
                            <span className="font-mono font-bold text-lg text-red-600">
                              {articleToPick.slot?.row || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Niveau:</span>
                            <span className="font-mono font-bold text-lg text-red-600">
                              {articleToPick.slot?.col || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Emplacement:</span>
                            <Badge variant="destructive" className="font-mono font-bold text-base">
                              {articleToPick.slot?.id || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Tag RFID:</span>
                          <span className="font-mono text-xs font-semibold">{articleToPick.article.tagId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Taille:</span>
                          <span className="text-xs font-semibold">{articleToPick.article.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Restants:</span>
                          <Badge variant="secondary" className="text-xs">{articleToPick.remaining} article(s)</Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmPicking}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmer Picking
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-500/50">
                  <CardContent className="py-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                    <p className="font-bold text-lg text-green-700 dark:text-green-400">Commande Terminée!</p>
                    <p className="text-sm text-muted-foreground mt-1">Tous les articles ont été pickés avec succès</p>
                  </CardContent>
                </Card>
              )}

              {/* Liste articles */}
              <Card className="py-2 gap-2">
                <CardHeader className="">
                  <CardTitle className="text-sm">Liste des Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedCommande.articles.map((article, index) => {
                      const isPicked = article.picked === article.quantity;
                      const isInProgress = article.picked > 0 && article.picked < article.quantity;
                      const isCurrent = articleToPick && articleToPick.articleLine === article;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded text-sm border ${
                            isCurrent ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-sm' :
                            isPicked ? 'bg-green-50 dark:bg-green-900/20 border-green-500/30' :
                            isInProgress ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/30' :
                            'bg-accent border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            {isCurrent ? (
                              <ArrowRight className="w-4 h-4 text-red-500 animate-pulse" />
                            ) : isPicked ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : isInProgress ? (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs truncate">{article.designation}</span>
                          </div>
                          <Badge variant="outline" className="text-xs ml-2">
                            {article.picked}/{article.quantity}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Panel - Storage Grid */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="gap-2 pt-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Plan de la Zone de Stockage
                </CardTitle>
                {articleToPick && (
                  <div className="flex space-x-2">
                    {['STK-1', 'STK-2', 'STK-3'].map(zone => (
                      <Button
                        key={zone}
                        variant={currentZone === zone ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentZone(zone)}
                        className={currentZone === zone && articleToPick.zone === zone ? 'ring-2 ring-red-400' : ''}
                      >
                        {zone}
                        {articleToPick.zone === zone && <span className="ml-1">🔴</span>}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCommande ? (
                <StorageGrid
                  zone={currentZone}
                  emplacements={emplacementsByZone[currentZone]}
                  highlightSlot={articleToPick && articleToPick.zone === currentZone ? articleToPick.slot?.id : null}
                  pickedSlots={[]}
                  mode="picking"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-accent/30 rounded-lg border-2 border-dashed border-border">
                  <div className="text-center">
                    <PackageSearch className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-lg font-semibold text-muted-foreground">Sélectionnez une commande</p>
                    <p className="text-sm text-muted-foreground/70">pour commencer le picking</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historique récent */}
          {pickingHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Historique de Picking (Session actuelle)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pickingHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm font-semibold">{entry.designation}</p>
                          <p className="text-xs text-muted-foreground font-mono">{entry.tagId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-semibold text-primary">
                          {entry.zone} - {entry.slot}
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
