import { ExternalLink, Github, Folder } from "lucide-react";

interface Project {
  title: string;
  description: string;
  details: string;
  tech: string[];
  github: string;
  live: string;
}

const projects: Project[] = [
  {
    title: "Responsive Portfolio Website",
    description:
      "A clean, mobile-first personal portfolio built with semantic HTML and modern CSS techniques.",
    details:
      "Implemented a fully responsive layout using CSS Grid and Flexbox. Focused on accessibility, performance, and a strong visual hierarchy across all screen sizes.",
    tech: ["HTML", "CSS", "Responsive Design"],
    github: "#",
    live: "#",
  },
  {
    title: "Product Landing Page",
    description:
      "A modern landing page designed for a fictional product with clear CTAs and engaging sections.",
    details:
      "Used CSS custom properties for consistent theming and media queries for responsive breakpoints. Emphasized clean typography and whitespace for readability.",
    tech: ["HTML", "CSS", "Figma"],
    github: "#",
    live: "#",
  },
  {
    title: "Interactive Dashboard UI",
    description:
      "A dashboard interface mockup with cards, charts placeholder, and responsive sidebar navigation.",
    details:
      "Built with a mobile-first approach using Flexbox for the sidebar layout and Grid for the card system. Added hover states and subtle transitions for interactivity.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "#",
    live: "#",
  },
  {
    title: "Survey Form Application",
    description:
      "An accessible survey form with validation styling and clean input designs.",
    details:
      "Focused on form UX best practices including proper label associations, focus states, and clear error/success indicators. Fully responsive across devices.",
    tech: ["HTML", "CSS", "UI/UX"],
    github: "#",
    live: "#",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">03. Projects</p>
        <h2 className="section-title">Things I've Built</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="project-card opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Folder size={28} className="text-highlight" />
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    className="text-muted-foreground hover:text-highlight transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.live}
                    className="text-muted-foreground hover:text-highlight transition-colors"
                    aria-label="Live preview"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-heading mb-2">
                {project.title}
              </h3>
              <p className="text-foreground/70 text-sm mb-3 leading-relaxed">
                {project.description}
              </p>
              <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                {project.details}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
