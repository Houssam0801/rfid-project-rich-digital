import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./pages/Layouts/Layout";
import PublicLayout from "./pages/Layouts/PublicLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import Zones from "./pages/Zones";
import Rfid from "./pages/Rfid";
import Reports from "./pages/Reports";

// Part 2 - Operational pages
import Commandes from "./pages/Commandes";
import Picking from "./pages/Picking";
import Stockage from "./pages/Stockage";
import SAV from "./pages/SAV";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster position="top-right" duration={3000} richColors closeButton />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Application routes */}
        <Route path="/" element={<Layout />}>
          <Route path="tableau-bord" element={<Dashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="zones" element={<Zones />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="operations/picking" element={<Picking />} />
          <Route path="operations/stockage" element={<Stockage />} />
          <Route path="rfid" element={<Rfid />} />
          <Route path="sav" element={<SAV />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
