import { useState } from "react";
import {
  X,
  TrendingUp,
  FileDown,
  BarChart3,
  Table as TableIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { indiceAdequation } from "../../data/ratios";
import ExcelJS from "exceljs";

export default function IndiceAdequationModal({ onClose }) {
  const [viewMode, setViewMode] = useState("table"); // table or chart

  // Helper function to get badge color based on percentage range
  const getBadgeColor = (percentage) => {
    if (percentage >= 95 && percentage <= 105) {
      return "bg-green-500 text-white";
    } else if (
      (percentage >= 90 && percentage < 95) ||
      (percentage > 105 && percentage <= 110)
    ) {
      return "bg-orange-500 text-white";
    } else {
      return "bg-red-500 text-white";
    }
  };

  // Helper function to get bar color based on percentage
  const getBarColor = (percentage) => {
    if (percentage >= 95 && percentage <= 105) {
      return "#1e40af"; // Dark blue
    } else if (
      (percentage >= 90 && percentage < 95) ||
      (percentage > 105 && percentage <= 110)
    ) {
      return "#60a5fa"; // Light blue
    } else {
      return "#1e3a8a"; // Navy blue
    }
  };

  // Prepare chart data - showing indices as percentages
  const chartData = [
    {
      name: "Calculé / Actuel",
      indice: indiceAdequation.indiceCalculeVsActuel,
      color: getBarColor(indiceAdequation.indiceCalculeVsActuel),
    },
    {
      name: "Recommandé / Actuel",
      indice: indiceAdequation.indiceRecommandeVsActuel,
      color: getBarColor(indiceAdequation.indiceRecommandeVsActuel),
    },
    {
      name: "Recommandé / Calculé",
      indice: indiceAdequation.indiceRecommandeVsCalcule,
      color: getBarColor(indiceAdequation.indiceRecommandeVsCalcule),
    },
  ];

  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Indice_Adequation");

      // Set column widths
      worksheet.columns = [
        { width: 20 }, // Empty for the first column
        { width: 20 }, // Effectif Actuel
        { width: 20 }, // Effectif Calculé
        { width: 20 }, // Effectif Recommandé
        { width: 25 }, // Indice Calculé vs Actuel
        { width: 30 }, // Indice Recommandé vs Actuel
        { width: 30 }, // Indice Recommandé vs Calculé
      ];

      // Add title
      const titleRow = worksheet.addRow(["Indice d'Adéquation des Ressources"]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:G1");
      worksheet.addRow([]); // Empty row

      // Add table headers FIRST
      const headersRow = worksheet.addRow([
        "", // Empty for the first column
        "Effectif Actuel",
        "Effectif Calculé",
        "Effectif Recommandé",
        "Indice Calculé vs Actuel",
        "Indice Recommandé vs Actuel",
        "Indice Recommandé vs Calculé",
      ]);
      headersRow.font = { bold: true };
      headersRow.alignment = { horizontal: "center" };

      // Add data row
      const dataRow = worksheet.addRow([
        "Total",
        indiceAdequation.effectifActuel,
        indiceAdequation.effectifCalcule,
        indiceAdequation.effectifRecommande,
        `${indiceAdequation.indiceCalculeVsActuel}%`,
        `${indiceAdequation.indiceRecommandeVsActuel}%`,
        `${indiceAdequation.indiceRecommandeVsCalcule}%`,
      ]);
      dataRow.alignment = { horizontal: "center" };

      // Apply borders to table
      const tableStartRow = 3; // Headers row
      const tableEndRow = 4; // Data row
      for (let rowNum = tableStartRow; rowNum <= tableEndRow; rowNum++) {
        const row = worksheet.getRow(rowNum);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }

      worksheet.addRow([]); // Empty row after table

      // Add legend AFTER the table
      const legendRow1 = worksheet.addRow(["Légende:"]);
      legendRow1.font = { bold: true, size: 12 };

      worksheet.addRow(["95% à 105%"]);
      worksheet.addRow(["[90%-95%] ou [105%-110%]"]);
      worksheet.addRow(["<90% ou >110%"]);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Indice_Adequation_Ressources.xlsx";
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
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white z-10 rounded-t-xl flex-shrink-0">
          <div className="flex-1 flex justify-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Indice d'Adéquation des Ressources
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer text-gray-600 hover:text-red-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-shrink-0">
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "chart" : "table")
              }
              className="cursor-pointer text-sm px-3 py-1.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2 justify-center"
            >
              {viewMode === "table" ? (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Afficher Graphe
                </>
              ) : (
                <>
                  <TableIcon className="w-4 h-4" />
                  Afficher Tableau
                </>
              )}
            </button>

            <button
              onClick={handleExporterExcel}
              className="text-sm px-3 py-1.5 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2 cursor-pointer justify-center"
            >
              <FileDown className="w-4 h-4" />
              Exporter Excel
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {viewMode === "table" ? (
              <div className="flex flex-col h-full p-5 mt-20">
                {/* Table */}
                <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <TableRow>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words"></TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                            Effectif Actuel
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                            Effectif Calculé
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                            Effectif Recommandé
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                            Indice Calculé vs Actuel
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words ">
                            Indice Recommandé vs Actuel
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-normal break-words">
                            Indice Recommandé vs Calculé
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-white">
                          <TableCell className="text-center text-base font-bold text-gray-900">
                            Total
                          </TableCell>
                          <TableCell className="text-center text-base font-bold text-gray-900">
                            {indiceAdequation.effectifActuel}
                          </TableCell>
                          <TableCell className="text-center text-base font-bold text-gray-900">
                            {indiceAdequation.effectifCalcule}
                          </TableCell>
                          <TableCell className="text-center text-base font-bold text-gray-900">
                            {indiceAdequation.effectifRecommande}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(
                                indiceAdequation.indiceCalculeVsActuel
                              )}`}
                            >
                              {indiceAdequation.indiceCalculeVsActuel}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(
                                indiceAdequation.indiceRecommandeVsActuel
                              )}`}
                            >
                              {indiceAdequation.indiceRecommandeVsActuel}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(
                                indiceAdequation.indiceRecommandeVsCalcule
                              )}`}
                            >
                              {indiceAdequation.indiceRecommandeVsCalcule}%
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Legend - Only shown in table view */}
                <div className=" rounded-lg p-4  flex-shrink-0 mt-20">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Légende:
                  </h4>
                  <div className="flex flex-wrap flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-xs text-gray-700">95% à 105%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-xs text-gray-700">
                        [90%-95%] ou [105%-110%]
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-xs text-gray-700">
                        &lt;90% ou &gt;110%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200 flex-shrink-0">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Note:</span> L'indice
                    d'adéquation mesure l'écart entre les différents effectifs.
                    Un indice proche de 100% indique une bonne adéquation des
                    ressources.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Graphique des Indices d'Adéquation
                </h4>
                <div className="w-full h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={0}
                        textAnchor="middle"
                      />
                      <YAxis
                        label={{
                          value: "Indice (%)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                        domain={[0, 220]}
                      />
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend
                        content={() => (
                          <div className="flex justify-center mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
                              <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-800"></div>
                              <span className="text-xs text-gray-700">
                                Seuil 100%
                              </span>
                            </div>
                          </div>
                        )}
                      />
                      <ReferenceLine
                        y={100}
                        stroke="#000"
                        strokeDasharray="3 3"
                        strokeWidth={2}
                      />
                      <Bar
                        dataKey="indice"
                        radius={[8, 8, 0, 0]}
                        barSize={100}
                        fill="#005ea8" // This will be overridden by the data
                      >
                        <LabelList
                          dataKey="indice"
                          position="top"
                          formatter={(value) => `${value}%`}
                          style={{
                            fill: "#000",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
