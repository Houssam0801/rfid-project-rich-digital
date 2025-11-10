import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Car, MapPin, Radio, BarChart3, Menu, Moon, Sun, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, path: '/' },
  { id: 'vehicles', label: 'Véhicules', icon: Car, path: '/vehicles' },
  { id: 'zones', label: 'Zones', icon: MapPin, path: '/zones' },
  { id: 'rfid', label: 'RFID & Tags', icon: Radio, path: '/rfid' },
  { id: 'reports', label: 'Rapports', icon: BarChart3, path: '/reports' },
  // { id: 'about', label: 'À Propos', icon: Info, path: '/about' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else if (systemPrefersDark) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsSheetOpen(false); // Close sheet on navigation
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    const buttonClass = isMobile
      ? `flex items-center justify-start space-x-3 p-3 w-full rounded-lg transition-all duration-200 ${
          active
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`
      : `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-white/10 text-white shadow-lg'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`;

    return (
      <Button
        variant="ghost"
        onClick={() => handleNavigate(item.path)}
        className={buttonClass}
      >
        <Icon className="w-5! h-5!" />
        <span className="font-medium">{item.label}</span>
      </Button> 
    );
  };

  return (
    <header className="border-b shadow-sm sticky top-0 z-40" style={{ backgroundColor: '#234367', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src="/images/logo_RFID.png" alt="RFID TrackerPro Logo" className="h-15 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white/70 hover:text-white hover:bg-white/10"
              title={darkMode ? 'Mode Clair' : 'Mode Sombre'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Ouvrir le menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 px-1 border-b">
                       <div className="flex items-center">
                          <img src="/images/logo_RFID.png" alt="RFID TrackerPro Logo" className="h-15 w-auto" />
                        </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Fermer</span>
                        </Button>
                      </SheetClose>
                    </div>
                    <div className="flex-1 py-4 px-1 space-y-2">
                      {navItems.map((item) => (
                        <NavLink key={item.id} item={item} isMobile={true} />
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}