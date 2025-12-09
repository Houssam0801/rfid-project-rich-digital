import { useState } from "react";
import {
  MapPin,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Archive,
  Ruler,
} from "lucide-react";
import { getZoneStatsByBrand } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Zones() {
  const [selectedBrand, setSelectedBrand] = useState("Global");
  const zoneStats = getZoneStatsByBrand(selectedBrand);

  // Calculate totals for detailed KPI
  const totalArticles = zoneStats.reduce((sum, z) => sum + z.total, 0);
  const totalBanquettes = zoneStats.reduce((sum, z) => sum + z.banquettes, 0);
  const totalMatelas = zoneStats.reduce((sum, z) => sum + z.matelas, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Brand Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            Gestion des Zones
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble et occupation détaillée par zone
          </p>
        </div>
        <div className="w-64">
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

      {/* Summary Stats at Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Capacité Totale"
          value={zoneStats.reduce((sum, z) => sum + z.capacite, 0)}
          color="blue"
          icon={Ruler}
        />
        <DetailedKPICard
          title="Articles Sur Site"
          icon={Archive}
          banquettes={totalBanquettes}
          matelas={totalMatelas}
          color="purple"
        />
        <SummaryCard
          label="Places Disponibles"
          value={zoneStats.reduce((sum, z) => sum + z.placesDisponibles, 0)}
          color="green"
          icon={CheckCircle}
        />
        <SummaryCard
          label="Zones Actives"
          value={zoneStats.filter((z) => z.total > 0).length}
          color="orange"
          icon={MapPin}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zoneStats.map((zone) => {
          let statusColor = "green";
          let statusIcon = CheckCircle;
          let statusText = "Normal";

          if (zone.status === "critical") {
            statusColor = "red";
            statusIcon = AlertCircle;
            statusText = "Critique";
          } else if (zone.status === "warning") {
            statusColor = "orange";
            statusIcon = TrendingUp;
            statusText = "Attention";
          }

          const StatusIcon = statusIcon;

          return (
            <div
              key={zone.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-card-foreground leading-tight">
                      {zone.nom}
                    </h3>
                    <p className="text-[10px] text-primary font-semibold">
                      {zone.code}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded ${getStatusBgColor(
                    statusColor
                  )}`}
                >
                  <StatusIcon
                    className={`w-3 h-3 ${getColorClass(statusColor)}`}
                  />
                  <span
                    className={`text-[10px] font-medium ${getColorClass(
                      statusColor
                    )}`}
                  >
                    {statusText}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {/* Gauge & Occupation */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-muted-foreground text-xs">
                      Occupation
                    </span>
                    <span className="text-card-foreground font-bold text-sm">
                      {zone.total} / {zone.capacite}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                        statusColor
                      )}`}
                      style={{
                        width: `${Math.min(zone.tauxOccupation, 100)}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`text-right text-xs font-semibold mt-0.5 ${getColorClass(
                      statusColor
                    )}`}
                  >
                    {zone.tauxOccupation}%
                  </p>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-1.5 rounded-lg">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {zone.banquettes}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase">
                        Banq.
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-1.5 rounded-lg">
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {zone.matelas}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase">
                        Mat.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg">
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {zone.autres}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase">
                        Aut.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-muted/30 p-2 rounded text-xs">
                    <span className="text-muted-foreground">
                      Places Libres:
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {zone.placesDisponibles}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getColorClass(color) {
  const classes = {
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
  };
  return classes[color] || "text-green-500";
}

function getProgressColor(color) {
  const classes = {
    green: "bg-gradient-to-r from-green-500 to-green-400",
    orange: "bg-gradient-to-r from-orange-500 to-orange-400",
    red: "bg-gradient-to-r from-red-500 to-red-400",
  };
  return classes[color] || "bg-gradient-to-r from-green-500 to-green-400";
}

function getStatusBgColor(color) {
  const classes = {
    green: "bg-green-500/10 border border-green-500/30",
    orange: "bg-orange-500/10 border border-orange-500/30",
    red: "bg-red-500/10 border border-red-500/30",
  };
  return classes[color] || "bg-green-500/10 border border-green-500/30";
}

function SummaryCard({ label, value, color, icon: Icon }) {
  const colorClasses = {
    blue: "text-primary",
    purple: "text-purple-500",
    green: "text-green-500",
    orange: "text-orange-500",
  };

  return (
    <Card className="px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-default h-full flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value.toLocaleString("fr-FR")}
          </div>
        </div>
        {Icon && (
          <Icon className={`w-8 h-8 opacity-20 ${colorClasses[color]}`} />
        )}
      </div>
    </Card>
  );
}

function DetailedKPICard({ title, icon: Icon, banquettes, matelas, color }) {
  const colorClasses = {
    purple: "text-purple-500",
  };

  return (
    <Card className="px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-default h-full gap-1">
      <div className="flex items-center justify-between gap-1">
        <div>
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-card-foreground">
                {banquettes}
              </span>
              <span className="text-[9px] text-muted-foreground">
                Banquettes
              </span>
            </div>
            <span className="text-muted-foreground/30 text-xl">|</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-card-foreground">
                {matelas}
              </span>
              <span className="text-[9px] text-muted-foreground">Matelas</span>
            </div>
          </div>
 </div>
          {Icon && (
            <Icon className={`w-8 h-8 opacity-20 ${colorClasses[color]}`} />
          )}
       
      </div>
    </Card>
  );
}
