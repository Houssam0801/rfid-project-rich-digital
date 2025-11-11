import { Radio, Tag, Activity, Clock, MapPin } from 'lucide-react';
import { mockRFIDTags, mockRFIDReadings } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Rfid() {
  const sortedReadings = [...mockRFIDReadings].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const recentReadings = sortedReadings.slice(0, 20);

  const stats = {
    totalTags: mockRFIDTags.length + 200, // Assuming 50 tags have been deactivated or removed
    totalReadings: mockRFIDReadings.length,
    readingsToday: mockRFIDReadings.filter((r) => {
      const today = new Date();
      const readingDate = new Date(r.timestamp);
      return (
        readingDate.getDate() === today.getDate() &&
        readingDate.getMonth() === today.getMonth() &&
        readingDate.getFullYear() === today.getFullYear()
      );
    }).length,
    activeTags: mockRFIDTags.length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">RFID & Tags</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des tags RFID et lectures en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Tag} label="Tags en Total" value={stats.totalTags} color="blue" />
        <StatCard icon={Tag} label="Tags Actifs" value={stats.activeTags} color="blue" />
        <StatCard icon={Activity} label="Lectures Totales" value={stats.totalReadings} color="purple" />
        <StatCard icon={Clock} label="Lectures Aujourd'hui" value={stats.readingsToday} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Lectures RFID Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {recentReadings.map((reading) => (
                <div
                  key={reading.id}
                  className="bg-accent rounded-lg p-4 border border-border hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Radio className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-card-foreground font-medium">Tag {reading.tagId}</p>
                        <p className="text-sm text-muted-foreground font-mono">{reading.vin}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reading.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 ml-11 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-card-foreground">{reading.zone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{reading.lecteur}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Tag className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Tags Associés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {mockRFIDTags.slice(0, 15).map((tag) => (
                <div
                  key={tag.id}
                  className="bg-accent rounded-lg p-3 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary font-medium text-sm">{tag.tagId}</span>
                    <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/30">
                      Actif
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">{tag.vin}</p>
                  <p className="text-xs text-muted-foreground">
                    Associé le {new Date(tag.dateAssociation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Technologie RFID Utilisée</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <TechDetail
              label="Fréquence"
              value="UHF 865-868 MHz"
              description="Lecture longue portée jusqu'à 10 mètres"
            />
            <TechDetail
              label="Protocole"
              value="EPC Gen2 (ISO 18000-6C)"
              description="Standard international pour l'identification RFID"
            />
            <TechDetail
              label="Type de Tag"
              value="Tags Passifs"
              description="Sans batterie, alimentés par le lecteur RFID"
            />
          </div>
          <div className="space-y-4">
            <TechDetail
              label="Lecteurs Installés"
              value="10 Points de Lecture"
              description="Couvrant toutes les zones stratégiques"
            />
            <TechDetail
              label="Durée de Vie"
              value="> 10 ans"
              description="Tags durables résistants aux conditions extérieures"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'text-primary',
    purple: 'text-purple-500',
    green: 'text-green-500',
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
      </CardContent>
    </Card>
  );
}

function TechDetail({ label, value, description }) {
  return (
    <div className="bg-accent rounded-lg p-3 border border-border shadow-sm hover:shadow-md transition-shadow">
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-card-foreground font-bold text-lg mb-2">{value}</p>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  );
}