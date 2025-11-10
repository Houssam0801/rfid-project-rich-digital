import { useState, useMemo } from 'react';
import { Search, Eye, X, Filter, ChevronsUpDown, Check, ArrowUp, ArrowDown, SearchX } from 'lucide-react';
import { mockVehicles, mockVehicleHistory, marques, modeles, couleurs, zones } from '../data/mockData';
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
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function Vehicles() {
  const [searchVIN, setSearchVIN] = useState('');
  const [selectedMarque, setSelectedMarque] = useState('');
  const [selectedModele, setSelectedModele] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedCouleur, setSelectedCouleur] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [sortField, setSortField] = useState('derniereMAJ');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedVehicleVin, setSelectedVehicleVin] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const availableModeles = useMemo(() => (selectedMarque ? modeles[selectedMarque] : []), [selectedMarque]);
  
  const availableYears = useMemo(() => Array.from(
    new Set(mockVehicles.filter((v) => !selectedMarque || v.marque === selectedMarque).map((v) => v.annee))
  ).sort((a, b) => b - a).map(String), [selectedMarque]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => mockVehicles
    .filter((v) => {
      if (searchVIN && !v.vin.toLowerCase().includes(searchVIN.toLowerCase())) return false;
      if (selectedMarque && v.marque !== selectedMarque) return false;
      if (selectedModele && v.modele !== selectedModele) return false;
      if (selectedAnnee && v.annee !== parseInt(selectedAnnee)) return false;
      if (selectedCouleur && v.couleur !== selectedCouleur) return false;
      if (selectedZone && v.zone !== selectedZone) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    }), [searchVIN, selectedMarque, selectedModele, selectedAnnee, selectedCouleur, selectedZone, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = useMemo(() => 
    filteredVehicles.slice(startIndex, endIndex), 
    [filteredVehicles, startIndex, endIndex]
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchVIN('');
    setSelectedMarque('');
    setSelectedModele('');
    setSelectedAnnee('');
    setSelectedCouleur('');
    setSelectedZone('');
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const activeFiltersCount = [searchVIN, selectedMarque, selectedModele, selectedAnnee, selectedCouleur, selectedZone].filter(Boolean).length;

  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleVin) return null;
    const vehicle = mockVehicles.find((v) => v.vin === selectedVehicleVin);
    const history = mockVehicleHistory[selectedVehicleVin];
    return { ...vehicle, history };
  }, [selectedVehicleVin]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Gestion des Véhicules</h1>
          <p className="text-muted-foreground mt-1">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}
            {filteredVehicles.length > 0 && (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtres de Recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par VIN..."
                value={searchVIN}
                onChange={(e) => handleFilterChange(setSearchVIN)(e.target.value)}
                className="pl-10"
              />
            </div>

            <FilterCombobox
              value={selectedMarque}
              onChange={(value) => {
                handleFilterChange(setSelectedMarque)(value);
                setSelectedModele('');
                setSelectedAnnee('');
              }}
              options={marques}
              placeholder="Marque"
            />

            <FilterCombobox
              value={selectedModele}
              onChange={handleFilterChange(setSelectedModele)}
              options={availableModeles}
              placeholder="Modèle"
              disabled={!selectedMarque}
            />

            <FilterCombobox
              value={selectedAnnee}
              onChange={handleFilterChange(setSelectedAnnee)}
              options={availableYears}
              placeholder="Année"
              disabled={!selectedMarque}
            />

            <FilterCombobox
              value={selectedCouleur}
              onChange={handleFilterChange(setSelectedCouleur)}
              options={couleurs}
              placeholder="Couleur"
            />

            <FilterCombobox
              value={selectedZone}
              onChange={handleFilterChange(setSelectedZone)}
              options={zones}
              placeholder="Zone"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader field="vin" currentSort={sortField} direction={sortDirection} onSort={handleSort}>VIN</SortableTableHeader>
                  <SortableTableHeader field="marque" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Marque</SortableTableHeader>
                  <SortableTableHeader field="modele" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Modèle</SortableTableHeader>
                  <SortableTableHeader field="annee" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Année</SortableTableHeader>
                  <SortableTableHeader field="couleur" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Couleur</SortableTableHeader>
                  <SortableTableHeader field="zone" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Zone</SortableTableHeader>
                  <SortableTableHeader field="derniereMAJ" currentSort={sortField} direction={sortDirection} onSort={handleSort}>Dernière MAJ</SortableTableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVehicles.length > 0 ? (
                  paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono text-primary">{vehicle.vin}</TableCell>
                      <TableCell>{vehicle.marque}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.modele}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.annee}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: getColorHex(vehicle.couleur) }} />
                          <span className="text-muted-foreground">{vehicle.couleur}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vehicle.zone}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(vehicle.derniereMAJ).toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => setSelectedVehicleVin(vehicle.vin)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-30 text-center p-5">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <SearchX className="w-12 h-12" />
                        <p className="font-semibold text-lg">Aucun véhicule trouvé</p>
                        <p className="text-base">Essayez d'ajuster vos filtres de recherche.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredVehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Afficher</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  résultats par page
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} sur {filteredVehicles.length}
                </span>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={cn(
                        "cursor-pointer",
                        currentPage === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={cn(
                        "cursor-pointer",
                        currentPage === totalPages && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <VehicleDetailsDialog 
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicleVin}
        onClose={() => setSelectedVehicleVin(null)}
      />
    </div>
  );
}

function FilterCombobox({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = useState(false);
  const optionMap = useMemo(() => options.map(opt => typeof opt === 'string' ? { value: opt, label: opt } : opt), [options]);
  const selectedLabel = optionMap.find(opt => opt.value === value)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
          disabled={disabled}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Rechercher ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === '' ? "opacity-100" : "opacity-0")} />
                {`Tous les ${placeholder.toLowerCase()}s`}
              </CommandItem>
              {optionMap.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SortableTableHeader({ children, field, currentSort, direction, onSort }) {
  const isActive = currentSort === field;
  return (
    <TableHead className="cursor-pointer" onClick={() => onSort(field)}>
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {isActive && (direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
      </div>
    </TableHead>
  );
}

function VehicleDetailsDialog({ vehicle, isOpen, onClose }) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails du Véhicule: {vehicle.vin}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <DetailItem label="Marque" value={vehicle.marque} />
          <DetailItem label="Modèle" value={vehicle.modele} />
          <DetailItem label="Année" value={vehicle.annee.toString()} />
          <DetailItem label="Couleur" value={vehicle.couleur} />
          <DetailItem label="Zone Actuelle" value={<Badge variant="secondary">{vehicle.zone}</Badge>} />
          <DetailItem label="Dernière MAJ" value={new Date(vehicle.derniereMAJ).toLocaleString('fr-FR')} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Historique des déplacements</h3>
          <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
            {vehicle.history?.events.map((event, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="flex-grow w-px bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">{event.zone}</p>
                  <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString('fr-FR')}</p>
                  <p className="text-xs text-muted-foreground">Lecteur: {event.lecteur} | Statut: {event.statut}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base">{value}</div>
    </div>
  );
}

function getColorHex(color) {
  const colors = {
    'Blanc Nacré': '#F8F8FF', 'Noir Métallisé': '#2C2C2C', 'Gris Anthracite': '#464647',
    'Bleu Marine': '#003366', 'Rouge Bordeaux': '#722F37', 'Argent Métallisé': '#C0C0C0',
    'Vert British Racing': '#004225', 'Or Rose': '#B76E79', 'Bronze': '#CD7F32',
    'Bleu Électrique': '#007BFF'
  };
  return colors[color] || '#FFFFFF';
}