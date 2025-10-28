import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";

// Import des pages principales (qui contiendront le toggle)
import SimulationParPosition from "./pages/processus_actuel_recommande/SimulationParPosition";
import SimulationGlobale from "./pages/processus_actuel_recommande/SimulationGlobale";
import ChronogrammeTraitement from "./pages/processus_actuel_recommande/ChronogrammeTraitement";
import Referentiel from "./pages/processus_actuel_recommande/Referentiel";
import ShemaProcess from "./pages/processus_actuel_recommande/ShemaProcess";
import NormesDimensionnement from "./pages/processus_actuel_recommande/NormesDimensionnement";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Redirect root to simulation position by default */}
        <Route path="/" element={<Layout />}>
          <Route index element={<SimulationParPosition />} />
        </Route>

        {/* Routes principales simplifiées */}
        <Route path="/" element={<Layout />}>
          <Route path="simulation-position" element={<SimulationParPosition />} />
          <Route path="simulation-globale" element={<SimulationGlobale />} />
          <Route path="chronogramme-unitaire" element={<ChronogrammeTraitement />} />
          <Route path="referentiel" element={<Referentiel />} />
          <Route path="schema-process" element={<ShemaProcess />} />
          <Route path="normes-dimensionnement" element={<NormesDimensionnement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}