export const referentiels = {
  'Chargé réception dossier': [
    { order: 1, activite: 'Passation avec BO BAM', minutes: 0, secondes: 30, unite: 'Sac' },
    { order: 2, activite: 'Ouverture sac', minutes: 0, secondes: 3, unite: 'Sac' },
    { order: 3, activite: 'Mise en chemise', minutes: 0, secondes: 7, unite: 'Demande' },
    { order: 4, activite: 'Vérification reçu de paiement /BC renseignement', minutes: 0, secondes: 53, unite: 'Demande' },
    { order: 5, activite: 'Réception numérique sur système', minutes: 1, secondes: 0, unite: 'Demande' },
    { order: 6, activite: 'Préparation état non-conformité', minutes: 0, secondes: 45, unite: 'Demande' },
    { order: 7, activite: 'Création fichier Excel', minutes: 0, secondes: 1, unite: 'Demande' },
    { order: 8, activite: 'Affectation', minutes: 0, secondes: 30, unite: 'Demande' },
    { order: 9, activite: 'Passation', minutes: 0, secondes: 0, unite: 'Demande' },
  ],
  'Chargé dossier': [
    { order: 1, activite: 'Analyse dossier', minutes: 2, secondes: 30, unite: 'Demande' },
    { order: 2, activite: 'Validation documents', minutes: 1, secondes: 15, unite: 'Demande' },
    { order: 3, activite: 'Traitement complémentaire', minutes: 3, secondes: 0, unite: 'Demande' },
  ],
  'Chargé saisie': [
    { order: 1, activite: 'Saisie données', minutes: 3, secondes: 0, unite: 'Demande' },
    { order: 2, activite: 'Contrôle qualité', minutes: 1, secondes: 30, unite: 'Demande' },
    { order: 3, activite: 'Validation saisie', minutes: 0, secondes: 45, unite: 'Demande' },
  ],
  'Chargé validation': [
    { order: 1, activite: 'Validation finale', minutes: 2, secondes: 0, unite: 'Demande' },
    { order: 2, activite: 'Archivage', minutes: 0, secondes: 45, unite: 'Demande' },
    { order: 3, activite: 'Notification', minutes: 0, secondes: 30, unite: 'Demande' },
  ],
};

export const positionOptions = Object.keys(referentiels);
