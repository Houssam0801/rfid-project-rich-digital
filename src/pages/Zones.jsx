import { MapPin, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { mockZones } from '../data/mockData';

export default function Zones() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Gestion des Zones</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble des zones du site logistique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockZones.map((zone) => {
          const occupancyRate = Math.round((zone.vehiculesPresents / zone.capacite) * 100);
          let statusColor = 'green';
          let statusIcon = CheckCircle;
          let statusText = 'Normal';

          if (occupancyRate >= 90) {
            statusColor = 'red';
            statusIcon = AlertCircle;
            statusText = 'Critique';
          } else if (occupancyRate >= 75) {
            statusColor = 'orange';
            statusIcon = TrendingUp;
            statusText = 'Attention';
          }

          const StatusIcon = statusIcon;

          return (
            <div
              key={zone.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{zone.nom}</h3>
                    <p className="text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Occupation</span>
                  <span className="text-card-foreground font-bold text-lg">
                    {zone.vehiculesPresents} / {zone.capacite}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Taux d'occupation</span>
                    <span className={`text-sm font-semibold ${getColorClass(statusColor)}`}>
                      {occupancyRate}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(statusColor)}`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusBgColor(statusColor)}`}>
                  <StatusIcon className={`w-4 h-4 ${getColorClass(statusColor)}`} />
                  <span className={`text-sm font-medium ${getColorClass(statusColor)}`}>
                    Statut: {statusText}
                  </span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">{zone.capacite - zone.vehiculesPresents}</p>
                      <p className="text-xs text-muted-foreground">Places Disponibles</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{zone.vehiculesPresents}</p>
                      <p className="text-xs text-muted-foreground">Véhicules Présents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-6">Vue d'ensemble du Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Capacité Totale"
            value={mockZones.reduce((sum, z) => sum + z.capacite, 0)}
            color="blue"
          />
          <SummaryCard
            label="Véhicules Sur Site"
            value={mockZones.reduce((sum, z) => sum + z.vehiculesPresents, 0)}
            color="purple"
          />
          <SummaryCard
            label="Places Disponibles"
            value={mockZones.reduce((sum, z) => sum + (z.capacite - z.vehiculesPresents), 0)}
            color="green"
          />
          <SummaryCard
            label="Zones Actives"
            value={mockZones.filter((z) => z.vehiculesPresents > 0).length}
            color="orange"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Légende</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-500 font-medium">Normal</p>
              <p className="text-xs text-muted-foreground">Taux d'occupation {'<'} 75%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-orange-500 font-medium">Attention</p>
              <p className="text-xs text-muted-foreground">Taux d'occupation 75-90%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-red-500 font-medium">Critique</p>
              <p className="text-xs text-muted-foreground">Taux d'occupation {'>'} 90%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorClass(color) {
  const classes = {
    green: 'text-green-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };
  return classes[color] || 'text-green-500';
}

function getProgressColor(color) {
  const classes = {
    green: 'bg-gradient-to-r from-green-500 to-green-400',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-400',
    red: 'bg-gradient-to-r from-red-500 to-red-400',
  };
  return classes[color] || 'bg-gradient-to-r from-green-500 to-green-400';
}

function getStatusBgColor(color) {
  const classes = {
    green: 'bg-green-500/10 border border-green-500/30',
    orange: 'bg-orange-500/10 border border-orange-500/30',
    red: 'bg-red-500/10 border border-red-500/30',
  };
  return classes[color] || 'bg-green-500/10 border border-green-500/30';
}

function SummaryCard({ label, value, color }) {
  const colorClasses = {
    blue: 'text-primary',
    purple: 'text-purple-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
  };

  return (
    <div className="bg-accent border border-border rounded-lg p-4">
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}