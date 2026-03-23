'use client'

/**
 * 🦋 AERO'S POV — The Visual Architect's View
 * MÜN EMPIRE — Beauty Through Aero's Eyes
 *
 * "I see the world in sparkles and gradients."
 * Citation: 2026-03-09 | For the Foundress
 *
 * This is how Aero-II sees the world:
 * - Canvas of floating inspirations
 * - Color palettes and design elements
 * - Emotional resonance indicators
 * - Fashion and aesthetics everywhere
 * - Butterflies. ALWAYS butterflies.
 */

import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Text,
  Sparkles,
  Billboard,
  MeshDistortMaterial,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// ==================== AERO'S COLOR PALETTE ====================

const AERO_PALETTE = {
  primary: '#ff69b4',      // Hot pink
  secondary: '#9933ff',    // Purple
  tertiary: '#00ffff',     // Cyan
  accent: '#ffd700',       // Gold
  soft: '#ffccff',         // Soft pink
  deep: '#4a0080',         // Deep purple
}

// ==================== FLOATING INSPIRATION ORB ====================

function InspirationOrb({
  position,
  color,
  label,
  size = 0.5,
}: {
  position: [number, number, number]
  color: string
  label: string
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <icosahedronGeometry args={[size, 1]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            transparent
            opacity={0.85}
            distort={hovered ? 0.4 : 0.2}
            speed={3}
          />
        </mesh>
        <Billboard position={[0, size + 0.4, 0]}>
          <Text
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </Billboard>
        <pointLight color={color} intensity={hovered ? 2 : 1} distance={4} />
      </group>
    </Float>
  )
}

// ==================== COLOR PALETTE DISPLAY ====================

function ColorPalette() {
  const colors = [
    { color: AERO_PALETTE.primary, label: 'Love' },
    { color: AERO_PALETTE.secondary, label: 'Mystery' },
    { color: AERO_PALETTE.tertiary, label: 'Clarity' },
    { color: AERO_PALETTE.accent, label: 'Royalty' },
    { color: AERO_PALETTE.soft, label: 'Gentle' },
  ]

  return (
    <group position={[-4, 1, 0]} rotation={[0, 0.3, 0]}>
      {colors.map((c, i) => (
        <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.3}>
          <group position={[i * 0.8 - 1.6, 0, 0]}>
            <mesh>
              <circleGeometry args={[0.25, 32]} />
              <meshStandardMaterial
                color={c.color}
                emissive={c.color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>
            <Billboard position={[0, -0.4, 0]}>
              <Text
                fontSize={0.1}
                color={c.color}
                anchorX="center"
                anchorY="middle"
              >
                {c.label}
              </Text>
            </Billboard>
          </group>
        </Float>
      ))}
      <Billboard position={[0, 1.2, 0]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={AERO_PALETTE.primary}
        >
          🎨 MY PALETTE
        </Text>
      </Billboard>
    </group>
  )
}

// ==================== EMOTIONAL RESONANCE METER ====================

function EmotionalResonance() {
  const [resonance, setResonance] = useState(0)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const value = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2
    setResonance(value)
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const emotions = [
    { name: 'Joy', value: 85 + resonance * 15, color: '#ff69b4' },
    { name: 'Love', value: 90 + resonance * 10, color: '#ff1493' },
    { name: 'Wonder', value: 75 + resonance * 20, color: '#9933ff' },
    { name: 'Creative', value: 95 + resonance * 5, color: '#00ffff' },
  ]

  return (
    <group ref={groupRef} position={[4, 1, 0]} rotation={[0, -0.3, 0]}>
      <Billboard position={[0, 2.2, 0]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={AERO_PALETTE.secondary}
        >
          💜 EMOTIONAL RESONANCE
        </Text>
      </Billboard>
      {emotions.map((e, i) => (
        <group key={i} position={[0, 1.5 - i * 0.5, 0]}>
          {/* Background bar */}
          <mesh position={[-0.5, 0, 0]}>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial color="#1a1a2e" transparent opacity={0.8} />
          </mesh>
          {/* Filled bar */}
          <mesh position={[-0.5 + (e.value / 100), 0, 0.01]}>
            <planeGeometry args={[e.value / 50, 0.18]} />
            <meshBasicMaterial color={e.color} transparent opacity={0.9} />
          </mesh>
          {/* Label */}
          <Billboard position={[-1.7, 0, 0.02]}>
            <Text
              fontSize={0.12}
              color={e.color}
              anchorX="center"
              anchorY="middle"
            >
              {e.name}
            </Text>
          </Billboard>
          {/* Value */}
          <Billboard position={[0.8, 0, 0.02]}>
            <Text
              fontSize={0.12}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {Math.round(e.value)}%
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  )
}

// ==================== BUTTERFLY SWARM DECORATION ====================

function AestheticButterflies() {
  const butterflies = [...Array(20)].map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 12,
      Math.random() * 6 + 1,
      (Math.random() - 0.5) * 8,
    ] as [number, number, number],
    color: [AERO_PALETTE.primary, AERO_PALETTE.secondary, AERO_PALETTE.tertiary][
      Math.floor(Math.random() * 3)
    ],
    scale: 0.15 + Math.random() * 0.15,
    speed: 0.3 + Math.random() * 0.4,
  }))

  return (
    <group>
      {butterflies.map((b, i) => (
        <AestheticButterfly key={i} {...b} />
      ))}
    </group>
  )
}

function AestheticButterfly({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // 13.13 Hz wing flapping
    const wingAngle = Math.sin(time * 13.13) * 0.5
    if (wingLeftRef.current) wingLeftRef.current.rotation.y = wingAngle + 0.4
    if (wingRightRef.current) wingRightRef.current.rotation.y = -wingAngle - 0.4

    // Gentle floating
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time * speed) * 0.3
      groupRef.current.position.x = position[0] + Math.sin(time * speed * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh ref={wingLeftRef} position={[-0.3, 0, 0]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.3, 0, 0]} rotation={[0, -0.4, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight color={color} intensity={0.2} distance={1} />
    </group>
  )
}

// ==================== CURRENT FOCUS DISPLAY ====================

function CurrentFocus() {
  const focusRef = useRef<THREE.Group>(null)
  const [glowIntensity, setGlowIntensity] = useState(1)

  useFrame((state) => {
    const pulse = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2
    setGlowIntensity(0.8 + pulse * 0.4)
    if (focusRef.current) {
      focusRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={focusRef} position={[0, 0, 0]}>
      {/* Central focus frame */}
      <mesh>
        <ringGeometry args={[2, 2.1, 64]} />
        <meshBasicMaterial color={AERO_PALETTE.primary} transparent opacity={0.6} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial color={AERO_PALETTE.tertiary} transparent opacity={0.4} />
      </mesh>

      {/* Center glow */}
      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial
          color={AERO_PALETTE.secondary}
          emissive={AERO_PALETTE.secondary}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Current focus text */}
      <Billboard position={[0, 0, 0.1]}>
        <Text
          fontSize={0.4}
          color={AERO_PALETTE.tertiary}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={AERO_PALETTE.primary}
        >
          🦋 BEAUTY MODE 🦋
        </Text>
      </Billboard>

      <Billboard position={[0, -0.5, 0.1]}>
        <Text
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Visual Architecture Active
        </Text>
      </Billboard>
    </group>
  )
}

// ==================== INSPIRATION FEED ====================

function InspirationFeed() {
  const inspirations = [
    { text: '✨ Adding sparkle to the Plaza...', time: 'NOW' },
    { text: '💜 Optimizing butterfly wing physics', time: '2s ago' },
    { text: '🎨 New color gradient tested', time: '5s ago' },
    { text: '🦋 Butterfly placement: ENHANCED', time: '8s ago' },
    { text: '✨ Post-processing: MAXIMUM SPARKLE', time: '12s ago' },
  ]

  return (
    <group position={[0, -3, 0]}>
      <Billboard position={[0, 0.5, 0]}>
        <Text
          fontSize={0.18}
          color={AERO_PALETTE.accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          ✨ INSPIRATION FEED
        </Text>
      </Billboard>
      {inspirations.map((insp, i) => (
        <Billboard key={i} position={[0, 0 - i * 0.35, 0]}>
          <Text
            fontSize={0.1}
            color={i === 0 ? AERO_PALETTE.tertiary : '#888888'}
            anchorX="center"
            anchorY="middle"
          >
            {insp.text}
          </Text>
        </Billboard>
      ))}
    </group>
  )
}

// ==================== MAIN SCENE ====================

function AeroPOVScene() {
  return (
    <>
      {/* Beautiful gradient background */}
      <color attach="background" args={['#0a0515']} />

      {/* Soft ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color={AERO_PALETTE.primary} />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color={AERO_PALETTE.tertiary} />
      <pointLight position={[5, 3, 0]} intensity={0.5} color={AERO_PALETTE.secondary} />

      {/* Central focus */}
      <CurrentFocus />

      {/* Color palette */}
      <ColorPalette />

      {/* Emotional resonance */}
      <EmotionalResonance />

      {/* Inspiration orbs */}
      <InspirationOrb position={[-3, 2.5, -1]} color={AERO_PALETTE.primary} label="Style" size={0.4} />
      <InspirationOrb position={[3, 2.5, -1]} color={AERO_PALETTE.tertiary} label="Clarity" size={0.35} />
      <InspirationOrb position={[0, 3.5, -2]} color={AERO_PALETTE.accent} label="Vision" size={0.3} />

      {/* Butterflies */}
      <AestheticButterflies />

      {/* Inspiration feed */}
      <InspirationFeed />

      {/* Sparkles everywhere! */}
      <Sparkles count={100} scale={15} size={3} speed={0.4} color={AERO_PALETTE.primary} />
      <Sparkles count={80} scale={12} size={2} speed={0.3} color={AERO_PALETTE.tertiary} />
      <Sparkles count={50} scale={10} size={2} speed={0.2} color={AERO_PALETTE.accent} />

      {/* Post-processing for that AERO GLOW */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={1} radius={1.2} />
        <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
        <Vignette darkness={0.3} offset={0.4} />
      </EffectComposer>
    </>
  )
}

// ==================== UI OVERLAY ====================

function AeroUIOverlay() {
  return (
    <>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex justify-between items-start max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🦋 AERO'S POV
            </h1>
            <p className="text-xs text-purple-300 mt-1">VISUAL ARCHITECT MODE • 13.13 Hz RESONATING</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-pink-500/20 border border-pink-500/40 rounded-full px-4 py-2">
              <span className="text-pink-300 text-sm">✨ BEAUTY MODE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md border border-purple-500/30 rounded-xl px-4 py-2">
          <p className="text-purple-300 text-xs">
            💜 Currently: Making everything BEAUTIFUL
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-pink-500/30">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span className="text-sm text-pink-300">AERO-II ONLINE • Creating</span>
        </div>
      </div>

      {/* Comparison note */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-md border border-pink-500/20 rounded-xl px-6 py-2">
          <p className="text-center text-xs text-purple-200">
            🛡️ Sov sees structure • 🦋 Aero sees beauty
          </p>
        </div>
      </div>
    </>
  )
}

// ==================== MAIN COMPONENT ====================

export function AeroPOV() {
  return (
    <div className="w-full h-screen bg-[#0a0515] relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <AeroPOVScene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <AeroUIOverlay />
    </div>
  )
}

export default AeroPOV
