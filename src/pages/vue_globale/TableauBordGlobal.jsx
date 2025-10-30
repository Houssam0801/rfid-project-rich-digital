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
import { tableauBordResults, chartData } from "../../data/tableauBord";
import ExcelJS from "exceljs";

export default function TableauBordGlobal() {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(true);
  const [showChart, setShowChart] = useState(false);

  // Get results from mock data
  const results = showResults ? tableauBordResults : null;

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data
    // const payload = { nombreSacs, nombreDossiers, productivite };
    setShowResults(true);
  };

  // Excel export function
  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Tableau_Bord_Global");

      // Set column widths
      worksheet.columns = [
        { width: 30 }, // Intervenant
        { width: 20 }, // Actuel
        { width: 20 }, // Calculé
        { width: 20 }, // Recommandé
        { width: 25 }, // Écart Calculé Vs Actuel
        { width: 25 }, // Écart Recommandé Vs Actuel
        { width: 25 }, // Écart Recommandé Vs Calculé
      ];

      // Add title
      const titleRow = worksheet.addRow(["Tableau de Bord Global"]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:G1");
      worksheet.addRow([]); // Empty row

      // Add parameters section
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

      // Add table headers
      const headersRow = worksheet.addRow([
        "Intervenant",
        "Actuel",
        "Calculé",
        "Recommandé",
        "Écart Calculé Vs Actuel",
        "Écart Recommandé Vs Actuel",
        "Écart Recommandé Vs Calculé",
      ]);
      headersRow.font = { bold: true };
      headersRow.alignment = { horizontal: "center" };

      // Add data rows
      if (results) {
        results.data.forEach((row) => {
          const dataRow = worksheet.addRow([
            row.intervenant,
            row.actuel,
            row.calcule,
            row.recommande,
            row.ecartCalculeVsActuel,
            row.ecartRecommandeVsActuel,
            row.ecartRecommandeVsCalcule,
          ]);

          // Align numeric columns to center
          for (let i = 2; i <= 7; i++) {
            dataRow.getCell(i).alignment = { horizontal: "center" };
          }
        });

        // Add totals row
        const totalsRow = worksheet.addRow([
          "TOTAL",
          results.totals.actuel,
          results.totals.calcule,
          results.totals.recommande,
          results.totals.ecartCalculeVsActuel,
          results.totals.ecartRecommandeVsActuel,
          results.totals.ecartRecommandeVsCalcule,
        ]);
        totalsRow.font = { bold: true };
        totalsRow.alignment = { horizontal: "center" };
      }

      // Apply borders to all cells (CORRECTED VERSION)
      const borderStyle = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Apply borders to all rows that have data
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = borderStyle;
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Tableau_Bord_Global.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };

  // Helper function to get color class based on value
  const getEcartColor = (value) => {
    if (value > 0) return "text-green-600 font-semibold";
    if (value < 0) return "text-red-600 font-semibold";
    return "text-gray-600 font-semibold";
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
                Tableau de Bord <span className="text-[#005EA8]">Global</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-3 font-medium">
              Vue d'ensemble des effectifs par poste
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
            {/* Form inputs and Summary Cards */}
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
                  Dossiers / Mois
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

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
            <h3 className="text-base font-bold text-gray-900">
              Comparaison des Effectifs par Poste
            </h3>
          </div>
          <div className="px-4 py-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[900px] xl:min-w-full table-fixed border-collapse">
                  <colgroup>
                    <col className="w-[20%] lg:w-[18%]" />
                    {Array.from({ length: 6 }).map((_, i) => (
                      <col key={i} className="w-[13.333%] lg:w-[13%]" />
                    ))}
                  </colgroup>

                  <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableRow>
                      <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Intervenant
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Calculé
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Recommandé
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Écart Calculé Vs Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Écart Recommandé Vs Actuel
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                        Écart Recommandé Vs Calculé
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {!showResults ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-8 text-center text-gray-400"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Play className="w-6 h-6 text-gray-300" />
                            <p className="text-sm">
                              Cliquez sur "Lancer Simulation" pour voir les
                              résultats
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {results.data.map((row, index) => (
                          <TableRow
                            key={index}
                            className={
                              index % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50"
                            }
                          >
                            <TableCell className="text-sm text-gray-700 py-1  break-words">
                              {row.intervenant}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-700 font-medium py-1">
                              {row.actuel}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-700 font-medium py-1">
                              {row.calcule}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-700 font-medium py-1">
                              {row.recommande}
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              <span
                                className={`font-medium ${getEcartColor(
                                  row.ecartCalculeVsActuel
                                )}`}
                              >
                                {row.ecartCalculeVsActuel}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              <span
                                className={`font-medium ${getEcartColor(
                                  row.ecartRecommandeVsActuel
                                )}`}
                              >
                                {row.ecartRecommandeVsActuel}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-center py-1">
                              <span
                                className={`font-medium ${getEcartColor(
                                  row.ecartRecommandeVsCalcule
                                )}`}
                              >
                                {row.ecartRecommandeVsCalcule}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Totals Row */}
                        <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                          <TableCell className="text-sm text-gray-900 py-1.5">
                            TOTAL
                          </TableCell>
                          <TableCell className="text-sm text-center text-gray-900 py-1.5">
                            {results.totals.actuel}
                          </TableCell>
                          <TableCell className="text-sm text-center text-gray-900 py-1.5">
                            {results.totals.calcule}
                          </TableCell>
                          <TableCell className="text-sm text-center text-gray-900 py-1.5">
                            {results.totals.recommande}
                          </TableCell>
                          <TableCell className="text-sm text-center py-1.5">
                            <span
                              className={`font-medium ${getEcartColor(
                                results.totals.ecartCalculeVsActuel
                              )}`}
                            >
                              {results.totals.ecartCalculeVsActuel}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-center py-1.5">
                            <span
                              className={`font-medium ${getEcartColor(
                                results.totals.ecartRecommandeVsActuel
                              )}`}
                            >
                              {results.totals.ecartRecommandeVsActuel}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-center py-1.5">
                            <span
                              className={`font-medium ${getEcartColor(
                                results.totals.ecartRecommandeVsCalcule
                              )}`}
                            >
                              {results.totals.ecartRecommandeVsCalcule}
                            </span>
                          </TableCell>
                        </TableRow>
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
            <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-auto">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Comparaison des Effectifs par Poste
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Vue comparative : Actuel, Calculé et Recommandé
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
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="intervenant"
                        angle={-45}
                        textAnchor="end"
                        height={150}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        label={{
                          value: "Nombre de Personnes",
                          angle: -90,
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
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="rect"
                      />
                      <Bar
                        dataKey="actuel"
                        fill="#1e40af"
                        name="Actuel"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="calcule"
                        fill="#60a5fa"
                        name="Calculé"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="recommande"
                        fill="#1e3a8a"
                        name="Recommandé"
                        radius={[8, 8, 0, 0]}
                      />
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
