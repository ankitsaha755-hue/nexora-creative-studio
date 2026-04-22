import { Link } from "@tanstack/react-router";
import aiSphere from "@/assets/ai-sphere.png";
import aiRobot from "@/assets/ai-robot.png";

const projects = [
  { tag: "Web", title: "Cosmic Voyage", desc: "Interactive 3D solar system & galaxy explorer.", color: "from-cyan-500/30 to-blue-600/30", href: "/galaxy" },
  { tag: "Web", title: "Ancient Rome Reconstructed", desc: "Walk through a 3D model of Rome at its peak — the Forum, Colosseum & more.", color: "from-amber-500/30 to-orange-700/30", href: "/rome" },
  { tag: "PowerPoint Design", title: "The $10 Trillion Problem", desc: "A deep dive into the global cost of cybercrime and actionable steps businesses can take right now.", color: "from-fuchsia-500/30 to-rose-600/30", href: "/dollar10-Trillion.pptx", external: true },
  { tag: "Data Managemant and Analytics", title: "Business Toolkit Suite", desc: "A curated bundle of productivity systems — ready to download.", color: "from-cyan-400/30 to-violet-600/30", href: "/downloads" },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      <img src={aiSphere} alt="" loading="lazy" className="absolute right-10 top-32 w-72 opacity-30 animate-spin-slow pointer-events-none" />
      <img src={aiRobot} alt="" loading="lazy" className="absolute left-0 bottom-10 w-80 opacity-30 animate-float pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Selected Work</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Our <span className="text-gradient">Portfolio</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A glimpse into projects where strategy, design, and data come together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => {
            const inner = (
              <div className="group relative h-80 rounded-3xl overflow-hidden glass hover-lift cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 grid-pattern opacity-20" />

                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest text-primary">
                      {p.tag}
                    </span>
                    <span className="font-display text-5xl font-black text-foreground/10 group-hover:text-foreground/30 transition-colors">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="font-display text-3xl font-bold mb-2">{p.title}</h3>
                    <p className="text-foreground/80">{p.desc}</p>
                  </div>
                </div>
              </div>
            );

            return "href" in p && p.href ? (
              "external" in p && p.external ? (
                <a key={p.title} href={p.href} download className="block">
                  {inner}
                </a>
              ) : (
                <Link key={p.title} to={p.href} className="block">
                  {inner}
                </Link>
              )
            ) : (
              <div key={p.title}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
