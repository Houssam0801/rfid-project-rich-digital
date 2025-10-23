import { useState, useMemo, useRef } from "react";
import {
  X,
  Search,
  FileDown,
  BarChart3,
  Table,
} from "lucide-react";
import ExcelJS from "exceljs";
import {
  chronogrammeData,
  positions,
  chronogrammeParPositionData,
  chronogrammeTotal,
} from "../../data/chronogrammeData";

export default function ChronogrammeTraitement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const searchTimeoutRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return chronogrammeData;
    return chronogrammeData.filter((item) =>
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
      const worksheet = workbook.addWorksheet("Chronogramme");

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

      chronogrammeData.forEach((item) => {
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
      link.download = "Chronogramme_Traitement_Unitaire.xlsx";
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

  const cumulativeChartData = useMemo(() => {
    const data = Object.entries(chronogrammeParPositionData)
      .map(([position, data]) => ({
        position,
        duration: data.dureeHeures,
      }))
      .sort((a, b) => a.duration - b.duration);

    data.push({
      position: "Total Général",
      duration: chronogrammeTotal.dureeHeures,
    });

    return data;
  }, []);

  const CumulativeBarChart = ({ data }) => {
    const maxValue = 1.2;

    const chartWidth = 900;
    const marginLeft = 200;
    const marginRight = 100;
    const marginTop = 30;
    const marginBottom = 50;
    const barHeight = 25;
    const barSpacing = 8;

    const xScale = (value) => {
      return (
        marginLeft +
        (value / maxValue) * (chartWidth - marginLeft - marginRight)
      );
    };

    return (
      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={
            data.length * (barHeight + barSpacing) + marginTop + marginBottom
          }
          className="mx-auto"
        >
          <text
            x={chartWidth / 2}
            y={20}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Répartition Cumulative du Temps par Poste
          </text>

          {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map((tick) => (
            <g key={tick}>
              <line
                x1={xScale(tick)}
                y1={marginTop}
                x2={xScale(tick)}
                y2={
                  data.length * (barHeight + barSpacing) +
                  marginTop -
                  barSpacing
                }
                stroke="#e5e7eb"
                strokeDasharray="3,3"
              />
              <text
                x={xScale(tick)}
                y={
                  data.length * (barHeight + barSpacing) +
                  marginTop +
                  20 -
                  barSpacing
                }
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {tick.toFixed(1)}
              </text>
            </g>
          ))}

          <text
            x={chartWidth / 2}
            y={
              data.length * (barHeight + barSpacing) +
              marginTop +
              45 -
              barSpacing
            }
            textAnchor="middle"
            className="text-xs font-semibold fill-gray-700"
          >
            Cumul de Durée (Heures)
          </text>

          {data.map((item, index) => {
            const y = marginTop + index * (barHeight + barSpacing);
            const isTotal = item.position === "Total Général";
            const barColor = isTotal ? "#1e3a8a" : "#3b82f6";

            return (
              <g key={item.position}>
                <text
                  x={marginLeft - 10}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-700"
                >
                  {item.position}
                </text>

                <rect
                  x={xScale(0)}
                  y={y}
                  width={xScale(item.duration) - xScale(0)}
                  height={barHeight}
                  fill={barColor}
                  rx={3}
                  ry={3}
                />

                <text
                  x={xScale(item.duration) + 8}
                  y={y + barHeight / 2 + 4}
                  className="text-xs font-semibold fill-gray-700"
                >
                  {item.duration.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#f8fafc] py-1 px-2">
      <div className="max-w-full mx-auto p-4 space-y-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
            <h1 className="text-xl font-bold text-gray-900">
              Chronogramme de{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text">
                Traitement Unitaire
              </span>
            </h1>
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
          </div>
          <p className="text-gray-600 text-xs max-w-2xl mx-auto leading-relaxed">
            Visualisez le déroulement temporel des tâches et optimisez votre
            processus de traitement
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
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
                    list="positions-list"
                  />
                  <datalist id="positions-list">
                    {positions.map((pos) => (
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
                  onClick={handleExporterExcel}
                  className="cursor-pointer w-full sm:w-auto text-sm px-3 py-1 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <FileDown className="w-4 h-4" />
                  Exporter Excel
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="cursor-pointer w-full sm:w-auto text-sm px-3 py-1 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <BarChart3 className="w-4 h-4" />
                  Chronogramme
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-gray-900">
              Détail des Tâches
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({searchResultsCount} résultat
                  {searchResultsCount !== 1 ? "s" : ""})
                </span>
              )}
            </h3>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tâche
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Durée (Min)
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Durée (Sec)
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Temps Cumulé (Min)
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Temps Cumulé (Sec)
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Temps Cumulé (m:s)
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Temps Cumulé (Heure)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
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
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }
                      >
                        <td className="py-2 px-3 text-sm text-gray-700">
                          {item.tache}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                          {item.responsable}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700">
                          {item.dureeMin}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700">
                          {item.dureeSec}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700">
                          {item.tempsCumuleMin}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700">
                          {item.tempsCumuleSec}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                          {item.tempsCumuleMS}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                          {item.tempsCumuleHeure}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
                <div className="flex-1 flex justify-center">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Chronogramme par Position - Processus Actuel
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
                <div className="flex justify-center">
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
                        <Table className="w-4 h-4" />
                        Afficher Tableau
                      </>
                    )}
                  </button>
                </div>

                {viewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <table className="w-[85%] mx-auto">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Durée Cumulée (Secondes)
                          </th>
                          <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Durée Cumulée (Minutes)
                          </th>
                          <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Durée Cumulée (Heures)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(chronogrammeParPositionData).map(
                          ([position, data], index) => (
                            <tr
                              key={position}
                              className={
                                index % 2 === 0
                                  ? "bg-gray-50 hover:bg-gray-100"
                                  : "bg-white hover:bg-gray-50"
                              }
                            >
                              <td className="py-2 px-3 text-sm text-gray-700 font-medium">
                                {position}
                              </td>
                              <td className="py-2 px-3 text-sm text-center text-gray-700">
                                {data.dureeSecondes.toFixed(2)}
                              </td>
                              <td className="py-2 px-3 text-sm text-center text-gray-700">
                                {data.dureeMinutes.toFixed(2)}
                              </td>
                              <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                                {data.dureeHeures.toFixed(2)}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            Total Général
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900">
                            {chronogrammeTotal.dureeSecondes.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900">
                            {chronogrammeTotal.dureeMinutes.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900">
                            {chronogrammeTotal.dureeHeures.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex justify-center py-4">
                    <CumulativeBarChart data={cumulativeChartData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}