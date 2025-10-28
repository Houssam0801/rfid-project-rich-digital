export const simulationResultsActuel = {
  'Chargé réception dossier': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Passation avec BO BAM', nombreUnites: 50, heures: 0.25 },
      { order: 2, activite: 'Ouverture sac', nombreUnites: 50, heures: 0.03 },
      { order: 3, activite: 'Mise en chemise', nombreUnites: 217, heures: 0.25 },
      { order: 4, activite: 'Vérification reçu de paiement /BC renseignement', nombreUnites: 217, heures: 1.92 },
      { order: 5, activite: 'Réception numérique sur système', nombreUnites: 217, heures: 3.62 },
      { order: 6, activite: 'Préparation état non-conformité', nombreUnites: 217, heures: 1.63 },
      { order: 7, activite: 'Création fichier Excel', nombreUnites: 217, heures: 0.04 },
      { order: 8, activite: 'Affectation', nombreUnites: 217, heures: 1.09 },
      { order: 9, activite: 'Passation', nombreUnites: 217, heures: 0.00 },
    ],
    totalHeuresNecessaires: 8.83,
    effectifNecessaire: 1.26,
    effectifNecessaireArrondi: 2
  },
  'Chargé dossier': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Analyse dossier', nombreUnites: 217, heures: 9.04 },
      { order: 2, activite: 'Validation documents', nombreUnites: 217, heures: 4.34 },
      { order: 3, activite: 'Traitement complémentaire', nombreUnites: 217, heures: 10.85 },
    ],
    totalHeuresNecessaires: 24.23,
    effectifNecessaire: 3.46,
    effectifNecessaireArrondi: 4
  },
  'Chargé saisie': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Saisie données', nombreUnites: 217, heures: 10.85 },
      { order: 2, activite: 'Contrôle qualité', nombreUnites: 217, heures: 5.43 },
      { order: 3, activite: 'Validation saisie', nombreUnites: 217, heures: 1.63 },
    ],
    totalHeuresNecessaires: 17.91,
    effectifNecessaire: 2.56,
    effectifNecessaireArrondi: 3
  },
  'Chargé validation': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Validation finale', nombreUnites: 217, heures: 7.23 },
      { order: 2, activite: 'Archivage', nombreUnites: 217, heures: 2.71 },
      { order: 3, activite: 'Notification', nombreUnites: 217, heures: 1.81 },
    ],
    totalHeuresNecessaires: 11.75,
    effectifNecessaire: 1.68,
    effectifNecessaireArrondi: 2
  }
};


// -------------------------------- Recommended Process Results --------------------------------
export const simulationResultsRecommande = {
  'Chargé réception dossier': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Passation avec BO BAM', nombreUnites: 50, heures: 0.17 },
      { order: 2, activite: 'Ouverture sac', nombreUnites: 50, heures: 0.02 },
      { order: 3, activite: 'Mise en chemise', nombreUnites: 217, heures: 0.18 },
      { order: 4, activite: 'Vérification reçu de paiement /BC renseignement', nombreUnites: 217, heures: 1.27 },
      { order: 5, activite: 'Réception numérique sur système', nombreUnites: 217, heures: 2.71 },
      { order: 6, activite: 'Préparation état non-conformité', nombreUnites: 217, heures: 1.09 },
      { order: 7, activite: 'Création fichier Excel', nombreUnites: 217, heures: 0.04 },
      { order: 8, activite: 'Affectation', nombreUnites: 217, heures: 0.72 },
      { order: 9, activite: 'Passation', nombreUnites: 217, heures: 0.00 },
    ],
    totalHeuresNecessaires: 6.20,
    effectifNecessaire: 0.89,
    effectifNecessaireArrondi: 1
  },
  'Chargé dossier': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Analyse dossier', nombreUnites: 217, heures: 7.23 },
      { order: 2, activite: 'Validation documents', nombreUnites: 217, heures: 3.62 },
      { order: 3, activite: 'Traitement complémentaire', nombreUnites: 217, heures: 9.04 },
    ],
    totalHeuresNecessaires: 19.89,
    effectifNecessaire: 2.84,
    effectifNecessaireArrondi: 3
  },
  'Chargé saisie': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Saisie données', nombreUnites: 217, heures: 9.04 },
      { order: 2, activite: 'Contrôle qualité', nombreUnites: 217, heures: 4.34 },
      { order: 3, activite: 'Validation saisie', nombreUnites: 217, heures: 1.27 },
    ],
    totalHeuresNecessaires: 14.65,
    effectifNecessaire: 2.09,
    effectifNecessaireArrondi: 2
  },
  'Chargé validation': {
    dossiersParJour: 217,
    heuresNetParJour: 7,
    results: [
      { order: 1, activite: 'Validation finale', nombreUnites: 217, heures: 6.33 },
      { order: 2, activite: 'Archivage', nombreUnites: 217, heures: 2.11 },
      { order: 3, activite: 'Notification', nombreUnites: 217, heures: 1.51 },
    ],
    totalHeuresNecessaires: 9.95,
    effectifNecessaire: 1.42,
    effectifNecessaireArrondi: 2
  }
};