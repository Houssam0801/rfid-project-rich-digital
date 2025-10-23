import { useState } from "react";
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
} from "recharts";
import {
  X,
  Play,
  BarChart3,
  FileDown,
  Users,
  Clock,
  Folder,
  Package,
  GitCompare,
} from "lucide-react";

import { simulationGlobaleData } from "../../data/simulationGlobale";

import EffectifComparisonModal from "../../components/EffectifComparisonModal"; // Import the new comparison modal

// Import exceljs instead of xlsx
import ExcelJS from "exceljs";

export default function SimulationGlobale() {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // NEW STATE: Control the visibility of the comparison modal
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Get results only if simulation has been run
  const currentResults = showResults ? simulationGlobaleData : null;

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data
    // const payload = { nombreSacs, nombreDossiers, productivite };
    // const response = await fetch('/api/simulation-globale', { method: 'POST', body: JSON.stringify(payload) });
    // const data = await response.json();
    setShowResults(true);
  };

  const handleExporterExcel = async () => {
    if (!showResults) {
      alert("Veuillez d'abord lancer la simulation");
      return;
    }

    try {
      // Create workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Simulation Globale");

      // Set column widths
      worksheet.columns = [
        { width: 35 }, // Position column
        { width: 15 }, // Heures column
        { width: 20 }, // Besoin Effectifs column
        { width: 25 }, // Besoin Effectifs Arrondi column
      ];

      // Add header row with styling
      const headerRow = worksheet.addRow([
        "Position",
        "Heures",
        "Besoin Effectifs",
        "Besoin Effectifs Arrondi",
      ]);

      // Style header row - simple bold and borders
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      // Add position data
      currentResults.positions.forEach((pos) => {
        const row = worksheet.addRow([
          pos.position,
          Number(pos.heures.toFixed(2)),
          Number(pos.besoinEffectifs.toFixed(2)),
          pos.besoinEffectifsArrondi,
        ]);

        // Style data rows - simple alignment
        row.alignment = { horizontal: "left" };
        row.getCell(2).alignment = { horizontal: "right" }; // Heures
        row.getCell(3).alignment = { horizontal: "right" }; // Besoin Effectifs
        row.getCell(4).alignment = { horizontal: "right" }; // Besoin Effectifs Arrondi
      });

      // Add empty row
      worksheet.addRow([]);

      // Add totals with proper formatting
      const totalHeuresRow = worksheet.addRow([
        "Total heures nécessaires (Activités/jour)",
        currentResults.totaux.totalHeures + " h",
        "",
        "",
      ]);
      totalHeuresRow.font = { bold: true };

      const effectifRow = worksheet.addRow([
        `Effectif nécessaire (base ${currentResults.heuresNetParJour}.00 h/jour)`,
        "",
        Number(currentResults.totaux.totalEffectifsCalcules.toFixed(2)),
        "",
      ]);
      effectifRow.font = { bold: true };

      const effectifArrondiRow = worksheet.addRow([
        `Effectif nécessaire Arrondi (base ${currentResults.heuresNetParJour}.00 h/jour)`,
        "",
        "",
        currentResults.totaux.totalBesoinEffectifsArrondi,
      ]);
      effectifArrondiRow.font = { bold: true };

      // Add borders to all cells
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
      link.download = "Simulation_Globale.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };
  // Prepare chart data - include Total
  const chartData = showResults
    ? [
        ...currentResults.positions
          .filter((pos) => pos.besoinEffectifsArrondi > 0)
          .map((pos) => ({
            name: pos.position,
            value: pos.besoinEffectifsArrondi,
          })),
        {
          name: "Total",
          value: currentResults.totaux.totalBesoinEffectifsArrondi,
        },
      ]
    : [];

  return (
    <div className="bg-[#f8fafc] py-1 px-2">
      <div className="max-w-full mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
            <h1 className="text-2xl font-bold text-gray-900">
              Simulation{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text">
                Globale
              </span>
            </h1>
            <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
          </div>
          {/* <p className="text-gray-600 text-xs max-w-2xl mx-auto leading-relaxed">
            Analysez les besoins en effectif pour toutes les positions avec
            précision et efficacité
          </p> */}
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Paramètres de Simulation
            </h3>
          </div>
          <div className="p-4">
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
                      Nombre de sacs / jour
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
                      Nombre dossiers / Mois
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
              <div className="space-y-4 ">
                <div className="grid grid-cols-2 gap-4 xl:mt-5">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                    <p className="text-xs font-medium text-blue-700">
                      Dossiers/jour
                    </p>

                    <p className="text-sm font-bold text-blue-800">
                      {currentResults ? currentResults.dossiersParJour : "--"}
                    </p>
                  </div>

                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                    <p className="text-xs font-medium text-blue-700">
                      Heures net/jour
                    </p>
                    <p className="text-sm font-bold text-blue-800">
                      {currentResults
                        ? `${currentResults.heuresNetParJour}h`
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
                Lancer Simulation
              </button>
              <button
                onClick={handleExporterExcel}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2"
              >
                <FileDown className="w-3 h-3" />
                Exporter Excel
              </button>
              <button
                onClick={() => setShowChart(true)}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
              >
                <BarChart3 className="w-3 h-3" />
                Afficher Graphe
              </button>
              <button
                // Button is now enabled and opens the modal
                onClick={() => setShowComparisonModal(true)}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all font-medium flex items-center gap-2"
              >
                <GitCompare className="w-3 h-3" />
                Comparatif Effectifs
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Résultats de Simulation Globale
            </h3>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Heures
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Besoin Effectifs
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Besoin Effectifs Arrondi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!showResults ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Play className="w-8 h-8 text-gray-300" />
                          <p className="text-sm">
                            Cliquez sur "Lancer Simulation" pour voir les
                            résultats
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentResults.positions.map((position, index) => (
                        <tr
                          key={position.position}
                          className={
                            index % 2 === 0
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-white hover:bg-gray-50"
                          }
                        >
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {position.position}
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                            {position.heures.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                            {position.besoinEffectifs.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                            {position.besoinEffectifsArrondi}
                          </td>
                        </tr>
                      ))}
                      {/* Totals rows */}
                      <tr className="bg-blue-50 font-semibold border-t-2 border-blue-200 hover:bg-blue-100">
                        <td className="py-2 px-3 text-left text-sm text-gray-700">
                          Total heures nécessaires (Activités/jour)
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                          {currentResults.totaux.totalHeures} h
                        </td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                      </tr>
                      <tr className="bg-blue-50 font-semibold hover:bg-blue-100">
                        <td className="py-2 px-3 text-left text-sm text-gray-700">
                          Effectif nécessaire (base{" "}
                          {currentResults.heuresNetParJour}h /jour)
                        </td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                        <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                          {currentResults.totaux.totalEffectifsCalcules.toFixed(
                            2
                          )}
                        </td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                        <td className="py-2 px-3 text-left text-sm text-gray-900">
                          Effectif nécessaire Arrondi (base{" "}
                          {currentResults.heuresNetParJour}h /jour)
                        </td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                        <td className="py-2 px-3 text-sm text-center"></td>
                        <td className="py-2 px-3 text-sm text-center text-gray-900">
                          {currentResults.totaux.totalBesoinEffectifsArrondi}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chart Modal */}
        {showChart && showResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Besoin Effectifs (Arrondi) par Position
                </h3>
                <button
                  onClick={() => setShowChart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
                        <LabelList
                          dataKey="value"
                          position="top"
                          style={{
                            fill: "#374151",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        />
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Total"
                                ? "#1E40AF"
                                : index % 2 === 0
                                ? "#3B82F6"
                                : "#60A5FA"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Comparison Modal */}
        {showComparisonModal && (
          <EffectifComparisonModal
            onClose={() => setShowComparisonModal(false)}
          />
        )}
      </div>
    </div>
  );
}
