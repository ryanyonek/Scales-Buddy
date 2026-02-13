import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Scales from "./pages/Scales";
import Transpose from "./pages/Transpose";
import Worksheets from "./pages/Worksheets";
import ScaleHeader from "./components/music/ScaleHeader";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <ScaleHeader />
        <Link to="/">Scales</Link>
        <Link to="/transpose">Transpose</Link>
        <Link to="/worksheets">Worksheets</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Scales />} />
        <Route path="/transpose" element={<Transpose />} />
        <Route path="/worksheets" element={<Worksheets />} />
      </Routes>
    </BrowserRouter>
  );
}