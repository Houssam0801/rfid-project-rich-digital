import { useState, useMemo } from 'react';
import { PackageSearch, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { getPickableCommandes, getCommandeProgress, getNextArticleToPick } from '../data/mockCommandes';
import { emplacementsByZone } from '../data/mockEmplacements';

export default function Picking() {
  const [selectedCommandeId, setSelectedCommandeId] = useState('');
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [pickedSlots, setPickedSlots] = useState([]);
  const [currentZone, setCurrentZone] = useState('STK-1');

  const pickableCommandes = getPickableCommandes();

  const selectedCommande = useMemo(() => {
    return pickableCommandes.find(c => c.id === selectedCommandeId);
  }, [selectedCommandeId, pickableCommandes]);

  const articleToPick = useMemo(() => {
    if (!selectedCommande) return null;
    return getNextArticleToPick(selectedCommande.id);
  }, [selectedCommande]);

  const progress = selectedCommande ? getCommandeProgress(selectedCommande) : 0;

  const handleConfirmPicking = () => {
    if (articleToPick && articleToPick.slot) {
      // Add slot to picked slots
      setPickedSlots([...pickedSlots, articleToPick.slot.id]);

      // Simulate picking - in real app, would update backend
      alert(`Article ${articleToPick.article.tagId} pické avec succès!`);

      // Move to next article
      const nextArticle = getNextArticleToPick(selectedCommande.id);
      if (!nextArticle) {
        alert('Tous les articles de cette commande ont été pikés!');
      }
    }
  };

  const handleCommandeChange = (commandeId) => {
    setSelectedCommandeId(commandeId);
    setPickedSlots([]);
    setCurrentArticleIndex(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Picking - Préparation Commandes</h1>
        <p className="text-muted-foreground mt-1">
          Localisez et collectez les articles pour chaque commande
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Commande Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Sélecteur de commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sélectionner une Commande</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCommandeId} onValueChange={handleCommandeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une commande..." />
                </SelectTrigger>
                <SelectContent>
                  {pickableCommandes.map(commande => (
                    <SelectItem key={commande.id} value={commande.id}>
                      {commande.id} - {commande.client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCommande && (
            <>
              {/* Commande en cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Commande en Cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">N° Commande</p>
                    <p className="font-mono font-semibold text-primary">{selectedCommande.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-semibold">{selectedCommande.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priorité</p>
                    <Badge variant={selectedCommande.priority === 'high' ? 'destructive' : 'default'}>
                      {selectedCommande.priority === 'high' ? 'Haute' : selectedCommande.priority === 'low' ? 'Basse' : 'Normale'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Progression</p>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-center">{progress}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Article à picker */}
              {articleToPick ? (
                <Card className="border-primary">
                  <CardHeader className="bg-primary/10">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <PackageSearch className="w-5 h-5" />
                      <span>Article à Picker</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-accent rounded-lg flex items-center justify-center">
                        <PackageSearch className="w-10 h-10 text-primary" />
                      </div>
                      <p className="font-semibold text-lg text-card-foreground">{articleToPick.article.designation}</p>
                      <p className="text-sm text-muted-foreground">{articleToPick.article.category}</p>
                    </div>

                    <div className="space-y-2 bg-accent p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Emplacement:</span>
                        <span className="font-mono font-semibold text-primary">{articleToPick.slot?.id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Zone:</span>
                        <Badge variant="secondary">{articleToPick.zone || 'N/A'}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tag ID:</span>
                        <span className="font-mono text-sm">{articleToPick.article.tagId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Restants:</span>
                        <span className="font-semibold">{articleToPick.remaining}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmPicking}
                      className="w-full"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmer Picking
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-lg text-card-foreground">Commande Terminée!</p>
                    <p className="text-sm text-muted-foreground">Tous les articles ont été pikés</p>
                  </CardContent>
                </Card>
              )}

              {/* Liste articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Articles de la Commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCommande.articles.map((article, index) => {
                      const isPicked = article.picked === article.quantity;
                      const isInProgress = article.picked > 0 && article.picked < article.quantity;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            isPicked ? 'bg-green-500/10 border border-green-500/30' :
                            isInProgress ? 'bg-yellow-500/10 border border-yellow-500/30' :
                            'bg-accent'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {isPicked ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : isInProgress ? (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs">{article.designation}</span>
                          </div>
                          <span className="text-xs font-semibold">
                            {article.picked}/{article.quantity}
                          </span>
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Plan de la Zone de Stockage</CardTitle>
                {articleToPick && (
                  <div className="flex space-x-2">
                    {['STK-1', 'STK-2', 'STK-3'].map(zone => (
                      <Button
                        key={zone}
                        variant={currentZone === zone ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentZone(zone)}
                      >
                        {zone}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCommande && articleToPick ? (
                <StorageGrid
                  zone={currentZone}
                  emplacements={emplacementsByZone[currentZone]}
                  highlightSlot={articleToPick.zone === currentZone ? articleToPick.slot?.id : null}
                  pickedSlots={pickedSlots}
                  mode="picking"
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <PackageSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">Sélectionnez une commande</p>
                    <p className="text-sm">pour commencer le picking</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
