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
  Gauge,
  Activity,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { simulationGlobaleDataRecommande } from "../../data/simulationGlobale";
import EffectifComparisonModalRecommande from "../EffectifComparisonModalRecommande";
import ExcelJS from "exceljs";

export default function SimulationGlobaleRecommande() {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Get results only if simulation has been run
  const currentResults = showResults ? simulationGlobaleDataRecommande : null;

  const handleLancerSimulation = () => {
    setShowResults(true);
  };

  const handleExporterExcel = async () => {
    if (!showResults) {
      alert("Veuillez d'abord lancer la simulation");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Simulation_Globale_Recommande");

      // Set column widths
      worksheet.columns = [
        { width: 35 },
        { width: 15 },
        { width: 20 },
        { width: 25 },
      ];

      // Add header row
      const headerRow = worksheet.addRow([
        "Position",
        "Heures",
        "Besoin Effectifs",
        "Besoin Effectifs Arrondi",
      ]);

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

        row.alignment = { horizontal: "left" };
        row.getCell(2).alignment = { horizontal: "right" };
        row.getCell(3).alignment = { horizontal: "right" };
        row.getCell(4).alignment = { horizontal: "right" };
      });

      // Add empty row
      worksheet.addRow([]);

      // Add totals
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

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Simulation_Globale_Recommande.xlsx";
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
    <div className="max-w-full mx-auto space-y-4">
      {/* Input Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
          <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-2">
            Paramètres de Simulation
          </h3>
        </div>
        <div className="p-4">
          {/* Form inputs and Summary Cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2">
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
                onChange={(e) => setNombreSacs(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-2 py-1.5 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full text-xs px-2 py-1.5 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Productivité */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Gauge className="w-4 h-4 text-blue-500" />
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
                  className="w-full text-xs px-2 py-1.5 pr-10 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>

            {/* Dossiers/jour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-500" />
                Dossiers / jour
              </label>
              <input
                type="text"
                readOnly
                value={currentResults ? currentResults.dossiersParJour : "--"}
                className="w-full text-sm px-2 py-1 text-center font-bold border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 focus:outline-none"
              />
            </div>

            {/* Heures net/jour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                Heures net / jour
              </label>
              <input
                type="text"
                readOnly
                value={
                  currentResults ? `${currentResults.heuresNetParJour}h` : "--"
                }
                className="w-full text-sm px-2 py-1 text-center font-bold border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 justify-center flex-wrap">
            <button
              onClick={handleLancerSimulation}
              className="cursor-pointer text-sm px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Play className="w-3 h-3" />
              Lancer Simulation
            </button>

            <button
              onClick={() => setShowChart(true)}
              className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
            >
              <BarChart3 className="w-3 h-3" />
              Afficher Graphe
            </button>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
            >
              <GitCompare className="w-3 h-3" />
              Comparatif Effectifs
            </button>
            <button
              onClick={handleExporterExcel}
              className="cursor-pointer text-sm px-2 py-1 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2"
            >
              <FileDown className="w-3 h-3" />
              Exporter Excel
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
          <h3 className="text-base font-bold text-gray-900">
            Résultats de Simulation Globale - Recommandé
          </h3>
        </div>
        <div className="px-4 py-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <TableRow>
                  <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2/5">
                    Position
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Heures
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Besoin Effectifs
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Besoin Effectifs Arrondi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!showResults ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-12 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Play className="w-8 h-8 text-gray-300" />
                        <p className="text-sm">
                          Cliquez sur "Lancer Simulation" pour voir les
                          résultats
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {currentResults.positions.map((position, index) => (
                      <TableRow
                        key={position.position}
                        className={
                          index % 2 === 0
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }
                      >
                        <TableCell className="text-sm text-gray-700 w-2/5">
                          {position.position}
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-700 font-medium w-1/5">
                          {position.heures.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-700 font-medium w-1/5">
                          {position.besoinEffectifs.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-900 font-bold w-1/5">
                          {position.besoinEffectifsArrondi}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals rows */}
                    <TableRow className="bg-blue-50 font-semibold border-t-2 border-blue-200 hover:bg-blue-100">
                      <TableCell className="text-left text-sm text-gray-700 w-2/5">
                        Total heures nécessaires (Activités/jour)
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-900 font-bold w-1/5">
                        {currentResults.totaux.totalHeures} h
                      </TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50 font-semibold hover:bg-blue-100">
                      <TableCell className="text-left text-sm text-gray-700 w-2/5">
                        Effectif nécessaire (base{" "}
                        {currentResults.heuresNetParJour}h /jour)
                      </TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                      <TableCell className="text-sm text-center text-gray-900 font-bold w-1/5">
                        {currentResults.totaux.totalEffectifsCalcules.toFixed(
                          2
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                    </TableRow>
                    <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                      <TableCell className="text-left text-sm text-gray-900 w-2/5">
                        Effectif nécessaire Arrondi (base{" "}
                        {currentResults.heuresNetParJour}h /jour)
                      </TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                      <TableCell className="text-sm text-center w-1/5"></TableCell>
                      <TableCell className="text-sm text-center text-gray-900 w-1/5">
                        {currentResults.totaux.totalBesoinEffectifsArrondi}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {showChart && showResults && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Besoin Effectifs (Arrondi) par Position - Processus Recommandé
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

      {/* Comparison Modal */}
      {showComparisonModal && (
        <EffectifComparisonModalRecommande
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
}
