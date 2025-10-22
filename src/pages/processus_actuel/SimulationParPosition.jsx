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
} from "lucide-react";
import { referentiels, positionOptions } from "../../data/referentiels";
import { simulationResults } from "../../data/results";

// Utility functions
const formatTime = (minutes, secondes) => {
  return `${minutes}m ${secondes}s`;
};

const getTotalMinutes = (minutes, secondes) => {
  return minutes + secondes / 60;
};

export default function SimulationParPosition() {
  // Form inputs
  const [position, setPosition] = useState("Chargé réception dossier");
  const [nombreSacs, setNombreSacs] = useState(50);
  const [nombreDossiers, setNombreDossiers] = useState(6500);
  const [productivite, setProductivite] = useState(100);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Get current data based on selected position
  const currentReferentiel = referentiels[position];

  // Prepare chart data
  const chartData = currentReferentiel.map((activity) => ({
    name: activity.activite,
    value: getTotalMinutes(activity.minutes, activity.secondes),
    label: formatTime(activity.minutes, activity.secondes),
  }));

  const handleLancerSimulation = () => {
    // TODO: This will call backend API with the form data
    // const payload = { position, nombreSacs, nombreDossiers, productivite };
    // const response = await fetch('/api/simulation', { method: 'POST', body: JSON.stringify(payload) });
    // const data = await response.json();
    // For now, we just show the results
    setShowResults(true);
  };

  // Get results only if simulation has been run
  const currentResults = showResults ? simulationResults[position] : null;

  return (
    <div className="bg-[#f8fafc] py-1 px-2">
      <div className="max-w-full mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text ">
            Simulation par Position
          </h1>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Paramètres de Simulation
            </h3>
          </div>
          <div className="p-5">
            {/* Form inputs in one row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Position Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Position à simuler
                </label>
                <div className="relative">
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white pr-8 hover:border-gray-400"
                  >
                    {positionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Nombre de sacs */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  Nombre de sacs / jour
                </label>
                <input
                  type="number"
                  min="1"
                  value={nombreSacs}
                  onChange={(e) => setNombreSacs(parseInt(e.target.value) || 0)}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Nombre dossiers */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Productivité */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                    className="w-full text-xs px-2 py-1.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Cards - Centered and smaller */}
            <div className="flex justify-center gap-4 mt-3">
              <div className="w-40 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-blue-700">
                  Dossiers/jour
                </p>
                <p className="text-sm font-bold text-blue-800">
                  {currentResults ? currentResults.dossiersParJour : "--"}
                </p>
              </div>
              <div className="w-40 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-0.5 border border-blue-200 hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-blue-700">
                  Heures net/jour
                </p>

                <p className="text-sm font-bold text-blue-800">
                  {currentResults
                    ? `${currentResults.heuresNetParJour}h`
                    : "--"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-3 justify-center lg:justify-start">
              <button
                onClick={handleLancerSimulation}
                className="cursor-pointer text-sm px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Lancer Simulation
              </button>
              <button
                onClick={() => setShowChart(true)}
                className="cursor-pointer text-sm px-2.5 py-1.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Afficher Graphe
              </button>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Référentiel Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="border-b border-gray-200 px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900">
                Référentiel d'activités
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({position})
                </span>
              </h3>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Activité
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Min
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Sec
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Unité
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReferentiel.map((activity, index) => (
                      <tr
                        key={activity.order}
                        className={
                          index % 2 === 0
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }
                      >
                        <td className="py-2 px-3 text-sm font-medium text-gray-900">
                          {activity.order}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-700">
                          {activity.activite}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                          {activity.minutes}
                        </td>
                        <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                          {activity.secondes}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              activity.unite === "Sac"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            {activity.unite}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Table - Always visible but empty until simulation runs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="border-b border-gray-200 px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Résultats de Simulation
              </h3>
            </div>
            <div className="p-5">
              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Activité
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Unités
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Heures
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!showResults ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-gray-400"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Play className="w-8 h-8 text-gray-300" />
                            <p className="text-sm">
                              Cliquez sur "Lancer Simulation" pour voir les
                              résultats
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {currentResults.results.map((result, index) => (
                          <tr
                            key={result.order}
                            className={
                              index % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50"
                            }
                          >
                            <td className="py-2 px-3 text-sm font-medium text-gray-900">
                              {result.order}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-700">
                              {result.activite}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                              {result.nombreUnites}
                            </td>
                            <td className="py-2 px-3 text-sm text-center text-gray-700 font-medium">
                              {result.heures}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold border-t-2 border-blue-200 hover:bg-blue-100">
                          <td
                            colSpan="3"
                            className="py-2 px-3 text-left text-sm text-gray-700"
                          >
                            Total heures nécessaires (Activité/jour)
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                            {currentResults.totalHeuresNecessaires} h
                          </td>
                        </tr>
                        <tr className="bg-blue-50 font-semibold hover:bg-blue-100">
                          <td
                            colSpan="3"
                            className="py-2 px-3 text-left text-sm text-gray-700"
                          >
                            Effectif nécessaire (base{" "}
                            {currentResults.heuresNetParJour}h /jour)
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-900 font-bold">
                            {currentResults.effectifNecessaire}
                          </td>
                        </tr>
                        <tr className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold border-t-2 border-blue-300">
                          <td
                            colSpan="3"
                            className="py-2 px-3 text-left text-sm text-gray-900"
                          >
                            Effectif nécessaire Arrondi (base{" "}
                            {currentResults.heuresNetParJour}h /jour)
                          </td>
                          <td className="py-2 px-3 text-sm text-center text-gray-900">
                            {currentResults.effectifNecessaireArrondi}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Modal */}
        {showChart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Temps unitaire par activité (min)
                </h3>
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
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}  barSize={20} >
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
    </div>
  );
}
