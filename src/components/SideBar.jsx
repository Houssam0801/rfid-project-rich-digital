import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  BarChart3,
  FileText,
  Clock,
  BookOpen,
  Network,
  X,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Users,
  TrendingUp,
  DollarSign,
  GitCompare,
  LineChart,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [isEffectifsOpen, setIsEffectifsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(true);

  const effectifsItems = [
    {
      id: "tableau-bord",
      label: "Tableau de Bord Global",
      icon: BarChart3,
      path: "/tableau-bord-global",
    },
    {
      id: "ratios",
      label: "Ratios",
      icon: TrendingUp,
      path: "/ratios",
    },
    {
      id: "economies",
      label: "Économies Budgétaires Estimées",
      icon: DollarSign,
      path: "/economies-budgetaires",
    },
    {
      id: "comparatif",
      label: "Comparatif Positions",
      icon: GitCompare,
      path: "/comparatif-positions",
    },
    {
      id: "projection",
      label: "Projection",
      icon: LineChart,
      path: "/projection",
    },
  ];

  const processItems = [
    {
      id: "simulation-position",
      label: "Simulation par Position",
      icon: Building2,
      path: "/simulation-position",
    },
    {
      id: "simulation-globale",
      label: "Simulation Globale",
      icon: BarChart3,
      path: "/simulation-globale",
    },
    {
      id: "normes",
      label: "Normes de Dimensionnement",
      icon: FileText,
      path: "/normes-dimensionnement",
    },
    {
      id: "chronogramme",
      label: "Chronogramme de Traitement Unitaire",
      icon: Clock,
      path: "/chronogramme-unitaire",
    },
    {
      id: "schema",
      label: "Schéma Process",
      icon: Network,
      path: "/schema-process",
    },
    {
      id: "referentiel",
      label: "Référentiel",
      icon: BookOpen,
      path: "/referentiel",
    },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-65 bg-white border-r border-gray-200 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          shadow-xl lg:shadow-none
        `}
      >
        {/* Header with Logo */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {/* Logo Container */}
            <div className="p-1 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm border border-blue-100">
              <img
                src="/images/LOGO_Tawazoon_RH_Mini.png"
                alt="Tawazoon RH"
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* App Name */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                TAWAZOON RH
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Analyse des Effectifs
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 py-4 overflow-y-auto">
          {/* Vue Globale des Effectifs Section */}
          <div className="mb-2">
            <button
              onClick={() => setIsEffectifsOpen(!isEffectifsOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all
                hover:bg-gray-50 group
                ${isEffectifsOpen ? "bg-gray-50" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-green-500 shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                  Vue Globale des Effectifs
                </span>
              </div>
              {isEffectifsOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform" />
              )}
            </button>

            {isEffectifsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-1 border-gray-200 pl-2">
                {effectifsItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
                        ${
                          active
                            ? "bg-green-50 text-green-700 border-l-2 border-green-500 -ml-0.5"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          active
                            ? "text-green-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span className="font-medium flex-1">{item.label}</span>
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {/* Résultats de la Simulation Section */}
          <div className="mb-2">
            <button
              onClick={() => setIsResultsOpen(!isResultsOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all
                hover:bg-gray-50 group
                ${isResultsOpen ? "bg-gray-50" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500 shadow-sm">
                  <PlayCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                  Résultats de la simulation
                </span>
              </div>
              {isResultsOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform" />
              )}
            </button>

            {isResultsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-1 border-gray-200 pl-2">
                {processItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
                        ${
                          active
                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500 -ml-0.5"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          active
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span className="font-medium flex-1">{item.label}</span>
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500 text-center">
            Version 1.0.0 • © 2025 Tawazoon RH
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
