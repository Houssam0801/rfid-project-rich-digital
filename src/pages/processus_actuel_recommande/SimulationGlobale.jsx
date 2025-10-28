import React, { useState } from "react";
import SimulationGlobaleActuel from "@/components/processus/SimulationGlobaleActuel";
import SimulationGlobaleRecommande from "@/components/processus/SimulationGlobaleRecommande";

const SimulationGlobale = () => {
  const [isRecommended, setIsRecommended] = useState(false);

  return (
    <div className="bg-slate-50">
      <div className="max-w-full mx-auto p-4 space-y-4">
        <div className="relative mb-5">
          <div className="relative bg-white rounded-2xl shadow-lg px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-7 bg-[#005EA8] rounded-full"></div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Simulation <span className="text-[#005EA8]">Globale</span>
                  </h1>
                </div>
                <p className="text-xs text-gray-500 ml-3 font-medium">
                  {isRecommended ? "Processus recommandé" : "Processus actuel"}{" "}
                  • Analyse globale
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-1 px-1.5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRecommended(false)}
                    className={`cursor-pointer px-4 py-1 rounded-lg font-semibold text-sm transition-all ${
                      !isRecommended
                        ? "bg-[#005EA8] text-white shadow-lg scale-105"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Actuel
                  </button>
                  <button
                    onClick={() => setIsRecommended(true)}
                    className={`cursor-pointer px-4 py-1 rounded-lg font-semibold text-sm transition-all ${
                      isRecommended
                        ? "bg-[#005EA8] text-white shadow-lg scale-105"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Recommandé
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isRecommended ? (
          <SimulationGlobaleRecommande />
        ) : (
          <SimulationGlobaleActuel />
        )}
      </div>
    </div>
  );
};

export default SimulationGlobale;
