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
  Users,
  Clock,
  Folder,
  Package,
  ChevronDown,
  FileDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  referentielsRecommande,
  positionOptionsRecommande,
} from "../../data/referentiels";
import { simulationResultsRecommande } from "../../data/results";
import ExcelJS from "exceljs";

// Utility functions
const formatTime = (minutes, secondes) => {
  return `${minutes}m ${secondes}s`;
};

const getTotalMinutes = (minutes, secondes) => {
  return minutes + secondes / 60;
};

export default function SimulationParPositionRecommande() {
  // Form inputs
  const [position, setPosition] = useState("Chargé réception dossier");
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Get current data based on selected position
  const currentReferentiel = referentielsRecommande[position];

  // Prepare chart data
  const chartData = currentReferentiel.map((activity) => ({
    name: activity.activite,
    value: getTotalMinutes(activity.minutes, activity.secondes),
    label: formatTime(activity.minutes, activity.secondes),
  }));

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data for recommended process
    // const payload = { position, nombreSacs, nombreDossiers, productivite, type: "recommande" };
    setShowResults(true);
  };

  // Get results only if simulation has been run
  const currentResults = showResults
    ? simulationResultsRecommande[position]
    : null;

  // Excel export function
  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Simulation_Position_Recommande");

      // Set column widths
      worksheet.columns = [
        { width: 8 },
        { width: 35 },
        { width: 10 },
        { width: 10 },
        { width: 12 }, // Table 1 columns
        { width: 5 }, // Spacer
        { width: 8 },
        { width: 35 },
        { width: 15 },
        { width: 15 }, // Table 2 columns
      ];

      // Add title
      const titleRow = worksheet.addRow([
        "Simulation par Position - Processus Recommandé - " + position,
      ]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:J1");
      worksheet.addRow([]); // Empty row

      // Headers on the same row - Référentiel (merge 3 cells) and Résultats (merge 3 cells)
      const headersRow = worksheet.addRow([
        "Référentiel d'activités",
        "",
        "", // Will be merged A3:C3
        "",
        "", // Remaining cells for table 1
        "", // Spacer
        "Résultats de Simulation",
        "",
        "", // Will be merged G3:I3
        "", // Remaining cell for table 2
      ]);

      // Merge cells for Référentiel d'activités (3 cells)
      worksheet.mergeCells("A3:C3");
      headersRow.getCell(1).value = "Référentiel d'activités";
      headersRow.getCell(1).font = { bold: true, size: 14 };
      headersRow.getCell(1).alignment = { horizontal: "center" };

      // Merge cells for Résultats de Simulation (3 cells)
      worksheet.mergeCells("G3:I3");
      headersRow.getCell(7).value = "Résultats de Simulation";
      headersRow.getCell(7).font = { bold: true, size: 14 };
      headersRow.getCell(7).alignment = { horizontal: "center" };

      // Table Subheaders
      const subHeadersRow = worksheet.addRow([
        "#",
        "Activité",
        "Min",
        "Sec",
        "Unité",
        "", // Spacer
        "#",
        "Activité",
        "Unités",
        "Heures",
      ]);
      subHeadersRow.font = { bold: true };
      subHeadersRow.alignment = { horizontal: "center" };

      // Add data from both tables
      const maxRows = Math.max(
        currentReferentiel.length,
        currentResults ? currentResults.results.length : 0
      );

      for (let i = 0; i < maxRows; i++) {
        const rowData = [];

        // Table 1 data
        if (i < currentReferentiel.length) {
          const activity = currentReferentiel[i];
          rowData.push(
            activity.order,
            activity.activite,
            activity.minutes,
            activity.secondes,
            activity.unite
          );
        } else {
          rowData.push("", "", "", "", "");
        }

        // Spacer column
        rowData.push("");

        // Table 2 data
        if (currentResults && i < currentResults.results.length) {
          const result = currentResults.results[i];
          rowData.push(
            result.order,
            result.activite,
            result.nombreUnites,
            result.heures
          );
        } else {
          rowData.push("", "", "", "");
        }

        const row = worksheet.addRow(rowData);

        // Align numeric columns to center
        [2, 3, 8, 9].forEach((colIndex) => {
          if (row.getCell(colIndex).value) {
            row.getCell(colIndex).alignment = { horizontal: "center" };
          }
        });
      }

      // Add summary rows for table 2
      if (currentResults) {
        worksheet.addRow([]);

        // Total heures nécessaires
        const totalHeuresRow = worksheet.addRow([
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "Total heures nécessaires (Activité/jour)",
          "",
          currentResults.totalHeuresNecessaires + " h",
        ]);
        totalHeuresRow.getCell(8).alignment = { horizontal: "left" };
        totalHeuresRow.getCell(9).alignment = { horizontal: "center" };
        totalHeuresRow.getCell(9).font = { bold: true };

        // Effectif nécessaire
        const effectifRow = worksheet.addRow([
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          `Effectif nécessaire (base ${currentResults.heuresNetParJour}h /jour)`,
          "",
          currentResults.effectifNecessaire,
        ]);
        effectifRow.getCell(8).alignment = { horizontal: "left" };
        effectifRow.getCell(9).alignment = { horizontal: "center" };
        effectifRow.getCell(9).font = { bold: true };

        // Effectif nécessaire Arrondi
        const effectifArrondiRow = worksheet.addRow([
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          `Effectif nécessaire Arrondi (base ${currentResults.heuresNetParJour}h /jour)`,
          "",
          currentResults.effectifNecessaireArrondi,
        ]);
        effectifArrondiRow.getCell(8).alignment = { horizontal: "left" };
        effectifArrondiRow.getCell(9).alignment = { horizontal: "center" };
        effectifArrondiRow.getCell(9).font = { bold: true };
      }

      // Apply borders to all cells with data
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          if (cell.value) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Simulation_Position_Recommande_${position.replace(
        /\s+/g,
        "_"
      )}.xlsx`;
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
    <div className="max-w-full mx-auto space-y-4">
      {/* Input Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
          <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-2">
            Paramètres de Simulation
          </h3>
        </div>
        <div className="p-4">
          {/* Form inputs and Summary Cards side by side - 2/3 and 1/3 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            {/* Left side - Inputs (2/3 width) */}
            <div className="xl:col-span-2 space-y-4">
              {/* Inputs grid - 4 inputs in one line */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                {/* Position Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    Position à simuler
                  </label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="h-7.5! w-full font-semibold text-xs border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex justify-between items-center px-2">
                      <SelectValue placeholder="Choisir une position" />
                    </SelectTrigger>

                    <SelectContent className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                      {positionOptionsRecommande.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="text-xs text-blue-800 hover:bg-blue-100! cursor-pointer"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                    className="w-full text-sm font-semibold px-2 py-1 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full text-sm font-semibold px-2 py-1 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full text-sm font-semibold px-2 py-1 pr-10 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Summary (1/3 width) */}
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
                    currentResults
                      ? `${currentResults.heuresNetParJour}h`
                      : "--"
                  }
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
              onClick={() => setShowChart(true)}
              className="cursor-pointer text-sm px-2 py-1 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
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
      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Référentiel Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
            <h3 className="text-base font-bold text-gray-900">
              Référentiel d'activités - Recommandé
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({position})
              </span>
            </h3>
          </div>
          <div className="px-4 py-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 ">
                  <TableRow>
                    <TableHead className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </TableHead>
                    <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Activité
                    </TableHead>
                    <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Min
                    </TableHead>
                    <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Sec
                    </TableHead>
                    <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Unité
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReferentiel.map((activity, index) => (
                    <TableRow
                      key={activity.order}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "bg-white hover:bg-gray-50"
                      }
                    >
                      <TableCell className="text-sm font-medium text-gray-900">
                        {activity.order}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {activity.activite}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 font-medium">
                        {activity.minutes}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 font-medium">
                        {activity.secondes}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {activity.unite}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Results Table - Always visible but empty until simulation runs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
            <h3 className="text-base font-bold text-gray-900">
              Résultats de Simulation - Recommandé
            </h3>
          </div>
          <div className="px-4 py-2">
            {/* Results Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <TableRow>
                    <TableHead className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </TableHead>
                    <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Activité
                    </TableHead>
                    <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Unités
                    </TableHead>
                    <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Heures
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
                      {currentResults.results.map((result, index) => (
                        <TableRow
                          key={result.order}
                          className={
                            index % 2 === 0
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-white hover:bg-gray-50"
                          }
                        >
                          <TableCell className="text-sm font-medium text-gray-900">
                            {result.order}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {result.activite}
                          </TableCell>
                          <TableCell className="text-sm text-center text-gray-700 font-medium">
                            {result.nombreUnites}
                          </TableCell>
                          <TableCell className="text-sm text-center text-gray-700 font-medium">
                            {result.heures}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-from-blue-50 to-indigo-50-50 font-semibold border-t-2 border-blue-200 hover:bg-blue-100">
                        <TableCell
                          colSpan={3}
                          className="text-left text-sm text-gray-700"
                        >
                          Total heures nécessaires (Activité/jour)
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-900 font-bold">
                          {currentResults.totalHeuresNecessaires} h
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-blue-50 font-semibold hover:bg-blue-100">
                        <TableCell
                          colSpan={3}
                          className="text-left text-sm text-gray-700"
                        >
                          Effectif nécessaire (base{" "}
                          {currentResults.heuresNetParJour}h /jour)
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-900 font-bold">
                          {currentResults.effectifNecessaire}
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                        <TableCell
                          colSpan={3}
                          className="text-left text-sm text-gray-900"
                        >
                          Effectif nécessaire Arrondi (base{" "}
                          {currentResults.heuresNetParJour}h /jour)
                        </TableCell>
                        <TableCell className="text-sm text-center text-gray-900">
                          {currentResults.effectifNecessaireArrondi}
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
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Temps unitaire par activité (min) - Processus Recommandé
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Position:{" "}
                    <span className="font-medium text-blue-600">
                      {position}
                    </span>
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
                    layout="vertical"
                    margin={{ top: 20, right: 50, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, "auto"]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={180}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toFixed(2)} min`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      <LabelList
                        dataKey="label"
                        position="right"
                        style={{
                          fill: "#374151",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      />
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3B82F6" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
