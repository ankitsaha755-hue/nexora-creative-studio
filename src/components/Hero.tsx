import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/media/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      <div className="container relative z-10 text-center px-4 animate-fade-up">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            End-to-End Digital Solutions
          </span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-[0.95]">
          <span className="block text-foreground">NEXORA</span>
          <span className="block text-gradient">DIGITAL</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-xl text-muted-foreground mb-10 leading-relaxed">
          We craft <span className="text-primary font-semibold">premium websites</span>, intelligent apps,
          stunning presentations, and data-driven systems that turn ambitious ideas into measurable results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#order" className="btn-hero group">
            Start Your Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#portfolio" className="btn-ghost-glow">
            View Portfolio
          </a>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { n: "120+", l: "Projects" },
            { n: "98%", l: "Satisfaction" },
            { n: "24/7", l: "Support" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-primary/60 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-float" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
