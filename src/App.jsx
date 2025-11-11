import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layouts/Layout";
import PublicLayout from "./pages/Layouts/PublicLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Zones from "./pages/Zones";
import Rfid from "./pages/Rfid";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Application routes */}
        <Route path="/" element={<Layout />}>
          <Route path="tableau-bord" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="zones" element={<Zones />} />
          <Route path="rfid" element={<Rfid />} />
          <Route path="reports" element={<Reports />} />
          {/*<Route path="about" element={<About />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
