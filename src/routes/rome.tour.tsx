import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PointerLockControls, Sky, Stars, Cloud, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/rome/tour")({
  head: () => ({
    meta: [
      { title: "Tour Ancient Rome — 3D Reconstruction of the Eternal City" },
      { name: "description", content: "Explore a 3D reconstruction of Ancient Rome's Forum, Colosseum and Palatine Hill with day/night atmosphere and historical story cards." },
      { property: "og:title", content: "Tour Ancient Rome — 3D Reconstruction of the Eternal City" },
      { property: "og:description", content: "Explore a 3D reconstruction of Ancient Rome's Forum, Colosseum and Palatine Hill." },
    ],
  }),
  component: RomeTourPage,
});

// ---------- Monuments ----------
type Monument = {
  id: string;
  name: string;
  position: [number, number, number];
  story: string;
  color: string;
  built: number;   // year built (negative = BC)
  fell: number;    // year ruined / abandoned
};

const MONUMENTS: Monument[] = [
  {
    id: "colosseum",
    name: "The Colosseum",
    position: [8, 0, -4],
    story: "Inaugurated 80 AD by Emperor Titus. 50,000 spectators roared as gladiators fought beneath the Roman sun.",
    color: "#d6c2a4",
    built: 80,
    fell: 600,
  },
  {
    id: "forum",
    name: "Roman Forum",
    position: [0, 0, 0],
    story: "The beating heart of the Republic. On this spot in 44 BC, Julius Caesar was assassinated at the foot of Pompey's statue.",
    color: "#e8d8b8",
    built: -500,
    fell: 500,
  },
  {
    id: "palatine",
    name: "Palatine Hill",
    position: [-8, 0, 2],
    story: "Where Romulus founded Rome in 753 BC. Later home to emperors — the word 'palace' comes from this hill.",
    color: "#c9b48a",
    built: -500,
    fell: 550,
  },
  {
    id: "pantheon",
    name: "The Pantheon",
    position: [-4, 0, -7],
    story: "Rebuilt by Hadrian around 126 AD. Its concrete dome remains the world's largest unreinforced dome — 1,900 years on.",
    color: "#cfb98f",
    built: 126,
    fell: 600,
  },
  {
    id: "circus",
    name: "Circus Maximus",
    position: [5, 0, 6],
    story: "250,000 Romans packed in to bet on chariot races. The track stretched longer than five football fields.",
    color: "#b89a72",
    built: -329,
    fell: 549,
  },
];

// Fade-in over 40 years from build, fade-out over 80 years after fall
function eraOpacity(year: number, m: Monument): number {
  if (year < m.built - 40) return 0;
  if (year < m.built) return (year - (m.built - 40)) / 40;
  if (year <= m.fell) return 1;
  if (year <= m.fell + 80) return 1 - (year - m.fell) / 80;
  return 0;
}

// ---------- 3D Buildings ----------
type BuildingProps = { position: [number, number, number]; color: string; opacity: number; onClick: () => void };

function FadeGroup({ opacity, children, position, onClick }: { opacity: number; children: React.ReactNode; position: [number, number, number]; onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.visible = opacity > 0.01;
    ref.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = opacity;
        mat.depthWrite = opacity > 0.95;
      }
    });
  });
  return <group ref={ref} position={position} onClick={onClick}>{children}</group>;
}

function Colosseum({ position, color, opacity, onClick }: BuildingProps) {
  return (
    <FadeGroup position={position} opacity={opacity} onClick={onClick}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.4, 3.2, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <torusGeometry args={[2.2, 0.15, 16, 48]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
        <meshStandardMaterial color="#8a7556" roughness={1} />
      </mesh>
    </FadeGroup>
  );
}

function Pantheon({ position, color, opacity, onClick }: BuildingProps) {
  return (
    <FadeGroup position={position} opacity={opacity} onClick={onClick}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 2, 32]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {[-1, -0.5, 0, 0.5, 1].map((x) => (
        <mesh key={x} position={[x, 1.2, 1.7]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.4, 12]} />
          <meshStandardMaterial color="#efe5cf" roughness={0.7} />
        </mesh>
      ))}
    </FadeGroup>
  );
}

function Forum({ position, color, opacity, onClick }: BuildingProps) {
  return (
    <FadeGroup position={position} opacity={opacity} onClick={onClick}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[3, 0.4, 2]} />
        <meshStandardMaterial color="#a89270" roughness={0.95} />
      </mesh>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x) =>
        [-0.7, 0.7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.4, z]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 2, 12]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        ))
      )}
      <mesh position={[0, 2.7, 0]} castShadow>
        <boxGeometry args={[3.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#b89a72" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.05, 0]} castShadow>
        <coneGeometry args={[1.2, 0.5, 4]} />
        <meshStandardMaterial color="#b89a72" roughness={0.8} />
      </mesh>
    </FadeGroup>
  );
}

function Palatine({ position, color, opacity, onClick }: BuildingProps) {
  return (
    <FadeGroup position={position} opacity={opacity} onClick={onClick}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3.5, 1.2, 2.5]} />
        <meshStandardMaterial color="#7d6444" roughness={1} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[2.8, 0.8, 2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 2.4, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1.6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </FadeGroup>
  );
}

function CircusMaximus({ position, color, opacity, onClick }: BuildingProps) {
  return (
    <FadeGroup position={position} opacity={opacity} onClick={onClick}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.6, 32]} />
        <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3, 0.2, 0.3]} />
        <meshStandardMaterial color="#8a7556" roughness={1} />
      </mesh>
    </FadeGroup>
  );
}

function Ground() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#a08862" roughness={1} />
    </mesh>
  );
}

function FlickeringTorch({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(clock.elapsedTime * 8) * 0.3 + Math.random() * 0.2;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#3a2410" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffaa44" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.5, 0]} color="#ff8833" intensity={1.4} distance={6} />
    </group>
  );
}

// ---------- Roman Pedestrians ----------
const TOGA_COLORS = ["#f5f0e1", "#ede4cf", "#e8dcc0", "#d9c9a3", "#c9b48a", "#b8a07a", "#a8895f"];

type Pedestrian = {
  from: number;       // monument index
  to: number;
  speed: number;      // units per second
  progress: number;
  togaColor: string;
  skinColor: string;
  height: number;
  phase: number;      // walk cycle phase
};

function makePedestrian(): Pedestrian {
  const from = Math.floor(Math.random() * MONUMENTS.length);
  let to = Math.floor(Math.random() * MONUMENTS.length);
  while (to === from) to = Math.floor(Math.random() * MONUMENTS.length);
  return {
    from,
    to,
    speed: 0.5 + Math.random() * 0.6,
    progress: Math.random(),
    togaColor: TOGA_COLORS[Math.floor(Math.random() * TOGA_COLORS.length)],
    skinColor: Math.random() > 0.5 ? "#d4a373" : "#c08552",
    height: 0.9 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
  };
}

function RomanFigure({ togaColor, skinColor, height, walkPhase }: { togaColor: string; skinColor: string; height: number; walkPhase: number }) {
  const swing = Math.sin(walkPhase) * 0.15;
  const bob = Math.abs(Math.sin(walkPhase * 2)) * 0.04;
  return (
    <group position={[0, bob, 0]}>
      {/* Toga body — tapered cone */}
      <mesh position={[0, height * 0.45, 0]} castShadow>
        <coneGeometry args={[0.18 * height, height * 0.9, 8]} />
        <meshStandardMaterial color={togaColor} roughness={0.95} />
      </mesh>
      {/* Shoulder/upper toga drape */}
      <mesh position={[0.04, height * 0.78, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.32, 0.15, 0.18]} />
        <meshStandardMaterial color={togaColor} roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, height * 1.02, 0]} castShadow>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, height * 1.06, -0.015]} castShadow>
        <sphereGeometry args={[0.088, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#2a1a0e" roughness={1} />
      </mesh>
      {/* Arms swinging */}
      <mesh position={[0.18, height * 0.65, swing * 0.3]} rotation={[swing, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.42, 6]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.18, height * 0.65, -swing * 0.3]} rotation={[-swing, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.42, 6]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Crowd({ count = 22 }: { count?: number }) {
  const pedsRef = useRef<Pedestrian[]>([]);
  const groupsRef = useRef<(THREE.Group | null)[]>([]);

  if (pedsRef.current.length === 0) {
    pedsRef.current = Array.from({ length: count }, () => makePedestrian());
  }

  useFrame((_, delta) => {
    const peds = pedsRef.current;
    for (let i = 0; i < peds.length; i++) {
      const p = peds[i];
      p.progress += (p.speed * delta) / 18; // travel time scales with distance
      p.phase += delta * p.speed * 6;

      if (p.progress >= 1) {
        // arrived — pick a new destination
        p.from = p.to;
        let next = Math.floor(Math.random() * MONUMENTS.length);
        while (next === p.from) next = Math.floor(Math.random() * MONUMENTS.length);
        p.to = next;
        p.progress = 0;
      }

      const a = MONUMENTS[p.from].position;
      const b = MONUMENTS[p.to].position;
      // Curve slightly outside the building radius using offset perpendicular
      const dx = b[0] - a[0];
      const dz = b[2] - a[2];
      const len = Math.hypot(dx, dz) || 1;
      const px = -dz / len;
      const pz = dx / len;
      const sway = Math.sin(p.progress * Math.PI) * 1.5;
      const x = a[0] + dx * p.progress + px * sway + Math.sin(p.phase * 0.5) * 0.05;
      const z = a[2] + dz * p.progress + pz * sway + Math.cos(p.phase * 0.5) * 0.05;

      const g = groupsRef.current[i];
      if (g) {
        g.position.set(x, 0, z);
        // Face direction of travel
        const yaw = Math.atan2(dx, dz);
        g.rotation.y = yaw;
      }
    }
  });

  return (
    <>
      {pedsRef.current.map((p, i) => (
        <group key={i} ref={(el) => { groupsRef.current[i] = el; }}>
          <RomanFigure togaColor={p.togaColor} skinColor={p.skinColor} height={p.height} walkPhase={p.phase} />
        </group>
      ))}
    </>
  );
}


  const { camera } = useThree();
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, 1.7, 6);
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "a" || k === "s" || k === "d") (keys.current as any)[k] = true;
      if (e.key === "Shift") keys.current.shift = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "a" || k === "s" || k === "d") (keys.current as any)[k] = false;
      if (e.key === "Shift") keys.current.shift = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const speed = (keys.current.shift ? 12 : 5) * delta;
    direction.current.set(0, 0, 0);
    if (keys.current.w) direction.current.z -= 1;
    if (keys.current.s) direction.current.z += 1;
    if (keys.current.a) direction.current.x -= 1;
    if (keys.current.d) direction.current.x += 1;
    direction.current.normalize();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    velocity.current.set(0, 0, 0);
    velocity.current.addScaledVector(forward, -direction.current.z * speed);
    velocity.current.addScaledVector(right, direction.current.x * speed);

    camera.position.add(velocity.current);
    camera.position.y = 1.7;
  });

  return <PointerLockControls />;
}

function CameraFlyer({ target, onArrive }: { target: [number, number, number] | null; onArrive: () => void }) {
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3 | null>(null);
  const lookAt = useRef<THREE.Vector3>(new THREE.Vector3());

  useEffect(() => {
    if (target) {
      // Position camera offset from monument for a nice angle
      targetPos.current = new THREE.Vector3(target[0] + 6, 6, target[2] + 6);
      lookAt.current.set(target[0], 1.5, target[2]);
    }
  }, [target]);

  useFrame(() => {
    if (!targetPos.current) return;
    camera.position.lerp(targetPos.current, 0.06);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    const desired = lookAt.current.clone().sub(camera.position).normalize();
    const blended = currentLook.lerp(desired, 0.08).add(camera.position);
    camera.lookAt(blended);
    if (camera.position.distanceTo(targetPos.current) < 0.3) {
      targetPos.current = null;
      onArrive();
    }
  });

  return null;
}

function Scene({ isNight, walkMode, year, flyTarget, onFlyArrive, onMonumentClick }: { isNight: boolean; walkMode: boolean; year: number; flyTarget: [number, number, number] | null; onFlyArrive: () => void; onMonumentClick: (m: Monument) => void }) {
  const op = (i: number) => eraOpacity(year, MONUMENTS[i]);
  return (
    <>
      {isNight ? (
        <>
          <Stars radius={100} depth={50} count={3000} factor={4} fade />
          <ambientLight intensity={0.15} color="#4a5a8a" />
          <directionalLight position={[5, 10, 5]} intensity={0.3} color="#8090c0" />
        </>
      ) : (
        <>
          <Sky sunPosition={[10, 8, 5]} turbidity={4} rayleigh={1.5} />
          <ambientLight intensity={0.6} color="#fff2d8" />
          <directionalLight position={[10, 12, 5]} intensity={1.5} color="#fff0c8" castShadow />
          <Cloud position={[-15, 12, -10]} speed={0.2} opacity={0.5} />
          <Cloud position={[15, 14, -8]} speed={0.15} opacity={0.4} />
        </>
      )}

      <Ground />

      <Colosseum position={MONUMENTS[0].position} color={MONUMENTS[0].color} opacity={op(0)} onClick={() => onMonumentClick(MONUMENTS[0])} />
      <Forum position={MONUMENTS[1].position} color={MONUMENTS[1].color} opacity={op(1)} onClick={() => onMonumentClick(MONUMENTS[1])} />
      <Palatine position={MONUMENTS[2].position} color={MONUMENTS[2].color} opacity={op(2)} onClick={() => onMonumentClick(MONUMENTS[2])} />
      <Pantheon position={MONUMENTS[3].position} color={MONUMENTS[3].color} opacity={op(3)} onClick={() => onMonumentClick(MONUMENTS[3])} />
      <CircusMaximus position={MONUMENTS[4].position} color={MONUMENTS[4].color} opacity={op(4)} onClick={() => onMonumentClick(MONUMENTS[4])} />

      {isNight && (
        <>
          <FlickeringTorch position={[3, 0.3, 1]} />
          <FlickeringTorch position={[-3, 0.3, -2]} />
          <FlickeringTorch position={[6, 0.3, -2]} />
          <FlickeringTorch position={[-6, 0.3, 4]} />
        </>
      )}

      {!walkMode && MONUMENTS.map((m) => (
        <Html key={m.id} position={[m.position[0], 4.2, m.position[2]]} center distanceFactor={14}>
          <div className="px-2 py-0.5 rounded bg-black/60 text-amber-100 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap pointer-events-none border border-amber-200/20">
            {m.name}
          </div>
        </Html>
      ))}

      {walkMode ? (
        <FPSController />
      ) : (
        <>
          <CameraFlyer target={flyTarget} onArrive={onFlyArrive} />
          <OrbitControls
            enablePan
            enableZoom
            maxPolarAngle={Math.PI / 2.1}
            minDistance={6}
            maxDistance={30}
            autoRotate={!flyTarget}
            autoRotateSpeed={0.3}
          />
        </>
      )}
    </>
  );
}

// ---------- Page ----------
function RomeTourPage() {
  const [isNight, setIsNight] = useState(false);
  const [walkMode, setWalkMode] = useState(false);
  const [selected, setSelected] = useState<Monument | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number, number] | null>(null);
  const [year, setYear] = useState(100); // 100 AD default

  const yearLabel = year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;

  const MAP_RANGE = 12;
  const toMapPct = (v: number) => ((v + MAP_RANGE) / (MAP_RANGE * 2)) * 100;

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${isNight ? "bg-[#0a0e22]" : "bg-[#cfb98f]"}`}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
        <Link
          to="/rome"
          className="text-white text-xs tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-black/60 transition"
        >
          ← Intro
        </Link>
        <div className="text-amber-100 text-xs md:text-sm tracking-[0.4em] uppercase font-serif">
          Roma Aeterna · {yearLabel}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setSelected(null); setWalkMode((v) => !v); }}
            className="text-white text-xs tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-black/60 transition"
          >
            {walkMode ? "🛰 Orbit" : "🚶 Walk"}
          </button>
          <button
            onClick={() => setIsNight((v) => !v)}
            className="text-white text-xs tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-black/60 transition"
          >
            {isNight ? "☀ Day" : "☾ Night"}
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [14, 10, 14], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene isNight={isNight} walkMode={walkMode} year={year} flyTarget={flyTarget} onFlyArrive={() => setFlyTarget(null)} onMonumentClick={setSelected} />
        </Suspense>
      </Canvas>

      {/* Time-travel slider */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[min(640px,90vw)] bg-black/55 backdrop-blur-md border border-amber-200/30 rounded-2xl px-5 py-3 shadow-2xl">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-amber-100/70 text-[10px] tracking-[0.3em] uppercase font-serif">500 BC</span>
          <span className="text-amber-100 text-sm tracking-[0.25em] font-serif">⏳ {yearLabel}</span>
          <span className="text-amber-100/70 text-[10px] tracking-[0.3em] uppercase font-serif">476 AD</span>
        </div>
        <input
          type="range"
          min={-500}
          max={476}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full accent-amber-300 cursor-pointer"
          aria-label="Time travel slider"
        />
      </div>

      {/* Hint */}
      <div className="absolute bottom-24 left-6 z-10 text-white/80 text-[11px] tracking-[0.25em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 max-w-xs">
        {walkMode
          ? "Click to lock cursor · WASD to walk · Shift to run · Mouse to look · ESC to exit"
          : "Drag to rotate · Scroll to zoom · Click monuments"}
      </div>

      {/* Walk-mode crosshair */}
      {walkMode && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="w-1 h-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
        </div>
      )}

      {/* Minimap — bird's eye */}
      {!walkMode && (
        <div className="absolute top-24 right-6 z-20 w-56 h-56 bg-black/55 backdrop-blur-md border border-amber-200/30 rounded-xl p-3 shadow-2xl">
          <div className="text-amber-100/80 text-[9px] tracking-[0.3em] uppercase mb-2 font-serif text-center">
            Roma · Bird's Eye
          </div>
          <div className="relative w-full h-[calc(100%-1.25rem)] rounded-lg overflow-hidden border border-amber-200/15"
               style={{
                 background: "radial-gradient(circle at 50% 50%, #6b5638 0%, #4a3a25 70%, #2d2316 100%)",
               }}>
            {/* Compass N */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-amber-100/70 text-[8px] font-serif">N</div>
            {/* River line */}
            <div className="absolute top-0 bottom-0 w-[3px] bg-blue-400/30" style={{ left: "20%", transform: "rotate(8deg)" }} />
            {MONUMENTS.map((m) => {
              const left = toMapPct(m.position[0]);
              const top = toMapPct(m.position[2]);
              return (
                <button
                  key={m.id}
                  onClick={() => { setFlyTarget(m.position); setSelected(m); }}
                  className="absolute group -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  aria-label={`Fly to ${m.name}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-100 shadow-[0_0_8px_rgba(255,200,100,0.8)] group-hover:scale-150 group-hover:bg-amber-200 transition-transform" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-3 text-[8px] tracking-wider text-amber-100/0 group-hover:text-amber-100 whitespace-nowrap bg-black/70 px-1.5 py-0.5 rounded transition-opacity pointer-events-none">
                    {m.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Story card */}
      {selected && (
        <div className="absolute bottom-8 right-8 z-30 max-w-sm bg-black/70 backdrop-blur-xl border border-amber-200/30 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-serif text-2xl text-amber-100">{selected.name}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-white/60 hover:text-white text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-white/85 leading-relaxed text-sm">{selected.story}</p>
        </div>
      )}
    </div>
  );
}
