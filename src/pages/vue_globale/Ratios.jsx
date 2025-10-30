import { useState } from "react";
import {
  Play,
  BarChart3,
  Package,
  Folder,
  FileDown,
  Gauge,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ratiosResults } from "../../data/ratios";
import RatiosChartModal from "@/components/vueGlobale/RatiosChartModal";
import RatiosIndiceAdequationModal from "@/components/vueGlobale/RatiosIndiceAdequationModal";
import ExcelJS from "exceljs";

export default function Ratios() {
  // Form inputs
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(true);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showIndiceModal, setShowIndiceModal] = useState(false);

  // Get results from mock data
  const results = showResults ? ratiosResults : null;

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data
    // const payload = { nombreSacs, nombreDossiers, productivite };
    setShowResults(true);
  };

  // Excel export function
  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ratios_Productivite");

      // Set column widths
      worksheet.columns = [
        { width: 30 }, // Position
        { width: 12 }, // Mois
        { width: 12 }, // Jour
        { width: 12 }, // Heure
        { width: 12 }, // VM Mois Actuel
        { width: 12 }, // VM Mois Calculé
        { width: 15 }, // VM Mois Recommandé
        { width: 12 }, // VM Jour Actuel
        { width: 12 }, // VM Jour Calculé
        { width: 15 }, // VM Jour Recommandé
        { width: 12 }, // VM Heure Actuel
        { width: 12 }, // VM Heure Calculé
        { width: 15 }, // VM Heure Recommandé
      ];

      // Add title
      const titleRow = worksheet.addRow(["Ratios de Productivité"]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:M1");
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
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      paramsRow.font = { bold: true, size: 14 };
      worksheet.mergeCells("A3:M3");
      paramsRow.alignment = { horizontal: "center" };

      worksheet.addRow([
        `Sacs/jour: ${nombreSacs}`,
        `Dossiers/mois: ${nombreDossiers}`,
        `Productivité: ${productivite}%`,
        "",
        "",
        "",
        "",
        "",
        "",
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
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.addRow([]); // Empty row

      // Add main headers
      const mainHeadersRow = worksheet.addRow([
        "Position",
        "Volume Activités",
        "",
        "",
        "Volume Moyen / Mois",
        "",
        "",
        "Volume Moyen / Jour",
        "",
        "",
        "Volume Moyen / Heure",
        "",
        "",
      ]);
      mainHeadersRow.font = { bold: true };
      mainHeadersRow.alignment = { horizontal: "center" };

      // Merge cells for main headers
      worksheet.mergeCells("B7:D7"); // Volume Activités
      worksheet.mergeCells("E7:G7"); // Volume Moyen / Mois
      worksheet.mergeCells("H7:J7"); // Volume Moyen / Jour
      worksheet.mergeCells("K7:M7"); // Volume Moyen / Heure

      // Add sub headers
      const subHeadersRow = worksheet.addRow([
        "",
        "Mois",
        "Jour",
        "Heure",
        "Actuel",
        "Calculé",
        "Recommandé",
        "Actuel",
        "Calculé",
        "Recommandé",
        "Actuel",
        "Calculé",
        "Recommandé",
      ]);
      subHeadersRow.font = { bold: true };
      subHeadersRow.alignment = { horizontal: "center" };

      // Add data rows
      if (results) {
        results.data.forEach((row) => {
          const dataRow = worksheet.addRow([
            row.position,
            row.volumeActivites.mois,
            row.volumeActivites.jour,
            row.volumeActivites.heure,
            row.volumeMoyenMois.actuel,
            row.volumeMoyenMois.calcule,
            row.volumeMoyenMois.recommande,
            row.volumeMoyenJour.actuel,
            row.volumeMoyenJour.calcule,
            row.volumeMoyenJour.recommande,
            row.volumeMoyenHeure.actuel,
            row.volumeMoyenHeure.calcule,
            row.volumeMoyenHeure.recommande,
          ]);

          // Bold TOTAL row
          if (row.position === "TOTAL") {
            dataRow.font = { bold: true };
          }

          // Align numeric columns to center
          for (let i = 2; i <= 13; i++) {
            dataRow.getCell(i).alignment = { horizontal: "center" };
          }
        });
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
      link.download = "Ratios_Productivite.xlsx";
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
                Ratios de <span className="text-[#005EA8]">Productivité</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-3 font-medium">
              Analyse des volumes et de la productivité par position
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
              {/* Left side - Inputs (2/3 width) */}
              <div className="xl:col-span-2 space-y-4">
                {/* Inputs grid */}
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
                </div>
              </div>

              {/* Right side - Summary */}
              <div className="xl:col-span-1 grid grid-cols-2 gap-2">
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
                onClick={() => setShowChartModal(true)}
                disabled={!showResults}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="w-3 h-3" />
                Afficher Graphe
              </button>
              <button
                onClick={() => setShowIndiceModal(true)}
                disabled={!showResults}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-purple-50 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-3 h-3" />
                Indice d'adéquation
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
              Ratios de Productivité par Position
            </h3>
          </div>
          <div className="px-4 py-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[1100px] xl:min-w-full table-fixed border-collapse">
                  <colgroup>
                    <col className="w-1/5 lg:w-1/6 xl:w-[16%]" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <col key={i} className="w-1/15 lg:w-1/12 xl:w-[7%]" />
                    ))}
                  </colgroup>

                  <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableRow>
                      <TableHead
                        rowSpan={2}
                        className="text-center text-xs font-bold text-gray-800 uppercase tracking-wider align-middle border-r border-gray-300 whitespace-normal break-words"
                      >
                        Position
                      </TableHead>

                      {/* Volume Activités Header */}
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300 whitespace-normal break-words leading-tight"
                      >
                        <span className="hidden xl:inline">
                          Volume Activités
                        </span>
                        <span className="xl:hidden lg:inline hidden">
                          Vol. Activités
                        </span>
                        <span className="lg:hidden inline">Vol. Act.</span>
                      </TableHead>

                      {/* Volume Moyen / Mois Header */}
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300 whitespace-normal break-words leading-tight"
                      >
                        <span className="hidden xl:inline">
                          Volume Moyen / Mois
                        </span>
                        <span className="xl:hidden lg:inline hidden">
                          Vol. /Mois
                        </span>
                        <span className="lg:hidden inline">Mois</span>
                      </TableHead>

                      {/* Volume Moyen / Jour Header */}
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300 whitespace-normal break-words leading-tight"
                      >
                        <span className="hidden xl:inline">
                          Volume Moyen / Jour
                        </span>
                        <span className="xl:hidden lg:inline hidden">
                          Vol. /Jour
                        </span>
                        <span className="lg:hidden inline">Jour</span>
                      </TableHead>

                      {/* Volume Moyen / Heure Header */}
                      <TableHead
                        colSpan={3}
                        className="text-center text-xs font-bold text-gray-800 uppercase tracking-wider whitespace-normal break-words leading-tight"
                      >
                        <span className="hidden xl:inline">
                          Volume Moyen / Heure
                        </span>
                        <span className="xl:hidden lg:inline hidden">
                          Vol. /Heure
                        </span>
                        <span className="lg:hidden inline">Heure</span>
                      </TableHead>
                    </TableRow>

                    {/* Subcolumns */}
                    <TableRow>
                      {/* Volume Activités Subcolumns */}
                      {["M", "J", "H"].map((label, i) => (
                        <TableHead
                          key={i}
                          className={`text-center text-xs font-semibold text-gray-600 ${
                            label === "H" ? "border-r border-gray-300" : ""
                          }`}
                        >
                          <span className="xl:inline hidden">
                            {["Mois", "Jour", "Heure"][i]}
                          </span>
                          <span className="xl:hidden inline">{label}</span>
                        </TableHead>
                      ))}

                      {/* Volume Moyen / Mois Subcolumns */}
                      {["A", "C", "R"].map((label, i) => (
                        <TableHead
                          key={`mois-${i}`}
                          className={`text-center text-xs font-semibold text-gray-600 ${
                            label === "R" ? "border-r border-gray-300" : ""
                          }`}
                        >
                          <span className="xl:inline hidden">
                            {["Actuel", "Calculé", "Recommandé"][i]}
                          </span>
                          <span className="xl:hidden inline">{label}</span>
                        </TableHead>
                      ))}

                      {/* Volume Moyen / Jour Subcolumns */}
                      {["A", "C", "R"].map((label, i) => (
                        <TableHead
                          key={`jour-${i}`}
                          className={`text-center text-xs font-semibold text-gray-600 ${
                            label === "R" ? "border-r border-gray-300" : ""
                          }`}
                        >
                          <span className="xl:inline hidden">
                            {["Actuel", "Calculé", "Recommandé"][i]}
                          </span>
                          <span className="xl:hidden inline">{label}</span>
                        </TableHead>
                      ))}

                      {/* Volume Moyen / Heure Subcolumns */}
                      {["A", "C", "R"].map((label, i) => (
                        <TableHead
                          key={`heure-${i}`}
                          className="text-center text-xs font-semibold text-gray-600"
                        >
                          <span className="xl:inline hidden">
                            {["Actuel", "Calculé", "Recommandé"][i]}
                          </span>
                          <span className="xl:hidden inline">{label}</span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  {/* Body */}
                  <TableBody>
                    {!showResults ? (
                      <TableRow>
                        <TableCell
                          colSpan={13}
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
                              row.position === "TOTAL"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300"
                                : index % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50"
                            }
                          >
                            {/* Position */}
                            <TableCell
                              className={`text-xs lg:text-sm ${
                                row.position === "TOTAL"
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-700 whitespace-normal break-words"
                              } border-r border-gray-200 py-1`}
                            >
                              {row.position}
                            </TableCell>

                            {/* Volume Activités */}
                            {["mois", "jour", "heure"].map((key, i) => (
                              <TableCell
                                key={i}
                                className={`text-xs lg:text-sm text-center text-gray-700 font-medium ${
                                  key === "heure"
                                    ? "border-r border-gray-200"
                                    : ""
                                } py-1`}
                              >
                                {row.volumeActivites[key]}
                              </TableCell>
                            ))}

                            {/* Volume Moyen / Mois */}
                            {["actuel", "calcule", "recommande"].map(
                              (key, i) => (
                                <TableCell
                                  key={`mois-${i}`}
                                  className={`text-xs lg:text-sm text-center text-gray-700 font-medium ${
                                    key === "recommande"
                                      ? "border-r border-gray-200"
                                      : ""
                                  } py-1`}
                                >
                                  {row.volumeMoyenMois[key]}
                                </TableCell>
                              )
                            )}

                            {/* Volume Moyen / Jour */}
                            {["actuel", "calcule", "recommande"].map(
                              (key, i) => (
                                <TableCell
                                  key={`jour-${i}`}
                                  className={`text-xs lg:text-sm text-center text-gray-700 font-medium ${
                                    key === "recommande"
                                      ? "border-r border-gray-200"
                                      : ""
                                  } py-1`}
                                >
                                  {row.volumeMoyenJour[key]}
                                </TableCell>
                              )
                            )}

                            {/* Volume Moyen / Heure */}
                            {["actuel", "calcule", "recommande"].map(
                              (key, i) => (
                                <TableCell
                                  key={`heure-${i}`}
                                  className="text-xs lg:text-sm text-center text-gray-700 font-medium py-1"
                                >
                                  {row.volumeMoyenHeure[key]}
                                </TableCell>
                              )
                            )}
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

        {/* Modals */}
        {showChartModal && (
          <RatiosChartModal onClose={() => setShowChartModal(false)} />
        )}
        {showIndiceModal && (
          <RatiosIndiceAdequationModal
            onClose={() => setShowIndiceModal(false)}
          />
        )}
      </div>
    </div>
  );
}
