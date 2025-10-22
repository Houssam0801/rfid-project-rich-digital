import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimulationParPosition from "./pages/processus_actuel/SimulationParPosition";
import Layout from "./pages/Layout.jsx";
import SimulationGlobale from "./pages/processus_actuel/SimulationGlobale";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Layout/>} >
          <Route path="simulation-position" element={<SimulationParPosition/>} />
          <Route path="simulation-globale" element={<SimulationGlobale/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
