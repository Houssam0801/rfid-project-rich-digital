import { useState, useMemo } from 'react';
import { Search, Eye, X, Filter, ChevronsUpDown, Check, ArrowUp, ArrowDown, SearchX, Package, Sofa, BedDouble, Frame, Armchair, Box } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Import Richbond mock data
import { mockArticles, mockArticleHistory, banquettePieces, categories, tailles, zones, statuts } from '../data/mockData';

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Category icons mapping
const categoryIcons = {
  "Matelas": BedDouble,
  "Banquette": Sofa,
  "Sommier": BedDouble,
  "Tête de lit": Frame,
  "Coussin décoratif": Armchair,
  "Pouf": Box,
  "Sur-matelas": BedDouble,
};

export default function Articles() {
  const [searchTag, setSearchTag] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all'); // NEW: Brand filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filter and sort articles
  const filteredArticles = useMemo(() => mockArticles
    .filter((a) => {
      if (searchTag && !a.tagId.toLowerCase().includes(searchTag.toLowerCase()) &&
          !a.lot.toLowerCase().includes(searchTag.toLowerCase())) return false;
      if (selectedBrand && selectedBrand !== 'all' && a.brand !== selectedBrand) return false; // NEW: Brand filter
      if (selectedCategory && selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (selectedSize && selectedSize !== 'all' && a.size !== selectedSize) return false;
      if (selectedZone && selectedZone !== 'all' && a.currentZone !== selectedZone) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    }), [searchTag, selectedBrand, selectedCategory, selectedSize, selectedZone, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = useMemo(() =>
    filteredArticles.slice(startIndex, endIndex),
    [filteredArticles, startIndex, endIndex]
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTag('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedZone('all');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTag,
    selectedBrand !== 'all' ? selectedBrand : '',
    selectedCategory !== 'all' ? selectedCategory : '',
    selectedSize !== 'all' ? selectedSize : '',
    selectedZone !== 'all' ? selectedZone : ''
  ].filter(Boolean).length;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 inline" /> : <ArrowDown className="w-3 h-3 ml-1 inline" />;
  };

  const selectedArticle = selectedArticleId ? mockArticles.find(a => a.id === selectedArticleId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Articles</h1>
          <p className="text-muted-foreground mt-1">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            {filteredArticles.length > 0 && (
              <span className="text-xs ml-2">
                (Page {currentPage} sur {totalPages})
              </span>
            )}
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearFilters}
            variant="destructive"
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Effacer les filtres ({activeFiltersCount})</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-lg gap-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} variant="ghost" size="sm" className="flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>Effacer ({activeFiltersCount})</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag ID / Lot (OF)</label>
              <Input
                placeholder="TAG-2024-XXXXX"
                value={searchTag}
                onChange={(e) => handleFilterChange(setSearchTag)(e.target.value)}
                className="font-mono w-full"
              />
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Usine</label>
              <Select value={selectedBrand} onValueChange={handleFilterChange(setSelectedBrand)}>
                <SelectTrigger className="bg-white dark:bg-gray-900 w-full">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Richbond">Richbond</SelectItem>
                  <SelectItem value="Mesidor">Mesidor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={selectedCategory} onValueChange={handleFilterChange(setSelectedCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.label}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Taille</label>
              <Select value={selectedSize} onValueChange={handleFilterChange(setSelectedSize)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {tailles.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zone actuelle</label>
              <Select value={selectedZone} onValueChange={handleFilterChange(setSelectedZone)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {zones.map(z => (
                    <SelectItem key={z.id} value={z.id}>{z.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="py-0 px-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('tagId')} className="cursor-pointer hover:bg-accent">
                    Tag ID <SortIcon field="tagId" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-accent text-center">
                    Usine <SortIcon field="brand" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('category')} className="cursor-pointer hover:bg-accent text-center">
                    Catégorie <SortIcon field="category" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('designation')} className="cursor-pointer hover:bg-accent text-center">
                    Désignation <SortIcon field="designation" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('size')} className="cursor-pointer hover:bg-accent text-center">
                    Taille <SortIcon field="size" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('lot')} className="cursor-pointer hover:bg-accent text-center">
                    Lot (OF) <SortIcon field="lot" />
                  </TableHead>
                  <TableHead onClick={() => handleSort('currentZone')} className="cursor-pointer hover:bg-accent text-center">
                    Zone <SortIcon field="currentZone" />
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map(article => (
                    <TableRow key={article.id} className="hover:bg-accent/50">
                      <TableCell className="font-mono text-primary font-semibold">{article.tagId}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={article.brand === "Richbond" ? "default" : "secondary"}>
                          {article.brand}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{article.category}</TableCell>
                      <TableCell className="text-center">{article.designation}</TableCell>
                      <TableCell className="text-center">{article.size}</TableCell>
                      <TableCell className="font-mono text-sm text-center">{article.lot}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {zones.find(z => z.id === article.currentZone)?.nom || article.currentZone}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedArticleId(article.id)}
                        >
                          <Eye className="w-4 h-4 " />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <SearchX className="w-12 h-12 opacity-30" />
                        <p>Aucun article trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Combined Items Per Page + Pagination - INSIDE CardContent */}
          {filteredArticles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pt-4 border-t">
              {/* Left side: Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Afficher</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                  setItemsPerPage(Number(val));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt.toString()}>{opt} par page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Right side: Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Details Dialog */}
      <ArticleDetailsDialog
        article={selectedArticle}
        isOpen={!!selectedArticleId}
        onClose={() => setSelectedArticleId(null)}
      />
    </div>
  );
}

// ============ ARTICLE DETAILS DIALOG ============
function ArticleDetailsDialog({ article, isOpen, onClose }) {
  if (!article) return null;

  const history = mockArticleHistory[article.id];
  const pieces = article.category === "Banquette" ? banquettePieces[article.id] : null;
  const CategoryIcon = categoryIcons[article.category] || Package;

  // Format date helper: JJ/MM/AA HH:mm
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (statut) => {
    switch (statut) {
      case 'En production': return 'default';
      case 'En stock': return 'secondary';
      case 'En préparation': return 'default';
      case 'Prêt à expédier': return 'default';
      case 'En livraison': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col pt-3 bg-white ">
        {/* HEADER - Fixed, doesn't scroll */}
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <CategoryIcon className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                Détails de l'Article:{" "}
                <span className="font-mono ml-2">{article.tagId}</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={article.brand === "Richbond" ? "default" : "secondary"}>
                  🏭 {article.brand}
                </Badge>
                <Badge variant="outline">{article.category}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {/* Article Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              <DetailItem label="Désignation" value={article.designation} />
              <DetailItem label="Tag ID" value={article.tagId} mono />
              <DetailItem label="Taille" value={article.size} />
              <DetailItem label="Lot (OF)" value={article.lot} mono />
              <DetailItem label="Zone actuelle" value={<Badge variant="secondary">{zones.find(z => z.id === article.currentZone)?.nom || article.currentZone}</Badge>} />
              <DetailItem label="Statut" value={<Badge variant="outline">{article.status}</Badge>} />
              <DetailItem label="Date création" value={formatDate(article.createdAt)} />
              <DetailItem label="Séjour total" value={history?.totalSejour || '-'} />
            </div>

            {/* Tabs Section */}
            <div>
              <Tabs defaultValue="historique" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="historique" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Historique des Mouvements
                  </TabsTrigger>
                  {pieces && pieces.length > 0 && (
                    <TabsTrigger value="pieces" className="flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Pièces ({pieces.length})
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Tab 1: Historique */}
                <TabsContent value="historique" className="mt-2">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableHead className="font-bold w-[20%]">Zone</TableHead>
                          <TableHead className="font-bold w-[15%]">Statut</TableHead>
                          <TableHead className="font-bold w-[15%]">Lecteur</TableHead>
                          <TableHead className="font-bold w-[18%]">Entrée</TableHead>
                          <TableHead className="font-bold w-[18%]">Sortie</TableHead>
                          <TableHead className="font-bold w-[14%] text-right">Durée</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history?.mouvements.map((mouvement, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <TableCell className="font-semibold text-primary">{mouvement.zone}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(mouvement.statut)}>
                                {mouvement.statut}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {mouvement.lecteur}
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(mouvement.entree)}</TableCell>
                            <TableCell className="text-sm">{formatDate(mouvement.sortie)}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{mouvement.duree}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="border-t bg-gray-50 dark:bg-gray-800 px-4 py-3">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Total mouvements: <span className="text-primary">{history?.totalMouvements || 0}</span>
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Pièces */}
                {pieces && pieces.length > 0 && (
                  <TabsContent value="pieces" className="mt-2">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableHead className="font-bold w-[20%]">Tag RFID</TableHead>
                            <TableHead className="font-bold w-[15%]">Catégorie</TableHead>
                            <TableHead className="font-bold w-[30%]">Désignation</TableHead>
                            <TableHead className="font-bold w-[12%]">Taille</TableHead>
                            <TableHead className="font-bold w-[12%]">Usine</TableHead>
                            <TableHead className="font-bold w-[11%]">Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pieces.map((piece) => (
                            <TableRow key={piece.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <TableCell className="font-mono text-primary font-semibold">{piece.tagId}</TableCell>
                              <TableCell className="font-medium">{piece.category}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="truncate">{piece.designation}</span>
                                  <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                                    {piece.tagId}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{piece.size}</TableCell>
                              <TableCell>
                                <Badge variant={piece.brand === "Richbond" ? "default" : "secondary"}>
                                  {piece.brand}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{piece.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for detail items
function DetailItem({ label, value, mono = false }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <div className={cn("text-base font-medium", mono && "font-mono")}>{value}</div>
    </div>
  );
}
