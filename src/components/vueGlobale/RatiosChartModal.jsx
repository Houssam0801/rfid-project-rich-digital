import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { X, BarChart3 } from "lucide-react";
import { ratiosResults } from "../../data/ratios";

export default function RatiosChartModal({ onClose }) {
  const [activeChart, setActiveChart] = useState("mois"); // mois, jour, heure

  // Prepare chart data based on active chart
  const getChartData = () => {
    return ratiosResults.data
      .filter((row) => row.position !== "TOTAL")
      .map((row) => {
        if (activeChart === "mois") {
          return {
            position: row.position,
            actuel: row.volumeMoyenMois.actuel,
            recommande: row.volumeMoyenMois.recommande,
          };
        } else if (activeChart === "jour") {
          return {
            position: row.position,
            actuel: row.volumeMoyenJour.actuel,
            recommande: row.volumeMoyenJour.recommande,
          };
        } else {
          return {
            position: row.position,
            actuel: row.volumeMoyenHeure.actuel,
            recommande: row.volumeMoyenHeure.recommande,
          };
        }
      });
  };

  const chartData = getChartData();

  const getChartTitle = () => {
    if (activeChart === "mois") return "Volume Moyen / Mois par Position";
    if (activeChart === "jour") return "Volume Moyen / Jour par Position";
    return "Volume Moyen / Heure par Position";
  };

  return (
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {getChartTitle()}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Comparaison Actuel vs Recommandé
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chart Type Selector */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActiveChart("mois")}
              className={`cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeChart === "mois"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Volume / Mois
            </button>
            <button
              onClick={() => setActiveChart("jour")}
              className={`cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeChart === "jour"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Volume / Jour
            </button>
            <button
              onClick={() => setActiveChart("heure")}
              className={`cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeChart === "heure"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Volume / Heure
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                 barGap={1} 
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="position"
                  angle={-45}
                  textAnchor="end"
                  height={150}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  label={{
                    value:
                      activeChart === "mois"
                        ? "Volume Moyen / Mois"
                        : activeChart === "jour"
                        ? "Volume Moyen / Jour"
                        : "Volume Moyen / Heure",
                    angle: -90,
                     dy: 60, //pushes the label slightly down
                     dx: -10,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px" }}
                  iconType="rect"
                />
                <Bar
                  dataKey="actuel"
                  fill="#3B82F6"
                  name="Effectif Actuel"
                  radius={[8, 8, 0, 0]}
                  barSize={25}
                >
                  <LabelList
                    dataKey="actuel"
                    position="top"
                    style={{
                      fill: "#374151",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  />
                </Bar>
                <Bar
                  dataKey="recommande"
                  fill="#1E3A8A"
                  name="Effectif Recommandé"
                  radius={[8, 8, 0, 0]}
                  barSize={25}
                >
                  <LabelList
                    dataKey="recommande"
                    position="top"
                    style={{
                      fill: "#374151",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}