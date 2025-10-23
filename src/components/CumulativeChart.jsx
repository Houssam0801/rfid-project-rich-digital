// src/components/CumulativeGanttChart.jsx
import React, { useMemo } from 'react';

const CumulativeGanttChart = ({ data, total, unit = 'Heures' }) => {
  // Define the correct process order based on your workflow
  const processOrder = [
    'Client',
    'Agence',
    'Chargé Réception dossier',
    'Chargé dossier',
    'Chargé saisie',
    'Chargé Validation',
    'Chargé production',
    'Chargé envoi',
    'Chargé archives',
    'Chargé Numérisation',
    'Chargé codes PIN',
  ];

  // Prepare cumulative data following process order
  const chartData = useMemo(() => {
    let cumulative = 0;
    const cumulativeData = [];

    processOrder.forEach((position) => {
      if (data[position]) {
        const duration = unit === 'Heures' 
          ? data[position].dureeHeures 
          : unit === 'Minutes' 
          ? data[position].dureeMinutes 
          : data[position].dureeSecondes;

        // Only include positions with duration > 0
        if (duration > 0) {
          const start = cumulative;
          cumulative += duration;
          cumulativeData.push({
            position,
            start,
            end: cumulative,
            duration,
          });
        }
      }
    });

    return cumulativeData;
  }, [data, unit]);

  // Get total value
  const totalValue = useMemo(() => {
    return unit === 'Heures' 
      ? total.dureeHeures 
      : unit === 'Minutes' 
      ? total.dureeMinutes 
      : total.dureeSecondes;
  }, [total, unit]);

  // Chart dimensions
  const width = 1000;
  const height = (chartData.length + 1) * 35 + 80; // +1 for total row
  const marginLeft = 220;
  const marginRight = 100;
  const marginTop = 40;
  const marginBottom = 50;
  const barHeight = 22;

  // Scale function
  const xScale = (value) => {
    const maxValue = totalValue * 1.05; // 5% padding
    return (
      marginLeft +
      (value / maxValue) * (width - marginLeft - marginRight)
    );
  };

  // Generate grid lines
  const gridLines = useMemo(() => {
    const maxValue = totalValue * 1.05;
    const step = maxValue / 10;
    return Array.from({ length: 11 }, (_, i) => i * step);
  }, [totalValue]);

  return (
    <div className="w-full overflow-x-auto py-2">
      <svg
        width={width}
        height={height}
        className="mx-auto"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          className="text-base font-bold fill-gray-800"
        >
          Répartition Cumulative du Temps par Poste
        </text>

        {/* Grid lines */}
        {gridLines.map((tick, i) => (
          <g key={i}>
            <line
              x1={xScale(tick)}
              y1={marginTop}
              x2={xScale(tick)}
              y2={height - marginBottom}
              stroke="#e5e7eb"
              strokeDasharray="3,3"
              strokeWidth="1"
            />
            <text
              x={xScale(tick)}
              y={height - marginBottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          Cumul de Durée ({unit})
        </text>

        {/* Bars - Gantt/Waterfall style following process order */}
        {chartData.map((item, index) => {
          const y = marginTop + index * 35;
          const barWidth = xScale(item.end) - xScale(item.start);

          return (
            <g key={item.position}>
              {/* Position label */}
              <text
                x={marginLeft - 10}
                y={y + barHeight / 2 + 5}
                textAnchor="end"
                className="text-xs fill-gray-700"
              >
                {item.position}
              </text>

              {/* Bar segment - showing individual contribution */}
              <rect
                x={xScale(item.start)}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                rx="4"
                ry="4"
                opacity="0.85"
              />

              {/* Cumulative value label at the end */}
              <text
                x={xScale(item.end) + 10}
                y={y + barHeight / 2 + 5}
                className="text-xs font-semibold fill-gray-700"
              >
                {item.end.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Total bar */}
        {chartData.length > 0 && (
          <g>
            {/* Separator line */}
            <line
              x1={marginLeft - 10}
              y1={marginTop + chartData.length * 35 - 5}
              x2={width - marginRight}
              y2={marginTop + chartData.length * 35 - 5}
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {/* Total label */}
            <text
              x={marginLeft - 10}
              y={marginTop + chartData.length * 35 + barHeight / 2 + 5}
              textAnchor="end"
              className="text-sm font-bold fill-gray-900"
            >
              Total Général
            </text>

            {/* Total bar - full width from 0 to total */}
            <rect
              x={xScale(0)}
              y={marginTop + chartData.length * 35}
              width={xScale(totalValue) - xScale(0)}
              height={barHeight}
              fill="#1e3a8a"
              rx="4"
              ry="4"
              opacity="0.9"
            />

            {/* Total value label */}
            <text
              x={xScale(totalValue) + 10}
              y={marginTop + chartData.length * 35 + barHeight / 2 + 5}
              className="text-sm font-bold fill-gray-900"
            >
              {totalValue.toFixed(2)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default CumulativeGanttChart;