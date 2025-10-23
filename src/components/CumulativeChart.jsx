import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

/**
 * Composant de graphique pour afficher la durée cumulative par position,
 * reproduisant l'effet du diagramme de flux/Gantt cumulatif.
 * * @param {Array<Object>} rawData - Les données brutes de position, incluant les durées.
 * @param {string} unitKey - La clé des données à utiliser (ex: 'heures_calculees').
 * @param {string} unitDisplay - L'unité à afficher (ex: 'Heures').
 * @param {string} barColor - Couleur principale des barres.
 * @param {string} totalColor - Couleur de la barre 'Total Général'.
 * @param {string} excludePosition - Position à exclure du calcul cumulatif (ex: 'Chef Service').
 */
const CumulativeChart = ({
  rawData,
  unitKey,
  unitDisplay,
  barColor = '#3B82F6', // Blue-500
  totalColor = '#1e3a8a', // Blue-900
  excludePosition = 'Chef Service',
}) => {

  // --- 1. Préparation et Transformation des Données ---
  const chartData = useMemo(() => {
    let cumulativeValue = 0;
    let dataForChart = [];

    // 1. Filtrer et calculer le cumul
    const filteredPositions = rawData.filter(
        (pos) => pos.position !== excludePosition && pos.position !== 'Total Général'
    ).map(pos => ({
        position: pos.position,
        value: pos[unitKey] || 0,
    }));

    // 2. Créer les entrées pour le graphique (avec la valeur 'Invisible' pour le décalage)
    for (const item of filteredPositions) {
      // Le 'gap' invisible est la valeur cumulative précédente
      const invisibleGap = cumulativeValue;
      
      // La valeur visible est la durée propre de cette position
      const visibleDuration = item.value;

      dataForChart.push({
        name: item.position,
        // Les barres Recharts vont utiliser ces deux clés pour l'empilement
        invisible: invisibleGap, 
        visible: visibleDuration,
        // Sauvegarde de la durée totale jusqu'à ce point pour l'étiquette
        cumulative: cumulativeValue + visibleDuration,
      });

      cumulativeValue += visibleDuration;
    }

    // 3. Ajouter la barre 'Total Général'
    dataForChart.push({
      name: "Total Général",
      invisible: 0, // Pas de décalage
      visible: cumulativeValue, // Durée totale
      cumulative: cumulativeValue,
    });
    
    return dataForChart;

  }, [rawData, unitKey, excludePosition]);

  if (chartData.length === 0) {
    return <p className="text-center text-gray-500 p-4">Aucune donnée disponible pour le graphique.</p>;
  }

  // Détermination de la durée maximale pour l'axe X
  const totalMax = chartData[chartData.length - 1]?.cumulative || 1;


  // --- Custom Tooltip pour afficher le cumul ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // payload[0] est la barre invisible, payload[1] est la barre visible
        const visibleBar = payload.find(p => p.dataKey === 'visible');
        const cumulativeValue = visibleBar ? visibleBar.payload.cumulative : 0;
        
        return (
            <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-xl text-sm min-w-[180px]">
                <p className="font-bold text-gray-800 border-b pb-1 mb-1">{label}</p>
                <p className="text-gray-700">Durée Propre: <span className="font-mono text-blue-700 font-semibold">{visibleBar.value.toFixed(2)} {unitDisplay.toLowerCase()}</span></p>
                <p className="mt-1 pt-1 border-t text-sm font-semibold text-gray-900 flex justify-between">
                    Cumul: <span className="font-mono">{cumulativeValue.toFixed(2)} {unitDisplay.toLowerCase()}</span>
                </p>
            </div>
        );
    }
    return null;
  };


  return (
    <div className="h-[500px] w-full bg-white p-4 rounded-lg shadow-inner border border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical" // Pour un graphique horizontal
          margin={{ top: 20, right: 60, left: 10, bottom: 20 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />

          {/* Axe X: Cumul de Durée */}
          <XAxis
            type="number"
            domain={[0, totalMax * 1.1]} // Ajuste la plage
            stroke="#374151"
            tickLine={false}
            axisLine={{ strokeWidth: 2, stroke: "#374151" }}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value.toFixed(2)}`}
            label={{
                value: `Cumul de Durée (${unitDisplay})`,
                position: "insideBottom",
                offset: -10,
                fill: "#374151",
                fontSize: 12,
                fontWeight: 600,
            }}
          />

          {/* Axe Y: Positions */}
          <YAxis
            type="category"
            dataKey="name"
            stroke="#374151"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#374151" }}
            width={120}
          />

          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip unitDisplay={unitDisplay} />} />

          {/* Barre INVISIBLE (pour créer le décalage 'left') */}
          <Bar 
            dataKey="invisible" 
            stackId="a" 
            fill="transparent" 
            isAnimationActive={false} // Désactiver l'animation pour les barres invisibles
          />
          
          {/* Barre VISIBLE (la durée propre de la position) */}
          <Bar 
            dataKey="visible" 
            stackId="a" 
            barSize={20}
            radius={[0, 8, 8, 0]} // Coins arrondis à droite
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                // Couleur différente pour le 'Total Général'
                fill={entry.name === "Total Général" ? totalColor : barColor}
              />
            ))}
            
            {/* L'étiquette affiche la valeur cumulative totale (comme dans votre code Python) */}
            <LabelList
              dataKey="cumulative"
              position="right"
              formatter={(value) => value.toFixed(2)}
              style={{ fill: "#374151", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeChart;
