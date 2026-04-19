import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/galaxy")({
  head: () => ({
    meta: [
      { title: "Cosmic Voyage — A 3D Tour of the Solar System" },
      { name: "description", content: "Take a cinematic 3D tour of the Solar System. Explore each planet with interactive models, facts, and a stunning galactic backdrop." },
      { property: "og:title", content: "Cosmic Voyage — A 3D Tour of the Solar System" },
      { property: "og:description", content: "Take a cinematic 3D tour of the Solar System with interactive planets and stars." },
    ],
  }),
  component: GalaxyPage,
});

// ---------- 3D Planet ----------
type PlanetMeshProps = {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  hasRing?: boolean;
  ringColor?: string;
};

function PlanetMesh({ color, emissive, emissiveIntensity = 0.15, hasRing, ringColor = "#d4c8a0" }: PlanetMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.004;
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.6} color="#fff6e0" />
      <pointLight position={[-5, -2, -5]} intensity={0.4} color="#88aaff" />
      <Stars radius={80} depth={40} count={2500} factor={3} saturation={0} fade speed={0.6} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive ?? "#000000"}
          emissiveIntensity={emissiveIntensity}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      {hasRing && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[2.0, 3.0, 128]} />
          <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.55} />
        </mesh>
      )}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

// ---------- Hero starfield (background only, no planets) ----------
function HeroStars() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

// ---------- Reveal-on-scroll wrapper ----------
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1400ms] ease-out ${
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ---------- Planet data ----------
type PlanetInfo = {
  name: string;
  tagline: string;
  description: string;
  facts: { label: string; value: string }[];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  hasRing?: boolean;
  ringColor?: string;
};

const PLANETS: PlanetInfo[] = [
  {
    name: "Mercury",
    tagline: "The Swift Messenger",
    description:
      "Closest to the Sun and the smallest planet in our system, Mercury is a scorched, cratered world with almost no atmosphere. A single day on Mercury lasts longer than its year, and its surface swings between blistering heat and freezing cold.",
    facts: [
      { label: "Diameter", value: "4,879 km" },
      { label: "Distance from Sun", value: "57.9 million km" },
      { label: "Year length", value: "88 Earth days" },
      { label: "Moons", value: "0" },
    ],
    color: "#9a8f86",
    emissive: "#3a302a",
  },
  {
    name: "Venus",
    tagline: "The Veiled Twin",
    description:
      "Wrapped in thick clouds of sulfuric acid, Venus is the hottest planet in the Solar System. Its dense atmosphere traps heat in a runaway greenhouse effect, making its surface hot enough to melt lead.",
    facts: [
      { label: "Diameter", value: "12,104 km" },
      { label: "Surface temp", value: "465°C" },
      { label: "Year length", value: "225 Earth days" },
      { label: "Moons", value: "0" },
    ],
    color: "#e8b07a",
    emissive: "#5a3a1a",
  },
  {
    name: "Earth",
    tagline: "The Pale Blue Dot",
    description:
      "Our home — the only known world to harbour life. A delicate balance of water, atmosphere, and magnetic protection makes Earth a thriving sanctuary in the cold vastness of space.",
    facts: [
      { label: "Diameter", value: "12,742 km" },
      { label: "Distance from Sun", value: "149.6 million km" },
      { label: "Year length", value: "365.25 days" },
      { label: "Moons", value: "1" },
    ],
    color: "#3aa1ff",
    emissive: "#0a3a7a",
    emissiveIntensity: 0.25,
  },
  {
    name: "Mars",
    tagline: "The Red Frontier",
    description:
      "A cold desert world with rust-coloured plains, towering volcanoes, and the deepest canyons in the Solar System. Mars holds clues to our past — and may hold the future of human exploration beyond Earth.",
    facts: [
      { label: "Diameter", value: "6,779 km" },
      { label: "Surface temp", value: "−63°C avg" },
      { label: "Year length", value: "687 Earth days" },
      { label: "Moons", value: "2 (Phobos, Deimos)" },
    ],
    color: "#c1440e",
    emissive: "#3a1004",
  },
  {
    name: "Jupiter",
    tagline: "The King of Planets",
    description:
      "A colossal ball of gas more than twice as massive as all other planets combined. Jupiter's swirling storms — including the centuries-old Great Red Spot — could swallow Earth whole.",
    facts: [
      { label: "Diameter", value: "139,820 km" },
      { label: "Year length", value: "11.9 Earth years" },
      { label: "Moons", value: "95+" },
      { label: "Famous storm", value: "Great Red Spot" },
    ],
    color: "#d4a373",
    emissive: "#3a2a14",
  },
  {
    name: "Saturn",
    tagline: "The Jewel of the System",
    description:
      "Famous for its breathtaking ring system — billions of icy fragments stretching wider than the Earth-Moon distance, yet only meters thick. A gas giant of pale gold and astonishing beauty.",
    facts: [
      { label: "Diameter", value: "116,460 km" },
      { label: "Year length", value: "29.5 Earth years" },
      { label: "Moons", value: "146+" },
      { label: "Ring width", value: "~282,000 km" },
    ],
    color: "#e6d4a4",
    emissive: "#3a2e10",
    hasRing: true,
    ringColor: "#e8d8a8",
  },
  {
    name: "Uranus",
    tagline: "The Sideways Giant",
    description:
      "An ice giant tipped on its side, rolling around the Sun like a barrel. Its pale cyan glow comes from methane in the upper atmosphere, which absorbs red light and reflects blue.",
    facts: [
      { label: "Diameter", value: "50,724 km" },
      { label: "Year length", value: "84 Earth years" },
      { label: "Moons", value: "27" },
      { label: "Tilt", value: "97.8°" },
    ],
    color: "#9fdcdc",
    emissive: "#0e3a3a",
    emissiveIntensity: 0.25,
  },
  {
    name: "Neptune",
    tagline: "The Distant Storm",
    description:
      "The farthest planet from the Sun — a deep blue world of supersonic winds and swirling storms. Neptune was the first planet predicted by mathematics before it was ever observed.",
    facts: [
      { label: "Diameter", value: "49,244 km" },
      { label: "Year length", value: "165 Earth years" },
      { label: "Moons", value: "14 (incl. Triton)" },
      { label: "Wind speed", value: "up to 2,100 km/h" },
    ],
    color: "#3b6cf2",
    emissive: "#0a1a5a",
    emissiveIntensity: 0.3,
  },
];

// ---------- Page ----------
function GalaxyPage() {
  const tourRef = useRef<HTMLDivElement>(null);
  const [outroVisible, setOutroVisible] = useState(false);
  const outroRef = useRef<HTMLDivElement>(null);
  const outroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = outroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setOutroVisible(true);
            outroVideoRef.current?.play().catch(() => {});
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToTour = () => {
    tourRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans">
      {/* Subtle starfield behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <HeroStars />
          </Suspense>
        </Canvas>
      </div>

      {/* Top nav */}
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-16 py-6">
        <Link to="/" className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/70 hover:text-white transition">
          ← Back
        </Link>
        <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/50">Cosmic Voyage</span>
      </nav>

      {/* ===== HERO: Full-width video left | Text right ===== */}
      <section className="relative z-20 min-h-[calc(100vh-80px)] w-full pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-160px)]">
          {/* Video panel — stretches to left edge */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-screen lg:w-full max-w-none aspect-video overflow-hidden bg-black">
              <video
                src="/solar-hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Edge fade so video blends into black bg */}
              <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_140px_60px_rgba(0,0,0,0.98)]" />
            </div>
          </div>

          {/* Text panel */}
          <div className="lg:col-span-5 text-left px-6 md:px-12 lg:pr-20">
            <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-cyan-300/90 mb-5">
              An interactive journey
            </p>
            <h1 className="font-serif text-4xl md:text-6xl xl:text-7xl font-light leading-[1.05] tracking-tight mb-6">
              The <span className="italic text-white/90">Solar</span>
              <br />
              System
              <span className="block mt-2 text-fuchsia-300/90 italic font-normal">& Beyond</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mb-10">
              A cinematic voyage through the worlds that orbit our Sun. Eight planets,
              countless moons, billions of stars — and one fragile blue world we call home.
            </p>
            <button
              onClick={scrollToTour}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium tracking-[0.2em] uppercase text-xs md:text-sm hover:bg-fuchsia-200 transition-all duration-500 shadow-[0_0_40px_rgba(232,121,249,0.25)]"
            >
              Take a Tour
              <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Divider into the tour */}
      <div ref={tourRef} className="relative z-20 h-32" />

      {/* ===== TOUR: One planet per section ===== */}
      <main className="relative z-20">
        {PLANETS.map((planet, i) => (
          <section
            key={planet.name}
            className="min-h-screen w-full px-6 md:px-12 lg:px-20 py-24 flex items-center"
          >
            <div className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}>
              {/* 3D Planet */}
              <Reveal>
                <div className="w-full aspect-square max-w-[520px] mx-auto">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                      <PlanetMesh
                        color={planet.color}
                        emissive={planet.emissive}
                        emissiveIntensity={planet.emissiveIntensity}
                        hasRing={planet.hasRing}
                        ringColor={planet.ringColor}
                      />
                    </Suspense>
                  </Canvas>
                </div>
              </Reveal>

              {/* Text */}
              <Reveal>
                <div className="text-left">
                  <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/40 mb-4">
                    Planet 0{i + 1} / 08
                  </p>
                  <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-3">
                    {planet.name}
                  </h2>
                  <p className="text-cyan-300/80 italic text-lg md:text-xl mb-8">{planet.tagline}</p>
                  <p className="text-white/75 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                    {planet.description}
                  </p>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-5 max-w-lg">
                    {planet.facts.map((f) => (
                      <div key={f.label} className="border-l border-white/15 pl-4">
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">
                          {f.label}
                        </dt>
                        <dd className="text-white/90 text-sm md:text-base">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </section>
        ))}

        {/* ===== OUTRO: Sun video with fade in ===== */}
        <section
          ref={outroRef}
          className="relative min-h-screen w-full flex flex-col items-center justify-center py-24"
        >
          <div
            className={`relative w-screen aspect-video overflow-hidden bg-black transition-opacity duration-[2500ms] ease-out ${
              outroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              ref={outroVideoRef}
              src="/sun-outro.mp4"
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_180px_70px_rgba(0,0,0,0.98)]" />
          </div>

          <div
            className={`mt-14 text-center px-6 transition-all duration-[2500ms] delay-500 ease-out ${
              outroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-4">
              Thank you for taking the tour
            </h2>
            <p className="text-white/70 text-lg md:text-xl italic">
              … and staying with us.
            </p>
            <Link
              to="/"
              className="inline-block mt-12 px-8 py-4 rounded-full border border-white/30 hover:border-white/80 hover:bg-white/5 transition tracking-[0.25em] uppercase text-xs"
            >
              Return to Earth
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
