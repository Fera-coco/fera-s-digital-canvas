import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
    <section id="education" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">05. Education</p>
        <h2 className="section-title">Academic Background</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-surface border border-border group hover:border-highlight/30 transition-all duration-300">
            <GraduationCap size={24} className="text-highlight mb-4" />
            <h3 className="text-base font-semibold text-heading mb-1">
              B.Sc. Computer Science
            </h3>
            <p className="font-mono text-xs text-highlight mb-3">In View</p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Currently pursuing a Bachelor's degree in Computer Science,
              deepening knowledge in software development, algorithms, and
              front-end engineering.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border group hover:border-highlight/30 transition-all duration-300">
            <GraduationCap size={24} className="text-highlight mb-4" />
            <h3 className="text-base font-semibold text-heading mb-1">
              Diploma in Electrical Engineering
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-3">
              Completed
            </p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Built a strong foundation in engineering principles, technical
              problem-solving, and analytical thinking that translates well into
              software development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
