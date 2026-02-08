import { Lightbulb, Code, BookOpen } from "lucide-react";

const LearningSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">06. Growth</p>
        <h2 className="section-title">Learning & Growth</h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-surface border border-border hover:border-highlight/30 transition-all duration-300">
            <Code size={24} className="text-highlight mb-4" />
            <h3 className="text-sm font-semibold text-heading mb-2">
              Practice Projects
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Consistently building small to medium projects to reinforce
              HTML, CSS, and JavaScript fundamentals through hands-on practice.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border hover:border-highlight/30 transition-all duration-300">
            <BookOpen size={24} className="text-highlight mb-4" />
            <h3 className="text-sm font-semibold text-heading mb-2">
              Continuous Learning
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Actively learning through online courses, documentation, and
              developer communities. Currently deepening JavaScript knowledge.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border hover:border-highlight/30 transition-all duration-300">
            <Lightbulb size={24} className="text-highlight mb-4" />
            <h3 className="text-sm font-semibold text-heading mb-2">
              Learning in Public
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Sharing progress, documenting lessons learned, and contributing
              to open discussions about the front-end development journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
