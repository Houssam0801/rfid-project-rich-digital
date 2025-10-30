import { FileDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { comparatifPositionsData } from "../../data/comparatifPositions";
import ExcelJS from "exceljs";

export default function ComparatifPositions() {
  // Helper function to get badge color based on commentaire


  const handleExporterExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Comparatif_Positions");

      // Set column widths
      worksheet.columns = [
        { width: 35 }, // Positions Actuelles
        { width: 35 }, // Positions Recommandées
        { width: 20 }, // Commentaire
      ];

      // Add title
      const titleRow = worksheet.addRow(["Comparatif Positions"]);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:C1");
      worksheet.addRow([]); // Empty row

      // Add table headers
      const headersRow = worksheet.addRow([
        "Positions Actuelles",
        "Positions Recommandées",
        "Commentaire",
      ]);
      headersRow.font = { bold: true };
      headersRow.alignment = { horizontal: "center" };

      // Add data rows
      comparatifPositionsData.forEach((row) => {
        const dataRow = worksheet.addRow([
          row.positionActuelle,
          row.positionRecommandee,
          row.commentaire,
        ]);

        // Align columns
        dataRow.getCell(1).alignment = { horizontal: "left" };
        dataRow.getCell(2).alignment = { horizontal: "left" };
        dataRow.getCell(3).alignment = { horizontal: "center" };

        // Apply color to commentaire cell based on value
        const cell = dataRow.getCell(3);
        if (row.commentaire === "RAS") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDBEAFE" }, // Blue
          };
        } else if (row.commentaire === "Suppression") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFECACA" }, // Red
          };
        } else if (row.commentaire === "Ajout") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" }, // Green
          };
        }
      });

      // Apply borders to all cells with data
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 3) {
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
      link.download = "Comparatif_Positions.xlsx";
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
                Comparatif <span className="text-[#005EA8]">Positions</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-3 font-medium">
              Analyse comparative des positions actuelles et recommandées
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                Tableau Comparatif des Positions
              </h3>
              <button
                onClick={handleExporterExcel}
                className="cursor-pointer text-sm px-2 py-1 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-2"
              >
                <FileDown className="w-3 h-3" />
                Exporter Excel
              </button>
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableRow>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/3">
                        Positions Actuelles
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/3">
                        Positions Recommandées
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/3">
                        Commentaire
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparatifPositionsData.map((row, index) => (
                      <TableRow
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }
                      >
                        <TableCell className="text-center text-sm text-gray-700 font-medium w-1/3 py-1">
                          {row.positionActuelle}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-700 font-medium w-1/3 py-1">
                          {row.positionRecommandee}
                        </TableCell>
                        <TableCell className="text-center w-1/3 py-1">
                          <span
                            className={`inline-block px-2  rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 border-blue-200 `}
                          >
                            {row.commentaire}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-center items-center gap-4">

                <div className="flex items-center gap-1">
                  <span className="inline-block px-2 rounded-full text-xs font-semibold border ">
                    RAS
                  </span>
                  <span className="text-xs text-gray-700 whitespace-nowrap">
                    Aucun changement requis
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block px-2 rounded-full text-xs font-semibold border ">
                    Suppression
                  </span>
                  <span className="text-xs text-gray-700 whitespace-nowrap">
                    Position à supprimer
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block px-2 rounded-full text-xs font-semibold border">
                    Ajout
                  </span>
                  <span className="text-xs text-gray-700 whitespace-nowrap">
                    Position à ajouter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
