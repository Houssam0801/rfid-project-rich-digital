import { cn } from "@/lib/utils";

/**
 * StorageGrid - Grille visuelle réutilisable pour zones de stockage
 *
 * @param {string} zone - ID de la zone (STK-1, STK-2, STK-3)
 * @param {object} emplacements - Données grille {rows, cols, slots}
 * @param {string} highlightSlot - ID du slot à mettre en surbrillance
 * @param {array} pickedSlots - Liste des slots déjà pikés
 * @param {array} alternativeSlots - Liste des slots alternatifs (mode stockage)
 * @param {string} mode - "picking" ou "stockage"
 * @param {function} onSlotClick - Callback au clic sur un slot
 */
export default function StorageGrid({
  zone,
  emplacements,
  highlightSlot = null,
  pickedSlots = [],
  alternativeSlots = [],
  mode = "picking",
  onSlotClick = null,
}) {
  if (!emplacements) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Aucune grille disponible pour cette zone</p>
      </div>
    );
  }

  const { rows, cols, slots } = emplacements;

  const getSlotStatus = (slot) => {
    // Priorité : to-pick > picked > suggested > alternative > occupied > empty
    if (highlightSlot && slot.id === highlightSlot) {
      return mode === "picking" ? "to-pick" : "suggested";
    }
    if (pickedSlots.includes(slot.id)) {
      return "picked";
    }
    if (alternativeSlots.some(alt => alt.id === slot.id)) {
      return "alternative";
    }
    if (slot.status === "occupied") {
      return "occupied";
    }
    return "empty";
  };

  const getSlotColor = (status) => {
    const colors = {
      "empty": "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400",
      "occupied": "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300",
      "to-pick": "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 animate-pulse ring-2 ring-red-400",
      "picked": "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300",
      "suggested": "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300 animate-pulse ring-2 ring-green-400",
      "alternative": "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300",
    };
    return colors[status] || colors.empty;
  };

  const getSlotIcon = (status) => {
    switch (status) {
      case "to-pick":
        return "🔴";
      case "picked":
        return "✅";
      case "suggested":
        return "⭐";
      case "alternative":
        return "⚡";
      case "occupied":
        return "📦";
      default:
        return "";
    }
  };

  const handleSlotClick = (slot) => {
    if (onSlotClick && typeof onSlotClick === 'function') {
      const status = getSlotStatus(slot);
      onSlotClick(slot, status);
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête de la grille */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          {zone} - Plan de la Zone
        </h3>
        <div className="text-sm text-muted-foreground">
          Grille {rows.length}x{cols.length} ({slots.length} emplacements)
        </div>
      </div>

      {/* Grille */}
      <div className="border border-border rounded-lg p-4 bg-accent/30">
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${cols.length}, 1fr)` }}>
          {/* En-têtes des colonnes */}
          <div></div>
          {cols.map(col => (
            <div key={col} className="text-center text-sm font-semibold text-muted-foreground">
              {col}
            </div>
          ))}

          {/* Rangées */}
          {rows.map(row => (
            <React.Fragment key={row}>
              {/* Label de rangée */}
              <div className="flex items-center justify-center text-sm font-semibold text-muted-foreground pr-2">
                {row}
              </div>

              {/* Cellules de la rangée */}
              {cols.map(col => {
                const slot = slots.find(s => s.row === row && s.col === col);
                if (!slot) return <div key={`${row}${col}`} className="aspect-square"></div>;

                const status = getSlotStatus(slot);
                const colorClass = getSlotColor(status);
                const icon = getSlotIcon(status);

                return (
                  <div
                    key={slot.id}
                    className={cn(
                      "aspect-square border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md",
                      colorClass,
                      onSlotClick && "active:scale-95"
                    )}
                    onClick={() => handleSlotClick(slot)}
                    title={`${slot.id} - ${status === 'empty' ? 'Vide' : slot.category || 'Occupé'}`}
                  >
                    <span className="text-xs font-mono">{slot.id}</span>
                    {icon && <span className="text-lg">{icon}</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {mode === "picking" ? (
          <>
            <LegendItem color="bg-red-100 dark:bg-red-900/30 border-red-500" label="À picker (actuel)" icon="🔴" />
            <LegendItem color="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500" label="À picker (suivant)" icon="🟡" />
            <LegendItem color="bg-green-100 dark:bg-green-900/30 border-green-500" label="Déjà pické" icon="✅" />
            <LegendItem color="bg-blue-100 dark:bg-blue-900/30 border-blue-400" label="Occupé (autre)" icon="📦" />
            <LegendItem color="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700" label="Vide" icon="⬜" />
          </>
        ) : (
          <>
            <LegendItem color="bg-green-100 dark:bg-green-900/30 border-green-500" label="Suggéré" icon="⭐" />
            <LegendItem color="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500" label="Alternative" icon="⚡" />
            <LegendItem color="bg-blue-100 dark:bg-blue-900/30 border-blue-400" label="Occupé" icon="📦" />
            <LegendItem color="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700" label="Vide" icon="⬜" />
          </>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label, icon }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={cn("w-6 h-6 border-2 rounded flex items-center justify-center text-xs", color)}>
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// Export React separately if needed
import React from 'react';
