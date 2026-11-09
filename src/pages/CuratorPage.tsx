import Curator from "@/components/exhibition/Curator";
import NextRoom from "@/components/exhibition/NextRoom";
import { usePageMeta } from "@/hooks/use-exhibition";

const CuratorPage = () => {
  usePageMeta(
    "The Curator: about Fera | Fera's Studio",
    "About Fera (Peace Oluwaferanmi Segun-Babs), the UX/UI designer and front-end developer behind Fera's Studio.",
    "/curator",
  );
  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      <Curator />
      <NextRoom from="curator" />
    </main>
  );
};

export default CuratorPage;
