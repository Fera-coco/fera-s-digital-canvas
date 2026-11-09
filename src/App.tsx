import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "@/components/exhibition/Header";
import { useReveal, useScrollManager } from "@/hooks/use-exhibition";
import Index from "./pages/Index";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";

const Layout = () => {
  useScrollManager();
  useReveal();
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
