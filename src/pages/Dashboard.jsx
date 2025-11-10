import {
  Package,
  Archive,
  Wrench,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { getKPIs, mockAlerts, mockVehicles, mockZones } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const kpis = getKPIs();

  const zoneOccupancy = mockZones.map((zone) => ({
    nom: zone.nom,
    taux: Math.round((zone.vehiculesPresents / zone.capacite) * 100),
  }));

  const vehiclesByZone = mockVehicles.reduce((acc, vehicle) => {
    acc[vehicle.zone] = (acc[vehicle.zone] || 0) + 1;
    return acc;
  }, {});

  const maxZoneCount = Math.max(...Object.values(vehiclesByZone));

  const zoneOrder = [
    'Port - Arrivée',
    'Zone de stockage',
    'Zone de réception',
    'Lavage',
    'Atelier',
    'Zone de préparation',
    'Zone de chargement de batterie',
    'Zone d’expédition',
    'Showroom'
  ];

  const sortedVehiclesByZone = Object.entries(vehiclesByZone).sort(([zoneA], [zoneB]) => {
      const indexA = zoneOrder.indexOf(zoneA);
      const indexB = zoneOrder.indexOf(zoneB);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble en temps réel
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-green-500 font-medium">
            Système Opérationnel
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Véhicules"
          value={kpis.total}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="En Stockage"
          value={kpis.enStockage}
          icon={Archive}
          color="purple"
        />
        <KPICard
          title="En Préparation"
          value={kpis.enPreparation}
          icon={Wrench}
          color="orange"
        />
        <KPICard
          title="Prêts à Livrer"
          value={kpis.pretsALivrer}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Livrés"
          value={kpis.livres}
          icon={CheckCircle}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              <CardTitle className="text-xl">Véhicules Par Zone</CardTitle>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedVehiclesByZone.map(([zone, count]) => {
                const percentage = (count / maxZoneCount) * 100;
                return (
                  <div key={zone}>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground text-sm">
                        {zone}
                      </span>
                      <span className="text-card-foreground font-semibold">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex items-center space-x-1">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-xl">Alertes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : alert.type === "success"
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      alert.type === "warning"
                        ? "text-yellow-300"
                        : alert.type === "success"
                        ? "text-green-300"
                        : "text-blue-300"
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Taux d'Occupation des Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {zoneOccupancy.map((zone) => {
              let colorClass =
                "text-green-500 bg-green-500/10 border-green-500/30";
              if (zone.taux >= 80)
                colorClass = "text-red-500 bg-red-500/10 border-red-500/30";
              else if (zone.taux >= 60)
                colorClass =
                  "text-orange-500 bg-orange-500/10 border-orange-500/30";

              return (
                <div
                  key={zone.nom}
                  className={`text-center p-2 rounded-lg border ${colorClass}`}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    {zone.nom}
                  </p>
                  <p className="text-2xl font-bold">{zone.taux}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "text-primary",
    purple: "text-purple-500",
    orange: "text-orange-500",
    green: "text-green-500",
    teal: "text-teal-500",
  };

  return (
    <Card className="shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 gap-2 p-4">
      <CardHeader className="flex flex-row items-center justify-center space-x-1 space-y-0 ">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-card-foreground text-center">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
