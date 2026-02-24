import profilePhoto from "@/assets/profile-photo.jpeg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">01. About</p>
        <h2 className="section-title">About Me</h2>

        <div className="relative min-h-[400px]">
          {/* Full-height background image on the right */}
          {/* <div className="absolute right-0 top-0 bottom-[10] w-[45%] rounded-lg overflow-hidden"> */}
          <div className="absolute left-[50%] right-[0%] top-[-20%] bottom-[-30%] w-[50%] rounded-lg overflow-hidden">
            <img
              src={profilePhoto}
              alt="Peace Oluwaferanmi Segun-Babs"
              className="w-full h-full object-cover object-top"
            />
            {/* Blur overlay on the left side where text overlaps */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
          </div>

          {/* Text content overlapping the image */}
          <div className="relative z-10 w-[65%] space-y-4 text-foreground/80 leading-relaxed py-6">
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
              My journey into web development has been hands-on, from building responsive
              layouts to understanding how great user experiences are crafted. I focus on writing
              clean, maintainable code and staying up-to-date with modern front-end practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
