import Exit from "@/components/exhibition/Exit";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";

const ContactPage = () => {
  usePageMeta(PAGES.contact);
  return (
    <main id="main">
      <Exit />
    </main>
  );
};

export default ContactPage;
