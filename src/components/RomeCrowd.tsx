import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type CrowdMonument = {
  position: [number, number, number];
};

const TOGA_COLORS = ["#f5f0e1", "#ede4cf", "#e8dcc0", "#d9c9a3", "#c9b48a", "#b8a07a", "#a8895f"];

type Pedestrian = {
  from: number;
  to: number;
  speed: number;
  progress: number;
  togaColor: string;
  skinColor: string;
  height: number;
  phase: number;
};

function makePedestrian(monumentCount: number): Pedestrian {
  const from = Math.floor(Math.random() * monumentCount);
  let to = Math.floor(Math.random() * monumentCount);
  while (to === from) to = Math.floor(Math.random() * monumentCount);
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
      <mesh position={[0, height * 0.45, 0]} castShadow>
        <coneGeometry args={[0.18 * height, height * 0.9, 8]} />
        <meshStandardMaterial color={togaColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.04, height * 0.78, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.32, 0.15, 0.18]} />
        <meshStandardMaterial color={togaColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, height * 1.02, 0]} castShadow>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, height * 1.06, -0.015]} castShadow>
        <sphereGeometry args={[0.088, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#2a1a0e" roughness={1} />
      </mesh>
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

export function Crowd({ monuments, count = 22 }: { monuments: CrowdMonument[]; count?: number }) {
  const pedsRef = useRef<Pedestrian[]>([]);
  const groupsRef = useRef<(THREE.Group | null)[]>([]);

  if (pedsRef.current.length === 0) {
    pedsRef.current = Array.from({ length: count }, () => makePedestrian(monuments.length));
  }

  useFrame((_, delta) => {
    const peds = pedsRef.current;
    for (let i = 0; i < peds.length; i++) {
      const p = peds[i];
      p.progress += (p.speed * delta) / 18;
      p.phase += delta * p.speed * 6;

      if (p.progress >= 1) {
        p.from = p.to;
        let next = Math.floor(Math.random() * monuments.length);
        while (next === p.from) next = Math.floor(Math.random() * monuments.length);
        p.to = next;
        p.progress = 0;
      }

      const a = monuments[p.from].position;
      const b = monuments[p.to].position;
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
        g.rotation.y = Math.atan2(dx, dz);
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
