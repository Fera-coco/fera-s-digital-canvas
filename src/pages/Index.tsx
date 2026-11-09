import Entrance from "@/components/exhibition/Entrance";
import Collection from "@/components/exhibition/Collection";
import Curator from "@/components/exhibition/Curator";
import Studio from "@/components/exhibition/Studio";
import Exit from "@/components/exhibition/Exit";
import { usePageMeta } from "@/hooks/use-exhibition";

const Index = () => {
  usePageMeta(
    "Fera's Studio: UX/UI design & web development by Fera",
    "Fera's Studio is the digital exhibition of Peace Oluwaferanmi Segun-Babs (Fera), a UX/UI designer and front-end developer designing and building websites, products and interfaces.",
    "/",
  );

  return (
    <>
      <main id="main">
        <Entrance />
        <Collection />
        <Curator />
        <Studio />
      </main>
      <Exit />
    </>
  );
};

export default Index;
