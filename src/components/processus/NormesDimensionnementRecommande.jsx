import { useState } from "react";
import { X, FileDown, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import ExcelJS from "exceljs";
import {
  normesDataRecommande,
  capaciteNominaleDataRecommande,
} from "../../data/normesDimensionnement";

export default function NormesDimensionnement() {
  const [showCapaciteModal, setShowCapaciteModal] = useState(false);

  const handleExporterNormes = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Normes Recommandé");

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

      normesDataRecommande.forEach((item) => {
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
      link.download = "Normes_de_dimensionnement_Recommandé.xlsx";
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
      const worksheet = workbook.addWorksheet("Capacité Nominale Recommandé");

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

      Object.entries(capaciteNominaleDataRecommande).forEach(([key, data]) => {
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
      link.download = "Capacite_Nominale_Recommandé.xlsx";
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-200 px-5 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
          {/* Use flex-row and justify-between to place items on opposite ends */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            {/* 1. Header Title (on the left) */}
            <h3 className="text-lg font-bold text-gray-900">
              Normes par Activité - Recommandé
            </h3>

            {/* 2. Action Buttons (on the right) */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Capacité Nominale Button */}
              <button
                onClick={() => setShowCapaciteModal(true)}
                className="cursor-pointer w-full sm:w-auto text-sm px-2 py-1.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
              >
                <Users className="w-3.5 h-3.5" />
                Capacité Nominale
              </button>

              {/* Exporter Excel Button */}
              <button
                onClick={handleExporterNormes}
                className="cursor-pointer w-full sm:w-auto text-sm px-2 py-1.5 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
              >
                <FileDown className="w-3.5 h-3.5" />
                Exporter Excel
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
                <TableRow>
                  <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2/5">
                    Activité
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Position
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Minutes
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Secondes
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                    Unité
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normesDataRecommande.map((item, index) => (
                  <TableRow
                    key={index}
                    className={` text-sm
                     ${
                       index % 2 === 0
                         ? "bg-gray-50 hover:bg-gray-100"
                         : "bg-white hover:bg-gray-50"
                     }
                      `}
                  >
                    <TableCell className=" text-gray-700 w-2/5">
                      {item.activite}
                    </TableCell>
                    <TableCell className=" text-center text-gray-700 font-medium w-1/5">
                      {item.position}
                    </TableCell>
                    <TableCell className=" text-center text-gray-700 w-1/5">
                      {item.minutes}
                    </TableCell>
                    <TableCell className=" text-center text-gray-700 w-1/5">
                      {item.secondes}
                    </TableCell>
                    <TableCell className="text-center w-1/5">
                      <span className="inline-block px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {item.unite}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {showCapaciteModal && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
              <div className="flex-1 flex justify-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Capacité Nominale - Recommandé
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow w-[90%] mx-auto">
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <TableRow>
                          <TableHead className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2/5">
                            Position
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                            Temps/Dossier
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                            Dossiers/Mois
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                            Dossiers/Jour
                          </TableHead>
                          <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                            Dossiers/Heure
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(capaciteNominaleDataRecommande).map(
                          ([key, data], index) => (
                            <TableRow
                              key={key}
                              className={
                                key === "Total"
                                  ? "bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300"
                                  : index % 2 === 0
                                  ? "bg-gray-50 hover:bg-gray-100"
                                  : "bg-white hover:bg-gray-50"
                              }
                            >
                              <TableCell className="text-sm text-gray-700 font-medium w-2/5">
                                {data.position}
                              </TableCell>
                              <TableCell className="text-sm text-center text-gray-700 w-1/5">
                                {data.tempsDossier}
                              </TableCell>
                              <TableCell className="text-sm text-center text-gray-700 w-1/5">
                                {data.dossiersMois || ""}
                              </TableCell>
                              <TableCell className="text-sm text-center text-gray-700 w-1/5">
                                {data.dossiersJour || ""}
                              </TableCell>
                              <TableCell className="text-sm text-center text-gray-900 font-bold w-1/5">
                                {data.dossiersHeure || ""}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
