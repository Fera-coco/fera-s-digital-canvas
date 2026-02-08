interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    role: "IT Intern – Front-End / Full Stack Development",
    company: "Tech Company",
    period: "Recent",
    description:
      "Gained hands-on experience building user interfaces and learning front-end and back-end fundamentals. Worked on real-world projects to strengthen development skills.",
  },
  {
    role: "SIWES Intern – Broadcast Engineering",
    company: "Radio Station",
    period: "Industrial Training",
    description:
      "Assisted with technical operations including equipment handling, generator management, and transmitter changeovers during live broadcast sessions.",
  },
  {
    role: "IT Support / Studio Assistant",
    company: "Radio Station",
    period: "Support Role",
    description:
      "Supported studio workflows, managed adverts playback, and assisted with live broadcast operations and technical troubleshooting.",
  },
  {
    role: "Student Information Officer",
    company: "University Admissions",
    period: "Administrative",
    description:
      "Managed admissions data, student records, and provided administrative support. Ensured accuracy and organization of critical student information.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">04. Experience</p>
        <h2 className="section-title">Where I've Worked</h2>

        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <div key={i} className="flex gap-6 group">
              {/* Timeline */}
              <div className="flex flex-col items-center pt-1.5">
                <div className="timeline-dot group-hover:bg-highlight transition-colors duration-300" />
                {i < experiences.length - 1 && (
                  <div className="timeline-line flex-1 min-h-[60px]" />
                )}
              </div>

              {/* Content */}
              <div className="pb-10">
                <div className="font-mono text-xs text-muted-foreground mb-1">
                  {exp.period}
                </div>
                <h3 className="text-base font-semibold text-heading mb-0.5">
                  {exp.role}
                </h3>
                <p className="text-highlight text-sm font-mono mb-2">
                  @ {exp.company}
                </p>
                <p className="text-foreground/70 text-sm leading-relaxed max-w-lg">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
