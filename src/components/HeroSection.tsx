import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center section-padding pt-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <p
            className="font-mono text-sm text-highlight mb-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Hi, my name is
          </p>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Segun-Babs Peace
            <br />
            <span className="text-gradient">Oluwaferanmi.</span>
          </h1>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            I build things for the web.
          </h2>

          <p
            className="text-foreground/80 text-base md:text-lg max-w-xl mb-10 leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Front-End Developer with a background in{" "}
            <span className="text-highlight">Electrical Engineering</span> and a{" "}
            <span className="text-highlight">B.Sc. in Computer Science</span> (in view).
            I focus on building responsive, user-friendly interfaces and translating
            designs into functional web experiences.
          </p>

          <div
            className="flex flex-wrap gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-md border border-highlight bg-transparent px-6 py-3 font-mono text-sm text-highlight transition-all duration-200 hover:bg-highlight/10"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3 font-mono text-sm text-primary-foreground transition-all duration-200 hover:bg-highlight/90"
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div
          className="mt-20 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm font-mono hover:text-highlight transition-colors"
          >
            <ArrowDown size={16} className="animate-pulse-glow" />
            scroll down
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
