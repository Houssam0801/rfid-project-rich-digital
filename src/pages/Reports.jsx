import { TrendingUp, Clock, Target, Award, BarChart3, AlertTriangle, ClockAlert } from 'lucide-react';
import { mockArticles, getStatsByCategory } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reports() {
  const avgTimePerZone = [
    { zone: 'Zone de Production', hours: 4 },
    { zone: 'Zone de Stockage 1', hours: 36 },
    { zone: 'Zone de Stockage 2', hours: 42 },
    { zone: 'Zone de Stockage 3', hours: 28 },
    { zone: 'Zone de Préparation', hours: 2.5 },
    { zone: 'Zone d\'Expédition', hours: 1.25 },
  ];

  const maxHours = Math.max(...avgTimePerZone.map((z) => z.hours));

  const categoryStats = getStatsByCategory();

  const totalArticles = mockArticles.length;
  const categoryData = categoryStats.map(cat => ({
    category: cat.category,
    count: cat.count,
    percentage: cat.percentage,
  })).sort((a, b) => b.count - a.count);

  const deliveryStats = {
    onTime: 94,
    delayed: 5,
    early: 1,
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
        <SingleValueKPICard icon={Clock} title="Temps moyen Production → Expédition" value="48h 30min" color="blue" />
        <SingleValueKPICard icon={AlertTriangle} title="Taux d'erreurs picking" value="2.3%" color="orange" />
        <SingleValueKPICard icon={TrendingUp} title="Taux de livraison à temps" value="94%" color="green" />
        <SingleValueKPICard icon={ClockAlert} title="Articles slow-moving" value="45" color="red" />
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
            <CardTitle className="text-xl">Distribution par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.category} className="bg-accent rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-card-foreground font-medium">{item.category}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground text-sm">{item.count.toLocaleString("fr-FR")} articles</span>
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
          <KPIDetail title="Précision Localisation" value="99.5%" target="99%" description="Exactitude du système RFID" />
          <KPIDetail title="Temps Recherche Article" value="< 1 min" target="< 2 min" description="Gain de temps opérationnel" />
          <KPIDetail title="Réduction Erreurs" value="92%" target="90%" description="Moins d'erreurs de picking" />
          <KPIDetail title="Disponibilité Système" value="99.8%" target="99.5%" description="Fiabilité opérationnelle" />
          <KPIDetail title="Taux Rotation Stock" value="4.2x" target="4x" description="Efficacité de gestion" />
          <KPIDetail title="ROI" value="245%" target="200%" description="Retour sur investissement" />
        </CardContent>
      </Card>

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