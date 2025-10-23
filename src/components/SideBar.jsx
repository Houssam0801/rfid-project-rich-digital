import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, BarChart3, FileText, Clock, BookOpen, Network, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navigationItems = [
    { 
      id: 'simulation-position', 
      label: 'Simulation par Position', 
      icon: Building2,
      path: '/simulation-position'
    },
    { 
      id: 'simulation-globale', 
      label: 'Simulation Globale', 
      icon: BarChart3,
      path: '/simulation-globale'
    },
    { 
      id: 'normes', 
      label: 'Normes de Dimensionnement', 
      icon: FileText,
      path: '/'
    },
    { 
      id: 'chronogramme', 
      label: 'Chronogramme de Traitement Unitaire', 
      icon: Clock,
      path: '/chronogramme-unitaire'
    },
    { 
      id: 'referentiel', 
      label: 'Référentiel', 
      icon: BookOpen,
      path: '/'
    },
    { 
      id: 'schema', 
      label: 'Schéma Process', 
      icon: Network,
      path: '/'
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
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
      <aside className={`
        fixed left-0 top-0 h-screen w-62 bg-white border-r border-gray-200 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        {/* Header */}
        <div className="px-3 py-1 border-b border-gray-200 flex items-center justify-between mx-auto">
          <div>
            <h1 className="text-xl font-bold text-blue-600">TAWAZOON RH</h1>
            <p className="text-sm text-gray-500 mt-1">Workforce Analytics</p>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`
                      w-full flex items-center gap-3 px-2 py-3 rounded-lg text-left transition-all
                      ${active
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            v1.0.0 - 2024
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;