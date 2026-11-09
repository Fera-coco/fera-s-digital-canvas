import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-exhibition";

const NotFound = () => {
  usePageMeta("Room not found | Fera's Studio", "This room isn't part of the exhibition.", "/");
  return (
    <main id="main" className="gallery-x flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label text-stone">Error 404 · Gallery closed</p>
      <h1 className="display mt-6 text-[clamp(3.5rem,11vw,9rem)]">
        This room is <em className="italic">empty.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/85">
        The page you're looking for isn't part of the exhibition, or it has been moved to another wall.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="btn-ink">
          Return to the entrance
        </Link>
        <Link to={{ pathname: "/", hash: "#collection" }} className="btn-line">
          See the collection
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
