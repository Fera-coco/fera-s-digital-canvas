import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Header, WaIcon } from "./components/ui";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Routine from "./pages/Routine";
import { Cart, OrderDone } from "./pages/Cart";
import { waLink } from "./data/products";

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
    <BrowserRouter basename="/demos/superb-naturals">
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<Product />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:ref" element={<OrderDone />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <a
        href={waLink("Hello Superb Naturals 👋")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105"
        aria-label="Chat with Superb Naturals on WhatsApp"
      >
        <span className="scale-150"><WaIcon /></span>
      </a>
    </BrowserRouter>
  );
}
