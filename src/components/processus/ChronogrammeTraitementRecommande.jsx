import { useState, useMemo, useRef } from "react";
import {
  X,
  Search,
  FileDown,
  BarChart3,
  Table as TableIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExcelJS from "exceljs";
import {
  chronogrammeDataRecommande,
  positionsRecommande,
  chronogrammeParPositionDataRecommande,
  chronogrammeTotalRecommande,
} from "../../data/chronogrammeData";
import CumulativeGanttChart from "../../components/CumulativeChart";

export default function ChronogrammeTraitementRecommande() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const searchTimeoutRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return chronogrammeDataRecommande;
    return chronogrammeDataRecommande.filter((item) =>
      item.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const searchResultsCount = useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Chronogramme_Recommande");

      worksheet.columns = [
        { width: 50 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
      ];

      const headerRow = worksheet.addRow([
        "Tâche",
        "Responsable",
        "Durée (Min)",
        "Durée (Sec)",
        "Temps Cumulé (Min)",
        "Temps Cumulé (Sec)",
        "Temps Cumulé (m:s)",
        "Temps Cumulé (Heure)",
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      chronogrammeDataRecommande.forEach((item) => {
        const row = worksheet.addRow([
          item.tache,
          item.responsable,
          item.dureeMin,
          item.dureeSec,
          item.tempsCumuleMin,
          item.tempsCumuleSec,
          item.tempsCumuleMS,
          item.tempsCumuleHeure,
        ]);
        row.alignment = { horizontal: "left" };
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).alignment = { horizontal: "center" };
        row.getCell(5).alignment = { horizontal: "center" };
        row.getCell(6).alignment = { horizontal: "center" };
        row.getCell(7).alignment = { horizontal: "center" };
        row.getCell(8).alignment = { horizontal: "center" };
      });

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

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Chronogramme_Traitement_Unitaire_Recommande.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };

  const handleExporterChronogrammeParPosition = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Chronogramme_par_Position_Recommande");

      worksheet.columns = [
        { width: 40 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
      ];

      const headerRow = worksheet.addRow([
        "Position",
        "Durée Cumulée (Secondes)",
        "Durée Cumulée (Minutes)",
        "Durée Cumulée (Heures)",
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      Object.entries(chronogrammeParPositionDataRecommande).forEach(
        ([position, data]) => {
          const row = worksheet.addRow([
            position,
            data.dureeSecondes.toFixed(2),
            data.dureeMinutes.toFixed(2),
            data.dureeHeures.toFixed(2),
          ]);
          row.alignment = { horizontal: "left" };
          row.getCell(2).alignment = { horizontal: "center" };
          row.getCell(3).alignment = { horizontal: "center" };
          row.getCell(4).alignment = { horizontal: "center" };
        }
      );

      const totalRow = worksheet.addRow([
        "TOTAL GÉNÉRAL",
        chronogrammeTotalRecommande.dureeSecondes.toFixed(2),
        chronogrammeTotalRecommande.dureeMinutes.toFixed(2),
        chronogrammeTotalRecommande.dureeHeures.toFixed(2),
      ]);
      totalRow.font = { bold: true };
      totalRow.alignment = { horizontal: "left" };
      totalRow.getCell(2).alignment = { horizontal: "center" };
      totalRow.getCell(3).alignment = { horizontal: "center" };
      totalRow.getCell(4).alignment = { horizontal: "center" };

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

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Chronogramme_Par_Position_Recommande.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handleSearch();
  };

  return (
    <div className="max-w-full mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
          <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-2">
            Recherche et Actions
          </h3>
        </div>
        <div className="py-3 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <div className="w-full sm:max-w-xs">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                Rechercher une position
                {searchTerm && (
                  <span className="text-xs text-gray-500 font-normal">
                    {searchResultsCount > 0
                      ? `(${searchResultsCount} résultat${
                          searchResultsCount > 1 ? "s" : ""
                        } trouvé${searchResultsCount > 1 ? "s" : ""})`
                      : "(Aucun résultat trouvé)"}
                  </span>
                )}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Tapez pour rechercher..."
                  className="w-full pl-9 pr-6 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
                  list="positions-list-recommande"
                />
                <datalist id="positions-list-recommande">
                  {positionsRecommande.map((pos) => (
                    <option key={pos} value={pos} />
                  ))}
                </datalist>

                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer w-full sm:w-auto text-sm px-3 py-1 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <BarChart3 className="w-4 h-4" />
                Chronogramme
              </button>

              <button
                onClick={handleExporterExcel}
                className="cursor-pointer w-full sm:w-auto text-sm px-3 py-1 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <FileDown className="w-4 h-4" />
                Exporter Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl text-center">
          <h3 className="text-base font-bold text-gray-900">
            Détail des Tâches - Processus Recommandé
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({searchResultsCount} résultat
                {searchResultsCount !== 1 ? "s" : ""})
              </span>
            )}
          </h3>
        </div>
        <div className="px-2 py-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
                <TableRow>
                  <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-3/12">
                    Tâche
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-2/12">
                    Responsable
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Durée (Min)
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Durée (Sec)
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Cumulé (Min)
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Cumulé (Sec)
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Cumulé (m:s)
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-2/12">
                    Cumulé (Heure)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-300" />
                        <p className="text-sm">
                          {searchTerm
                            ? "Aucun résultat trouvé"
                            : "Aucune donnée disponible"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "bg-white hover:bg-gray-50"
                      }
                    >
                      <TableCell className="text-sm text-gray-700 w-3/12">
                        {item.tache}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 font-medium w-2/12">
                        {item.responsable}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 w-1/12">
                        {item.dureeMin}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 w-1/12">
                        {item.dureeSec}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 w-1/12">
                        {item.tempsCumuleMin}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 w-1/12">
                        {item.tempsCumuleSec}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-700 font-medium w-1/12">
                        {item.tempsCumuleMS}
                      </TableCell>
                      <TableCell className="text-sm text-center text-gray-900 font-bold w-2/12">
                        {item.tempsCumuleHeure}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
              <div className="flex-1 flex justify-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Chronogramme par Position - Processus Recommandé
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer text-gray-600 hover:text-red-600 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "chart" : "table")
                  }
                  className="cursor-pointer text-sm px-3 py-1.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
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
                  onClick={handleExporterChronogrammeParPosition}
                  disabled={
                    Object.keys(chronogrammeParPositionDataRecommande).length === 0
                  }
                  className="text-sm px-3 py-1.5 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  Exporter Excel
                </button>
              </div>

              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow w-[85%] mx-auto">
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                          <TableRow>
                            <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2/5">
                              Position
                            </TableHead>
                            <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                              Durée Cumulée (Secondes)
                            </TableHead>
                            <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                              Durée Cumulée (Minutes)
                            </TableHead>
                            <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                              Durée Cumulée (Heures)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(chronogrammeParPositionDataRecommande).map(
                            ([position, data], index) => (
                              <TableRow
                                key={position}
                                className={
                                  index % 2 === 0
                                    ? "bg-gray-50 hover:bg-gray-100"
                                    : "bg-white hover:bg-gray-50"
                                }
                              >
                                <TableCell className="text-sm text-gray-700 font-medium w-2/5">
                                  {position}
                                </TableCell>
                                <TableCell className="text-sm text-center text-gray-700 w-1/5">
                                  {data.dureeSecondes.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-sm text-center text-gray-700 w-1/5">
                                  {data.dureeMinutes.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-sm text-center text-gray-900 font-bold w-1/5">
                                  {data.dureeHeures.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                          <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                            <TableCell className="text-sm text-gray-900 w-2/5">
                              Total Général
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-900 w-1/5">
                              {chronogrammeTotalRecommande.dureeSecondes.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-900 w-1/5">
                              {chronogrammeTotalRecommande.dureeMinutes.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-900 w-1/5">
                              {chronogrammeTotalRecommande.dureeHeures.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <CumulativeGanttChart
                    data={chronogrammeParPositionDataRecommande}
                    total={chronogrammeTotalRecommande}
                    unit="Heures"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}