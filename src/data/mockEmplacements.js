// ========================================
// MOCK DATA - EMPLACEMENTS STOCKAGE
// Grilles 6x5 pour zones STK-1, STK-2, STK-3
// ========================================

import { mockArticles } from './mockData';

// Configuration des grilles
const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5, 6];

// Fonction helper pour générer ID emplacement
const generateSlotId = (row, col) => `${row}${col}`;

// Fonction pour créer une grille vide avec tailles variables
const createEmptyGrid = (zoneId) => {
  const slots = [];
  
  ROWS.forEach(row => {
    let colIndex = 0;
    while (colIndex < COLS.length) {
      const col = COLS[colIndex];
      
      // Determine size randomly
      const rand = Math.random();
      let size = 'Medium';
      let capacity = 3;
      let colSpan = 1;

      // Small: 1 col, 1 capacity (30% chance)
      if (rand < 0.3) {
        size = 'Small';
        capacity = 1;
      }
      // Large: 2 cols, 5 capacity (20% chance) -> only if space remains
      else if (rand > 0.8 && colIndex < COLS.length - 1) {
        size = 'Large';
        capacity = 5;
        colSpan = 2;
      }
      
      slots.push({
        id: generateSlotId(row, col),
        row,
        col,
        zone: zoneId,
        status: 'empty', // empty, occupied
        articleId: null,
        tagId: null,
        category: null,
        size,           // Small, Medium, Large
        capacity,
        colSpan         // 1 or 2
      });

      colIndex += colSpan;
    }
  });

  return {
    zoneId,
    rows: ROWS,
    cols: COLS, // Note: headers might misalign slightly with uneven rows, handled in grid rendering
    totalSlots: slots.reduce((acc, s) => acc + s.capacity, 0), // Total capacity
    slots,
  };
};

// Créer les 3 grilles
const gridSTK1 = createEmptyGrid('STK-1');
const gridSTK2 = createEmptyGrid('STK-2');
const gridSTK3 = createEmptyGrid('STK-3');

// Remplir les grilles avec des articles en stock
const articlesEnStock = mockArticles.filter(a =>
  a.currentZone === 'STK-1' ||
  a.currentZone === 'STK-2' ||
  a.currentZone === 'STK-3'
);

// Distribution des articles dans les emplacements
let slotIndex = {
  'STK-1': 0,
  'STK-2': 0,
  'STK-3': 0,
};

articlesEnStock.forEach(article => {
  const zone = article.currentZone;
  let grid;

  if (zone === 'STK-1') grid = gridSTK1;
  else if (zone === 'STK-2') grid = gridSTK2;
  else if (zone === 'STK-3') grid = gridSTK3;
  else return;

  // Trouver un slot vide dans cette zone
  const emptySlots = grid.slots.filter(s => s.status === 'empty');
  if (emptySlots.length > 0 && slotIndex[zone] < emptySlots.length) {
    const slot = emptySlots[slotIndex[zone]];
    slot.status = 'occupied';
    slot.articleId = article.id;
    slot.tagId = article.tagId;
    slot.category = article.category;
    slotIndex[zone]++;
  }
});

// IMPORTANT: The grid is automatically populated with articlesEnStock.
// No manual placement needed as mockCommandes now references dynamic articles.

// Export des grilles
export const emplacementsSTK1 = gridSTK1;
export const emplacementsSTK2 = gridSTK2;
export const emplacementsSTK3 = gridSTK3;

// Export d'une map pour accès facile
export const emplacementsByZone = {
  'STK-1': gridSTK1,
  'STK-2': gridSTK2,
  'STK-3': gridSTK3,
};

// Fonction helper pour trouver l'emplacement d'un article
export const findArticleSlot = (articleId) => {
  for (const zone of Object.keys(emplacementsByZone)) {
    const grid = emplacementsByZone[zone];
    const slot = grid.slots.find(s => s.articleId === articleId);
    if (slot) {
      return { zone, slot };
    }
  }
  return null;
};

// Fonction pour suggérer un emplacement optimal
export const suggestOptimalSlot = (article) => {
  // Déterminer la zone prioritaire selon la catégorie
  const zoneMap = {
    'Matelas': 'STK-1',
    'Sommier': 'STK-1',
    'Sur-matelas': 'STK-1',
    'Banquette': 'STK-2',
    'Tête de lit': 'STK-2',
    'Coussin': 'STK-3',
    'Pouf': 'STK-3',
  };

  const preferredZone = zoneMap[article.category] || 'STK-3';
  const grid = emplacementsByZone[preferredZone];

  // Trouver les emplacements vides
  const emptySlots = grid.slots.filter(s => s.status === 'empty');

  if (emptySlots.length === 0) {
    // Si zone pleine, chercher dans les autres zones
    const otherZones = Object.keys(emplacementsByZone).filter(z => z !== preferredZone);
    for (const zone of otherZones) {
      const otherGrid = emplacementsByZone[zone];
      const otherEmptySlots = otherGrid.slots.filter(s => s.status === 'empty');
      if (otherEmptySlots.length > 0) {
        return {
          suggested: { ...otherEmptySlots[0], zone },
          alternatives: otherEmptySlots.slice(1, 4).map(s => ({ ...s, zone })),
        };
      }
    }
    return null; // Aucun emplacement disponible
  }

  // Privilégier les emplacements proches d'articles du même lot
  const sameLotSlots = emptySlots.filter(slot => {
    // Chercher des articles du même lot à proximité
    const adjacentSlots = getAdjacentSlots(grid, slot);
    return adjacentSlots.some(adjSlot => {
      const adjArticle = mockArticles.find(a => a.id === adjSlot.articleId);
      return adjArticle && adjArticle.lot === article.lot;
    });
  });

  const suggested = sameLotSlots.length > 0 ? sameLotSlots[0] : emptySlots[0];
  const alternatives = emptySlots.filter(s => s.id !== suggested.id).slice(0, 3);

  return {
    suggested: { ...suggested, zone: preferredZone },
    alternatives: alternatives.map(s => ({ ...s, zone: preferredZone })),
  };
};

// Fonction helper pour obtenir les slots adjacents
const getAdjacentSlots = (grid, slot) => {
  const adjacent = [];
  const rowIndex = ROWS.indexOf(slot.row);
  const colIndex = COLS.indexOf(slot.col);

  // Haut, Bas, Gauche, Droite
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRowIndex = rowIndex + dRow;
    const newColIndex = colIndex + dCol;

    if (newRowIndex >= 0 && newRowIndex < ROWS.length &&
        newColIndex >= 0 && newColIndex < COLS.length) {
      const adjRow = ROWS[newRowIndex];
      const adjCol = COLS[newColIndex];
      const adjSlot = grid.slots.find(s => s.row === adjRow && s.col === adjCol);
      if (adjSlot) adjacent.push(adjSlot);
    }
  });

  return adjacent;
};

// Export des statistiques par zone
export const getZoneStats = (zoneId) => {
  const grid = emplacementsByZone[zoneId];
  if (!grid) return null;

  const occupied = grid.slots.filter(s => s.status === 'occupied').length;
  const empty = grid.slots.filter(s => s.status === 'empty').length;

  return {
    zone: zoneId,
    total: grid.totalSlots,
    occupied,
    empty,
    occupancyRate: Math.round((occupied / grid.totalSlots) * 100),
  };
};

// Helper: Get articles ready for storage (Inbound)
export const getInboundArticles = () => {
    return mockArticles.filter(a => a.status === 'En production');
};
