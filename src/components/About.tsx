const About = () => {
  return (
    <section id="about" className="relative py-32">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
            Who We Are
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            About <span className="text-gradient">Us</span>
          </h2>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12 shadow-elegant space-y-6 text-muted-foreground leading-relaxed">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            About <span className="text-gradient">Nexora Digital</span>
          </h3>

          <p>
            At <span className="text-foreground font-semibold">Nexora Digital</span>, we are more
            than a digital agency — we are your long-term partner in growth.
          </p>

          <p>
            We specialize in end-to-end digital solutions for small and growing businesses,
            spanning web development, mobile apps, branding, data analytics, and intelligent
            automation. Whatever stage your business is at, we have the expertise to take you
            further.
          </p>

          <p>
            What sets us apart is our commitment to intentionality. We never rely on generic
            templates or cookie-cutter strategies. Before a single design element is placed or a
            line of code is written, we take the time to understand your business, your audience,
            and your goals — because great digital solutions are never one-size-fits-all.
          </p>

          <p>
            With over <span className="text-foreground font-semibold">120 successful projects</span>{" "}
            delivered and a{" "}
            <span className="text-foreground font-semibold">98% client satisfaction rate</span>,
            our work speaks for itself. And with round-the-clock support, we remain by your side
            long after launch.
          </p>

          <p className="text-foreground font-semibold text-lg pt-2">
            Your growth is our benchmark.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
