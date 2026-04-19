import { Code2, Smartphone, Presentation, Target, Database, BarChart3, Layers, Palette } from "lucide-react";
import aiBrain from "@/assets/ai-brain.png";
import aiChip from "@/assets/ai-chip.png";

const services = [
  { icon: Code2, title: "Website Development", desc: "Pixel-perfect, blazing-fast websites built with modern frameworks." },
  { icon: Smartphone, title: "App Development", desc: "Native & cross-platform mobile apps your users will love." },
  { icon: Layers, title: "Web Application Development", desc: "Robust, scalable web apps with seamless UX and powerful backends." },
  { icon: Presentation, title: "PowerPoint Design", desc: "Investor-grade decks and presentations that close deals." },
  { icon: Target, title: "Lead Generation", desc: "Targeted campaigns that fill your pipeline with quality leads." },
  { icon: Palette, title: "Logo Generation", desc: "Distinctive, memorable logos that define your brand identity." },
  { icon: Database, title: "Data Management", desc: "Clean, structured, and secure data systems built to scale." },
  { icon: BarChart3, title: "Data Analytics", desc: "Turn raw data into clear insights and smart business decisions." },
];

const Services = () => {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <img
        src={aiBrain}
        alt=""
        loading="lazy"
        className="absolute -left-32 top-20 w-[500px] opacity-30 animate-float-slow pointer-events-none"
      />
      <img
        src={aiChip}
        alt=""
        loading="lazy"
        className="absolute -right-20 bottom-10 w-[380px] opacity-25 animate-float pointer-events-none"
      />

      <div className="container relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">What We Do</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Premium <span className="text-gradient">Digital Services</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to build, launch, and scale — powered by intelligent design and data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative p-8 rounded-3xl glass hover-lift overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-glow">
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
