export const simulationResults = {
  'Chargé réception dossier': {
    dossiersParJour: 295.45,
    heuresNetParJour: 8.00,
    results: [
      { order: 1, activite: 'Passation avec BO BAM', nombreUnites: 50, heures: 0.21 },
      { order: 2, activite: 'Ouverture sac', nombreUnites: 50, heures: 0.00 },
      { order: 3, activite: 'Mise en chemise', nombreUnites: 295, heures: 0.06 },
      { order: 4, activite: 'Vérification reçu de paiement /BC renseignement', nombreUnites: 295, heures: 3.91 },
      { order: 5, activite: 'Réception numérique sur système', nombreUnites: 295, heures: 4.92 },
      { order: 6, activite: 'Préparation état non-conformité', nombreUnites: 295, heures: 2.95 },
      { order: 7, activite: 'Création fichier Excel', nombreUnites: 295, heures: 0.01 },
      { order: 8, activite: 'Affectation', nombreUnites: 295, heures: 1.23 },
      { order: 9, activite: 'Passation', nombreUnites: 295, heures: 0.00 },
    ],
    totalHeuresNecessaires: 13.28,
    effectifNecessaire: 1.66,
    effectifNecessaireArrondi: 2
  },
  'Chargé dossier': {
    dossiersParJour: 295.45,
    heuresNetParJour: 8.00,
    results: [
      { order: 1, activite: 'Analyse dossier', nombreUnites: 295, heures: 12.29 },
      { order: 2, activite: 'Validation documents', nombreUnites: 295, heures: 6.14 },
      { order: 3, activite: 'Traitement complémentaire', nombreUnites: 295, heures: 14.75 },
    ],
    totalHeuresNecessaires: 33.18,
    effectifNecessaire: 4.15,
    effectifNecessaireArrondi: 5
  },
  'Chargé saisie': {
    dossiersParJour: 295.45,
    heuresNetParJour: 8.00,
    results: [
      { order: 1, activite: 'Saisie données', nombreUnites: 295, heures: 14.75 },
      { order: 2, activite: 'Contrôle qualité', nombreUnites: 295, heures: 7.37 },
      { order: 3, activite: 'Validation saisie', nombreUnites: 295, heures: 3.69 },
    ],
    totalHeuresNecessaires: 25.81,
    effectifNecessaire: 3.23,
    effectifNecessaireArrondi: 4
  },
  'Chargé validation': {
    dossiersParJour: 295.45,
    heuresNetParJour: 8.00,
    results: [
      { order: 1, activite: 'Validation finale', nombreUnites: 295, heures: 9.83 },
      { order: 2, activite: 'Archivage', nombreUnites: 295, heures: 3.69 },
      { order: 3, activite: 'Notification', nombreUnites: 295, heures: 2.46 },
    ],
    totalHeuresNecessaires: 15.98,
    effectifNecessaire: 2.00,
    effectifNecessaireArrondi: 2
  }
};