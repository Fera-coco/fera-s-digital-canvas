import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { DemoBanner, Footer, Header } from "./components/ui";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Property from "./pages/Property";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <DemoBanner />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/concepts/brightdoor">
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/homes" element={<Search />} />
          <Route path="/homes/:slug" element={<Property />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
