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
import {
  X,
  Play,
  BarChart3,
  Package,
  Folder,
  FileDown,
  Gauge,
  Activity,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  economiesBudgetairesResults,
  chartMasseSalarialeData,
} from "../../data/economiesBudgetaires";
import ExcelJS from "exceljs";

export default function EconomiesBudgetaires() {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(true);
  const [showChart, setShowChart] = useState(false);

  // Get results from mock data
  const results = showResults ? economiesBudgetairesResults : null;

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data
    // const payload = { nombreSacs, nombreDossiers, productivite };
    setShowResults(true);
  };

  // Excel export function
  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Economies_Budgetaires");

      // Set column widths
      worksheet.columns = [
        { width: 30 }, // Label
        { width: 20 }, // Actuel
        { width: 20 }, // Calculé
        { width: 20 }, // Recommandé
        { width: 25 }, // Calculé vs Actuel
        { width: 25 }, // Recommandé vs Actuel
        { width: 25 }, // Recommandé vs Calculé
      ];

      // Add title
      const titleRow = worksheet.addRow(["Economies Budgétaires Estimées"]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:G1");
      worksheet.addRow([]); // Empty row

      // Add parameters
      const paramsRow = worksheet.addRow([
        "Paramètres de Simulation",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      paramsRow.font = { bold: true, size: 14 };
      worksheet.mergeCells("A3:G3");
      paramsRow.alignment = { horizontal: "center" };

      worksheet.addRow([
        `Sacs/jour: ${nombreSacs}`,
        `Dossiers/mois: ${nombreDossiers}`,
        `Productivité: ${productivite}%`,
        "",
        "",
        "",
        "",
      ]);
      worksheet.addRow([
        `Dossiers/jour: ${results?.dossiersParJour || "--"}`,
        `Heures Net/jour: ${results?.heuresNetParJour || "--"}h`,
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.addRow([]); // Empty row

      // Add main headers
      const mainHeadersRow = worksheet.addRow([
        "",
        "Comparaison Masse Salariale",
        "",
        "",
        "Écarts",
        "",
        "",
      ]);
      mainHeadersRow.font = { bold: true, size: 12 };
      mainHeadersRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("B7:D7");
      worksheet.mergeCells("E7:G7");

      // Add sub headers
      const headersRow = worksheet.addRow([
        "",
        "Actuel",
        "Calculé",
        "Recommandé",
        "Calculé Vs Actuel",
        "Recommandé Vs Actuel",
        "Recommandé Vs Calculé",
      ]);
      headersRow.font = { bold: true };
      headersRow.alignment = { horizontal: "center" };

      // Add data rows
      if (results) {
        for (let i = 0; i < results.masseSalariale.rows.length; i++) {
          const msRow = results.masseSalariale.rows[i];
          const ecartRow = results.ecarts.rows[i];

          const dataRow = worksheet.addRow([
            msRow.label,
            msRow.actuel,
            msRow.calcule,
            msRow.recommande,
            ecartRow.calculeVsActuel,
            ecartRow.recommandeVsActuel,
            ecartRow.recommandeVsCalcule,
          ]);

          // Bold first two rows (Mois and Année)
          if (i < 2) {
            dataRow.font = { bold: true };
          }

          // Align columns
          dataRow.getCell(1).alignment = { horizontal: "left" };
          for (let j = 2; j <= 7; j++) {
            dataRow.getCell(j).alignment = { horizontal: "center" };
          }
        }
      }

      // Apply borders
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 7) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Economies_Budgetaires.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-full mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="relative mb-5">
          <div className="relative bg-white rounded-2xl shadow-lg px-6 py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-7 bg-[#005EA8] rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Economies Budgétaires{" "}
                <span className="text-[#005EA8]">Estimées</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-3 font-medium">
              Analyse comparative des masses salariales et économies réalisées
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-2">
              Paramètres de Simulation
            </h3>
          </div>
          <div className="p-4">
            {/* Form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2">
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
                  onChange={(e) => setNombreSacs(parseInt(e.target.value) || 0)}
                  className="w-full text-sm font-semibold px-2 py-1 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Nombre dossiers */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Folder className="w-4 h-4 text-blue-500" />
                  Dossiers / mois
                </label>
                <input
                  type="number"
                  min="1"
                  value={nombreDossiers}
                  onChange={(e) =>
                    setNombreDossiers(parseInt(e.target.value) || 0)
                  }
                  className="w-full text-sm font-semibold px-2 py-1 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full text-sm font-semibold px-2 py-1 pr-10 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  value={results ? results.dossiersParJour : "--"}
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
                  value={results ? `${results.heuresNetParJour}h` : "--"}
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
                disabled={!showResults}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="w-3 h-3" />
                Afficher Graphe
              </button>
              <button
                onClick={handleExporterExcel}
                disabled={!showResults}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-3 h-3" />
                Exporter Excel
              </button>
            </div>
          </div>
        </div>

        {/* Unified Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
            <h3 className="text-base font-bold text-gray-900">
              Comparaison des Masses Salariales et Écarts
            </h3>
          </div>
          <div className="px-4 py-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableRow>
                      <TableHead
                        rowSpan={2}
                        className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider align-middle border-r border-gray-300"
                        style={{ width: "20%" }}
                      ></TableHead>
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-900 uppercase tracking-wider border-r-3 border-gray-600"
                      >
                        Comparaison Masse Salariale
                      </TableHead>
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-900 uppercase tracking-wider"
                      >
                        Écarts
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-center text-xs font-semibold text-gray-600">
                        Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-gray-600">
                        Calculé
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-gray-600 border-r-3 border-gray-600">
                        Recommandé
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-gray-600">
                        Calculé Vs Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-gray-600">
                        Recommandé Vs Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-gray-600">
                        Recommandé Vs Calculé
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!showResults ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
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
                        {results.masseSalariale.rows.map((row, index) => (
                          <TableRow
                            key={index}
                            className={
                              index < 2
                                ? "bg-blue-50 font-bold"
                                : index % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50"
                            }
                          >
                            <TableCell
                              className={`text-sm text-gray-700 ${
                                index < 2 ? "font-bold" : ""
                              } border-r border-gray-300 py-1`}
                            >
                              {row.label}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              {row.actuel}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              {row.calcule}
                            </TableCell>
                            <TableCell className="text-sm text-center border-r-3 border-gray-600 py-1">
                              {row.recommande}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              {results.ecarts.rows[index].calculeVsActuel}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              {results.ecarts.rows[index].recommandeVsActuel}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              {results.ecarts.rows[index].recommandeVsCalcule}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Modal */}
        {showChart && (
          <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Comparaison Globale des Masses Salariales
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Vue annuelle : Actuel, Calculé et Recommandé
                    </p>
                  </div>
                </div>
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
                      data={chartMasseSalarialeData}
                      margin={{ top: 40, right: 50, left: 50, bottom: 60 }}
                      barGap={150} // Controls gap between bars within same group
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                      <YAxis
                        label={{
                          value: "Masse Salariale (KMAD)",
                          angle: -90,
                          dy: 60,
                          dx: -10,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => `${value} KMAD`}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="rect"
                      />
                      <Bar
                        dataKey="actuel"
                        fill="#1e40af"
                        name="Actuel"
                        radius={[4, 4, 0, 0]}
                        barSize={40} // Reduced from 100
                      >
                        <LabelList
                          dataKey="actuel"
                          position="top"
                          formatter={(value) => `${value} KMAD`}
                          style={{
                            fill: "#000",
                            fontSize: 12, // Slightly smaller font
                            fontWeight: "bold",
                          }}
                        />
                      </Bar>
                      <Bar
                        dataKey="calcule"
                        fill="#1ba9ea"
                        name="Calculé"
                        radius={[4, 4, 0, 0]}
                        barSize={40} // Reduced from 100
                      >
                        <LabelList
                          dataKey="calcule"
                          position="top"
                          formatter={(value) => `${value} KMAD`}
                          style={{
                            fill: "#000",
                            fontSize: 12, // Slightly smaller font
                            fontWeight: "bold",
                          }}
                        />
                      </Bar>
                      <Bar
                        dataKey="recommande"
                        fill="#98c8fd"
                        name="Recommandé"
                        radius={[4, 4, 0, 0]}
                        barSize={40} // Reduced from 100
                      >
                        <LabelList
                          dataKey="recommande"
                          position="top"
                          formatter={(value) => `${value} KMAD`}
                          style={{
                            fill: "#000",
                            fontSize: 12, // Slightly smaller font
                            fontWeight: "bold",
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
