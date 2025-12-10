// ========================================
// MOCK DATA - COMMANDES
// Commandes reçues depuis JDE (mockées)
// Flux: production → stockage → picking → preparing → ready → shipped
// Une commande passe en "picking" uniquement quand 100% des pièces sont en stockage
// ========================================

import { mockArticles, mockClients } from './mockData';
import { findArticleSlot } from './mockEmplacements';

// Helper pour générer des timestamps
const generateTimestamp = (daysAgo, hoursAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

// Helper pour générer une date de livraison souhaitée (dans le futur)
const generateDeliveryDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Sélectionner des articles selon leur statut
const articlesEnProduction = mockArticles.filter(a => a.status === 'En production');
const articlesEnStock = mockArticles.filter(a => a.status === 'En stock');
const articlesEnPreparation = mockArticles.filter(a => a.status === 'En préparation');
const articlesExpedies = mockArticles.filter(a => a.status === 'Expédié');

// Fonction pour obtenir un client sécurisé
const getClient = (index) => {
  return mockClients[index] || mockClients[0]; // Fallback au premier client si index invalide
};

// ========================================
// COMMANDES
// ========================================
export const mockCommandes = [
  // ============ COMMANDES EN PRODUCTION ============

  {
    id: "CMD-2024-0156",
    client: getClient(0), // Mustapha Alaoui
    dateCommande: generateTimestamp(2, 6),
    dateLivraisonSouhaitee: generateDeliveryDate(5),
    priority: "high",
    status: "production",
    type: "mixte",
    articles: [
      {
        designation: "Matelas Confort Plus 160x200",
        category: "Matelas",
        quantity: 3,
        picked: 0,
        inProduction: 2,  // 2 en production, 1 en stockage
        inStockage: 1,
        articleIds: [...articlesEnProduction.slice(0, 2).map(a => a.id), articlesEnStock[0]?.id].filter(Boolean),
        tagIds: ["TAG-2024-10001"], // 1 en stockage
      },
      {
        designation: "Banquette Salon Marocain",
        category: "Banquette",
        quantity: 1,
        picked: 0,
        inProduction: 1,  // 1 en production, 0 en stockage
        inStockage: 0,
        isMultiPiece: true,
        articleIds: [articlesEnProduction[2]?.id].filter(Boolean),
        tagIds: [],
        pieces: [
          { name: "Pièce centrale (El Wosta)", picked: false, inStockage: false, tagId: "TAG-2024-10002" },
          { name: "Angle gauche (Lkounia Lisra)", picked: false, inStockage: false, tagId: "TAG-2024-10003" },
          { name: "Angle droit (Lkounia Limna)", picked: false, inStockage: false, tagId: "TAG-2024-10004" },
        ]
      }
    ],
    totalArticles: 7,
    pickedArticles: 0,
    stockageProgress: 14, // 1/7 en stockage ≈ 14%
    createdAt: generateTimestamp(2, 6),
    updatedAt: generateTimestamp(0, 2),
  },

  {
    id: "CMD-2024-0157",
    client: getClient(1), // Fatima Zahra
    dateCommande: generateTimestamp(1, 4),
    dateLivraisonSouhaitee: generateDeliveryDate(7),
    priority: "normal",
    status: "production",
    type: "articles",
    articles: [
      {
        designation: "Matelas Royal 180x200",
        category: "Matelas",
        quantity: 4,
        picked: 0,
        inProduction: 4,  // Tout en production
        inStockage: 0,
        articleIds: articlesEnProduction.slice(3, 7).map(a => a.id),
        tagIds: [], // Aucun en stockage encore
      }
    ],
    totalArticles: 4,
    pickedArticles: 0,
    stockageProgress: 0, // 0% en stockage
    createdAt: generateTimestamp(1, 4),
    updatedAt: generateTimestamp(0, 4),
  },

  // ============ COMMANDES EN STOCKAGE ============

  // {
  //   id: "CMD-2024-0158",
  //   client: getClient(2), // Karim Benjelloun
  //   dateCommande: generateTimestamp(3, 8),
  //   dateLivraisonSouhaitee: generateDeliveryDate(3),
  //   priority: "high",
  //   status: "stockage",  // CHANGÉ: production → stockage
  //   type: "banquettes",
  //   articles: [
  //     {
  //       designation: "Banquette Angle Luxe",
  //       category: "Banquette",
  //       quantity: 2,
  //       picked: 0,
  //       inProduction: 0,  // Production terminée
  //       inStockage: 1,    // 1/2 en stockage
  //       isMultiPiece: true,
  //       articleIds: [articlesEnStock[1]?.id].filter(Boolean),
  //       tagIds: [],
  //       pieces: [
  //         { name: "Module central", picked: false, inStockage: true, tagId: "TAG-2024-10010" },
  //         { name: "Module angle", picked: false, inStockage: false, tagId: "TAG-2024-10011" },
  //         { name: "Coussin déco 1", picked: false, inStockage: false, tagId: "TAG-2024-10012" },
  //         { name: "Coussin déco 2", picked: false, inStockage: false, tagId: "TAG-2024-10013" },
  //         { name: "Coussin déco 3", picked: false, inStockage: false, tagId: "TAG-2024-10014" },
  //         { name: "Coussin déco 4", picked: false, inStockage: false, tagId: "TAG-2024-10015" },
  //       ]
  //     }
  //   ],
  //   totalArticles: 8,  // 2 articles × 4 pièces chacun
  //   pickedArticles: 0,
  //   stockageProgress: 13, // 1/8 ≈ 13% en stockage
  //   createdAt: generateTimestamp(3, 8),
  //   updatedAt: generateTimestamp(0, 1),
  // },

  // {
  //   id: "CMD-2024-0159",
  //   client: getClient(3), // Aicha Bennis
  //   dateCommande: generateTimestamp(4, 2),
  //   dateLivraisonSouhaitee: generateDeliveryDate(2),
  //   priority: "high",
  //   status: "stockage",  // CHANGÉ: picking → stockage (pas encore 100%)
  //   type: "mixte",
  //   articles: [
  //     {
  //       designation: "Matelas Prestige 140x190",
  //       category: "Matelas",
  //       quantity: 3,
  //       picked: 0,
  //       inProduction: 0,
  //       inStockage: 2,    // 2/3 en stockage
  //       articleIds: articlesEnStock.slice(2, 4).map(a => a.id),
  //       tagIds: ["TAG-2024-10020", "TAG-2024-10021"], // 2 en stockage
  //     },
  //     {
  //       designation: "Sommier Classic 140x190",
  //       category: "Sommier",
  //       quantity: 3,
  //       picked: 0,
  //       inProduction: 0,
  //       inStockage: 1,    // 1/3 en stockage
  //       articleIds: [articlesEnStock[5]?.id].filter(Boolean),
  //       tagIds: ["TAG-2024-10022"], // 1 en stockage
  //     }
  //   ],
  //   totalArticles: 6,
  //   pickedArticles: 0,
  //   stockageProgress: 50, // 3/6 = 50% en stockage
  //   createdAt: generateTimestamp(4, 2),
  //   updatedAt: generateTimestamp(0, 3),
  // },

  // ============ COMMANDES EN PICKING (100% en stockage) ============

  {
    id: "CMD-2024-0160",
    client: getClient(4), // Youssef Laroui
    dateCommande: generateTimestamp(3, 10),
    dateLivraisonSouhaitee: generateDeliveryDate(4),
    priority: "normal",
    status: "picking",  // CORRECT: 100% en stockage
    type: "articles",
    articles: [
      {
        designation: "Tête de lit Capitonnée",
        category: "Tête de lit",
        quantity: 2,
        picked: 0,  // CHANGÉ: 0 pickés sur 2
        inProduction: 0,
        inStockage: 2,    // 100% en stockage
        articleIds: articlesEnStock.slice(8, 10).map(a => a.id),
        tagIds: articlesEnStock.slice(8, 10).map(a => a.tagId), // "TAG-2024-10030", "TAG-2024-10031"
      },
      {
        designation: "Coussin Marocain Brodé",
        category: "Coussin décoratif",
        quantity: 6,
        picked: 0,  // CHANGÉ: 0 pickés sur 6
        inProduction: 0,
        inStockage: 6,    // 100% en stockage
        articleIds: articlesEnStock.slice(10, 16).map(a => a.id),
        tagIds: articlesEnStock.slice(10, 16).map(a => a.tagId), // "TAG-2024-10032"...
      }
    ],
    totalArticles: 8,
    pickedArticles: 0,  // CHANGÉ: 0 pickés sur 8
    stockageProgress: 100, // 100% en stockage
    createdAt: generateTimestamp(3, 10),
    updatedAt: generateTimestamp(0, 5),
  },

  {
    id: "CMD-2024-0161",
    client: getClient(5), // Leila Chraibi
    dateCommande: generateTimestamp(2, 8),
    dateLivraisonSouhaitee: generateDeliveryDate(1),
    priority: "high",
    status: "picking",
    type: "banquettes",
    articles: [
      {
        designation: "Banquette Salon Moderne",
        category: "Banquette",
        quantity: 1,
        picked: 0,        // CHANGÉ: 0/1 pické
        inProduction: 0,
        inStockage: 1,    // 100% en stockage
        isMultiPiece: true,
        totalML: 9.4, // Total salon length (3 + 3 + 2 + 1.2 + 0.2)
        articleIds: [articlesEnStock[16]?.id].filter(Boolean),
        tagIds: [articlesEnStock[16]?.tagId].filter(Boolean),
        pieces: [
          { name: "Banquette Salon Royal", dim: "3.00m", ml: 3.0, picked: false, inStockage: true, tagId: articlesEnStock[17]?.tagId },
          { name: "Banquette Salon Royal", dim: "3.00m", ml: 3.0, picked: false, inStockage: true, tagId: articlesEnStock[18]?.tagId },
          { name: "Banquette Salon Royal", dim: "2.00m", ml: 2.0, picked: false, inStockage: true, tagId: articlesEnStock[19]?.tagId },
          { name: "Coin Salon Royal", dim: "1.20m", ml: 1.2, picked: false, inStockage: true, tagId: articlesEnStock[20]?.tagId },
          { name: "Coin Salon Royal", dim: "0.20m", ml: 0.2, picked: false, inStockage: true, tagId: articlesEnStock[21]?.tagId },
        ]
      }
    ],
    totalArticles: 5,  // CHANGÉ: 5 pièces total
    pickedArticles: 0,  // CHANGÉ: 0 pickés
    stockageProgress: 100, // 100% en stockage
    createdAt: generateTimestamp(2, 8),
    updatedAt: generateTimestamp(0, 1),
  },

  {
    id: "CMD-2024-0175",
    client: getClient(3), // Aicha Bennis
    dateCommande: generateTimestamp(1, 2),
    dateLivraisonSouhaitee: generateDeliveryDate(3),
    priority: "high",
    status: "picking",
    type: "mixte",
    articles: [
      {
        designation: "Matelas Prestige 160x200",
        category: "Matelas",
        quantity: 2,
        picked: 0,
        inProduction: 0,
        inStockage: 2,
        articleIds: articlesEnStock.slice(25, 27).map(a => a.id),
        tagIds: articlesEnStock.slice(25, 27).map(a => a.tagId),
      },
      {
        designation: "Sommier Luxe 160x200",
        category: "Sommier",
        quantity: 2,
        picked: 0,
        inProduction: 0,
        inStockage: 2,
        articleIds: articlesEnStock.slice(27, 29).map(a => a.id),
        tagIds: articlesEnStock.slice(27, 29).map(a => a.tagId),
      }
    ],
    totalArticles: 4,
    pickedArticles: 0,
    stockageProgress: 100,
    createdAt: generateTimestamp(1, 2),
    updatedAt: generateTimestamp(0, 1),
  },

  // ============ NOUVELLE COMMANDE EN STOCKAGE ============

  {
    id: "CMD-2024-0171",
    client: getClient(6), // Hassan Tazi (index 6)
    dateCommande: generateTimestamp(1, 12),
    dateLivraisonSouhaitee: generateDeliveryDate(5),
    priority: "normal",
    status: "stockage",
    type: "articles",
    articles: [
      {
        designation: "Matelas Standard 140x190",
        category: "Matelas",
        quantity: 5,
        picked: 4,
        inProduction: 0,
        inStockage: 4,    // 4/5 en stockage
        articleIds: articlesEnStock.slice(17, 21).map(a => a.id),
        tagIds: ["TAG-2024-10050", "TAG-2024-10051", "TAG-2024-10052", "TAG-2024-10053"],
      },
      {
        designation: "Pouf Rond 40cm",
        category: "Pouf",
        quantity: 3,
        picked: 0,
        inProduction: 0,
        inStockage: 3,    // 100% en stockage
        articleIds: articlesEnStock.slice(21, 24).map(a => a.id),
        tagIds: ["TAG-2024-10054", "TAG-2024-10055", "TAG-2024-10056"],
      }
    ],
    totalArticles: 8,
    pickedArticles: 4,
    stockageProgress: 88, // 7/8 = 87.5% ≈ 88% en stockage
    createdAt: generateTimestamp(1, 12),
    updatedAt: generateTimestamp(0, 2),
  },

  // ============ COMMANDES EN PREPARATION ============
  {
    id: "CMD-2024-0162",
    client: getClient(7), // Salma Berrada
    dateCommande: generateTimestamp(5, 12),
    dateLivraisonSouhaitee: generateDeliveryDate(1),
    priority: "normal",
    status: "preparing",
    type: "mixte",
    articles: [
      {
        designation: "Matelas Confort 90x190",
        category: "Matelas",
        quantity: 5,
        picked: 5,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesEnPreparation.slice(0, 5).map(a => a.id),
        tagIds: articlesEnPreparation.slice(0, 5).map(a => a.tagId),
      },
      {
        designation: "Pouf Marocain Carré",
        category: "Pouf",
        quantity: 4,
        picked: 4,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesEnPreparation.slice(5, 9).map(a => a.id),
        tagIds: articlesEnPreparation.slice(5, 9).map(a => a.tagId),
      },
    ],
    totalArticles: 9,
    pickedArticles: 9,
    stockageProgress: 100,
    createdAt: generateTimestamp(5, 12),
    updatedAt: generateTimestamp(0, 2),
  },

  {
    id: "CMD-2024-0163",
    client: getClient(8), // Karim Idrissi
    dateCommande: generateTimestamp(4, 6),
    dateLivraisonSouhaitee: generateDeliveryDate(0),
    priority: "high",
    status: "preparing",
    type: "banquettes",
    articles: [
      {
        designation: "Banquette Angle Confort",
        category: "Banquette",
        quantity: 1,
        picked: 1,
        inProduction: 0,
        inStockage: 0,
        isMultiPiece: true,
        articleIds: [articlesEnPreparation[9]?.id].filter(Boolean),
        tagIds: [articlesEnPreparation[9]?.tagId].filter(Boolean),
        pieces: [
          { name: "Module gauche", picked: true, tagId: "TAG-2024-00056" },
          { name: "Module central", picked: true, tagId: "TAG-2024-00057" },
          { name: "Module droit", picked: true, tagId: "TAG-2024-00058" },
        ],
      },
    ],
    totalArticles: 4,
    pickedArticles: 4,
    stockageProgress: 100,
    createdAt: generateTimestamp(4, 6),
    updatedAt: generateTimestamp(0, 1),
  },

  // ============ COMMANDES PRETES ============
  {
    id: "CMD-2024-0164",
    client: getClient(9), // Nadia Fassi Fihri
    dateCommande: generateTimestamp(6, 8),
    dateLivraisonSouhaitee: generateDeliveryDate(0),
    priority: "normal",
    status: "ready",
    type: "articles",
    articles: [
      {
        designation: "Matelas Luxe 160x200",
        category: "Matelas",
        quantity: 2,
        picked: 2,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesEnPreparation.slice(10, 12).map(a => a.id),
        tagIds: articlesEnPreparation.slice(10, 12).map(a => a.tagId),
      },
      {
        designation: "Sur-matelas Premium",
        category: "Sur-matelas",
        quantity: 2,
        picked: 2,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesEnPreparation.slice(12, 14).map(a => a.id),
        tagIds: articlesEnPreparation.slice(12, 14).map(a => a.tagId),
      },
    ],
    totalArticles: 4,
    pickedArticles: 4,
    stockageProgress: 100,
    createdAt: generateTimestamp(6, 8),
    updatedAt: generateTimestamp(0, 0),
  },

  {
    id: "CMD-2024-0165",
    client: getClient(10), // Omar Senhaji
    dateCommande: generateTimestamp(5, 4),
    dateLivraisonSouhaitee: generateDeliveryDate(-1),
    priority: "high",
    status: "ready",
    type: "mixte",
    articles: [
      {
        designation: "Banquette Traditionnelle",
        category: "Banquette",
        quantity: 1,
        picked: 1,
        inProduction: 0,
        inStockage: 0,
        isMultiPiece: true,
        articleIds: [articlesEnPreparation[14]?.id].filter(Boolean),
        tagIds: [articlesEnPreparation[14]?.tagId].filter(Boolean),
        pieces: [
          { name: "Assise centrale", picked: true, tagId: "TAG-2024-00080" },
          { name: "Dossier", picked: true, tagId: "TAG-2024-00081" },
          { name: "Accoudoir gauche", picked: true, tagId: "TAG-2024-00082" },
          { name: "Accoudoir droit", picked: true, tagId: "TAG-2024-00083" },
        ],
      },
      {
        designation: "Coussin Traditionnel",
        category: "Coussin décoratif",
        quantity: 8,
        picked: 8,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesEnPreparation.slice(15, 23).map(a => a.id),
        tagIds: articlesEnPreparation.slice(15, 23).map(a => a.tagId),
      },
    ],
    totalArticles: 12,
    pickedArticles: 12,
    stockageProgress: 100,
    createdAt: generateTimestamp(5, 4),
    updatedAt: generateTimestamp(0, 0),
  },

  // ============ COMMANDES EXPEDIEES ============

  {
    id: "CMD-2024-0166",
    client: getClient(11), // Laila Sqalli
    dateCommande: generateTimestamp(8, 10),
    dateLivraisonSouhaitee: generateTimestamp(1, 0),
    priority: "normal",
    status: "shipped",
    type: "articles",
    articles: [
      {
        designation: "Sommier Luxe 180x200",
        category: "Sommier",
        quantity: 2,
        picked: 2,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesExpedies.slice(0, 2).map(a => a.id),
        tagIds: articlesExpedies.slice(0, 2).map(a => a.tagId),
      },
      {
        designation: "Tête de lit Classique",
        category: "Tête de lit",
        quantity: 1,
        picked: 1,
        inProduction: 0,
        inStockage: 0,
        articleIds: [articlesExpedies[2]?.id].filter(Boolean),
        tagIds: [articlesExpedies[2]?.tagId].filter(Boolean),
      },
    ],
    totalArticles: 3,
    pickedArticles: 3,
    stockageProgress: 100,
    dateExpedition: generateTimestamp(1, 5),
    createdAt: generateTimestamp(8, 10),
    updatedAt: generateTimestamp(1, 5),
  },

  {
    id: "CMD-2024-0167",
    client: getClient(12), // Amine Belhaj
    dateCommande: generateTimestamp(10, 6),
    dateLivraisonSouhaitee: generateTimestamp(2, 0),
    priority: "low",
    status: "shipped",
    type: "banquettes",
    articles: [
      {
        designation: "Banquette Moderne Compacte",
        category: "Banquette",
        quantity: 1,
        picked: 1,
        inProduction: 0,
        inStockage: 0,
        isMultiPiece: true,
        articleIds: [articlesExpedies[3]?.id].filter(Boolean),
        tagIds: [articlesExpedies[3]?.tagId].filter(Boolean),
        pieces: [
          { name: "Assise", picked: true, tagId: "TAG-2024-00095" },
          { name: "Dossier", picked: true, tagId: "TAG-2024-00096" },
        ],
      },
    ],
    totalArticles: 3,
    pickedArticles: 3,
    stockageProgress: 100,
    dateExpedition: generateTimestamp(2, 8),
    createdAt: generateTimestamp(10, 6),
    updatedAt: generateTimestamp(2, 8),
  },

  {
    id: "CMD-2024-0168",
    client: getClient(13), // Zineb El Khattabi
    dateCommande: generateTimestamp(7, 3),
    dateLivraisonSouhaitee: generateTimestamp(0, 0),
    priority: "normal",
    status: "shipped",
    type: "mixte",
    articles: [
      {
        designation: "Matelas Confort 140x190",
        category: "Matelas",
        quantity: 4,
        picked: 4,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesExpedies.slice(4, 8).map(a => a.id),
        tagIds: articlesExpedies.slice(4, 8).map(a => a.tagId),
      },
      {
        designation: "Pouf Rond",
        category: "Pouf",
        quantity: 2,
        picked: 2,
        inProduction: 0,
        inStockage: 0,
        articleIds: articlesExpedies.slice(8, 10).map(a => a.id),
        tagIds: articlesExpedies.slice(8, 10).map(a => a.tagId),
      },
    ],
    totalArticles: 6,
    pickedArticles: 6,
    stockageProgress: 100,
    dateExpedition: generateTimestamp(0, 6),
    createdAt: generateTimestamp(7, 3),
    updatedAt: generateTimestamp(0, 6),
  },

  // ============ NOUVELLES COMMANDES (plus récentes, en production) ============
  {
    id: "CMD-2024-0169",
    client: getClient(14), // Rachid Amrani
    dateCommande: generateTimestamp(0, 8),
    dateLivraisonSouhaitee: generateDeliveryDate(10),
    priority: "low",
    status: "production",
    type: "articles",
    articles: [
      {
        designation: "Coussin Brodé Main",
        category: "Coussin décoratif",
        quantity: 12,
        picked: 0,
        inProduction: 12,
        inStockage: 0,
        articleIds: articlesEnProduction.slice(8, 20).map(a => a.id),
        tagIds: [],
      },
    ],
    totalArticles: 12,
    pickedArticles: 0,
    stockageProgress: 0,
    createdAt: generateTimestamp(0, 8),
    updatedAt: generateTimestamp(0, 8),
  },

  {
    id: "CMD-2024-0170",
    client: getClient(0), // Mustapha Alaoui (réutilisé)
    dateCommande: generateTimestamp(0, 3),
    dateLivraisonSouhaitee: generateDeliveryDate(6),
    priority: "normal",
    status: "production",
    type: "mixte",
    articles: [
      {
        designation: "Banquette Sur-mesure",
        category: "Banquette",
        quantity: 1,
        picked: 0,
        inProduction: 1,
        inStockage: 0,
        isMultiPiece: true,
        articleIds: [articlesEnProduction[20]?.id].filter(Boolean),
        tagIds: [],
        pieces: [
          { name: "Module A", picked: false, tagId: "TAG-2024-10070" },
          { name: "Module B", picked: false, tagId: "TAG-2024-10071" },
          { name: "Module C", picked: false, tagId: "TAG-2024-10072" },
          { name: "Coussin 1", picked: false, tagId: "TAG-2024-10073" },
          { name: "Coussin 2", picked: false, tagId: "TAG-2024-10074" },
          { name: "Coussin 3", picked: false, tagId: "TAG-2024-10075" },
          { name: "Coussin 4", picked: false, tagId: "TAG-2024-10076" },
          { name: "Coussin 5", picked: false, tagId: "TAG-2024-10077" },
          { name: "Coussin 6", picked: false, tagId: "TAG-2024-10078" },
        ],
      },
      {
        designation: "Matelas Standard 160x200",
        category: "Matelas",
        quantity: 2,
        picked: 0,
        inProduction: 2,
        inStockage: 0,
        articleIds: articlesEnProduction.slice(21, 23).map(a => a.id),
        tagIds: [],
      },
    ],
    totalArticles: 12,
    pickedArticles: 0,
    stockageProgress: 0,
    createdAt: generateTimestamp(0, 3),
    updatedAt: generateTimestamp(0, 3),
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getCommandesByStatus = (status) => {
  return mockCommandes.filter(c => c.status === status);
};

export const getCommandeById = (id) => {
  return mockCommandes.find(c => c.id === id);
};

export const getPickableCommandes = () => {
  return mockCommandes.filter(c => c.status === 'picking');
};

export const getCommandeProgress = (commande) => {
  if (!commande) return 0;
  return Math.round((commande.pickedArticles / commande.totalArticles) * 100);
};

// Stats pour le dashboard Commandes
export const getCommandesStats = () => {
  return {
    today: mockCommandes.filter(c =>
      new Date(c.dateCommande).toDateString() === new Date().toDateString()
    ).length,
    production: getCommandesByStatus('production').length,
    stockage: getCommandesByStatus('stockage').length,
    picking: getCommandesByStatus('picking').length,
    preparing: getCommandesByStatus('preparing').length,
    ready: getCommandesByStatus('ready').length,
    shipped: getCommandesByStatus('shipped').length,
  };
};

// Vérifier si une commande peut passer en picking
export const canStartPicking = (commande) => {
  if (!commande) return false;
  
  // 1. Tous les articles doivent avoir quitté la production
  const allProductionDone = commande.articles.every(a => a.inProduction === 0);
  if (!allProductionDone) return false;
  
  // 2. Tous les articles doivent être 100% en stockage
  const allInStockage = commande.articles.every(a => a.inStockage === a.quantity);
  if (!allInStockage) return false;
  
  // 3. Pour les articles multi-pièces, toutes les pièces doivent être en stockage
  const multiPieceReady = commande.articles
    .filter(a => a.isMultiPiece)
    .every(a => a.pieces.every(p => p.inStockage === true));
  
  return multiPieceReady;
};

// Pour le picking - obtenir le prochain article à picker
// Pour le picking - obtenir le prochain article à picker
export const getNextArticleToPick = (commandeId) => {
  const commande = getCommandeById(commandeId);
  if (!commande || commande.status !== 'picking') return null;

  for (const articleLine of commande.articles) {
    
    // CAS 1: Article Multi-pièces (Banquette)
    if (articleLine.isMultiPiece && articleLine.pieces) {
       const unpickedPiece = articleLine.pieces.find(p => !p.picked);
       if (unpickedPiece) {
            const article = mockArticles.find(a => a.tagId === unpickedPiece.tagId);
            if (article) {
                const slotInfo = findArticleSlot(article.id);
                return {
                    article: { ...article, designation: `${articleLine.designation} - ${unpickedPiece.name}` },
                    articleLine,
                    piece: unpickedPiece,
                    remaining: articleLine.pieces.filter(p => !p.picked).length,
                    slot: slotInfo?.slot || null,
                    zone: slotInfo?.zone || null,
                };
            }
       }
    }
    
    // CAS 2: Article Standard
    else if (articleLine.picked < articleLine.quantity) {
      const pickedCount = articleLine.picked;

      // Get tag ID for the next unpicked article
      const tagId = articleLine.tagIds && articleLine.tagIds[pickedCount];
      const article = tagId ? mockArticles.find(a => a.tagId === tagId) : null;

      if (article) {
        // Find the slot where this article is stored
        const slotInfo = findArticleSlot(article.id);

        return {
          article,
          articleLine,
          remaining: articleLine.quantity - articleLine.picked,
          slot: slotInfo?.slot || null,
          zone: slotInfo?.zone || null,
        };
      }
    }
  }

  return null; // Tous les articles sont pickés
};

// Filtrer les commandes
export const filterCommandes = ({ search, client, status, priority, dateLivraison }) => {
  return mockCommandes.filter(c => {
    if (!c || !c.client) return false; // Safety check
    
    if (search && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (client && c.client.name && !c.client.name.toLowerCase().includes(client.toLowerCase())) return false;
    if (status && status !== 'all' && c.status !== status) return false;
    if (priority && priority !== 'all' && c.priority !== priority) return false;
    if (dateLivraison) {
      const livraisonDate = new Date(c.dateLivraisonSouhaitee).toDateString();
      const filterDate = new Date(dateLivraison).toDateString();
      if (livraisonDate !== filterDate) return false;
    }
    return true;
  });
};

// Calcul automatique du stockageProgress
export const calculateStockageProgress = (commande) => {
  if (!commande) return 0;
  
  let totalPieces = 0;
  let piecesInStockage = 0;
  
  commande.articles.forEach(article => {
    totalPieces += article.quantity;
    piecesInStockage += article.inStockage;
    
    // Pour les articles multi-pièces, compter les pièces individuelles
    if (article.isMultiPiece && article.pieces) {
      totalPieces += article.pieces.length;
      piecesInStockage += article.pieces.filter(p => p.inStockage).length;
    }
  });
  
  return totalPieces > 0 ? Math.round((piecesInStockage / totalPieces) * 100) : 0;
};