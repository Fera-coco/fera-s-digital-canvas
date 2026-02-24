import profilePhoto from "@/assets/profile-photo.jpeg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">01. About</p>
        <h2 className="section-title">About Me</h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-4 text-foreground/80 leading-relaxed">
            <p>
              Hello! I'm <span className="text-highlight font-medium">Fera</span>, a front-end developer
              passionate about creating clean, responsive, and user-friendly web interfaces.
              I enjoy translating design concepts into functional, well-structured code.
            </p>
            <p>
              With a background in Electrical Engineering and currently pursuing a B.Sc. in
              Computer Science, I bring a unique problem-solving approach to my work. I'm a
              continuous learner who thrives on building practical projects and improving with
              every line of code.
            </p>
            <p>
              My journey into web development has been hands-on — from building responsive
              layouts to understanding how great user experiences are crafted. I focus on writing
              clean, maintainable code and staying up-to-date with modern front-end practices.
            </p>
          </div>

          <div className="flex items-start justify-center md:justify-end">
            <div className="relative group">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg border-2 border-highlight/30 overflow-hidden bg-surface transition-all duration-300 group-hover:border-highlight/60">
                <img src={profilePhoto} alt="Peace Oluwaferanmi Segun-Babs" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -inset-1 rounded-lg border border-highlight/20 -z-10 translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
