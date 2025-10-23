import { useState } from "react";
import { X, FileDown, Users } from "lucide-react";
import ExcelJS from "exceljs";
import {
  normesData,
  capaciteNominaleData,
} from "../../data/normesDimensionnement";

export default function NormesDimensionnement() {
  const [showCapaciteModal, setShowCapaciteModal] = useState(false);

  const handleExporterNormes = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Normes de dimensionnement");

      worksheet.columns = [
        { width: 50 }, // Activité
        { width: 30 }, // Position
        { width: 15 }, // Minutes
        { width: 15 }, // Secondes
        { width: 20 }, // Unité
      ];

      const headerRow = worksheet.addRow([
        "Activité",
        "Position",
        "Minutes",
        "Secondes",
        "Unité",
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      normesData.forEach((item) => {
        const row = worksheet.addRow([
          item.activite,
          item.position,
          item.minutes,
          item.secondes,
          item.unite,
        ]);
        row.alignment = { horizontal: "left" };
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).alignment = { horizontal: "center" };
        row.getCell(5).alignment = { horizontal: "center" };
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
      link.download = "Normes_de_dimensionnement.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation Excel");
    }
  };

  const handleExporterCapacite = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Capacité Nominale");

      worksheet.columns = [
        { width: 30 }, // Position
        { width: 20 }, // Temps/Dossier
        { width: 20 }, // Dossiers/Mois
        { width: 20 }, // Dossiers/Jour
        { width: 20 }, // Dossiers/Heure
      ];

      const headerRow = worksheet.addRow([
        "Position",
        "Temps/Dossier",
        "Dossiers/Mois",
        "Dossiers/Jour",
        "Dossiers/Heure",
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      Object.entries(capaciteNominaleData).forEach(([key, data]) => {
        const row = worksheet.addRow([
          data.position,
          data.tempsDossier,
          data.dossiersMois || "",
          data.dossiersJour || "",
          data.dossiersHeure || "",
        ]);

        if (key === "Total") {
          row.font = { bold: true };
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE5E7EB" },
          };
        }

        row.alignment = { horizontal: "left" };
        row.getCell(2).alignment = { horizontal: "center" };
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).alignment = { horizontal: "center" };
        row.getCell(5).alignment = { horizontal: "center" };
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
      link.download = "Capacite_Nominale.xlsx";
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
    <div className="bg-[#f8fafc] py-1 px-2">
      <div className="max-w-full mx-auto p-4 space-y-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
            <h1 className="text-2xl font-bold text-gray-900">
              Normes de{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text">
                Dimensionnement
              </span>
            </h1>
            <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full opacity-80"></div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-5 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            {/* Use flex-row and justify-between to place items on opposite ends */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* 1. Header Title (on the left) */}
              <h3 className="text-lg font-semibold text-gray-900">
                Normes par Activité
              </h3>

              {/* 2. Action Buttons (on the right) */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Exporter Excel Button */}
                <button
                  onClick={handleExporterNormes}
                  className="cursor-pointer w-full sm:w-auto text-sm px-2 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Exporter Excel
                </button>

                {/* Capacité Nominale Button */}
                <button
                  onClick={() => setShowCapaciteModal(true)}
                  className="cursor-pointer w-full sm:w-auto text-sm px-2 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
                >
                  <Users className="w-3.5 h-3.5" />
                  Capacité Nominale
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto ">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Activité
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Minutes
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Secondes
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Unité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {normesData.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "bg-white hover:bg-gray-50"
                      }
                    >
                      <td className="py-2 px-3 text-sm text-gray-700">
                        {item.activite}
                      </td>
                      <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                        {item.position}
                      </td>
                      <td className="py-2 px-3 text-sm text-center text-gray-700">
                        {item.minutes}
                      </td>
                      <td className="py-2 px-3 text-sm text-center text-gray-700">
                        {item.secondes}
                      </td>
                      <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                        {item.unite}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showCapaciteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
                <div className="flex-1 flex justify-center">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    Capacité Nominale
                  </h3>
                </div>
                <button
                  onClick={() => setShowCapaciteModal(false)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer text-gray-600 hover:text-red-600 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleExporterCapacite}
                    className="cursor-pointer text-sm px-3 py-1.5 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Exporter Excel
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Temps/Dossier
                        </th>
                        <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Dossiers/Mois
                        </th>
                        <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Dossiers/Jour
                        </th>
                        <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Dossiers/Heure
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(capaciteNominaleData).map(
                        ([key, data], index) => (
                          <tr
                            key={key}
                            className={
                              key === "Total"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300"
                                : index % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50"
                            }
                          >
                            <td className="py-2 px-3 text-sm text-gray-700 font-medium">
                              {data.position}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-700">
                              {data.tempsDossier}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-700">
                              {data.dossiersMois || ""}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-700">
                              {data.dossiersJour || ""}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                              {data.dossiersHeure || ""}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
