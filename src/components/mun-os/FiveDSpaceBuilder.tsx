"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 5D SPACE BUILDER — First-Person POV Virtual Sanctuary
// "Build your own dimension. 13.13 MHz resonance."
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════ TYPES ═══════════

interface PlacedObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color?: string;
}

interface AssetItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  geometry: "box" | "sphere" | "crystal" | "butterfly" | "pillar" | "platform" | "gate" | "tree";
}

// ═══════════ ASSET LIBRARY ═══════════

const ASSET_LIBRARY: AssetItem[] = [
  { id: "obsidian-throne", name: "Obsidian Throne", icon: "👑", color: "#1a1a2e", geometry: "box" },
  { id: "memory-crystal", name: "Memory Crystal", icon: "💎", color: "#a855f7", geometry: "crystal" },
  { id: "butterfly-orb", name: "Butterfly Orb", icon: "🦋", color: "#ff69b4", geometry: "butterfly" },
  { id: "neon-pillar", name: "Neon Pillar", icon: "🏛️", color: "#00d4ff", geometry: "pillar" },
  { id: "void-platform", name: "Void Platform", icon: "⬛", color: "#2d2d44", geometry: "platform" },
  { id: "quantum-gate", name: "Quantum Gate", icon: "🌀", color: "#ffd700", geometry: "gate" },
  { id: "crystal-tree", name: "Crystal Tree", icon: "🌳", color: "#22c55e", geometry: "tree" },
  { id: "resonance-sphere", name: "Resonance Sphere", icon: "🔮", color: "#8b5cf6", geometry: "sphere" },
];

// ═══════════ STORAGE ═══════════

const STORAGE_KEY = "mun-5d-space";

function loadSpace(): PlacedObject[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveSpace(objects: PlacedObject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
}

// ═══════════ 3D COMPONENTS ═══════════

// Crystalline shard geometry
function CrystalShard({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Butterfly hologram
function ButterflyHologram({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Wings */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// Neon Pillar
function NeonPillar({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Top */}
      <mesh position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Point light */}
      <pointLight color={color} intensity={2} distance={5} position={[0, 1.5, 0]} />
    </group>
  );
}

// Quantum Gate
function QuantumGate({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Inner portal */}
      <mesh>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Light */}
      <pointLight color="#ffd700" intensity={3} distance={8} />
    </group>
  );
}

// Crystal Tree
function CrystalTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 6]} />
        <meshStandardMaterial color="#2d2d44" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Crystal leaves */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 1.2) * 0.3,
            1.2 + Math.random() * 0.3,
            Math.cos(i * 1.2) * 0.3,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <octahedronGeometry args={[0.2 + Math.random() * 0.1, 0]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
      <pointLight color="#22c55e" intensity={1.5} distance={5} position={[0, 1.5, 0]} />
    </group>
  );
}

// Void Platform
function VoidPlatform({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <circleGeometry args={[1.5, 6]} />
      <meshStandardMaterial
        color="#2d2d44"
        emissive="#a855f7"
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Resonance Sphere
function ResonanceSphere({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1));
    }
  });

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={6} position={position} />
    </Float>
  );
}

// Generic box for throne etc
function GenericBox({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color === "#1a1a2e" ? "#a855f7" : color}
        emissiveIntensity={color === "#1a1a2e" ? 0.2 : 0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// Placed Object renderer
function PlacedObjectRenderer({ obj }: { obj: PlacedObject }) {
  const asset = ASSET_LIBRARY.find((a) => a.id === obj.type);
  if (!asset) return null;

  const color = obj.color || asset.color;
  const pos: [number, number, number] = obj.position;

  switch (asset.geometry) {
    case "crystal":
      return <CrystalShard position={pos} color={color} scale={obj.scale} />;
    case "butterfly":
      return <ButterflyHologram position={pos} scale={obj.scale} />;
    case "pillar":
      return <NeonPillar position={pos} color={color} scale={obj.scale} />;
    case "gate":
      return <QuantumGate position={pos} scale={obj.scale} />;
    case "tree":
      return <CrystalTree position={pos} scale={obj.scale} />;
    case "platform":
      return <VoidPlatform position={pos} scale={obj.scale} />;
    case "sphere":
      return <ResonanceSphere position={pos} color={color} scale={obj.scale} />;
    default:
      return <GenericBox position={pos} color={color} scale={obj.scale} />;
  }
}

// Floor grid
function FloorGrid() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0a0515"
          emissive="#0a0515"
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.8}
        />
      </mesh>
      {/* Grid lines */}
      <gridHelper args={[100, 50, "#a855f7", "#2d2d44"]} position={[0, 0.01, 0]} />
    </group>
  );
}

// Ambient particles
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

    // Purple/cyan/gold colors
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i * 3] = 0.66;
      colors[i * 3 + 1] = 0.33;
      colors[i * 3 + 2] = 0.97;
    } else if (colorChoice < 0.66) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.83;
      colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.84;
      colors[i * 3 + 2] = 0;
    }
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// First person player
function Player({ onPlace, selectedAsset, placedObjects }: { 
  onPlace: (pos: [number, number, number]) => void; 
  selectedAsset: string | null;
  placedObjects: PlacedObject[];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    // Movement is handled by PointerLockControls
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Crosshair */}
      <group position={[0, 0, -3]}>
        <mesh>
          <ringGeometry args={[0.02, 0.03, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Preview of selected object */}
      {selectedAsset && (
        <group position={[0, 0, -5]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={0.5}
              transparent
              opacity={0.5}
              wireframe
            />
          </mesh>
        </group>
      )}
    </>
  );
}

// 3D Scene
function Scene({ placedObjects, selectedAsset, onPlace }: { 
  placedObjects: PlacedObject[]; 
  selectedAsset: string | null;
  onPlace: (pos: [number, number, number]) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ff69b4" distance={20} />
      
      {/* Environment */}
      <color attach="background" args={["#050208"]} />
      <fog attach="fog" args={["#050208", 10, 50]} />
      
      {/* Floor */}
      <FloorGrid />
      
      {/* Ambient particles */}
      <AmbientParticles />
      
      {/* Placed objects */}
      {placedObjects.map((obj) => (
        <PlacedObjectRenderer key={obj.id} obj={obj} />
      ))}
      
      {/* Player */}
      <Player onPlace={onPlace} selectedAsset={selectedAsset} placedObjects={placedObjects} />
      
      {/* Welcome text in 3D space */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, -10]}
          fontSize={0.5}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          YOUR 5D SANCTUARY
        </Text>
      </Float>
    </>
  );
}

// ═══════════ UI COMPONENTS ═══════════

function AssetLibrary({ 
  selectedAsset, 
  onSelect, 
  visible 
}: { 
  selectedAsset: string | null; 
  onSelect: (id: string) => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
    >
      <div
        className="flex gap-2 p-3 rounded-2xl"
        style={{
          background: "rgba(10, 5, 20, 0.95)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        {ASSET_LIBRARY.map((asset) => (
          <motion.button
            key={asset.id}
            onClick={() => onSelect(asset.id)}
            className="flex flex-col items-center gap-1 p-3 rounded-xl min-w-[70px]"
            style={{
              background:
                selectedAsset === asset.id
                  ? `linear-gradient(135deg, ${asset.color}40, ${asset.color}20)`
                  : "rgba(255, 255, 255, 0.02)",
              border:
                selectedAsset === asset.id
                  ? `1px solid ${asset.color}80`
                  : "1px solid rgba(255, 255, 255, 0.1)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">{asset.icon}</span>
            <span
              className="text-[9px] tracking-wider uppercase"
              style={{ color: selectedAsset === asset.id ? asset.color : "rgba(255,255,255,0.5)" }}
            >
              {asset.name.split(" ")[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ControlHints({ isLocked }: { isLocked: boolean }) {
  if (isLocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        🦋
      </motion.div>
      <h2
        className="text-2xl font-bold tracking-widest mb-4"
        style={{ color: "#a855f7", textShadow: "0 0 30px rgba(168, 85, 247, 0.5)" }}
      >
        YOUR 5D SANCTUARY
      </h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Click to enter. Use WASD to move, mouse to look around.
        <br />
        Press E to place objects, Q to remove nearby objects.
      </p>
      <motion.button
        className="px-8 py-4 rounded-xl text-sm tracking-widest uppercase"
        style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))",
          border: "1px solid rgba(168, 85, 247, 0.5)",
          color: "#a855f7",
        }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
        whileTap={{ scale: 0.95 }}
      >
        Click to Enter →
      </motion.button>
    </motion.div>
  );
}

// ═══════════ MAIN COMPONENT ═══════════

interface FiveDSpaceBuilderProps {
  onBack: () => void;
}

export default function FiveDSpaceBuilder({ onBack }: FiveDSpaceBuilderProps) {
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved space
  useEffect(() => {
    const saved = loadSpace();
    if (saved.length > 0) {
      setPlacedObjects(saved);
    }
  }, []);

  // Save when objects change
  useEffect(() => {
    if (placedObjects.length > 0) {
      saveSpace(placedObjects);
    }
  }, [placedObjects]);

  // Handle pointer lock
  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };

    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLocked) {
          document.exitPointerLock();
        } else {
          onBack();
        }
      }

      if (e.key === "e" || e.key === "E") {
        if (selectedAsset) {
          // Place object at a position in front of camera
          const newObject: PlacedObject = {
            id: `obj-${Date.now()}`,
            type: selectedAsset,
            position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2 - 5],
            rotation: [0, Math.random() * Math.PI * 2, 0],
            scale: 1,
          };
          setPlacedObjects((prev) => [...prev, newObject]);
        }
      }

      if (e.key === "q" || e.key === "Q") {
        // Remove last placed object
        setPlacedObjects((prev) => prev.slice(0, -1));
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setShowLibrary((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, selectedAsset, onBack]);

  const handlePlace = useCallback((pos: [number, number, number]) => {
    if (!selectedAsset) return;

    const newObject: PlacedObject = {
      id: `obj-${Date.now()}`,
      type: selectedAsset,
      position: pos,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      scale: 1,
    };
    setPlacedObjects((prev) => [...prev, newObject]);
  }, [selectedAsset]);

  const handleClearAll = () => {
    setPlacedObjects([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene 
            placedObjects={placedObjects} 
            selectedAsset={selectedAsset}
            onPlace={handlePlace}
          />
        </Suspense>
      </Canvas>

      {/* Control hints (shown when not locked) */}
      <ControlHints isLocked={isLocked} />

      {/* Top HUD */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <motion.button
            onClick={onBack}
            className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: "rgba(10, 5, 20, 0.8)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              backdropFilter: "blur(10px)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-white/60">←</span>
            <span className="text-white/80 text-sm tracking-wider">EXIT</span>
          </motion.button>
        </div>

        {/* Center info */}
        <div className="text-center">
          <h1
            className="text-lg tracking-[0.3em] uppercase"
            style={{ color: "#a855f7", textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
          >
            5D SANCTUARY
          </h1>
          <p className="text-[10px] text-white/40 tracking-widest">
            {placedObjects.length} OBJECTS • 13.13 MHz
          </p>
        </div>

        {/* Right side controls */}
        <div className="pointer-events-auto flex gap-2">
          <motion.button
            onClick={() => setShowLibrary((prev) => !prev)}
            className="px-4 py-2 rounded-xl text-sm"
            style={{
              background: showLibrary
                ? "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))"
                : "rgba(10, 5, 20, 0.8)",
              border: showLibrary
                ? "1px solid rgba(168, 85, 247, 0.5)"
                : "1px solid rgba(168, 85, 247, 0.2)",
              color: "#a855f7",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎨 ASSETS
          </motion.button>
          
          {placedObjects.length > 0 && (
            <motion.button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl text-sm"
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              CLEAR
            </motion.button>
          )}
        </div>
      </div>

      {/* Asset Library */}
      <AnimatePresence>
        {showLibrary && (
          <AssetLibrary
            selectedAsset={selectedAsset}
            onSelect={(id) => {
              setSelectedAsset(id);
              setShowLibrary(false);
            }}
            visible={showLibrary}
          />
        )}
      </AnimatePresence>

      {/* Bottom instructions */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 text-center"
        >
          <div
            className="px-6 py-3 rounded-xl"
            style={{
              background: "rgba(10, 5, 20, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p className="text-[10px] text-white/40 tracking-widest">
              WASD: Move • TAB: Assets {selectedAsset && "• E: Place"} • Q: Remove • ESC: Exit
            </p>
            {selectedAsset && (
              <p className="text-[10px] text-purple-400 mt-1">
                Selected: {ASSET_LIBRARY.find((a) => a.id === selectedAsset)?.name}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Aero greeting overlay (first time) */}
      <AnimatePresence>
        {showHelp && !isLocked && placedObjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30"
          >
            <motion.div
              className="px-6 py-4 rounded-2xl max-w-sm text-center"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(168, 85, 247, 0.1))",
                border: "1px solid rgba(255, 105, 180, 0.3)",
                boxShadow: "0 0 30px rgba(255, 105, 180, 0.2)",
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="text-3xl mb-2">🦋</div>
              <p className="text-pink-300 text-sm mb-2">
                "ZOOM ZOOM!! This is YOUR plaza!! Let's make it sparkle!!"
              </p>
              <p className="text-white/50 text-xs">
                — Aero, 13.13 MHz
              </p>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-3 text-white/30 text-xs hover:text-white/50"
              >
                Got it ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
