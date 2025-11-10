export const marques = [
  {
    value: "volkswagen",
    label: "Volkswagen",
    image: "/images/marques/volkswagen.png",
  },
  {
    value: "audi",
    label: "Audi",
    image: "/images/marques/audi.png",
  },
  {
    value: "seat",
    label: "SEAT",
    image: "/images/marques/seat.png",
  },
  {
    value: "skoda",
    label: "Škoda",
    image: "/images/marques/skoda.png",
  },
  {
    value: "cupra",
    label: "CUPRA",
    image: "/images/marques/cupra.png",
  },
  {
    value: "bentley",
    label: "Bentley",
    image: "/images/marques/bentley.png",
  },
  {
    value: "porsche",
    label: "Porsche",
    image: "/images/marques/porsche.png",
  },
];

export const modeles = {
  Volkswagen: [
    "Golf",
    "Polo",
    "Tiguan",
    "T-Roc",
    "Touareg",
    "Passat",
    "Arteon",
    "ID.3",
    "ID.4",
  ],
  Audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS6"],
  SEAT: ["Ibiza", "Arona", "Leon", "Ateca", "Tarraco"],
  Škoda: [
    "Fabia",
    "Scala",
    "Octavia",
    "Superb",
    "Kamiq",
    "Karoq",
    "Kodiaq",
    "Enyaq iV",
  ],
  CUPRA: ["Formentor", "Born", "Leon", "Ateca", "Tavascan"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  Porsche: [
    "911",
    "Cayenne",
    "Macan",
    "Panamera",
    "Taycan",
    "718 Cayman",
    "718 Boxster",
  ],
};

export const couleurs = [
  "Blanc Nacré",
  "Noir Métallisé",
  "Gris Anthracite",
  "Bleu Marine",
  "Rouge Bordeaux",
  "Argent Métallisé",
  "Vert British Racing",
  "Or Rose",
  "Bronze",
  "Bleu Électrique",
];

export const zones = [
  "Port - Arrivée",
  "Zone de réception",
  "Zone de stockage",
  "Zone de préparation",
  "Zone de chargement de batterie",
  "Atelier",
  "Lavage",
  "Zone d’expédition",
  "Showroom",
];

export const statuts = [
  "En Transit",
  "En Stockage",
  "En Préparation",
  "Prêt à Livrer",
  "Livré",
  "En Exposition",
];

const generateVIN = (index) => {
  const prefixes = {
    Volkswagen: "WVW",
    Audi: "WAU",
    SEAT: "VSS",
    Škoda: "TMB",
    CUPRA: "VSS",
    Bentley: "SCB",
    Porsche: "WP0",
  };

  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let vin = "";

  // Get brand-specific prefix
  const brand = marques[index % marques.length].label;
  vin = prefixes[brand] || "VF3";

  // Add random characters
  for (let i = 0; i < 14; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
};

const generateTimestamp = (daysAgo, hoursAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

const generateVehicles = (count, status) => {
  return Array.from({ length: count }, (_, i) => {
    const marqueObj = marques[Math.floor(Math.random() * marques.length)];
    const marque = marqueObj.label;
    const modele =
      modeles[marque][Math.floor(Math.random() * modeles[marque].length)];
    const couleur = couleurs[Math.floor(Math.random() * couleurs.length)];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const annee = Math.random() > 0.4 ? 2025 : 2024;

    return {
      id: `vehicle-${status}-${i + 1}`,
      vin: generateVIN(i),
      marque,
      modele,
      couleur,
      zone,
      statut: status,
      derniereMAJ: generateTimestamp(daysAgo, Math.floor(Math.random() * 24)),
      annee,
    };
  });
};

const vehiclesEnStockage = generateVehicles(2500, "En Stockage");
const vehiclesEnPreparation = generateVehicles(21, "En Préparation");
const vehiclesPretsALivrer = generateVehicles(38, "Prêt à Livrer");
const vehiclesLivres = generateVehicles(280, "Livré");

let allVehicles = [
  ...vehiclesEnStockage,
  ...vehiclesEnPreparation,
  ...vehiclesPretsALivrer,
  ...vehiclesLivres,
].map((vehicle, i) => ({ ...vehicle, id: `vehicle-${i}`, vin: generateVIN(i) }));

// Zone distribution
const zoneCounts = {
  'Port - Arrivée': 214,
  'Zone de réception': 20,
  'Zone de stockage': 2500,
  'Atelier': 18,
  'Lavage': 8,
  'Zone de préparation': 25,
  'Zone de chargement de batterie': 8,
  'Zone d’expédition': 16,
  'Showroom': 30,
};

let vehicleIndex = 0;
const zonesForDistribution = Object.keys(zoneCounts);
for (const zone of zonesForDistribution) {
  const count = zoneCounts[zone];
  for (let i = 0; i < count; i++) {
    if (allVehicles[vehicleIndex]) {
      allVehicles[vehicleIndex].zone = zone;
      vehicleIndex++;
    }
  }
}

export const mockVehicles = allVehicles;

export const mockZones = [
  {
    id: "zone-1",
    nom: "Port - Arrivée",
    capacite: 300,
    vehiculesPresents: mockVehicles.filter((v) => v.zone === "Port - Arrivée")
      .length,
    description: "Zone de réception des véhicules arrivant au port.",
  },
  {
    id: "zone-2",
    nom: "Zone de réception",
    capacite: 200,
    vehiculesPresents: mockVehicles.filter(
      (v) => v.zone === "Zone de réception"
    ).length,
    description:
      "Zone pour l'inspection initiale et l'enregistrement des véhicules.",
  },
  {
    id: "zone-3",
    nom: "Zone de stockage",
    capacite: 7000,
    vehiculesPresents: mockVehicles.filter((v) => v.zone === "Zone de stockage")
      .length,
    description: "Zone de stockage principale pour les véhicules.",
  },
  {
    id: "zone-4",
    nom: "Zone de préparation",
    capacite: 250,
    vehiculesPresents: mockVehicles.filter(
      (v) => v.zone === "Zone de préparation"
    ).length,
    description: "Zone pour la préparation des véhicules avant la livraison.",
  },
  {
    id: "zone-5",
    nom: "Zone de chargement de batterie",
    capacite: 150,
    vehiculesPresents: mockVehicles.filter(
      (v) => v.zone === "Zone de chargement de batterie"
    ).length,
    description:
      "Zone dédiée au chargement des batteries des véhicules électriques.",
  },
  {
    id: "zone-6",
    nom: "Atelier",
    capacite: 100,
    vehiculesPresents: mockVehicles.filter((v) => v.zone === "Atelier").length,
    description: "Atelier pour les réparations et la maintenance.",
  },
  {
    id: "zone-7",
    nom: "Lavage",
    capacite: 80,
    vehiculesPresents: mockVehicles.filter((v) => v.zone === "Lavage").length,
    description: "Zone de lavage des véhicules.",
  },
  {
    id: "zone-8",
    nom: "Zone d’expédition",
    capacite: 200,
    vehiculesPresents: mockVehicles.filter(
      (v) => v.zone === "Zone d’expédition"
    ).length,
    description: "Zone pour les véhicules prêts à être expédiés.",
  },
  {
    id: "zone-9",
    nom: "Showroom",
    capacite: 50,
    vehiculesPresents: mockVehicles.filter((v) => v.zone === "Showroom").length,
    description: "Showroom pour l'exposition des véhicules.",
  },
];

export const mockRFIDTags = mockVehicles.map((vehicle, i) => ({
  id: `tag-${i + 1}`,
  tagId: `RFID-LUX${String(i + 1).padStart(4, "0")}`,
  vin: vehicle.vin,
  dateAssociation: generateTimestamp(Math.floor(Math.random() * 30)),
}));

export const mockRFIDReadings = mockVehicles.flatMap((vehicle, i) => {
  const tag = mockRFIDTags[i];
  const readings = Math.floor(Math.random() * 5) + 3;

  return Array.from({ length: readings }, (_, j) => ({
    id: `reading-${i}-${j}`,
    tagId: tag.tagId,
    vin: vehicle.vin,
    lecteur: `Lecteur_VIP_${Math.floor(Math.random() * 8) + 1}`,
    zone: zones[Math.floor(Math.random() * zones.length)],
    timestamp: generateTimestamp(
      Math.floor(Math.random() * 7),
      Math.floor(Math.random() * 24)
    ),
  }));
});

export const mockVehicleHistory = mockVehicles.reduce((acc, vehicle) => {
  const events = Array.from(
    { length: Math.floor(Math.random() * 5) + 3 },
    (_, i) => ({
      timestamp: generateTimestamp(6 - i, Math.floor(Math.random() * 24)),
      zone: zones[Math.min(i + 1, zones.length - 1)],
      statut: statuts[Math.min(i, statuts.length - 1)],
      lecteur: `Lecteur_VIP_${Math.floor(Math.random() * 8) + 1}`,
    })
  ).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  acc[vehicle.vin] = {
    vin: vehicle.vin,
    events,
  };
  return acc;
}, {});

export const mockAlerts = [
  {
    id: "alert-1",
    type: "warning",
    message: `Porsche ${mockVehicles[0].vin} nécessite contrôle qualité supplémentaire`,
    timestamp: generateTimestamp(0, 2),
  },
  {
    id: "alert-2",
    type: "info",
    message: "Showroom approche de la capacité maximale (90%)",
    timestamp: generateTimestamp(0, 5),
  },
  {
    id: "alert-3",
    type: "warning",
    message: `Bentley ${mockVehicles[3].vin} retardée en douane`,
    timestamp: generateTimestamp(0, 8),
  },
  {
    id: "alert-4",
    type: "success",
    message: "Livraison Volkswagen Golf effectuée avec succès",
    timestamp: generateTimestamp(0, 1),
  },
];

export const getKPIs = () => {
  const total = 2839;
  const enStockage = 2500;
  const enPreparation = 21;
  const pretsALivrer = 38;
  const livres = 280;
  const enExposition = mockVehicles.filter(
    (v) => v.statut === "En Exposition"
  ).length;

  return {
    total,
    enStockage,
    enPreparation,
    pretsALivrer,
    livres,
    enExposition,
  };
};

// Additional luxury-specific data
export const getLuxuryStats = () => {
  const byBrand = marques.map((marque) => ({
    marque: marque.label,
    count: mockVehicles.filter((v) => v.marque === marque.label).length,
    value:
      mockVehicles.filter((v) => v.marque === marque.label).length *
      (150000 + Math.random() * 500000), // Estimated value
  }));

  const byYear = {
    2024: mockVehicles.filter((v) => v.annee === 2024).length,
    2025: mockVehicles.filter((v) => v.annee === 2025).length,
  };

  return {
    byBrand,
    byYear,
    totalValue: byBrand.reduce((sum, brand) => sum + brand.value, 0),
  };
};
