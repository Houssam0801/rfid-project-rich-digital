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

// Import de les pages du Vue Globale
import TableauBordGlobal from "./pages/vue_globale/TableauBordGlobal.jsx";
import Ratios from "./pages/vue_globale/Ratios.jsx";
import ComparatifPositions from "./pages/vue_globale/ComparatifPositions.jsx";
import EconomiesBudgetaires from "./pages/vue_globale/EconomiesBudgetaires.jsx";


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
          <Route index element={<TableauBordGlobal />} />
        </Route>

        {/* Routes principales simplifiées */}
        <Route path="/" element={<Layout />}>

          {/* routes of vue globale */}
          <Route path="tableau-bord-global" element={<TableauBordGlobal />} />
          <Route path="ratios" element={<Ratios />} />
          <Route path="comparatif-positions" element={<ComparatifPositions />} />
          <Route path="economies-budgetaires" element={<EconomiesBudgetaires />} />

          {/* routes of proccessus */}
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