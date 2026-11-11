import Studio from "@/components/exhibition/Studio";
import PriceList from "@/components/exhibition/PriceList";
import NextRoom from "@/components/exhibition/NextRoom";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";

const StudioPage = () => {
  usePageMeta(PAGES.studio);
  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      <Studio />
      <PriceList />
      <NextRoom from="studio" />
    </main>
  );
};

export default StudioPage;
