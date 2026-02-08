import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          Built with
          <Heart size={12} className="text-highlight" />
          by Fera
        </p>
        <p className="font-mono text-xs text-muted-foreground/50 mt-1">
          © {new Date().getFullYear()} Segun-Babs Peace Oluwaferanmi
        </p>
      </div>
    </footer>
  );
};

export default Footer;
