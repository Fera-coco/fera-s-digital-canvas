import { Fragment, lazy, Suspense, useEffect, useState } from "react";
import { getLang, onLangChange } from "@/lib/i18n";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "@/components/exhibition/Header";
import RoomTransition from "@/components/exhibition/RoomTransition";
import { useReveal, useScrollManager } from "@/hooks/use-exhibition";
import TicketDesk from "./pages/TicketDesk";
import GalleryWalk from "./pages/GalleryWalk";
import CollectionPage from "./pages/CollectionPage";
import CuratorPage from "./pages/CuratorPage";
import StudioPage from "./pages/StudioPage";
import ContactPage from "./pages/ContactPage";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";
import OpenCallPage from "./pages/OpenCallPage";

const OpenCallAdmin = lazy(() => import("./pages/OpenCallAdmin"));

const Rooms = () => {
  useScrollManager();
  useReveal();
  return (
    <>
      <Header />
      <RoomTransition />
      <Outlet />
    </>
  );
};

const Layout = () => {
  const [lang, setLang] = useState(getLang());
  useEffect(() => onLangChange(setLang), []);
  // Switching language remounts the rooms so every string is re-read in the new language.
  return (
    <Fragment key={lang}>
      <Rooms />
    </Fragment>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TicketDesk />} />
        <Route path="/visit" element={<GalleryWalk />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/curator" element={<CuratorPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/open-call" element={<OpenCallPage />} />
        <Route
          path="/open-call/admin"
          element={
            <Suspense fallback={<p className="label pt-40 text-center text-stone">Opening the back office…</p>}>
              <OpenCallAdmin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
