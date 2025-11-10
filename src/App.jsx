import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Zones from "./pages/Zones";
import Rfid from "./pages/Rfid";
import Reports from "./pages/Reports";
// import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
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
