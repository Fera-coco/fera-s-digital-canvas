import { ExternalLink, Github, Folder } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
}

const projects: Project[] = [
  {
    title: "Gamerzverse",
    description:
      "A gaming-themed front-end website focused on layout structure, styling, and responsive design.",
    tech: ["HTML", "CSS", "Responsive Design"],
    github: "https://github.com/Fera-coco/LumenaXEstam300ComputerScience",
    live: "https://gamerzverse.vercel.app/",
  },
  {
    title: "SweetSips Landing Page",
    description:
      "A responsive landing page for a fictional beverage brand, emphasizing visual hierarchy, branding, and clean UI layout.",
    tech: ["HTML", "CSS", "UI/UX"],
    github: "https://github.com/Fera-coco/sweetsips-landing-page-project",
    live: "https://sweetsips-landing-page-project.vercel.app/",
  },
  {
    title: "UBA Clone",
    description:
      "A front-end clone of a banking interface demonstrating form structure, layout accuracy, and professional UI patterns.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Fera-coco/UbaClone",
    live: "https://uba-clone-iota.vercel.app/",
  },
  {
    title: "Read Smartly",
    description:
      "A learning-focused front-end application showcasing structured layouts and content presentation.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Fera-coco/read-smartly",
    live: "https://read-smartly.vercel.app/",
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-highlight transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
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
              <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-highlight bg-transparent px-3 py-1.5 font-mono text-xs text-highlight transition-all duration-200 hover:bg-highlight/10"
                >
                  <ExternalLink size={12} />
                  Live Demo
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all duration-200 hover:text-highlight hover:border-highlight/30"
                >
                  <Github size={12} />
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
