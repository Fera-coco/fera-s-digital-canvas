import Exit from "@/components/exhibition/Exit";
import { usePageMeta } from "@/hooks/use-exhibition";

const ContactPage = () => {
  usePageMeta(
    "The Exit: contact | Fera's Studio",
    "Start a project with Fera's Studio. Email Fera about your website, product or idea.",
    "/contact",
  );
  return (
    <main id="main">
      <Exit />
    </main>
  );
};

export default ContactPage;
