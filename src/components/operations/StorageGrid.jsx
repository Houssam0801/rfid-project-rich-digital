import React from 'react';
import { cn } from "@/lib/utils";

/**
 * StorageGrid - Grille visuelle réutilisable pour zones de stockage
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
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-xl h-64">
        <p className="text-muted-foreground flex flex-col items-center gap-2">
          <span className="text-2xl">🏗️</span>
          Aucune grille disponible pour cette zone
        </p>
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

  const getSlotStyle = (status) => {
    // Return classes for visual style
    const base = "transition-all duration-300 relative overflow-hidden group";
    
    switch (status) {
      case "empty":
        return cn(base, "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 hover:border-slate-400");
      case "occupied":
        return cn(base, "bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40");
      case "to-pick":
        return cn(base, "bg-red-100 dark:bg-red-900/40 border-red-500 ring-2 ring-red-500/50 ring-offset-2 animate-pulse text-red-700 font-bold z-10 scale-105");
      case "picked":
        return cn(base, "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400 font-medium");
      case "suggested":
        return cn(base, "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 ring-2 ring-emerald-500/50 ring-offset-2 animate-pulse text-emerald-700 font-bold z-10 scale-105 shadow-xl");
      case "alternative":
        return cn(base, "bg-amber-100/80 dark:bg-amber-900/20 border-amber-400 border-dashed text-amber-700 dark:text-amber-400 hover:bg-amber-100");
      default:
        return base;
    }
  };

  const getSlotIcon = (status) => {
    switch (status) {
      case "to-pick": return "📍";
      case "picked": return "✅";
      case "suggested": return "⭐";
      case "alternative": return "⚡";
      case "occupied": return "📦";
      default: return "";
    }
  };

  const handleSlotClick = (slot) => {
    if (onSlotClick && typeof onSlotClick === 'function') {
      const status = getSlotStatus(slot);
      onSlotClick(slot, status);
    }
  };

  const getTooltipTitle = (slot, status) => {
      let title = `Emplacement ${slot.id} - ${status}`;
      if (slot.articleId) {
          title += `\nArticle: ${slot.tagId}\n${slot.category}`;
      }
      return title;
  };

  return (
    <div className="space-y-4">
      {/* En-tête de la grille */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Zone {zone}
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
               {slots.filter(s => s.status === 'occupied').length} / {slots.length} occupés
            </span>
          </h3>
        </div>
        <div className="flex gap-4 text-xs">
           {/* Mini legend */}
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Vide</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Occupé</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cible</div>
        </div>
      </div>

      {/* Grille */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
        <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))` }}>
          
          {/* Colonne Headers */}
          <div className="h-6"></div>
          {cols.map(col => (
            <div key={col} className="h-6 flex items-center justify-center text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-t-md">
              {col}
            </div>
          ))}

          {/* Lignes */}
          {rows.map(row => (
            <React.Fragment key={row}>
              {/* Row Header */}
              <div className="flex items-center justify-center w-6 text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-l-md">
                {row}
              </div>

              {/* Slots */}
              {cols.map(col => {
                const slot = slots.find(s => s.row === row && s.col === col);
                if (!slot) return <div key={`${row}${col}`} className="aspect-square bg-transparent"></div>;

                const status = getSlotStatus(slot);
                const styleClass = getSlotStyle(status);
                const icon = getSlotIcon(status);

                return (
                  <div
                    key={slot.id}
                    className={cn(
                      "aspect-square rounded-md border flex flex-col items-center justify-center cursor-pointer shadow-sm",
                      styleClass
                    )}
                    onClick={() => handleSlotClick(slot)}
                    title={getTooltipTitle(slot, status)}
                  >
                    <span className="text-[10px] font-mono opacity-70 mb-0.5">{slot.id}</span>
                    {icon && <span className="text-sm leading-none">{icon}</span>}
                    
                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-white/0 hover:bg-white/10 dark:hover:bg-white/5 transition-colors" />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Légende Détaillée */}
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 ">
          {mode === "picking" ? (
            <>
              <LegendItem color="bg-red-100 border-red-500 text-red-700" label="À picker" icon="📍" ring />
              <LegendItem color="bg-green-100 border-green-500 text-green-700" label="Pické" icon="✅" />
              <LegendItem color="bg-blue-100 border-blue-400 text-blue-700" label="Occupé" icon="📦" />
              <LegendItem color="bg-slate-50 border-slate-200 text-slate-400" label="Vide" icon="" />
            </>
          ) : (
            <>
              <LegendItem color="bg-emerald-100 border-emerald-500 text-emerald-700" label="Suggestion" icon="⭐" ring />
              <LegendItem color="bg-amber-100 border-amber-400 text-amber-700" label="Alternative" icon="⚡" dashed />
              <LegendItem color="bg-blue-100 border-blue-400 text-blue-700" label="Occupé" icon="📦" />
              <LegendItem color="bg-slate-50 border-slate-200 text-slate-400" label="Vide" icon="" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, icon, ring, dashed }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs",
      color,
      ring && "ring-1 ring-offset-1 ring-inherit",
      dashed && "border-dashed"
    )}>
      <span className="text-sm">{icon || "⬜"}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
