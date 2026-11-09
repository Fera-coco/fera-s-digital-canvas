import Studio from "@/components/exhibition/Studio";
import NextRoom from "@/components/exhibition/NextRoom";
import { usePageMeta } from "@/hooks/use-exhibition";

const StudioPage = () => {
  usePageMeta(
    "The Studio: services | Fera's Studio",
    "Commission Fera's Studio for website design and development, UX/UI and product design, redesigns, landing pages and ordering flows.",
    "/studio",
  );
  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      <Studio />
      <NextRoom from="studio" />
    </main>
  );
};

export default StudioPage;
