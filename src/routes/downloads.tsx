import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ArrowLeft } from "lucide-react";
import aiSphere from "@/assets/ai-sphere.png";
import aiRobot from "@/assets/ai-robot.png";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Business Toolkit Downloads — Xora" },
      { name: "description", content: "Download our suite of business productivity tools: Nexus Pro, Financial Tracker, and Inventory System." },
      { property: "og:title", content: "Business Toolkit Downloads — Xora" },
      { property: "og:description", content: "A curated suite of business tools available for instant download." },
    ],
  }),
  component: DownloadsPage,
});

const files = [
  {
    n: 1,
    title: "Nexus Pro",
    desc: "An all-in-one premium suite for retail insights, mockups, and demos.",
    href: "/downloads/Nexus_Pro.zip",
    color: "from-cyan-500/30 to-violet-600/30",
  },
  {
    n: 2,
    title: "Financial Tracker",
    desc: "Track expenses, revenue, and budgets with a polished spreadsheet system.",
    href: "/downloads/Financial_Tracker.zip",
    color: "from-emerald-500/30 to-teal-600/30",
  },
  {
    n: 3,
    title: "Inventory System",
    desc: "A complete inventory management toolkit for stock, orders, and reporting.",
    href: "/downloads/Inventory_System.zip",
    color: "from-amber-500/30 to-rose-600/30",
  },
];

function DownloadsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-32">
      <img src={aiSphere} alt="" loading="lazy" className="absolute right-10 top-32 w-72 opacity-30 animate-spin-slow pointer-events-none" />
      <img src={aiRobot} alt="" loading="lazy" className="absolute left-0 bottom-10 w-80 opacity-30 animate-float pointer-events-none" />

      <div className="container relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Resource Library</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Business <span className="text-gradient">Toolkit</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            A curated collection of productivity systems. Download and start using them right away.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {files.map((f) => (
            <div key={f.title} className="group relative rounded-3xl overflow-hidden glass hover-lift">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
              <div className="absolute inset-0 grid-pattern opacity-20" />

              <div className="relative z-10 p-6 md:p-8 flex items-center gap-6">
                <span className="font-display text-5xl md:text-6xl font-black text-foreground/20 group-hover:text-foreground/40 transition-colors w-16 shrink-0">
                  0{f.n}
                </span>

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">{f.title}</h2>
                  <p className="text-foreground/80 text-sm md:text-base">{f.desc}</p>
                </div>

                <a
                  href={f.href}
                  download
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition-transform shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
