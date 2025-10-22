export const initialComparisonData = [
  {
    position: "Chef Service",
    effectifActuel: 1,
    fteCalcule: 1.0,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé Réception dossier",
    effectifActuel: 2,
    fteCalcule: 1.66,
    fteCalculeArrondi: 2,
  },
  {
    position: "Chargé dossier",
    effectifActuel: 7,
    fteCalcule: 6.75,
    fteCalculeArrondi: 7,
  },
  {
    position: "Chargé saisie",
    effectifActuel: 7,
    fteCalcule: 6.47,
    fteCalculeArrondi: 6,
  },
  {
    position: "Chargé Validation",
    effectifActuel: 1,
    fteCalcule: 1.33,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé production",
    effectifActuel: 5,
    fteCalcule: 5.4,
    fteCalculeArrondi: 5,
  },
  {
    position: "Chargé envoi",
    effectifActuel: 1,
    fteCalcule: 1.32,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé archives",
    effectifActuel: 1,
    fteCalcule: 1.11,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé Numérisation",
    effectifActuel: 1,
    fteCalcule: 0.92,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé Stock",
    effectifActuel: 1,
    fteCalcule: 1.0,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé réclamation et reporting",
    effectifActuel: 1,
    fteCalcule: 1.0,
    fteCalculeArrondi: 1,
  },
  {
    position: "Coordinateur Réseau",
    effectifActuel: 0,
    fteCalcule: 0.0,
    fteCalculeArrondi: 0,
  },
  {
    position: "Chargé codes PIN",
    effectifActuel: 1,
    fteCalcule: 1.23,
    fteCalculeArrondi: 1,
  },
  {
    position: "Chargé Contrôle",
    effectifActuel: 1,
    fteCalcule: 1.0,
    fteCalculeArrondi: 1,
  },
  {
    position: "Détaché agence",
    effectifActuel: 1,
    fteCalcule: 1.0,
    fteCalculeArrondi: 1,
  },
];

// Calculate derived totals and values
const calculateTotals = (data) => {
  const totalActuel = data.reduce((sum, item) => sum + item.effectifActuel, 0);
  const totalFTE = data.reduce((sum, item) => sum + item.fteCalcule, 0);
  const totalFTEArrondi = data.reduce(
    (sum, item) => sum + item.fteCalculeArrondi,
    0
  );
  const totalEcartFTE = totalFTE - totalActuel;
  const totalEcartArrondi = totalFTEArrondi - totalActuel;

  return {
    totalActuel: totalActuel,
    totalFTE: totalFTE,
    totalFTEArrondi: totalFTEArrondi,
    totalEcartFTE: totalEcartFTE,
    totalEcartArrondi: totalEcartArrondi,
    // Dummy summary results
    dossiersParJour: "295.5",
    heuresNetParJour: "8.00",
  };
};

export const comparisonData = {
  positions: initialComparisonData.map((item) => ({
    ...item,
    ecartFTE: item.fteCalcule - item.effectifActuel,
    ecartArrondi: item.fteCalculeArrondi - item.effectifActuel,
  })),
  totaux: calculateTotals(initialComparisonData),
};
