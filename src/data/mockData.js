// ========================================
// RICHBOND - MOCK DATA
// Traçabilité RFID pour Matelas & Mobilier
// ========================================

// ============ CATÉGORIES DE PRODUITS ============
export const categories = [
  { id: 1, label: "Matelas", code: "MAT", multiPieces: false },
  { id: 2, label: "Banquette", code: "BNQ", multiPieces: true },
  { id: 3, label: "Sommier", code: "SOM", multiPieces: false },
  { id: 4, label: "Tête de lit", code: "TDL", multiPieces: false },
  { id: 5, label: "Coussin décoratif", code: "COU", multiPieces: false },
  { id: 6, label: "Pouf", code: "POU", multiPieces: false },
  { id: 7, label: "Sur-matelas", code: "SUR", multiPieces: false },
];

// ============ PRODUITS PAR CATÉGORIE ============
export const produitsParCategorie = {
  "Matelas": [
    "Matelas Confort Plus 90x190",
    "Matelas Confort Plus 140x190",
    "Matelas Confort Plus 160x200",
    "Matelas Confort Plus 180x200",
    "Matelas Royal 90x190",
    "Matelas Royal 140x190",
    "Matelas Royal 160x200",
    "Matelas Royal 180x200",
    "Matelas Prestige 90x190",
    "Matelas Prestige 140x190",
    "Matelas Prestige 160x200",
    "Matelas Prestige 180x200",
    "Matelas Luxe 160x200",
    "Matelas Luxe 180x200",
  ],
  "Banquette": [
    "Banquette Salon Marocain Classique",
    "Banquette Salon Moderne",
    "Banquette Salon Royal",
    "Banquette Angle Confort",
    "Banquette Traditionnelle",
  ],
  "Sommier": [
    "Sommier Classic 90x190",
    "Sommier Classic 140x190",
    "Sommier Classic 160x200",
    "Sommier Classic 180x200",
    "Sommier Luxe 160x200",
    "Sommier Luxe 180x200",
  ],
  "Tête de lit": [
    "Tête de lit Capitonnée Luxe",
    "Tête de lit Moderne Simple",
    "Tête de lit Classique",
    "Tête de lit Design Contemporain",
  ],
  "Coussin décoratif": [
    "Coussin Marocain Traditionnel",
    "Coussin Moderne Uni",
    "Coussin Brodé Main",
    "Coussin Berbère",
  ],
  "Pouf": [
    "Pouf Marocain Carré",
    "Pouf Rond Traditionnel",
    "Pouf Cylindrique Moderne",
  ],
  "Sur-matelas": [
    "Sur-matelas Confort 140x190",
    "Sur-matelas Confort 160x200",
    "Sur-matelas Confort 180x200",
    "Sur-matelas Mémoire Forme 160x200",
    "Sur-matelas Mémoire Forme 180x200",
  ],
};

// ============ TAILLES ============
export const tailles = [
  "90x190",
  "140x190",
  "160x200",
  "180x200",
  "200x200",
  "Standard",
  "Sur-mesure",
];

// ============ ZONES (6 zones Richbond) ============
export const zones = [
  { id: "PROD", nom: "Zone de Production", code: "PROD" },
  { id: "STK-1", nom: "Zone de Stockage 1", code: "STK-1" },
  { id: "STK-2", nom: "Zone de Stockage 2", code: "STK-2" },
  { id: "STK-3", nom: "Zone de Stockage 3", code: "STK-3" },
  { id: "PREP", nom: "Zone de Préparation", code: "PREP" },
  { id: "EXP", nom: "Zone d'Expédition", code: "EXP" },
];

export const zonesNames = zones.map(z => z.nom);

// ============ STATUTS ARTICLES ============
export const statuts = [
  "En production",
  "En stock",
  "En préparation",
  "Expédié",
];

// ============ PIÈCES DE BANQUETTE ============
export const piecesBanquette = [
  "Pièce centrale (El Wosta)",
  "Angle gauche (Lkounia Lisra)",
  "Angle droit (Lkounia Limna)",
  "Dossier central",
  "Dossier latéral gauche",
  "Dossier latéral droit",
  "Traversin (Mkada)",
];

// ============ HELPER FUNCTIONS ============
const generateTagId = (index) => {
  return `TAG-2024-${String(index + 1).padStart(5, "0")}`;
};

const generateArticleId = (index) => {
  return `ART-2024-${String(index + 1).padStart(5, "0")}`;
};

const generateLotId = (index) => {
  return `OF-2024-${String(1400 + index).padStart(4, "0")}`;
};

const generateTimestamp = (daysAgo, hoursAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

// ============ GÉNÉRER LES ARTICLES ============
// ============ GÉNÉRER LES ARTICLES ============
const generateArticles = (count, status, startIndex = 0) => {
  return Array.from({ length: count }, (_, i) => {
    const globalIndex = startIndex + i; // Use global index for unique IDs
    
    // ... existing logic ...
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryName = category.label;
    const produits = produitsParCategorie[categoryName];
    const designation = produits[Math.floor(Math.random() * produits.length)];

    // Déterminer la taille
    let size = "Standard";
    if (categoryName === "Matelas" || categoryName === "Sommier" || categoryName === "Sur-matelas") {
      size = tailles[Math.floor(Math.random() * 4)]; // 90x190, 140x190, 160x200, 180x200
    } else if (categoryName === "Tête de lit") {
      size = tailles[Math.floor(Math.random() * 4)];
    } else if (categoryName === "Banquette") {
      size = Math.random() > 0.5 ? "Standard" : "Sur-mesure";
    }

    // Déterminer la zone selon le statut
    let zone = "STK-1";
    if (status === "En production") zone = "PROD";
    else if (status === "En stock") {
      // Distribuer entre les 3 zones de stockage
      if (categoryName === "Matelas" || categoryName === "Sommier" || categoryName === "Sur-matelas") {
        zone = "STK-1";
      } else if (categoryName === "Banquette" || categoryName === "Tête de lit") {
        zone = "STK-2";
      } else {
        zone = "STK-3";
      }
    }
    else if (status === "En préparation") zone = "PREP";
    else if (status === "Expédié") zone = "EXP";

    const daysAgo = Math.floor(Math.random() * 30);
    const lotIndex = Math.floor(globalIndex / 50); // Group articles into lots of ~50

    // Assign brand (70% Richbond, 30% Mesidor)
    const brand = Math.random() < 0.7 ? "Richbond" : "Mesidor";

    // Add ML (Linear Meters) for Banquettes - typically 1.2m to 3.0m
    let ml = null;
    if (categoryName === "Banquette") {
        const lengths = [1.2, 1.5, 1.8, 2.0, 2.5, 3.0];
        ml = lengths[Math.floor(Math.random() * lengths.length)];
    }

    return {
      id: generateArticleId(globalIndex),
      tagId: generateTagId(globalIndex),
      category: categoryName,
      designation: designation,
      size: size,
      ml: ml,
      lot: generateLotId(lotIndex),
      currentZone: zone,
      status: status,
      brand: brand,
      createdAt: generateTimestamp(daysAgo, Math.floor(Math.random() * 24)),
      updatedAt: generateTimestamp(Math.floor(Math.random() * 7), Math.floor(Math.random() * 24)),
      isMultiPiece: category.multiPieces,
      parentId: null,
      pieces: [],
    };
  });
};

// Générer les articles par statut avec des ID uniques (offset cumulatif)
const countProd = 150;
const countStock = 3890;
const countPrep = 85;
const countExp = 127;

const articlesEnProduction = generateArticles(countProd, "En production", 0);
const articlesEnStock = generateArticles(countStock, "En stock", countProd);
const articlesEnPreparation = generateArticles(countPrep, "En préparation", countProd + countStock);
const articlesExpedies = generateArticles(countExp, "Expédié", countProd + countStock + countPrep);

export const mockArticles = [
  ...articlesEnProduction,
  ...articlesEnStock,
  ...articlesEnPreparation,
  ...articlesExpedies,
];

// ============ ZONES DÉTAILLÉES ============
export const mockZones = [
  {
    id: "PROD",
    nom: "Zone de Production",
    code: "PROD",
    capacite: 200,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "PROD").length,
    description: "Poste de couture - fin de fabrication, pose des tags RFID",
  },
  {
    id: "STK-1",
    nom: "Zone de Stockage 1",
    code: "STK-1",
    capacite: 500,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "STK-1").length,
    description: "Stockage principal - Matelas",
  },
  {
    id: "STK-2",
    nom: "Zone de Stockage 2",
    code: "STK-2",
    capacite: 400,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "STK-2").length,
    description: "Stockage principal - Banquettes & Pièces",
  },
  {
    id: "STK-3",
    nom: "Zone de Stockage 3",
    code: "STK-3",
    capacite: 300,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "STK-3").length,
    description: "Stockage secondaire - Accessoires & Divers",
  },
  {
    id: "PREP",
    nom: "Zone de Préparation",
    code: "PREP",
    capacite: 100,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "PREP").length,
    description: "Préparation des commandes - Picking",
  },
  {
    id: "EXP",
    nom: "Zone d'Expédition",
    code: "EXP",
    capacite: 80,
    articlesPresents: mockArticles.filter((a) => a.currentZone === "EXP").length,
    description: "Quai de chargement - Livraison",
  },
];

// ============ TAGS RFID ============
export const mockRFIDTags = mockArticles.map((article, i) => ({
  id: `tag-${i + 1}`,
  tagId: article.tagId,
  articleId: article.id,
  designation: article.designation,
  lot: article.lot,
  dateAssociation: article.createdAt,
  status: "Actif",
}));

// ============ LECTURES RFID ============
export const mockRFIDReadings = mockArticles.flatMap((article, i) => {
  const readings = Math.floor(Math.random() * 5) + 2;

  return Array.from({ length: readings }, (_, j) => ({
    id: `reading-${i}-${j}`,
    tagId: article.tagId,
    articleId: article.id,
    designation: article.designation,
    lecteur: `READER-${article.currentZone}-0${(j % 2) + 1}`,
    zone: article.currentZone,
    timestamp: generateTimestamp(
      Math.floor(Math.random() * 15),
      Math.floor(Math.random() * 24)
    ),
  }));
});

// ============ HELPER: Calculate duration between timestamps ============
const calculateDuration = (start, end) => {
  const diffMs = new Date(end) - new Date(start);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return diffHours > 0 ? `${diffDays}j ${diffHours}h` : `${diffDays}j`;
  }
  return `${diffHours}h`;
};

// ============ HISTORIQUE DES ARTICLES (STRICT FLOW) ============
// New structure: track zone entry/exit with timestamps
export const mockArticleHistory = mockArticles.reduce((acc, article) => {
  const mouvements = [];
  let entreeTimestamp = new Date(article.createdAt);

  // Step 1: Zone de production - Always starts here (tag RFID assigned)
  const prodDuration = 1 + Math.floor(Math.random() * 3); // 1-3 days
  const prodSortie = new Date(entreeTimestamp.getTime() + prodDuration * 24 * 60 * 60 * 1000);

  mouvements.push({
    zone: "Zone de production",
    statut: "En production",
    lecteur: "READER-PROD-01",
    entree: entreeTimestamp.toISOString(),
    sortie: article.status === "En production" ? null : prodSortie.toISOString(),
    duree: article.status === "En production"
      ? calculateDuration(entreeTimestamp.toISOString(), new Date().toISOString())
      : calculateDuration(entreeTimestamp.toISOString(), prodSortie.toISOString()),
  });

  // Continue only if article left production
  if (article.status !== "En production") {
    entreeTimestamp = prodSortie;

    // Step 2: Zone de stockage - Required for all articles
    let storageZone = article.currentZone.startsWith("STK") ? article.currentZone : "STK-1";
    const storageDuration = 2 + Math.floor(Math.random() * 8); // 2-10 days
    const storageSortie = new Date(entreeTimestamp.getTime() + storageDuration * 24 * 60 * 60 * 1000);

    mouvements.push({
      zone: `Zone de stockage ${storageZone.replace('STK-', '')}`,
      statut: "En stock",
      lecteur: `READER-${storageZone}-01`,
      entree: entreeTimestamp.toISOString(),
      sortie: article.status === "En stock" ? null : storageSortie.toISOString(),
      duree: article.status === "En stock"
        ? calculateDuration(entreeTimestamp.toISOString(), new Date().toISOString())
        : calculateDuration(entreeTimestamp.toISOString(), storageSortie.toISOString()),
    });

    if (article.status !== "En stock") {
      entreeTimestamp = storageSortie;

      // Optional: Transfer between storage zones (15% chance)
      if (Math.random() < 0.15 && article.status !== "En préparation") {
        const nextStorageZone = storageZone === "STK-1" ? "STK-2" : "STK-3";
        const transferDuration = 1 + Math.floor(Math.random() * 3); // 1-3 days
        const transferSortie = new Date(entreeTimestamp.getTime() + transferDuration * 24 * 60 * 60 * 1000);

        mouvements.push({
          zone: `Zone de stockage ${nextStorageZone.replace('STK-', '')}`,
          statut: "En stock",
          lecteur: `READER-${nextStorageZone}-01`,
          entree: entreeTimestamp.toISOString(),
          sortie: transferSortie.toISOString(),
          duree: calculateDuration(entreeTimestamp.toISOString(), transferSortie.toISOString()),
        });

        entreeTimestamp = transferSortie;
        storageZone = nextStorageZone;
      }

      // Step 3: Zone de préparation - Only if article is being prepared or expedited
      if (article.status === "En préparation" || article.status === "Expédié") {
        const prepDuration = 4 + Math.floor(Math.random() * 12); // 4-16 hours
        const prepSortie = new Date(entreeTimestamp.getTime() + prepDuration * 60 * 60 * 1000);

        mouvements.push({
          zone: "Zone de préparation",
          statut: "En préparation",
          lecteur: "READER-PREP-01",
          entree: entreeTimestamp.toISOString(),
          sortie: article.status === "En préparation" ? null : prepSortie.toISOString(),
          duree: article.status === "En préparation"
            ? calculateDuration(entreeTimestamp.toISOString(), new Date().toISOString())
            : calculateDuration(entreeTimestamp.toISOString(), prepSortie.toISOString()),
        });

        if (article.status === "Expédié") {
          entreeTimestamp = prepSortie;

          // Step 4: Zone d'expédition
          const expDuration = 2 + Math.floor(Math.random() * 6); // 2-8 hours
          const expSortie = new Date(entreeTimestamp.getTime() + expDuration * 60 * 60 * 1000);

          mouvements.push({
            zone: "Zone d'expédition",
            statut: "Prêt à expédier",
            lecteur: "READER-EXP-01",
            entree: entreeTimestamp.toISOString(),
            sortie: expSortie.toISOString(),
            duree: calculateDuration(entreeTimestamp.toISOString(), expSortie.toISOString()),
          });

          entreeTimestamp = expSortie;

          // Step 5: En transit / Livraison
          const deliveryDuration = 6 + Math.floor(Math.random() * 48); // 6-54 hours
          const deliverySortie = new Date(entreeTimestamp.getTime() + deliveryDuration * 60 * 60 * 1000);

          mouvements.push({
            zone: "En transit",
            statut: "En livraison",
            lecteur: "SYSTEM-MOBILE",
            entree: entreeTimestamp.toISOString(),
            sortie: deliverySortie.toISOString(),
            duree: calculateDuration(entreeTimestamp.toISOString(), deliverySortie.toISOString()),
          });
        }
      }
    }
  }

  // Calculate total sejour (from first entry to last exit or now)
  const firstMouvement = mouvements[0];
  const lastMouvement = mouvements[mouvements.length - 1]; // Current state
  const sejourEnd = lastMouvement.sortie || new Date().toISOString();
  const totalSejour = calculateDuration(firstMouvement.entree, sejourEnd);

  // Remove the current active step (last one) from the historic list
  // The user wants to see only *completed* steps
  const completedMouvements = [...mouvements];
  if (completedMouvements.length > 0) {
      completedMouvements.pop();
  }

  acc[article.id] = {
    articleId: article.id,
    tagId: article.tagId,
    mouvements: completedMouvements.reverse(), // Most recent completed first
    totalMouvements: completedMouvements.length,
    totalSejour,
    deliveryDate: lastMouvement.zone === "En transit" ? lastMouvement.sortie : null,
  };
  return acc;
}, {});

// ============ BANQUETTE PIECES (SALON COMPOSITION) ============
// For each banquette, generate child articles (pieces) forming a Salon
export const banquettePieces = mockArticles
  .filter(a => a.category === "Banquette")
  .reduce((acc, banquette, index) => {
    // Salon Composition: e.g., 2 Banquettes (Base) + 1 Angle (Coin)
    // Random 2-4 pieces
    const numPieces = 2 + Math.floor(Math.random() * 3); 
    const pieces = [];

    // Length options for Banquettes and Coins
    const banquetteLengths = [2.0, 2.5, 3.0, 3.5];
    const coinLengths = [1.0, 1.2]; // Coins are typically smaller

    for (let i = 0; i < numPieces; i++) {
        // First pieces are Banquettes, last one might be a coin/angle if random
        const isCoin = i === numPieces - 1 && Math.random() > 0.3; 
        const category = isCoin ? "Coin" : "Banquette";
        
        const length = isCoin 
            ? coinLengths[Math.floor(Math.random() * coinLengths.length)] 
            : banquetteLengths[Math.floor(Math.random() * banquetteLengths.length)];

        pieces.push({
            id: `${banquette.id}-P${i + 1}`,
            tagId: `${banquette.tagId}-P${i + 1}`,
            parentId: banquette.id,
            category: category,
            designation: `${category} ${length}m - ${banquette.brand}`,
            size: "Standard",
            ml: length,
            status: banquette.status,
            brand: banquette.brand,
        });
    }

    acc[banquette.id] = pieces;
    return acc;
  }, {});

// ============ ALERTES ============
export const mockAlerts = [
  {
    id: "alert-1",
    type: "warning",
    message: "Stock faible Zone STK-1 - Matelas 160x200",
    timestamp: generateTimestamp(0, 2),
  },
  {
    id: "alert-2",
    type: "success",
    message: "Commande #CMD-2024-156 prête à expédier",
    timestamp: generateTimestamp(0, 1),
  },
  {
    id: "alert-3",
    type: "warning",
    message: `Article ${mockArticles[42]?.tagId || 'TAG-2024-00043'} en zone depuis 15 jours`,
    timestamp: generateTimestamp(0, 5),
  },
  {
    id: "alert-4",
    type: "info",
    message: "Nouveau lot OF-2024-1547 entré en production",
    timestamp: generateTimestamp(0, 3),
  },
];

// ============ KPIs ============
export const getKPIs = () => {
  const total = mockArticles.length;
  const enProduction = mockArticles.filter((a) => a.status === "En production").length;
  const enStock = mockArticles.filter((a) => a.status === "En stock").length;
  const enPreparation = mockArticles.filter((a) => a.status === "En préparation").length;
  const expedies = mockArticles.filter((a) => a.status === "Expédié").length;

  return {
    total,
    enProduction,
    enStock,
    enPreparation,
    pretsAExpedier: enPreparation, // Articles en préparation sont prêts à expédier
    expedies,
  };
};

// ============ CLIENTS POUR COMMANDES (Part 2) ============
export const mockClients = [
  { id: 1, name: "Mohammed Benjelloun", city: "Casablanca", phone: "0661-234567", address: "123 Bd Mohammed V, Casablanca" },
  { id: 2, name: "Fatima Zahra El Alaoui", city: "Rabat", phone: "0662-345678", address: "45 Avenue Hassan II, Rabat" },
  { id: 3, name: "Ahmed Bennani", city: "Marrakech", phone: "0663-456789", address: "78 Rue de la Liberté, Marrakech" },
  { id: 4, name: "Khadija Ouazzani", city: "Fès", phone: "0664-567890", address: "34 Avenue des FAR, Fès" },
  { id: 5, name: "Youssef El Mansouri", city: "Tanger", phone: "0665-678901", address: "56 Rue de la Résistance, Tanger" },
  { id: 6, name: "Meryem Chraibi", city: "Oujda", phone: "0666-789012", address: "89 Boulevard Zerktouni, Oujda" },
  { id: 7, name: "Hassan Tazi", city: "Agadir", phone: "0667-890123", address: "23 Avenue du Prince Moulay Abdallah, Agadir" },
  { id: 8, name: "Salma Berrada", city: "Kenitra", phone: "0668-901234", address: "67 Boulevard Mohammed V, Kenitra" },
  { id: 9, name: "Karim Idrissi", city: "Tétouan", phone: "0669-012345", address: "90 Avenue Hassan II, Tétouan" },
  { id: 10, name: "Nadia Fassi Fihri", city: "Meknès", phone: "0670-123456", address: "12 Boulevard Mohamed VI, Meknès" },
  { id: 11, name: "Omar Senhaji", city: "Al Hoceima", phone: "0671-234567", address: "34 Rue Moulay Ismail, Al Hoceima" },
  { id: 12, name: "Laila Sqalli", city: "Beni Mellal", phone: "0672-345678", address: "56 Avenue Mohammed V, Beni Mellal" },
  { id: 13, name: "Amine Belhaj", city: "Safi", phone: "0673-456789", address: "78 Boulevard Hassan II, Safi" },
  { id: 14, name: "Zineb El Khattabi", city: "El Jadida", phone: "0674-567890", address: "90 Rue de la Plage, El Jadida" },
  { id: 15, name: "Rachid Amrani", city: "Settat", phone: "0675-678901", address: "12 Avenue Royale, Settat" },
];

// ============ STATISTIQUES PAR CATÉGORIE ============
export const getStatsByCategory = () => {
  return categories.map(cat => ({
    category: cat.label,
    count: mockArticles.filter(a => a.category === cat.label).length,
    percentage: Math.round((mockArticles.filter(a => a.category === cat.label).length / mockArticles.length) * 100),
  }));
};

// ============ DASHBOARD KPIs BY BRAND ============
export const getDashboardKPIsByBrand = (brand = "Global") => {
  const articles = brand === "Global"
    ? mockArticles
    : mockArticles.filter(a => a.brand === brand);

  const getBanquettesAndMatelas = (filterFn) => {
    const filtered = articles.filter(filterFn);
    return {
      banquettes: filtered.filter(a => a.category === "Banquette").length,
      matelas: filtered.filter(a => a.category === "Matelas").length,
    };
  };

  return {
    total: getBanquettesAndMatelas(() => true),
    enStock: getBanquettesAndMatelas(a => a.status === "En stock"),
    enPreparation: getBanquettesAndMatelas(a => a.status === "En préparation"),
    pretsAExpedier: getBanquettesAndMatelas(a => a.status === "En préparation"),
    expedies: getBanquettesAndMatelas(a => a.status === "Expédié"),
  };
};

// ============ DELIVERY INDICATORS BY BRAND ============
export const getDeliveryKPIsByBrand = (brand = "Global") => {
  const articles = brand === "Global"
    ? mockArticles
    : mockArticles.filter(a => a.brand === brand);

  const expedies = articles.filter(a => a.status === "Expédié");
  const banquettesLivrees = expedies.filter(a => a.category === "Banquette").length;
  const matelasLivres = expedies.filter(a => a.category === "Matelas").length;

  // Simulated delivery metrics
  const brandMultiplier = brand === "Richbond" ? 1 : brand === "Mesidor" ? 1.15 : 1.05;

  // Different metrics for banquettes vs matelas (banquettes typically have longer delivery times)
  const delaiMoyenBanquettes = (4.8 * brandMultiplier).toFixed(1);
  const delaiMoyenMatelas = (3.6 * brandMultiplier).toFixed(1);

  const otdBanquettes = brand === "Richbond" ? 86.5 : brand === "Mesidor" ? 82.0 : 84.5;
  const otdMatelas = brand === "Richbond" ? 92.5 : brand === "Mesidor" ? 88.5 : 90.5;

  const retardMoyenBanquettes = (3.2 * brandMultiplier).toFixed(1);
  const retardMoyenMatelas = (2.4 * brandMultiplier).toFixed(1);

  return {
    livres: {
      banquettes: banquettesLivrees,
      matelas: matelasLivres,
    },
    delaiMoyen: {
      banquettes: delaiMoyenBanquettes,
      matelas: delaiMoyenMatelas,
    },
    otd: {
      banquettes: otdBanquettes,
      matelas: otdMatelas,
    },
    retardMoyen: {
      banquettes: retardMoyenBanquettes,
      matelas: retardMoyenMatelas,
    },
    enRetard: {
      banquettes: Math.floor(banquettesLivrees * 0.08),
      matelas: Math.floor(matelasLivres * 0.06),
    },
  };
};

// ============ DASHBOARD ALERTS BY BRAND ============
export const getDashboardAlertsByBrand = (brand = "Global") => {
  const alerts = [
    {
      id: "alert-mto-1",
      type: "make-to-order",
      severity: "warning",
      icon: "Clock",
      message: "OF-2024-1523 : retard de production de 3 jours",
      brand: "Richbond",
      timestamp: generateTimestamp(0, 2),
    },
    {
      id: "alert-capacity-1",
      type: "capacity",
      severity: "danger",
      icon: "AlertTriangle",
      message: "STK-2 : capacité à 98% (saturation)",
      brand: "Global",
      timestamp: generateTimestamp(0, 4),
    },
    {
      id: "alert-delivery-1",
      type: "delivery-deadline",
      severity: "urgent",
      icon: "TruckIcon",
      message: "CMD-2024-0156 : livraison < 24h, 3 articles manquants",
      brand: "Richbond",
      timestamp: generateTimestamp(0, 1),
    },
    {
      id: "alert-mto-2",
      type: "make-to-order",
      severity: "warning",
      icon: "Clock",
      message: "OF-2024-1567 : risque de retard",
      brand: "Mesidor",
      timestamp: generateTimestamp(0, 8),
    },
    {
      id: "alert-delivery-2",
      type: "delivery-deadline",
      severity: "urgent",
      icon: "TruckIcon",
      message: "CMD-2024-0178 : livraison demain, picking en cours",
      brand: "Richbond",
      timestamp: generateTimestamp(0, 3),
    },
    {
      id: "alert-capacity-2",
      type: "capacity",
      severity: "warning",
      icon: "AlertTriangle",
      message: "STK-1 : occupation à 92% (réorganisation conseillée)",
      brand: "Global",
      timestamp: generateTimestamp(0, 12),
    },
  ];

  if (brand === "Global") {
    return alerts;
  }
  return alerts.filter(a => a.brand === brand || a.brand === "Global");
};

// ============ ZONE STATISTICS BY BRAND ============
export const getZoneStatsByBrand = (brand = "Global") => {
  const articles = brand === "Global"
    ? mockArticles
    : mockArticles.filter(a => a.brand === brand);

  // Define specific occupation rates for each zone (3 normal, 1 attention, 2 critique)
  const zoneOccupationRates = {
    "PROD": 65,    // Normal
    "STK-1": 105,  // Critique (105%)
    "STK-2": 93,   // Critique (93%)
    "STK-3": 45,   // Normal
    "PREP": 82,    // Attention (warning)
    "EXP": 58,     // Normal
  };

  return mockZones.map(zone => {
    const targetOccupation = zoneOccupationRates[zone.code] || 50;

    // Calculate capacity based on desired occupation rate
    const zoneArticles = articles.filter(a => a.currentZone === zone.code);
    const total = zoneArticles.length;
    const adjustedCapacity = Math.floor((total * 100) / targetOccupation);

    const banquettes = zoneArticles.filter(a => a.category === "Banquette").length;
    const matelas = zoneArticles.filter(a => a.category === "Matelas").length;
    const placesDisponibles = Math.max(0, adjustedCapacity - total);

    return {
      id: zone.id,
      code: zone.code,
      nom: zone.nom,
      banquettes,
      matelas,
      autres: total - banquettes - matelas,
      total,
      capacite: adjustedCapacity,
      placesDisponibles,
      tauxOccupation: targetOccupation,
      status: targetOccupation >= 90 ? "critical" : targetOccupation >= 75 ? "warning" : "normal",
    };
  });
};
