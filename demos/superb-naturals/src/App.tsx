import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Header, WaIcon } from "./components/ui";
import Home from "./pages/Home";
import { ClassicFooter, ClassicHeader, ClassicHome } from "./classic/Classic";

const classic = import.meta.env.VITE_THEME === "classic";
const Head = classic ? ClassicHeader : Header;
const Foot = classic ? ClassicFooter : Footer;
const Landing = classic ? ClassicHome : Home;
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Routine from "./pages/Routine";
import { Cart, OrderDone } from "./pages/Cart";
import { Delivery, Refunds } from "./pages/Policies";
import { waLink } from "./data/products";
import Watermark from "./components/Watermark";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ScrollManager />
      <Head />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<Product />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:ref" element={<OrderDone />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/refund-policy" element={<Refunds />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Foot />
      <Watermark />
      <a
        href={waLink("Hello Superb Naturals 👋")}
        target="_blank"
        rel="noopener noreferrer"
        className="keep-round fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105"
        aria-label="Chat with Superb Naturals on WhatsApp"
      >
        <span className="scale-150"><WaIcon /></span>
      </a>
    </BrowserRouter>
  );
}
