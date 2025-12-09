import { useState } from 'react';
import { Warehouse, Search, CheckCircle, MapPin, Tag, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StorageGrid from '../components/operations/StorageGrid';
import { mockArticles } from '../data/mockData';
import { emplacementsByZone, suggestOptimalSlot, getZoneStats } from '../data/mockEmplacements';

export default function Stockage() {
  const [tagInput, setTagInput] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [selectedZone, setSelectedZone] = useState('STK-1');
  const [recentStorageHistory, setRecentStorageHistory] = useState([]);

  const handleSearchTag = () => {
    const article = mockArticles.find(a =>
      a.tagId.toLowerCase().includes(tagInput.toLowerCase()) &&
      a.status === 'En production'
    );

    if (article) {
      setCurrentArticle(article);
      const optimalSlot = suggestOptimalSlot(article);
      setSuggestion(optimalSlot);
      if (optimalSlot && optimalSlot.suggested) {
        setSelectedZone(optimalSlot.suggested.zone);
      }
    } else {
      alert('Tag non trouvé ou article déjà stocké');
      setCurrentArticle(null);
      setSuggestion(null);
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
    alert(`Article ${currentArticle.tagId} stocké en ${suggestion.suggested.zone}-${suggestion.suggested.id}!`);

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
        <h1 className="text-3xl font-bold text-card-foreground">Stockage - Rangement Articles</h1>
        <p className="text-muted-foreground mt-1">
          Trouvez l'emplacement optimal pour ranger chaque article
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Scanner Tag */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Scanner ou Saisir Tag</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="TAG-2024-XXXXX"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchTag()}
                  className="font-mono"
                />
                <Button onClick={handleSearchTag}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Scannez le tag RFID ou saisissez le numéro manuellement
              </p>
            </CardContent>
          </Card>

          {/* Article Info */}
          {currentArticle && (
            <Card className="border-primary">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Article à Stocker</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-accent rounded-lg flex items-center justify-center">
                    <Package className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-semibold text-lg text-card-foreground">{currentArticle.designation}</p>
                  <Badge variant="outline" className="mt-2">{currentArticle.category}</Badge>
                </div>

                <div className="space-y-2 bg-accent p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tag ID:</span>
                    <span className="font-mono font-semibold">{currentArticle.tagId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lot (OF):</span>
                    <span className="font-mono">{currentArticle.lot}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Catégorie:</span>
                    <span>{currentArticle.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Provenance:</span>
                    <Badge variant="secondary">{currentArticle.currentZone}</Badge>
                  </div>
                </div>

                {suggestion && suggestion.suggested && (
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                      Emplacement Suggéré
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-mono font-bold text-lg text-card-foreground">
                          {suggestion.suggested.zone} - {suggestion.suggested.id}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Zone {suggestion.suggested.zone} • {zoneStats[suggestion.suggested.zone]?.occupancyRate}% occupation
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleConfirmStorage}
                  className="w-full"
                  size="lg"
                  disabled={!suggestion}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmer Stockage
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Alternatives */}
          {suggestion && suggestion.alternatives && suggestion.alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emplacements Alternatifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestion.alternatives.map((alt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotClick(alt, 'alternative')}
                      className="w-full flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/30 rounded hover:bg-yellow-500/20 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-yellow-600" />
                        <span className="font-mono text-sm font-semibold">{alt.zone} - {alt.id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Vide</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zone Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Zones Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(zoneStats).map(([zone, stats]) => (
                <div key={zone} className="flex items-center justify-between p-2 bg-accent rounded">
                  <span className="text-sm font-semibold">{zone}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{stats.empty} places libres</p>
                    <p className="text-xs text-muted-foreground">{stats.occupancyRate}% occupation</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Storage Grid */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Plan de la Zone de Stockage</CardTitle>
                <div className="flex space-x-2">
                  {['STK-1', 'STK-2', 'STK-3'].map(zone => (
                    <Button
                      key={zone}
                      variant={selectedZone === zone ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedZone(zone)}
                    >
                      {zone}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StorageGrid
                zone={selectedZone}
                emplacements={emplacementsByZone[selectedZone]}
                highlightSlot={suggestion?.suggested?.zone === selectedZone ? suggestion.suggested.id : null}
                alternativeSlots={suggestion?.alternatives?.filter(a => a.zone === selectedZone) || []}
                mode="stockage"
                onSlotClick={handleSlotClick}
              />
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique Stockage Récent</CardTitle>
            </CardHeader>
            <CardContent>
              {recentStorageHistory.length > 0 ? (
                <div className="space-y-2">
                  {recentStorageHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucun stockage récent
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
