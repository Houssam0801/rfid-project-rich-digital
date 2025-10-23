import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimulationParPosition from "./pages/processus_actuel/SimulationParPosition";
import Layout from "./pages/Layout.jsx";
import SimulationGlobale from "./pages/processus_actuel/SimulationGlobale";
import ChronogrammeTraitement from "./pages/processus_actuel/ChronogrammeTraitement";
import Referentiel from "./pages/processus_actuel/Referentiel";
import ShemaProcess from "./pages/processus_actuel/ShemaProcess";
import NormesDimensionnement from "./pages/processus_actuel/NormesDimensionnement";

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
          <Route path="chronogramme-unitaire" element={<ChronogrammeTraitement/>} />
          <Route path="referentiel-actuel" element={<Referentiel/>} />
          <Route path="schema-process" element={<ShemaProcess/>} />
          <Route path="normes-dimensionnement" element={<NormesDimensionnement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
