import { useState, type FormEvent } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:peacesegunbabs@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`;
    window.open(mailtoLink, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <p className="section-label">07. Contact</p>
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-foreground/70 text-sm leading-relaxed mb-10">
            I'm currently looking for internship and junior front-end developer
            opportunities. Whether you have a question or just want to say hi,
            feel free to reach out!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="name" className="block font-mono text-xs text-muted-foreground mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-mono text-xs text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-mono text-xs text-muted-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3 font-mono text-sm text-primary-foreground transition-all duration-200 hover:bg-highlight/90 w-full justify-center"
            >
              <Send size={16} />
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 mt-10">
            <a
              href="https://github.com/Fera-coco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-highlight transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/peace-segun-babs-961bbb365"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-highlight transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:ferrababs@gmail.com"
              className="text-muted-foreground hover:text-highlight transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
