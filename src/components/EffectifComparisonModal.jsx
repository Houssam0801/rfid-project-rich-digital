import React, { useState, useMemo } from "react";
import {
  X,
  Play,
  BarChart3,
  FileDown,
  Clock,
  Folder,
  Package,
  Table,
  GitCompare, // Include GitCompare icon for title
} from "lucide-react";
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
  Legend,
} from "recharts";

import ExcelJS from "exceljs";

// Import mock data
import { comparisonData } from "../data/comparisonSimulation";


// Utility component for displaying the comparison table
const ComparisonTable = ({ data, totals }) => {
  return (
    <div className="overflow-x-auto py-2">
      <table className="w-[95%] mx-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Position
            </th>
            <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Effectif Actuel
            </th>
            <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              FTE Calculé
            </th>
            <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              FTE Calculé Arrondi
            </th>
            <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Écart (FTE)
            </th>
            <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Écart Arrondi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            // Apply a color for positive/negative écarts
            const ecartClass =
              item.ecartFTE > 0
                ? "text-red-600 font-semibold"
                : item.ecartFTE < 0
                ? "text-green-600 font-semibold"
                : "text-gray-700";

            return (
              <tr
                key={item.position}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-white hover:bg-gray-50"
                }
              >
                <td className="py-2 px-3 text-sm text-gray-700">
                  {item.position}
                </td>
                <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                  {item.effectifActuel}
                </td>
                <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                  {item.fteCalcule.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                  {item.fteCalculeArrondi}
                </td>
                <td className={`py-2 px-3 text-sm text-center ${ecartClass}`}>
                  {item.ecartFTE.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                  {item.ecartArrondi}
                </td>
              </tr>
            );
          })}
          {/* Total Row - Keeping the original single total row */}
          <tr className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
            <td className="py-2 px-3 text-sm text-gray-900">TOTAL GÉNÉRAL</td>
            <td className="py-2 px-3 text-sm text-center text-gray-900">
              {totals.totalActuel}
            </td>
            <td className="py-2 px-3 text-sm text-center text-gray-900">
              {totals.totalFTE.toFixed(2)}
            </td>
            <td className="py-2 px-3 text-sm text-center text-gray-900">
              {totals.totalFTEArrondi}
            </td>
            <td className="py-2 px-3 text-sm text-center text-gray-900">
              {totals.totalEcartFTE.toFixed(2)}
            </td>
            <td className="py-2 px-3 text-sm text-center text-gray-900">
              {totals.totalEcartArrondi}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Utility component for displaying the comparison chart
const ComparisonChart = ({ chartData }) => {
  return (
    <div className="h-[450px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="position"
            angle={-45}
            textAnchor="end"
            height={120}
            tick={{ fontSize: 10, fill: "#374151" }}
            interval={0}
          />
          <YAxis
            domain={[0, 10]}
            label={{
              value: "Effectif",
              angle: -90,
              position: "insideLeft",
              fill: "#374151",
              dx: -10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="fteCalculeArrondi"
            name="Besoin Effectifs"
            fill="#007bff"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="fteCalculeArrondi"
              position="top"
              style={{ fill: "#007bff", fontSize: 10, fontWeight: 700 }}
            />
          </Bar>
          <Bar
            dataKey="effectifActuel"
            name="Effectif Actuel"
            fill="#003366"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="effectifActuel"
              position="top"
              style={{ fill: "#003366", fontSize: 10, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function EffectifComparisonModal({ onClose }) {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'

  // This would be replaced by actual API response based on inputs
  const currentResults = showResults ? comparisonData : null;

  const handleLancerSimulation = () => {
    // In a real app, this would fetch data based on the three parameters
    console.log("Lancer Comparison Simulation with:", {
      nombreSacs,
      nombreDossiers,
      productivite,
    });
    setShowResults(true);
  };

  const handleExporterExcel = async () => {
    if (!showResults) {
      console.log("Veuillez d'abord lancer la simulation");
      return;
    }

    try {
      // Use the imported ExcelJS directly
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Comparatif Effectifs");

      // Set column widths
      worksheet.columns = [
        { width: 30 }, // Position
        { width: 15 }, // Effectif Actuel
        { width: 15 }, // FTE Calculé
        { width: 20 }, // FTE Calculé Arrondi
        { width: 15 }, // Écart (FTE)
        { width: 15 }, // Écart Arrondi
      ];

      // Add header row
      const headerRow = worksheet.addRow([
        "Position",
        "Effectif Actuel",
        "FTE Calculé",
        "FTE Calculé Arrondi",
        "Écart (FTE)",
        "Écart Arrondi",
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      // Add position data
      currentResults.positions.forEach((pos) => {
        const row = worksheet.addRow([
          pos.position,
          pos.effectifActuel,
          Number(pos.fteCalcule.toFixed(2)),
          pos.fteCalculeArrondi,
          Number(pos.ecartFTE.toFixed(2)),
          pos.ecartArrondi,
        ]);
        row.alignment = { horizontal: "center" };
        row.getCell(1).alignment = { horizontal: "left" }; // Position
      });

      // Add Totals
      const totalRow = worksheet.addRow([
        "TOTAL GÉNÉRAL",
        currentResults.totaux.totalActuel,
        currentResults.totaux.totalFTE.toFixed(2),
        currentResults.totaux.totalFTEArrondi,
        currentResults.totaux.totalEcartFTE.toFixed(2),
        currentResults.totaux.totalEcartArrondi,
      ]);
      totalRow.font = { bold: true };
      totalRow.alignment = { horizontal: "center" };
      totalRow.getCell(1).alignment = { horizontal: "left" };

      // Apply borders to all cells
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Generate Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Comparatif_Effectifs.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      console.error("Erreur lors de l'exportation Excel");
    }
  };

  // Prepare chart data - used once when results are calculated
  const chartData = useMemo(() => {
    if (!currentResults) return [];

    const totalRow = {
      position: "TOTAL",
      fteCalculeArrondi: currentResults.totaux.totalFTEArrondi,
      effectifActuel: currentResults.totaux.totalActuel,
    };

    return [...currentResults.positions, totalRow];
  }, [currentResults]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
          <div className="flex-1 flex justify-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-blue-600" />
              Comparison Effectif Calculé vs Actuel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer text-gray-600 hover:text-red-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* --- Simulation Parameters and Summary --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="border-b border-gray-200 px-5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Paramètres de Simulation
              </h3>
            </div>
            <div className="p-5">
              {/* Form inputs and Summary Cards side by side */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left side - Inputs */}
                <div className="space-y-4">
                  {/* Inputs grid - 3 inputs in one line */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Nombre de sacs */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Package className="w-4 h-4 text-blue-500" />
                        Sacs / jour
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={nombreSacs}
                        onChange={(e) =>
                          setNombreSacs(parseInt(e.target.value) || 0)
                        }
                        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Nombre dossiers */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Folder className="w-4 h-4 text-blue-500" />
                        Dossiers / Mois
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={nombreDossiers}
                        onChange={(e) =>
                          setNombreDossiers(parseInt(e.target.value) || 0)
                        }
                        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Productivité */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Productivité %
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={productivite}
                          onChange={(e) =>
                            setProductivite(parseInt(e.target.value) || 0)
                          }
                          className="w-full text-xs px-2 py-1.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Summary Cards */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 xl:mt-5">
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                      <p className="text-xs font-medium text-blue-700">
                        Dossiers/jour
                      </p>
                      <p className="text-sm font-bold text-blue-800">
                        {currentResults
                          ? currentResults.totaux.dossiersParJour
                          : "--"}
                      </p>
                    </div>

                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                      <p className="text-xs font-medium text-blue-700">
                        Heures net/jour
                      </p>
                      <p className="text-sm font-bold text-blue-800">
                        {currentResults
                          ? `${currentResults.totaux.heuresNetParJour}h`
                          : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 justify-center flex-wrap">
                <button
                  onClick={handleLancerSimulation}
                  className="cursor-pointer text-sm px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Play className="w-3 h-3" />
                  Lancer simulation
                </button>
                <button
                  onClick={handleExporterExcel}
                  disabled={!showResults}
                  className={`text-sm px-2 py-1 border-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    showResults
                      ? "cursor-pointer border-green-600 text-green-600 hover:bg-green-50"
                      : "cursor-not-allowed border-gray-300 text-gray-400 opacity-50"
                  }`}
                >
                  <FileDown className="w-3 h-3" />
                  Exporter Excel
                </button>
                <button
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "chart" : "table")
                  }
                  disabled={!showResults}
                  className={`text-sm px-2 py-1 border-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    showResults
                      ? "cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50"
                      : "cursor-not-allowed border-gray-300 text-gray-400 opacity-50"
                  }`}
                >
                  {viewMode === "table" ? (
                    <>
                      <BarChart3 className="w-3 h-3" />
                      Afficher Graphe
                    </>
                  ) : (
                    <>
                      <Table className="w-3 h-3" />
                      Afficher Tableau
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* --- Results Section (Table or Chart) --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-5 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                {viewMode === "table"
                  ? "Tableau de Comparaison"
                  : "Graphe de Comparaison"}
              </h3>
            </div>
            {showResults ? (
              viewMode === "table" ? (
                <ComparisonTable
                  data={currentResults.positions}
                  totals={currentResults.totaux}
                />
              ) : (
                <ComparisonChart chartData={chartData} />
              )
            ) : (
              <div className="py-12 text-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <Play className="w-8 h-8 text-gray-300" />
                  <p className="text-sm">
                    Cliquez sur "Lancer simulation" pour voir les résultats
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
