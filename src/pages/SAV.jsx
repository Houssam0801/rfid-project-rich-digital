import { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, XCircle, Package, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// HARDCODED TEST DATA FOR SAV
const mockSAVData = {
  'TAG-2024-GARANTIE-OK': {
    article: {
      id: 'sav-1',
      tagId: 'TAG-2024-GARANTIE-OK',
      category: 'Matelas',
      designation: 'Matelas Royal 160x200',
      size: '160x200',
      lot: 'LOT-2020-001',
      brand: 'Richbond',
      currentZone: 'Livré',
      status: 'Expédié',
      createdAt: '2020-01-15T08:00:00Z'
    },
    history: {
      totalSejour: '45j 12h',
      totalMouvements: 5,
      deliveryDate: '2020-03-01T14:30:00Z', // Delivered 5 years ago - WARRANTY ACTIVE
      mouvements: [
        {
          zone: 'Zone de production',
          statut: 'En production',
          lecteur: 'READER-PROD-01',
          entree: '2020-01-15T08:00:00Z',
          sortie: '2020-01-17T16:00:00Z',
          duree: '2j 8h'
        },
        {
          zone: 'Zone de Stockage 1',
          statut: 'En stock',
          lecteur: 'READER-STK1-02',
          entree: '2020-01-17T16:00:00Z',
          sortie: '2020-02-10T09:00:00Z',
          duree: '23j 17h'
        },
        {
          zone: 'Zone de Préparation',
          statut: 'En préparation',
          lecteur: 'READER-PREP-01',
          entree: '2020-02-10T09:00:00Z',
          sortie: '2020-02-28T11:00:00Z',
          duree: '18j 2h'
        },
        {
          zone: "Zone d'Expédition",
          statut: 'Prêt à expédier',
          lecteur: 'READER-EXP-01',
          entree: '2020-02-28T11:00:00Z',
          sortie: '2020-03-01T12:00:00Z',
          duree: '1j 1h'
        },
        {
          zone: 'En transit',
          statut: 'En livraison',
          lecteur: 'READER-TRUCK-05',
          entree: '2020-03-01T12:00:00Z',
          sortie: '2020-03-01T14:30:00Z',
          duree: '2h 30min'
        }
      ]
    }
  },
  'TAG-2024-GARANTIE-EXPIREE': {
    article: {
      id: 'sav-2',
      tagId: 'TAG-2024-GARANTIE-EXPIREE',
      category: 'Banquette',
      designation: 'Banquette Salon Marocain Classique',
      size: 'Sur-mesure',
      lot: 'LOT-2010-045',
      brand: 'Richbond',
      currentZone: 'Livré',
      status: 'Expédié',
      createdAt: '2010-05-10T10:00:00Z'
    },
    history: {
      totalSejour: '52j 5h',
      totalMouvements: 6,
      deliveryDate: '2010-07-01T15:00:00Z', // Delivered 14+ years ago - WARRANTY EXPIRED
      mouvements: [
        {
          zone: 'Zone de production',
          statut: 'En production',
          lecteur: 'READER-PROD-03',
          entree: '2010-05-10T10:00:00Z',
          sortie: '2010-05-15T14:00:00Z',
          duree: '5j 4h'
        },
        {
          zone: 'Zone de Stockage 2',
          statut: 'En stock',
          lecteur: 'READER-STK2-01',
          entree: '2010-05-15T14:00:00Z',
          sortie: '2010-06-20T08:00:00Z',
          duree: '35j 18h'
        },
        {
          zone: 'Zone de Préparation',
          statut: 'En préparation',
          lecteur: 'READER-PREP-02',
          entree: '2010-06-20T08:00:00Z',
          sortie: '2010-06-29T16:00:00Z',
          duree: '9j 8h'
        },
        {
          zone: "Zone d'Expédition",
          statut: 'Prêt à expédier',
          lecteur: 'READER-EXP-02',
          entree: '2010-06-29T16:00:00Z',
          sortie: '2010-07-01T10:00:00Z',
          duree: '1j 18h'
        },
        {
          zone: 'En transit',
          statut: 'En livraison',
          lecteur: 'READER-TRUCK-12',
          entree: '2010-07-01T10:00:00Z',
          sortie: '2010-07-01T15:00:00Z',
          duree: '5h'
        }
      ]
    }
  },
  'TAG-2024-EN-LIVRAISON': {
    article: {
      id: 'sav-3',
      tagId: 'TAG-2024-EN-LIVRAISON',
      category: 'Sommier',
      designation: 'Sommier Luxe 180x200',
      size: '180x200',
      lot: 'LOT-2024-892',
      brand: 'Mesidor',
      currentZone: 'En transit',
      status: 'En livraison',
      createdAt: '2024-11-20T07:00:00Z'
    },
    history: {
      totalSejour: '18j 15h 30min',
      totalMouvements: 5,
      deliveryDate: null, // Currently being delivered - IN TRANSIT (not delivered yet)
      mouvements: [
        {
          zone: 'Zone de production',
          statut: 'En production',
          lecteur: 'READER-PROD-02',
          entree: '2024-11-20T07:00:00Z',
          sortie: '2024-11-22T15:00:00Z',
          duree: '2j 8h'
        },
        {
          zone: 'Zone de Stockage 3',
          statut: 'En stock',
          lecteur: 'READER-STK3-01',
          entree: '2024-11-22T15:00:00Z',
          sortie: '2024-12-05T10:00:00Z',
          duree: '12j 19h'
        },
        {
          zone: 'Zone de Préparation',
          statut: 'En préparation',
          lecteur: 'READER-PREP-03',
          entree: '2024-12-05T10:00:00Z',
          sortie: '2024-12-07T14:00:00Z',
          duree: '2j 4h'
        },
        {
          zone: "Zone d'Expédition",
          statut: 'Prêt à expédier',
          lecteur: 'READER-EXP-01',
          entree: '2024-12-07T14:00:00Z',
          sortie: '2024-12-08T08:00:00Z',
          duree: '18h'
        },
        {
          zone: 'En transit',
          statut: 'En livraison',
          lecteur: 'READER-TRUCK-08',
          entree: '2024-12-08T08:00:00Z',
          sortie: null, // Currently in delivery
          duree: '14h 30min'
        }
      ]
    }
  },
  'TAG-2024-EN-PREPARATION': {
    article: {
      id: 'sav-4',
      tagId: 'TAG-2024-EN-PREPARATION',
      category: 'Matelas',
      designation: 'Matelas Confort Plus 140x190',
      size: '140x190',
      lot: 'LOT-2024-1205',
      brand: 'Richbond',
      currentZone: 'Zone de Préparation',
      status: 'En préparation',
      createdAt: '2024-12-01T09:00:00Z'
    },
    history: {
      totalSejour: '8j 6h',
      totalMouvements: 3,
      deliveryDate: null, // Not delivered yet - IN FACTORY
      mouvements: [
        {
          zone: 'Zone de production',
          statut: 'En production',
          lecteur: 'READER-PROD-01',
          entree: '2024-12-01T09:00:00Z',
          sortie: '2024-12-03T17:00:00Z',
          duree: '2j 8h'
        },
        {
          zone: 'Zone de Stockage 1',
          statut: 'En stock',
          lecteur: 'READER-STK1-03',
          entree: '2024-12-03T17:00:00Z',
          sortie: '2024-12-08T11:00:00Z',
          duree: '4j 18h'
        },
        {
          zone: 'Zone de Préparation',
          statut: 'En préparation',
          lecteur: 'READER-PREP-01',
          entree: '2024-12-08T11:00:00Z',
          sortie: null, // Currently in preparation
          duree: '1j 4h'
        }
      ]
    }
  }
};

export default function SAV() {
  const [tagInput, setTagInput] = useState('');
  const [verifiedArticle, setVerifiedArticle] = useState(null);
  const [isAuthentic, setIsAuthentic] = useState(null);

  const handleVerify = () => {
    const data = mockSAVData[tagInput.toUpperCase()];

    if (data) {
      setVerifiedArticle(data.article);
      setIsAuthentic(true);
    } else {
      setVerifiedArticle(null);
      setIsAuthentic(false);
    }
  };

  const handleClear = () => {
    setTagInput('');
    setVerifiedArticle(null);
    setIsAuthentic(null);
  };

  const history = verifiedArticle ? mockSAVData[verifiedArticle.tagId]?.history : null;

  // Calculate lifecycle stats
  const lifecycleStats = verifiedArticle && history ? {
    age: Math.floor((new Date() - new Date(verifiedArticle.createdAt)) / (1000 * 60 * 60 * 24)),
    totalMovements: history.totalMouvements || 0,
    currentPhase: verifiedArticle.status,
  } : null;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">SAV & Authenticité</h1>
        <p className="text-muted-foreground mt-1">
          Vérifiez l'origine et l'historique complet de chaque produit
        </p>
      </div>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Scanner ou Saisir le Tag du Produit</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="TAG-2024-XXXXX"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              className="font-mono text-lg"
            />
            <Button onClick={handleVerify} size="lg" className="px-8">
              Vérifier
            </Button>
            {verifiedArticle && (
              <Button onClick={handleClear} variant="outline" size="lg">
                Effacer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authenticity Banner */}
      {isAuthentic !== null && (
        <Card className={isAuthentic ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'}>
          <CardContent className="">
            <div className="flex flex-col items-center text-center space-y-3">
              {isAuthentic ? (
                <>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                      PRODUIT AUTHENTIQUE RICHBOND
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Ce produit a été fabriqué et tracé par Richbond
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-10 h-10 text-red-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                      TAG NON RECONNU
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Ce tag n'existe pas dans notre système ou a été désactivé
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Information */}
      {verifiedArticle && (
        <>
          {/* Product Details */}
          <Card className="pt-0">
            <CardHeader className="bg-accent/50 py-2">
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Informations Produit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Product Image Placeholder */}
                <div className="flex items-center justify-center">
                  <div className="w-40 h-40 bg-accent rounded-lg flex items-center justify-center">
                    <Package className="w-20 h-20 text-primary" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Tag ID</p>
                    <p className="font-mono font-semibold text-lg text-primary">{verifiedArticle.tagId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Catégorie</p>
                    <Badge variant="outline" className="mt-1">{verifiedArticle.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Désignation</p>
                    <p className="font-semibold">{verifiedArticle.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taille</p>
                    <p className="font-semibold">{verifiedArticle.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot (OF)</p>
                    <p className="font-mono">{verifiedArticle.lot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date fabrication</p>
                    <p className="text-sm">{new Date(verifiedArticle.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de pairage RFID</p>
                    <p className="text-sm">{new Date(verifiedArticle.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée de séjour total</p>
                    <p className="text-sm font-semibold text-primary">{history?.totalSejour || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery and Warranty Information */}
          <Card className="pt-0">
            <CardHeader className="bg-accent/50 py-2">
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Livraison & Garantie</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              {verifiedArticle.status === 'Expédié' && history?.deliveryDate ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de livraison</p>
                    <p className="font-semibold text-lg">{new Date(history.deliveryDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fin de garantie</p>
                    <p className="font-semibold text-lg">
                      {new Date(new Date(history.deliveryDate).setFullYear(new Date(history.deliveryDate).getFullYear() + 10)).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut de garantie</p>
                    {(() => {
                      const warrantyEndDate = new Date(history.deliveryDate);
                      warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 10);
                      const isUnderWarranty = new Date() < warrantyEndDate;
                      return (
                        <Badge variant={isUnderWarranty ? "success" : "destructive"} className="mt-1">
                          {isUnderWarranty ? '✓ Sous garantie' : '✗ Garantie expirée'}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    📦 Produit non encore livré
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    La garantie de 10 ans débutera à la date de livraison
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zone Duration Breakdown */}
          <Card className="pt-0">
            <CardHeader className="bg-accent/50 py-2">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Durée dans chaque zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Lecteur</TableHead>
                    <TableHead>Date d'entrée</TableHead>
                    <TableHead>Date de sortie</TableHead>
                    <TableHead className="text-right">Durée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.mouvements.map((mouvement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold text-primary">{mouvement.zone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{mouvement.statut}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{mouvement.lecteur}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(mouvement.entree).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {mouvement.sortie ? new Date(mouvement.sortie).toLocaleString('fr-FR') : 'En cours'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">{mouvement.duree}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-muted-foreground">Durée totale de séjour:</p>
                  <p className="text-lg font-bold text-primary">{history?.totalSejour || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle Timeline */}
          <Card className="pt-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Cycle de Vie Complet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Horizontal Timeline */}
              <div className="relative">
                <div className="flex justify-between items-center mb-5">
                  {history?.mouvements && history.mouvements.length > 0 ? (
                    history.mouvements.slice().reverse().map((mouvement, index) => (
                      <div key={index} className="flex flex-col items-center text-center flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          index === history.mouvements.length - 1
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-muted-foreground'
                        }`}>
                          <MapPin className="w-6 h-6" />
                        </div>
                        <p className="font-semibold text-xs">{mouvement.zone}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(mouvement.entree).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Aucun mouvement disponible</p>
                  )}
                </div>

                {/* Connecting line */}
                {history?.mouvements && history.mouvements.length > 0 && (
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Movement History */}
          <Card  className="pt-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Historique Détaillé des Mouvements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.mouvements && history.mouvements.length > 0 ? (
                    history.mouvements.slice().reverse().map((mouvement, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {new Date(mouvement.entree).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {index === 0 ? `Création → ${mouvement.zone}` : `Mouvement → ${mouvement.zone}`}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          Lecteur: {mouvement.lecteur}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{mouvement.statut}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Aucun mouvement disponible
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Repairs History */}
          <Card className="pt-3">
            <CardHeader>
              <CardTitle className="text-lg">Historique Réparations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>Aucune réparation précédente</p>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle Summary */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé Cycle de Vie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{lifecycleStats?.age || 0}</p>
                  <p className="text-xs text-muted-foreground">Âge (jours)</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-xl font-bold text-primary">{history?.totalSejour || '-'}</p>
                  <p className="text-xs text-muted-foreground">Durée séjour</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{lifecycleStats?.totalMovements || 0}</p>
                  <p className="text-xs text-muted-foreground">Mouvements</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground">Retours SAV</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground">Réparations</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {verifiedArticle.status === 'Expédié' ? 'Oui' : 'Non'}
                  </p>
                  <p className="text-xs text-muted-foreground">Livré</p>
                </div>
                <div className="bg-accent p-4 rounded-lg text-center">
                  <p className="text-lg font-bold text-primary">{lifecycleStats?.currentPhase}</p>
                  <p className="text-xs text-muted-foreground">Phase actuelle</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </>
      )}
    </div>
  );
}
