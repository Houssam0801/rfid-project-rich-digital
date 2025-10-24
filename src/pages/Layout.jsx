import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../Components/SideBar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and set initial sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Set initial sidebar state based on screen size
      if (mobile) {
        setSidebarOpen(false); // Closed by default on mobile
      } else {
        setSidebarOpen(true); // Open by default on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, sidebarOpen]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area wrapper */}
      <div
        className={`
        flex-1 min-w-0 h-full flex flex-col
        ${!isMobile && !sidebarOpen ? "ml-0" : ""}
        transition-all duration-300 ease-in-out
      `}
      >
        {/* Top Navigation Bar (Header) */}
        <header
          className="flex items-center justify-between h-15 px-5 
                  bg-gradient-to-r from-[#005EA8]/10 to-[#0A6BBC]/100 
                  backdrop-blur-md border-b border-white/10 shadow-sm text-white flex-shrink-0"
        >
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Menu toggle for small screens */}
            {isMobile && ( // Show only on mobile
              <button
                onClick={handleMenuToggle}
                className="p-2.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 text-black" />
              </button>
            )}

            {/* Welcome message - show on desktop when sidebar is open */}
            {!isMobile && sidebarOpen && (
              <div className="flex flex-col items-start">
                <div className="text-base font-semibold text-black">
                  Bienvenue!
                </div>
                <div className="text-sm text-black/80 mt-1">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date())}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Empty for now since we removed user dropdown */}
          <div className="flex items-center gap-6">
            <div className="p-1 rounded-md bg-white/80 flex items-center justify-center">
              <img
                src="/images/almav_bgremoved.png"
                alt="Logo"
                className="w-30 h-9 object-contain"
              />
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-y-scroll max-h-screen pt-0">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
    </div>
  );
};

export default Layout;
