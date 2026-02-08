const skills = [
  "HTML & CSS",
  "Responsive Web Design",
  "Front-End Fundamentals",
  "Basic JavaScript",
  "UI/UX Principles",
  "Figma",
  "Wireframing & Prototyping",
  "Git & GitHub",
  "Problem Solving",
  "Continuous Learning",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">02. Skills</p>
        <h2 className="section-title">Technologies & Tools</h2>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span
              key={skill}
              className="skill-tag opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg bg-surface border border-border">
            <div className="font-mono text-highlight text-sm mb-2">{"// "} Front-End</div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Building responsive layouts with HTML & CSS, learning JavaScript for
              interactive user interfaces and dynamic web pages.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-surface border border-border">
            <div className="font-mono text-highlight text-sm mb-2">{"// "} Design</div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Wireframing and prototyping in Figma, applying UI/UX principles to
              create intuitive and visually appealing designs.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-surface border border-border">
            <div className="font-mono text-highlight text-sm mb-2">{"// "} Workflow</div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Version control with Git & GitHub, responsive-first development
              approach, and collaborative project workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
