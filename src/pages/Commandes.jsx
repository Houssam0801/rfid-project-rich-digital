import { useState, useMemo } from 'react';
import { ClipboardList, Clock, PackageSearch, Truck, Eye, Filter, X, CheckCircle, AlertCircle, Search, Calendar, Factory, Box } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { mockCommandes, getCommandesStats, getCommandeProgress, canStartPicking } from '../data/mockCommandes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Commandes() {
  const [searchCommande, setSearchCommande] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [dateLivraison, setDateLivraison] = useState('');
  const [selectedCommandeId, setSelectedCommandeId] = useState(null);

  const stats = getCommandesStats();

  // Filter commandes
  const filteredCommandes = useMemo(() => {
    return mockCommandes.filter(c => {
      if (searchCommande && !c.id.toLowerCase().includes(searchCommande.toLowerCase())) return false;
      if (searchClient && !c.client.name.toLowerCase().includes(searchClient.toLowerCase())) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;
      if (dateLivraison) {
        const livraisonDate = new Date(c.dateLivraisonSouhaitee).toDateString();
        const filterDate = new Date(dateLivraison).toDateString();
        if (livraisonDate !== filterDate) return false;
      }
      return true;
    });
  }, [searchCommande, searchClient, selectedStatus, selectedPriority, dateLivraison]);

  const activeFiltersCount = [
    searchCommande !== '',
    searchClient !== '',
    selectedStatus !== 'all',
    selectedPriority !== 'all',
    dateLivraison !== ''
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchCommande('');
    setSearchClient('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setDateLivraison('');
  };

  const selectedCommande = useMemo(() => {
    return mockCommandes.find(c => c.id === selectedCommandeId);
  }, [selectedCommandeId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Gestion des Commandes</h1>
        <p className="text-muted-foreground mt-1">
          Commandes reçues depuis JDE - Suivi et préparation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <SingleValueKPICard
          icon={ClipboardList}
          title="Total Commandes"
          value={mockCommandes.length}
          color="blue"
        />
        <SingleValueKPICard
          icon={Factory}
          title="En Production"
          value={stats.production}
          color="orange"
        />
        <SingleValueKPICard
          icon={Box}
          title="En Stockage"
          value={stats.stockage}
          color="cyan"
        />
        <SingleValueKPICard
          icon={PackageSearch}
          title="En Picking"
          value={stats.picking}
          color="yellow"
        />
        <SingleValueKPICard
          icon={Clock}
          title="En Préparation"
          value={stats.preparing}
          color="purple"
        />
        <SingleValueKPICard
          icon={Truck}
          title="Prêtes"
          value={stats.ready}
          color="green"
        />
      </div>

      {/* Filters */}
      <Card className="py-4 shadow-sm hover:shadow-lg gap-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Effacer ({activeFiltersCount})</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">N° Commande</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="CMD-2024-..."
                  value={searchCommande}
                  onChange={(e) => setSearchCommande(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Client</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nom du client..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Date Livraison</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateLivraison}
                  onChange={(e) => setDateLivraison(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="production">En production</SelectItem>
                  <SelectItem value="stockage">En stockage</SelectItem>
                  <SelectItem value="picking">En picking</SelectItem>
                  <SelectItem value="preparing">En préparation</SelectItem>
                  <SelectItem value="ready">Prête</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Priorité</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commandes Table */}
      <Card className="pt-2 px-2 gap-3">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {filteredCommandes.length} commande{filteredCommandes.length > 1 ? 's' : ''} trouvée{filteredCommandes.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[14%]">N° Commande</TableHead>
                <TableHead className="w-[16%]">Client</TableHead>
                <TableHead className="w-[12%]">Date Cmd</TableHead>
                <TableHead className="w-[12%]">Livraison</TableHead>
                <TableHead className="w-[10%] text-center">Délai restant</TableHead>
                <TableHead className="w-[8%] text-center">Articles</TableHead>
                <TableHead className="w-[10%]">Priorité</TableHead>
                <TableHead className="w-[12%]">Progression</TableHead>
                <TableHead className="w-[10%]">Statut</TableHead>
                <TableHead className="w-[6%] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommandes.length > 0 ? (
                filteredCommandes.map(commande => {
                  const progress = getCommandeProgress(commande);
                  const isLate = new Date(commande.dateLivraisonSouhaitee) < new Date() && commande.status !== 'shipped';
                  return (
                    <TableRow key={commande.id}>
                      <TableCell className="font-mono text-primary font-semibold">{commande.id}</TableCell>
                      <TableCell className="font-medium">{commande.client.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-card-foreground">
                        {new Date(commande.dateLivraisonSouhaitee).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-center">
                        {(() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const deliveryDate = new Date(commande.dateLivraisonSouhaitee);
                          deliveryDate.setHours(0, 0, 0, 0);
                          const diffTime = deliveryDate - today;
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                          let colorClass = '';
                          if (diffDays < 2) {
                            colorClass = 'text-red-600 font-bold';
                          } else if (diffDays >= 2 && diffDays <= 4) {
                            colorClass = 'text-orange-600 font-bold';
                          } else {
                            colorClass = 'text-green-600 font-bold';
                          }

                          const displayText = diffDays < 0
                            ? `${Math.abs(diffDays)}j retard`
                            : diffDays === 0
                            ? "Aujourd'hui"
                            : `${diffDays}j`;

                          return <span className={colorClass}>{displayText}</span>;
                        })()}
                      </TableCell>
                      <TableCell className="text-center">{commande.totalArticles}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(commande.priority)}>
                          {getPriorityLabel(commande.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {/* PROGRESSION = DISPONIBILITÉ STOCK */}
                          {/* If picking/preparing, it means stock is 100% ready */}
                          <Progress 
                            value={commande.status === 'production' ? commande.stockageProgress : 100} 
                            className="w-16" 
                            indicatorClassName={commande.status === 'production' ? "bg-orange-500" : "bg-green-500"}
                          />
                          <span className="text-sm text-muted-foreground">
                              {commande.status === 'production' ? `${commande.stockageProgress}%` : "100%"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(commande.status)}>
                          {getStatusLabel(commande.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCommandeId(commande.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <p className="text-muted-foreground">Aucune commande trouvée</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <CommandeDetailModal
        commande={selectedCommande}
        isOpen={!!selectedCommandeId}
        onClose={() => setSelectedCommandeId(null)}
      />
    </div>
  );
}

function SingleValueKPICard({ title, icon: Icon, value, color }) {
  const colorClasses = {
    blue: 'text-primary',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    teal: 'text-teal-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    cyan: 'text-cyan-500',
  };

  return (
    <Card className="p-0 shadow-sm hover:shadow-md transition-all duration-300 border-white h-full">
      <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full">
        <div className="flex items-center space-x-2 mb-2">
          <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <div className={`text-xl font-bold `}>
          {typeof value === 'number' ? value.toLocaleString("fr-FR") : value}
        </div>
      </CardContent>
    </Card>
  );
}

function CommandeDetailModal({ commande, isOpen, onClose }) {
  if (!commande) return null;

  const progress = getCommandeProgress(commande);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Commande {commande.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Client */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-semibold text-card-foreground">{commande.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p className="font-semibold text-card-foreground">{commande.client.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="text-sm text-card-foreground">{commande.client.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="text-sm text-card-foreground">{commande.client.phone}</p>
            </div>
          </div>

          {/* Info Commande */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date commande</p>
              <p className="font-semibold text-card-foreground">
                {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Livraison souhaitée</p>
              <p className={`font-semibold ${new Date(commande.dateLivraisonSouhaitee) < new Date() && commande.status !== 'shipped' ? 'text-red-500' : 'text-card-foreground'}`}>
                {new Date(commande.dateLivraisonSouhaitee).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priorité</p>
              <Badge variant={getPriorityVariant(commande.priority)}>
                {getPriorityLabel(commande.priority)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge variant={getStatusVariant(commande.status)}>
                {getStatusLabel(commande.status)}
              </Badge>
            </div>
            {/* NEW: Total ML Display */}
            {(commande.totalML || (commande.type === 'banquettes' && commande.articles.some(a => a.totalML))) && (
                <div>
                   <p className="text-sm text-muted-foreground">Métrage Total</p>
                   <p className="font-semibold text-card-foreground">
                       {commande.totalML || commande.articles.reduce((acc, a) => acc + (a.totalML || 0), 0).toFixed(2)} ml
                   </p>
                </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-card-foreground">Progression</p>
              <p className="text-sm text-muted-foreground">
                {commande.pickedArticles}/{commande.totalArticles} articles
              </p>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">{progress}% complété</p>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Articles commandés</h3>
            <div className="space-y-3">
              {commande.articles.map((article, index) => (
                <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                          <p className="font-medium text-card-foreground">{article.designation}</p>
                          {/* Item Level ML */}
                          {article.totalML && <Badge variant="secondary" className="h-5 text-[10px]">{article.totalML} ml</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">Catégorie: {article.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quantité: {article.quantity}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {article.picked === article.quantity ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : article.picked > 0 ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {article.picked}/{article.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Individual article tags (for non-multipiece items) */}
                  {!article.isMultiPiece && article.quantity > 1 && (
                    <div className="mt-3 pl-4 border-l-2 border-primary space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Tags RFID:</p>
                      {Array.from({ length: article.quantity }).map((_, itemIndex) => {
                        const tagId = article.tagIds[itemIndex];
                        const isPicked = itemIndex < article.picked;
                        const isInStockage = itemIndex < article.inStockage;
                        return (
                          <div key={itemIndex} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">└─ Article {itemIndex + 1}</span>
                              {tagId ? (
                                <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  {tagId}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">
                                  {article.inProduction > 0 ? 'En production' : 'En attente'}
                                </span>
                              )}
                            </div>
                            {isPicked ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : isInStockage ? (
                              <Clock className="w-3 h-3 text-yellow-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Single article with tag */}
                  {!article.isMultiPiece && article.quantity === 1 && article.tagIds[0] && (
                    <div className="mt-2">
                      <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        {article.tagIds[0]}
                      </span>
                    </div>
                  )}

                  {/* Multi-piece details */}
                  {article.isMultiPiece && article.pieces && (
                    <div className="mt-3 pl-4 border-l-2 border-primary space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-semibold text-muted-foreground">Pièces:</p>
                        {article.totalML && <span className="text-[10px] font-mono text-muted-foreground">Total: {article.totalML}ml</span>}
                      </div>

                      {article.pieces.map((piece, pIndex) => (
                        <div key={pIndex} className="flex items-center gap-3 text-xs">
                          {/* Name - fixed width */}
                          <div className="min-w-[150px] text-muted-foreground">
                            └─ {piece.name}
                          </div>

                          {/* Meters - fixed width */}
                          <div className="min-w-[60px]">
                            {piece.ml ? (
                              <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                                {piece.ml}m
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">-</span>
                            )}
                          </div>

                          {/* Tag - fixed width */}
                          <div className="min-w-[140px]">
                            {piece.tagId ? (
                              <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {piece.tagId}
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">-</span>
                            )}
                          </div>

                          {/* Status - at the end */}
                          <div className="ml-auto">
                            {piece.picked ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            {commande.status === 'production' && (
              <Button disabled className="bg-gray-400">
                En attente production
              </Button>
            )}
            {commande.status === 'stockage' && !canStartPicking(commande) && (
              <Button disabled className="bg-gray-400">
                En attente stockage complet
              </Button>
            )}
            {commande.status === 'stockage' && canStartPicking(commande) && (
              <Button className="bg-primary hover:bg-primary/90">
                Lancer Picking
              </Button>
            )}
            {commande.status === 'picking' && (
              <Button className="bg-primary hover:bg-primary/90">
                Continuer Picking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getPriorityVariant(priority) {
  switch (priority) {
    case 'high': return 'destructive';
    case 'normal': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 'high': return 'Haute';
    case 'normal': return 'Normale';
    case 'low': return 'Basse';
    default: return priority;
  }
}

function getStatusVariant(status) {
  switch (status) {
    case 'production': return 'outline';
    case 'stockage': return 'secondary';
    case 'picking': return 'default';
    case 'preparing': return 'secondary';
    case 'ready': return 'default';
    case 'shipped': return 'default';
    default: return 'secondary';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'production': return 'En production';
    case 'stockage': return 'En stockage';
    case 'picking': return 'En picking';
    case 'preparing': return 'En préparation';
    case 'ready': return 'Prête';
    case 'shipped': return 'Expédiée';
    default: return status;
  }
}
