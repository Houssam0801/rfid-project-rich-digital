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
        <SingleValueKPICard icon={Tag} title="Total Tags" value={stats.totalTags} color="blue" />
        <SingleValueKPICard icon={Tag} title="Tags Actifs" value={stats.activeTags} color="blue" />
        <SingleValueKPICard icon={Activity} title="Total Lectures (aujourd'hui)" value={stats.readingsToday} color="purple" />
        <SingleValueKPICard icon={Clock} title="Lecteurs Actifs" value="8" color="green" />
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
                        <p className="text-card-foreground font-medium">{reading.tagId}</p>
                        <p className="text-sm text-muted-foreground">{reading.designation}</p>
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
                      {tag.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{tag.designation}</p>
                  <p className="text-xs text-muted-foreground font-mono mb-1">Lot: {tag.lot}</p>
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
              description="Lecture longue portée jusqu'à 5 mètres"
            />
            <TechDetail
              label="Protocole"
              value="EPC Gen2"
              description="Standard international pour l'identification RFID"
            />
            <TechDetail
              label="Type de Tag"
              value="Tags Passifs"
              description="Cousus dans le produit, sans batterie"
            />
          </div>
          <div className="space-y-4">
            <TechDetail
              label="Points de Lecture"
              value="8 (1 par zone + entrées/sorties)"
              description="Couvrant toutes les zones stratégiques"
            />
            <TechDetail
              label="Portée"
              value="3-5m"
              description="Lecture sans contact, rapide et fiable"
            />
          </div>
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

function TechDetail({ label, value, description }) {
  return (
    <div className="bg-accent rounded-lg p-3 border border-border shadow-sm hover:shadow-md transition-shadow">
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-card-foreground font-bold text-lg mb-2">{value}</p>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  );
}