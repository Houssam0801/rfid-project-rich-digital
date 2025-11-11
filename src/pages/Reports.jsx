import { TrendingUp, Clock, Target, Award, BarChart3, AlertTriangle, ClockAlert } from 'lucide-react';
import { mockVehicles, marques } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reports() {
  const avgTimePerZone = [
    { zone: 'Port - Arrivée', hours: 3.1 },
    { zone: 'Zone de réception', hours: 1.5 },
    { zone: 'Zone de stockage', hours: 72.5 },
    { zone: 'Lavage', hours: 1.2 },
    { zone: 'Atelier', hours: 8.4 },
    { zone: 'Zone de préparation', hours: 4.8 },
    { zone: 'Zone de chargement de batterie', hours: 2.1 },
    { zone: 'Zone d’expédition', hours: 3.5 },
    { zone: 'Showroom', hours: 12.2 },
  ];

  const maxHours = Math.max(...avgTimePerZone.map((z) => z.hours));

  const vehiclesByMarque = mockVehicles.reduce((acc, v) => {
    acc[v.marque] = (acc[v.marque] || 0) + 1;
    return acc;
  }, {});

  const totalVehicles = mockVehicles.length;
  const marqueData = Object.entries(vehiclesByMarque).map(([marque, count]) => {
    const marqueInfo = marques.find(m => m.label === marque);
    return {
      marque,
      count,
      percentage: Math.round((count / totalVehicles) * 100),
      image: marqueInfo ? marqueInfo.image : '',
    };
  }).sort((a, b) => b.count - a.count);

  const deliveryStats = {
    onTime: 92,
    delayed: 6,
    early: 2,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Rapports & Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Analyse des performances et métriques clés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Clock} label="Délai moyen de livraison" value="54h 20" trend="-8%" trendPositive={false} color="blue" />
        <MetricCard icon={AlertTriangle} label="Véhicules non conformes" value="8" trend="+2" trendPositive={false} color="red" />
        <MetricCard icon={TrendingUp} label="Véhicules livrés à temps (OTD)" value="92%" trend="+3%" trendPositive={true} color="green" />
        <MetricCard icon={ClockAlert} label="Retard moyen à la livraison" value="6h 50" trend="+15min" trendPositive={false} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Temps Moyen par Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {avgTimePerZone.map((item) => {
                const percentage = (item.hours / maxHours) * 100;
                return (
                  <div key={item.zone}>
                    <div className="flex justify-between mb-2">
                      <span className="text-card-foreground text-sm">{item.zone}</span>
                      <span className="text-card-foreground font-semibold">{item.hours}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-400 h-3 rounded-full transition-all duration-500"
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
          <CardHeader className="flex flex-row items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Répartition par Marque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marqueData.map((item) => (
                <div key={item.marque} className="bg-accent rounded-lg p-2 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      {item.image && <img src={item.image} alt={item.marque} className="w-12 h-10 object-contain" />}
                      <span className="text-card-foreground font-medium">{item.marque}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground text-sm">{item.count.toLocaleString("fr-FR")} véhicules</span>
                      <span className="text-primary font-bold">{item.percentage.toLocaleString("fr-FR")}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Target className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Performance de Livraison</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeliveryCard label="À Temps" percentage={deliveryStats.onTime} color="green" />
          <DeliveryCard label="En Retard" percentage={deliveryStats.delayed} color="orange" />
          <DeliveryCard label="En Avance" percentage={deliveryStats.early} color="blue" />
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Indicateurs de Performance Clés (KPI)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPIDetail title="Taux d'Utilisation des Zones" value="67%" target="75%" description="Optimisation de l'espace disponible" />
          <KPIDetail title="Précision de Localisation" value="99.8%" target="99%" description="Exactitude du système RFID" />
          <KPIDetail title="Temps de Recherche Véhicule" value="< 2 min" target="< 5 min" description="Gain de temps opérationnel" />
          <KPIDetail title="Réduction des Erreurs" value="95%" target="90%" description="Moins d'erreurs de manutention" />
          <KPIDetail title="ROI Système RFID" value="287%" target="200%" description="Retour sur investissement" />
          <KPIDetail title="Disponibilité Système" value="99.9%" target="99.5%" description="Fiabilité opérationnelle" />
        </CardContent>
      </Card>

    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, trendPositive, color }) {
  const colorClasses = {
    blue: 'text-primary',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  };

  return (
    <Card className="shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 gap-2 p-4">
      <CardHeader className="flex flex-row items-center justify-center space-x-1 space-y-0">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-card-foreground text-center">
          {typeof value === 'number' ? value.toLocaleString("fr-FR") : value}
        </p>
        <p className={`text-xs text-center ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend} par rapport à hier
        </p>
      </CardContent>
    </Card>
  );
}

function DeliveryCard({ label, percentage, color }) {
  const colorClasses = {
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', gradient: 'from-green-500 to-green-400' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', gradient: 'from-orange-500 to-orange-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', gradient: 'from-blue-500 to-cyan-400' },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-lg p-3 border ${colors.border} shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between mb-2">
      <p className="text-muted-foreground text-base mb-3">{label}</p>
      <p className={`text-3xl font-bold ${colors.text} mb-2`}>{percentage.toLocaleString("fr-FR")}%</p>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function KPIDetail({ title, value, target, description }) {
  return (
    <div className="bg-accent rounded-lg p-5 border border-border hover:border-primary transition-all shadow-sm hover:shadow-md">
      <h3 className="text-card-foreground font-bold mb-2">{title}</h3>
      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-3xl font-bold text-primary">{value}</span>
        <span className="text-sm text-muted-foreground">/ {target}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}