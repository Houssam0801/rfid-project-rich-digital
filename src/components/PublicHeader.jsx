import React from 'react';
import { LogIn, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navItems = [
  { id: 'accueil', label: 'Accueil', path: '/' },
  { id: 'outil', label: 'Outil', path: '/outil' },
  { id: 'faq', label: 'FAQ', path: '/faq' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export default function PublicHeader() {
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = () => {
    setIsSheetOpen(false);
  };

  const NavLink = ({ item, isMobile = false }) => {
    const active = isActive(item.path);
    
    const buttonClass = isMobile
      ? `flex items-center justify-start space-x-3 p-3 w-full rounded-lg transition-all duration-200 text-base ${
          active
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`
      : `flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-base ${
          active
            ? 'bg-white/10 text-white shadow-lg'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`;

    return (
      <Link to={item.path} onClick={handleNavigate}>
        <Button
          variant="ghost"
          className={buttonClass}
        >
          <span className="font-medium">{item.label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <header className="border-b shadow-sm sticky top-0 z-40 bg-[#234367] border-[#ffffff1a]">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo_RFID.png" alt="RFID SmartTrace Plus Logo" className="h-15 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          {/* Right Section - Connexion Button */}
          <div className="flex items-center space-x-2">
            {/* Connexion Button */}
            <Link to="/login">
              <Button className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 shadow-lg border border-white/20">
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Connexion</span>
              </Button>
            </Link>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Ouvrir le menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-[#234367]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 px-1 border-b border-white/10">
                      <div className="flex items-center">
                        <img src="/images/logo_RFID.png" alt="RFID SmartTrace Plus Logo" className="h-15 w-auto" />
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
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