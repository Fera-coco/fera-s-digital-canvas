import { Heart, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-5 mb-4">
          <a
            href="https://github.com/Fera-coco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-highlight transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/peace-segun-babs-961bbb365"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-highlight transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:ferrababs@gmail.com"
            className="text-muted-foreground hover:text-highlight transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
        <p className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          Built with
          <Heart size={12} className="text-highlight" />
          by Fera
        </p>
        <p className="font-mono text-xs text-muted-foreground/50 mt-1">
          © {new Date().getFullYear()} Peace Oluwaferanmi Segun-Babs
        </p>
      </div>
    </footer>
  );
};

export default Footer;
