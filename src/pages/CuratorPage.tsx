import Curator from "@/components/exhibition/Curator";
import NextRoom from "@/components/exhibition/NextRoom";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";

const CuratorPage = () => {
  usePageMeta(PAGES.curator);
  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      <Curator />
      <NextRoom from="curator" />
    </main>
  );
};

export default CuratorPage;
