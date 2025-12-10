import { useState } from "react";
import {
  Package,
  Archive,
  Wrench,
  TrendingUp,
  Truck,
  Clock,
  Target,
  AlertTriangle,
  AlertCircle,
  PackageX,
  TruckIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardKPIsByBrand,
  getDeliveryKPIsByBrand,
  getDashboardAlertsByBrand,
  getZoneStatsByBrand,
} from "../data/mockData";

export default function Dashboard() {
  const [selectedBrand, setSelectedBrand] = useState("Global");

  const kpis = getDashboardKPIsByBrand(selectedBrand);
  const deliveryKPIs = getDeliveryKPIsByBrand(selectedBrand);
  const alerts = getDashboardAlertsByBrand(selectedBrand).slice(0, 4); // Only 4 most recent
  const zoneStats = getZoneStatsByBrand(selectedBrand);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Brand Selector */}
      <div className="flex items-center justify-between">
        <div></div>
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble en temps réel
          </p>
        </div>
        <div className="w-30">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-white dark:bg-white dark:text-gray-900 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="Richbond">Richbond</SelectItem>
              <SelectItem value="Mesidor">Mesidor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Layout: KPIs (2/3) + Alerts (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: All KPIs in ONE CARD (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="py-3 shadow-lg border-white">
            <CardContent className="space-y-8 px-3">
              {/* Section 1: Répartition & Stock */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-card-foreground">
                  État du Stock
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <KPICard
                    title="Total Produits"
                    icon={Package}
                    banquettes={kpis.total.banquettes}
                    matelas={kpis.total.matelas}
                    color="blue"
                  />
                  <KPICard
                    title="En Stockage"
                    icon={Archive}
                    banquettes={kpis.enStock.banquettes}
                    matelas={kpis.enStock.matelas}
                    color="purple"
                  />
                  <KPICard
                    title="En Préparation"
                    icon={Wrench}
                    banquettes={kpis.enPreparation.banquettes}
                    matelas={kpis.enPreparation.matelas}
                    color="orange"
                  />
                  <KPICard
                    title="Prêts à Expédier"
                    icon={TrendingUp}
                    banquettes={kpis.pretsAExpedier.banquettes}
                    matelas={kpis.pretsAExpedier.matelas}
                    color="green"
                  />
                  <KPICard
                    title="Expédiés"
                    icon={Truck}
                    banquettes={kpis.expedies.banquettes}
                    matelas={kpis.expedies.matelas}
                    color="teal"
                  />
                </div>
              </div>

              {/* Section 2: Indicateurs de Livraison */}
              <div className="space-y-2 pb-5">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Indicateurs de Livraison
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <KPICard
                    title="Livrés"
                    icon={CheckCircle}
                    banquettes={deliveryKPIs.livres.banquettes}
                    matelas={deliveryKPIs.livres.matelas}
                    color="green"
                  />
                  <KPICard
                    title="Délai moyen (j)"
                    icon={Clock}
                    banquettes={deliveryKPIs.delaiMoyen.banquettes}
                    matelas={deliveryKPIs.delaiMoyen.matelas}
                    color="blue"
                  />
                  <KPICard
                    title="OTD (%)"
                    icon={Target}
                    banquettes={deliveryKPIs.otd.banquettes}
                    matelas={deliveryKPIs.otd.matelas}
                    color="green"
                  />
                  <KPICard
                    title="Retard moyen (j)"
                    icon={AlertCircle}
                    banquettes={deliveryKPIs.retardMoyen.banquettes}
                    matelas={deliveryKPIs.retardMoyen.matelas}
                    color="orange"
                  />
                  <KPICard
                    title="En retard"
                    icon={XCircle}
                    banquettes={deliveryKPIs.enRetard.banquettes}
                    matelas={deliveryKPIs.enRetard.matelas}
                    color="red"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Alertes Récentes (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="py-2 px-0 bg-white  border-none shadow-lg h-full gap-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-red-800 text-center">
                <span>Alertes Récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar px-5">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Zones Table (Full width) */}
      <div>
        <Card className="shadow-lg gap-1 py-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              État des Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableHead className="font-bold w-1/5">Zone</TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Banquettes
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Matelas
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Autres
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Total
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Places Dispo
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Occupation
                    </TableHead>
                    <TableHead className="text-center font-bold w-[11%]">
                      Statut
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zoneStats.map((zone, index) => (
                    <TableRow
                      key={zone.id}
                      className={`
            ${
              index % 2 === 0
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-50 dark:bg-gray-800/50"
            }
            hover:bg-gray-100 dark:hover:bg-gray-700/50
          `}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold text-card-foreground">
                            {zone.nom}{" "}
                            <span className="text-[10px] text-muted-foreground">
                              {"("} {zone.code} {")"}
                            </span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {zone.banquettes}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {zone.matelas}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {zone.autres}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">
                        {zone.total}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                        {zone.placesDisponibles}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold ${
                            zone.tauxOccupation >= 90
                              ? "text-red-500"
                              : zone.tauxOccupation >= 75
                              ? "text-orange-500"
                              : "text-green-500"
                          }`}
                        >
                          {zone.tauxOccupation}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            zone.status === "critical"
                              ? "destructive"
                              : zone.status === "warning"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            zone.status === "critical"
                              ? "bg-red-500"
                              : zone.status === "warning"
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }
                        >
                          {zone.status === "critical"
                            ? "Critique"
                            : zone.status === "warning"
                            ? "Attention"
                            : "Normal"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============ KPI CARD WITH BANQUETTES/MATELAS SPLIT ============
function KPICard({ title, icon: Icon, banquettes, matelas, color }) {
  const colorClasses = {
    blue: "text-primary",
    purple: "text-purple-500",
    orange: "text-orange-500",
    green: "text-green-500",
    teal: "text-teal-500",
    red: "text-red-500",
  };

  return (
    <Card className="p-0 shadow-sm hover:shadow-md transition-all duration-300 border-white h-full">
      <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
        <div className="flex items-center space-x-2 mb-3">
          <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <div className="flex items-center space-x-3 mb-1">
          <span className="text-xl font-bold text-card-foreground">
            {banquettes}
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-xl font-bold text-card-foreground">
            {matelas}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span>Banquettes</span>
          <span>Matelas</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ SINGLE VALUE KPI CARD ============
function SingleValueKPICard({ title, icon: Icon, value, color }) {
  const colorClasses = {
    blue: "text-primary",
    purple: "text-purple-500",
    orange: "text-orange-500",
    green: "text-green-500",
    teal: "text-teal-500",
    red: "text-red-500",
  };

  return (
    <Card className="p-0 shadow-sm hover:shadow-md transition-all duration-300 border-white h-full">
      <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
        <div className="flex items-center space-x-2 mb-3">
          <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <div className={`text-xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ ALERT CARD ============
function AlertCard({ alert }) {
  const iconComponents = {
    Clock,
    AlertTriangle,
    PackageX,
    TruckIcon,
  };

  const IconComponent = iconComponents[alert.icon] || AlertCircle;

  const severityColors = {
    urgent: "bg-red-500/20 border-red-300",
    danger: "bg-red-500/20 border-red-300",
    warning: "bg-yellow-500/20 border-yellow-300",
    info: "bg-blue-500/20 border-blue-300",
  };

  return (
    <div
      className={`p-2 rounded-lg border backdrop-blur-sm ${
        severityColors[alert.severity] || severityColors.info
      }`}
    >
      <div className="flex items-start space-x-2">
        <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{alert.message}</p>
          <p className="text-xs opacity-80 mt-1">
            {new Date(alert.timestamp).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
