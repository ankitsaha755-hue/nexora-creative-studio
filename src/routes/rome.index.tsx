import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/rome/")({
  head: () => ({
    meta: [
      { title: "Ancient Rome Reconstructed — A 3D Walk Through Rome at Its Peak" },
      { name: "description", content: "Walk through a 3D reconstruction of Ancient Rome — the Forum, Colosseum, Palatine Hill and more, brought back to life." },
      { property: "og:title", content: "Ancient Rome Reconstructed — A 3D Walk Through Rome at Its Peak" },
      { property: "og:description", content: "Walk through a 3D reconstruction of Ancient Rome — the Forum, Colosseum, Palatine Hill and more." },
    ],
  }),
  component: RomeIntroPage,
});

function RomeIntroPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <video
        src="/ancient-rome-intro.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 text-white/80 hover:text-white text-xs tracking-[0.3em] uppercase backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full border border-white/15"
      >
        ← Back
      </Link>

      {/* Tour CTA — bottom right, transparent w/ light black shade */}
      <Link
        to="/rome/tour"
        className="absolute bottom-8 right-8 z-10 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white text-sm tracking-[0.18em] uppercase hover:bg-black/60 hover:border-white/50 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        Tour to Reconstructed Ancient Rome →
      </Link>
    </div>
  );
}
