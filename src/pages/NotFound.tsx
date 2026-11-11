import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-exhibition";
import type { PageMeta } from "@/content/seo";
import { t } from "@/lib/i18n";

const NOT_FOUND: PageMeta = {
  path: "/",
  title: "Room not found | Fera's Studio",
  description: "This room isn't part of the exhibition.",
  heading: "Room not found",
  noindex: true,
};

const NotFound = () => {
  usePageMeta(NOT_FOUND);
  return (
    <main id="main" className="gallery-x flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label text-stone">{t("Error 404 · Gallery closed")}</p>
      <h1 className="display mt-6 text-[clamp(3.5rem,11vw,9rem)]">
        {t("This room is")} <em className="italic">{t("empty.")}</em>
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/85">
        {t("The page you're looking for isn't part of the exhibition, or it has been moved to another wall.")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="btn-ink">
          {t("Return to the entrance")}
        </Link>
        <Link to="/collection" className="btn-line">
          {t("See the collection")}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
