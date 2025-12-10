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
  targetSlots = [], // List of all slots to pick
  activeTargetSlot = null, // The specific slot currently focused/clicked
  onSlotClick = null,
  hideOccupied = false, // New prop for Stockage mode
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
    // Picking Mode Logic:
    if (mode === "picking") {
        const isPicked = pickedSlots.includes(slot.id);
        const isActiveTarget = slot.id === activeTargetSlot; // Currently selected item
        const isTarget = targetSlots.includes(slot.id); // Any target for this order

        if (isPicked) return "picked"; // PICKED (Green Check)
        if (isActiveTarget && !isPicked) return "active-target"; // FOCUS (Red Pin + Pulse)
        if (isTarget && !isPicked) return "passive-target"; // GENERAL TARGET (Red Border, No Pulse)
        
        // Everything else in picking mode:
        if (slot.status === "occupied") return "dimmed-occupied";
        return "dimmed-empty";
    }

    // Normal Mode Logic:
    if (highlightSlot && slot.id === highlightSlot) {
      return "suggested";
    }
    // ... rest of normal logic
    if (pickedSlots.includes(slot.id)) {
      return "picked";
    }
    if (alternativeSlots.some(alt => alt.id === slot.id)) {
      return "alternative";
    }
    if (slot.status === "occupied") {
        if (hideOccupied) return "hidden-occupied";
        return "occupied";
    }
    return "empty";
  };

  const getSlotStyle = (status, size) => {
    // Return classes for visual style
    const base = "transition-all duration-300 relative overflow-hidden group border";
    
    // Size-based styling adjustments (optional, mostly handled by layout)
    
    switch (status) {
      case "empty":
        return cn(base, "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 hover:border-slate-400");
      case "dimmed-empty":
        // Non-target empty slot: White/Neutral, visible border but faint
        return cn(base, "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-200 pointer-events-none");
      case "hidden-occupied":
        // Dimmed out style for occupied slots in Stockage mode
        return cn(base, "bg-slate-100/30 dark:bg-slate-800/20 border-transparent text-transparent pointer-events-none opacity-30 shadow-none");
      case "dimmed-occupied":
        // Non-target occupied slot: Light Gray/Neutral to show "it's there" but not "active"
        return cn(base, "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-300 pointer-events-none");
      case "occupied":
        return cn(base, "bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40");
      case "active-target":
        // FOCUSED SLOT: Pulse, Red, Pin
        return cn(base, "bg-red-500 text-white border-red-600 ring-4 ring-red-500/30 shadow-2xl font-bold z-20 scale-110 animate-pulse");
      case "passive-target":
        // GENERAL TARGET: Visible Border, Subtle BG, No Pulse
        return cn(base, "bg-red-50 border-red-400 border-2 text-red-700 z-10");
      case "picked":
        return cn(base, "bg-green-500 text-white border-green-600 shadow-md font-medium z-10");
      case "suggested":
        return cn(base, "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 ring-2 ring-emerald-500/50 ring-offset-2 animate-pulse text-emerald-700 font-bold z-10 scale-105 shadow-xl");
      case "alternative":
        return cn(base, "bg-amber-100/80 dark:bg-amber-900/20 border-amber-400 border-dashed text-amber-700 dark:text-amber-400 hover:bg-amber-100");
      default:
        return base;
    }
  };

  const getSlotIcon = (status, size) => {
    switch (status) {
      case "active-target": return "📍";
      case "picked": return "✅";
      case "passive-target": return ""; // No icon for passive to reduce noise
      case "suggested": return "⭐";
      case "alternative": return "⚡";
      case "occupied": return mode === 'stockage' && hideOccupied ? "" : "📦";
      case "empty": return ""; // No icon for empty
      default: return "";
    }
  };
  
  const getCapacityIndicator = (size) => {
      // Visual indicator for capacity: Small=1 dot, Medium=3 dots, Large=5 dots
      const dots = size === 'Small' ? 1 : size === 'Large' ? 5 : 3;
      return (
          <div className="flex gap-0.5 mt-1 opacity-40">
              {Array.from({length: dots}).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-current" />
              ))}
          </div>
      );
  };

  const handleSlotClick = (slot) => {
    if (onSlotClick && typeof onSlotClick === 'function') {
      const status = getSlotStatus(slot);
      if (status !== 'hidden-occupied') {
          onSlotClick(slot, status);
      }
    }
  };

  const getTooltipTitle = (slot, status) => {
      let title = `Emplacement ${slot.id} (${slot.size})\nCapacité: ${slot.capacity}`;
      if (status === 'hidden-occupied') return `Occupé (${slot.id})`;
      
      if (slot.articleId && status !== 'empty') {
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
            {mode === 'picking' && (
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {slots.filter(s => s.status === 'occupied').length} / {slots.reduce((acc, s) => acc + s.capacity, 0)} cap.
                </span>
            )}
          </h3>
        </div>
        <div className="flex gap-4 text-xs">
           {/* Mini legend - Adaptive based on mode */}
           {mode === 'picking' ? (
               <>
                {/* <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Vide</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Occupé</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cible</div> */}
               </>
           ) : (
                <>
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Disponible</div>
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Suggéré</div>
                </>
           )}
        </div>
      </div>

      {/* Grille */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
        <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
          
          {/* Colonne Headers */}
          {cols.map(col => (
            <div key={col} className="h-4 flex items-center justify-center text-[9px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-sm">
              {col}
            </div>
          ))}

          {/* Slots - Flattened rendering but respecting rows logic */}
          {rows.map(row => {
             // For each row, filter slots belonging to it
             const rowSlots = slots.filter(s => s.row === row);
             
             // To ensure grid alignment with colspans, we rely on CSS Grid auto-placement flow
             // BUT since we have different row definitions, better to wrap each row or just flatten carefully.
             // Simplest approach: Render ALL slots in order. 
             // We need to inject "spacers" if there are gaps, but our generation logic avoids gaps.
             
             // Wait, standard CSS grid with col-span works best if we just dump all items.
             // However, we are iterating rows. Let's return a fragment of cells.
             return rowSlots.map(slot => {
                 const status = getSlotStatus(slot);
                 const styleClass = getSlotStyle(status, slot.size);
                 const icon = getSlotIcon(status, slot.size);
                 
                 const colSpanClass = slot.colSpan === 2 ? "col-span-2" : "col-span-1";
                 
                 return (
                  <div
                    key={slot.id}
                    className={cn(
                      "rounded-md flex flex-col items-center justify-center cursor-pointer shadow-sm min-h-[3rem]",
                      styleClass,
                      colSpanClass
                    )}
                    onClick={() => handleSlotClick(slot)}
                    title={getTooltipTitle(slot, status)}
                  >
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono opacity-70">{slot.id}</span>
                        {/* Size Indicator for debug/clarity: S/M/L */}
                        {/* <span className="text-[8px] opacity-40">{slot.size[0]}</span> */}
                    </div>
                    
                    {icon && <span className="text-sm leading-none mt-0.5">{icon}</span>}
                    
                    {/* Capacity Indicator Dot */}
                    {status !== 'hidden-occupied' && getCapacityIndicator(slot.size)}

                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-white/0 hover:bg-white/10 dark:hover:bg-white/5 transition-colors" />
                  </div>
                 );
             })
          })}
        </div>
      </div>

      {/* Légende Détaillée */}
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 ">
          {mode === "picking" ? (
            <>
               <LegendItem color="bg-red-100 border-red-500 text-red-700" label="À picker" icon="📍" ring />
              <LegendItem color="bg-green-100 border-green-500 text-green-700" label="Pické" icon="✅" />
              {/*<LegendItem color="bg-blue-100 border-blue-400 text-blue-700" label="Occupé" icon="📦" />
              <LegendItem color="bg-slate-50 border-slate-200 text-slate-400" label="Vide" icon="" /> */}
            </>
          ) : (
            <>
              <LegendItem color="bg-emerald-100 border-emerald-500 text-emerald-700" label="Suggestion" icon="⭐" ring />
              <LegendItem color="bg-amber-100 border-amber-400 text-amber-700" label="Alternative" icon="⚡" dashed />
              <LegendItem color="bg-slate-50 border-slate-200 text-slate-400" label="Disponible" icon="" />
              {/* Removed 'Occupied' from legend as requested for Simplified View */}
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
      "flex items-center rounded-md border text-xs px-2 gap-2",
      color,
      ring && "ring-1 ring-offset-1 ring-inherit",
      dashed && "border-dashed"
    )}>
      <span className="text-sm">{icon || "⬜"}</span>
      <span className="font-medium">{label}</span>
      </div>
  );
}
