import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MapPin, Radio, BarChart3, Menu, Moon, Sun, X, ClipboardList, ShieldCheck, PackageSearch, Warehouse, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, path: '/tableau-bord' },
  { id: 'articles', label: 'Articles', icon: Package, path: '/articles' },
  { id: 'zones', label: 'Zones', icon: MapPin, path: '/zones' },
  { id: 'commandes', label: 'Commandes', icon: ClipboardList, path: '/commandes' },
  {
    id: 'operations',
    label: 'Opérations',
    icon: PackageSearch,
    dropdown: true,
    items: [
      { id: 'picking', label: 'Picking', icon: PackageSearch, path: '/operations/picking' },
      { id: 'stockage', label: 'Stockage', icon: Warehouse, path: '/operations/stockage' },
    ]
  },
  { id: 'rfid', label: 'RFID & Tags', icon: Radio, path: '/rfid' },
  { id: 'sav', label: 'SAV & Authenticité', icon: ShieldCheck, path: '/sav' },
  { id: 'reports', label: 'Rapports', icon: BarChart3, path: '/reports' },
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

  const isActive = (path, item = null) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // For dropdown items, check if any sub-item is active
    if (item && item.dropdown && item.items) {
      return item.items.some(subItem => location.pathname.startsWith(subItem.path));
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const active = isActive(item.path, item);

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
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </Button>
    );
  };

  const NavDropdown = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const active = isActive(null, item);

    if (isMobile) {
      // For mobile, render as expandable list
      return (
        <div className="space-y-1">
          <div className={`flex items-center justify-start space-x-3 p-3 w-full rounded-lg ${
            active ? 'bg-white/10 text-white' : 'text-white/70'
          }`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          <div className="pl-8 space-y-1">
            {item.items.map((subItem) => {
              const SubIcon = subItem.icon;
              const subActive = isActive(subItem.path);
              return (
                <Button
                  key={subItem.id}
                  variant="ghost"
                  onClick={() => handleNavigate(subItem.path)}
                  className={`flex items-center justify-start space-x-2 p-2 w-full rounded-lg text-sm transition-all duration-200 ${
                    subActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  <span>{subItem.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      );
    }

    // Desktop dropdown
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              active
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {item.items.map((subItem) => {
            const SubIcon = subItem.icon;
            return (
              <DropdownMenuItem
                key={subItem.id}
                onClick={() => handleNavigate(subItem.path)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <SubIcon className="w-4 h-4" />
                <span>{subItem.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="border-b shadow-sm sticky top-0 z-40" style={{ backgroundColor: '#234367', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src="/images/logo_RFID.png" alt="RFID TrackerPro Logo" className="h-15 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              item.dropdown ? (
                <NavDropdown key={item.id} item={item} />
              ) : (
                <NavLink key={item.id} item={item} />
              )
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
                        item.dropdown ? (
                          <NavDropdown key={item.id} item={item} isMobile={true} />
                        ) : (
                          <NavLink key={item.id} item={item} isMobile={true} />
                        )
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