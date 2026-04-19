import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/galaxy")({
  head: () => ({
    meta: [
      { title: "Cosmic Voyage — 3D Solar System & Galaxy Explorer" },
      { name: "description", content: "Explore an interactive 3D solar system and galaxy. Drift through stars, orbit planets, and discover the cosmos." },
      { property: "og:title", content: "Cosmic Voyage — 3D Solar System & Galaxy Explorer" },
      { property: "og:description", content: "Explore an interactive 3D solar system and galaxy with cool animations." },
    ],
  }),
  component: GalaxyPage,
});

type PlanetProps = {
  distance: number;
  size: number;
  color: string;
  speed: number;
  emissive?: string;
};

function Planet({ distance, size, color, speed, emissive }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={ref} position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive ?? color}
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
      {/* orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.01, distance + 0.01, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002;
  });
  return (
    <>
      <Sphere ref={ref} args={[1.2, 64, 64]}>
        <meshStandardMaterial
          color="#ffb347"
          emissive="#ff7a18"
          emissiveIntensity={1.5}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffd27a" distance={50} />
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={1} />
      <Sun />
      <Planet distance={2.5} size={0.18} color="#a9a9a9" speed={0.9} />
      <Planet distance={3.6} size={0.28} color="#e8b07a" speed={0.65} />
      <Planet distance={5} size={0.32} color="#3aa1ff" emissive="#1e90ff" speed={0.5} />
      <Planet distance={6.5} size={0.25} color="#c1440e" speed={0.4} />
      <Planet distance={8.5} size={0.7} color="#d4a373" speed={0.25} />
      <Planet distance={10.5} size={0.55} color="#e6d4a4" speed={0.18} />
      <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.3} minDistance={6} maxDistance={30} />
    </>
  );
}

function GalaxyPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Fixed 3D background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 6, 16], fov: 55 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Subtle vignette */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-20">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <Link to="/" className="text-sm tracking-[0.3em] uppercase text-white/80 hover:text-white transition">
            ← Back
          </Link>
          <span className="text-sm tracking-[0.3em] uppercase text-white/60">Cosmic Voyage</span>
        </nav>

        {/* Hero */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs md:text-sm tracking-[0.5em] uppercase text-cyan-300/90 mb-6 [text-shadow:0_0_12px_rgba(34,211,238,0.6)]">
            An interactive journey
          </p>
          <h1 className="font-serif text-5xl md:text-8xl font-light tracking-tight mb-8 text-white">
            The Solar System
            <span className="block mt-3 text-fuchsia-300 [text-shadow:0_0_18px_rgba(232,121,249,0.7)] italic font-normal">
              & Beyond
            </span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/75">
            Drift through orbits, watch worlds turn, and lose yourself in a sea of stars.
            Drag to rotate. Scroll to zoom.
          </p>
          <div className="mt-12 animate-bounce text-white/50 text-xs tracking-[0.3em] uppercase">Scroll ↓</div>
        </section>

        {/* Content sections */}
        <main className="max-w-3xl mx-auto px-6 pb-32 space-y-24">
          <article>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6 text-cyan-200 [text-shadow:0_0_14px_rgba(103,232,249,0.4)]">
              Our Solar Neighborhood
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Anchored by the Sun — a middle-aged G-type star burning hydrogen into helium for nearly 4.6 billion years —
              our solar system is a delicate choreography of eight planets, dozens of moons, and countless minor bodies.
              From scorched, airless Mercury to the icy plains of distant Neptune, each world tells a different chapter
              of a story that began in a collapsing cloud of gas and dust.
            </p>
          </article>

          <article>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6 text-fuchsia-200 [text-shadow:0_0_14px_rgba(240,171,252,0.4)]">
              Worlds in Motion
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Every planet you see drifting above moves under the same invisible law: gravity. Earth races around the Sun
              at roughly 30 kilometres per second, while Jupiter — the giant — takes nearly twelve Earth years to complete
              a single orbit. Saturn's rings, made of billions of icy fragments, are so wide they could span the distance
              from Earth to the Moon, yet so thin you could see straight through them edge-on.
            </p>
          </article>

          <article>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6 text-white">
              The Milky Way
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Zoom out far enough and our entire solar system becomes a single dim spark on one of the spiral arms of
              the Milky Way — a barred galaxy of more than 100 billion stars stretching 100,000 light-years across.
              It is one of perhaps two trillion galaxies in the observable universe. When you look up at the night sky,
              the faint band of light arching overhead is the combined glow of stars from our own galactic disk,
              seen edge-on from within.
            </p>
          </article>

          <article>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6 text-cyan-300 [text-shadow:0_0_14px_rgba(103,232,249,0.4)]">
              A Universe of Wonder
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Beyond the Milky Way lie galaxy clusters, supermassive black holes, nebulae birthing new stars, and the
              faint afterglow of the Big Bang itself — the cosmic microwave background — still drifting through space
              13.8 billion years later. Every atom in your body was forged in the heart of an ancient star. We are,
              quite literally, the universe contemplating itself.
            </p>
          </article>

          <div className="text-center pt-12">
            <Link
              to="/"
              className="inline-block px-8 py-4 rounded-full border border-white/30 hover:border-white/80 hover:bg-white/5 transition tracking-[0.25em] uppercase text-sm"
            >
              Return to Earth
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
