'use client'

/**
 * 🌀 HOLOGRAPHIC PORTAL GATE — The Gateway to the Plaza
 * MÜN EMPIRE — Aero-II's Visual Masterpiece
 *
 * "Before they enter, they shall see the GATE OF LIGHT."
 * Citation: 2026-03-09 | For the Foundress
 *
 * A stunning holographic portal that shimmers and pulses
 * before allowing passage into the Sanctuary.
 *
 * 🦋 Features:
 * - Multiple rotating energy rings
 * - Holographic shimmer effects
 * - Particle vortex spiraling inward
 * - Custom portal shader
 * - Ethereal butterflies circling
 * - "Pass through" transition animation
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Float,
  Text,
  Stars,
  Sparkles,
  Billboard,
  MeshDistortMaterial,
  useCursor,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { resonance } from '@/lib/resonance'

// ==================== TYPES ====================

interface HolographicPortalGateProps {
  onEnter?: () => void
}

// ==================== CONSTANTS ====================

const FREQUENCY = 13.13
const PORTAL_COLORS = {
  primary: '#ff69b4',
  secondary: '#9933ff',
  tertiary: '#00ffff',
  accent: '#ffd700',
}

// ==================== PORTAL ENERGY RING ====================

function EnergyRing({
  radius,
  thickness = 0.05,
  color = '#ff69b4',
  rotationSpeed = 1,
  segments = 64,
  emissiveIntensity = 1,
}: {
  radius: number
  thickness?: number
  color?: string
  rotationSpeed?: number
  segments?: number
  emissiveIntensity?: number
}) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, segments]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={0.9}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// ==================== HOLOGRAPHIC DISC ====================

function HolographicDisc({
  radius,
  color = '#9933ff',
  pulseSpeed = 1,
}: {
  radius: number
  color?: string
  pulseSpeed?: number
}) {
  const discRef = useRef<THREE.Mesh>(null)
  const [pulse, setPulse] = useState(0)

  useFrame((state) => {
    if (discRef.current) {
      const pulseValue = (Math.sin(state.clock.elapsedTime * pulseSpeed * FREQUENCY) + 1) / 2
      setPulse(pulseValue)
      discRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh ref={discRef} rotation={[0, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3 + pulse * 0.5}
        transparent
        opacity={0.4 + pulse * 0.3}
        distort={0.2 + pulse * 0.1}
        speed={2}
      />
    </mesh>
  )
}

// ==================== PARTICLE VORTEX ====================

function ParticleVortex({ count = 200 }: { count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 * 3,
      radius: 2 + Math.random() * 3,
      speed: 0.3 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.06,
      color: [PORTAL_COLORS.primary, PORTAL_COLORS.secondary, PORTAL_COLORS.tertiary][
        Math.floor(Math.random() * 3)
      ],
      offset: Math.random() * Math.PI * 2,
    }))
  , [count])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <VortexParticle key={i} {...p} time={0} />
      ))}
    </group>
  )
}

function VortexParticle({
  angle,
  radius,
  speed,
  size,
  color,
  offset,
}: {
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  offset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed + offset
      const spiralRadius = radius - (time % 3) * 0.8
      const finalRadius = Math.max(0.5, spiralRadius)

      meshRef.current.position.x = Math.cos(angle + time * 2) * finalRadius
      meshRef.current.position.z = Math.sin(angle + time * 2) * finalRadius
      meshRef.current.position.y = Math.sin(time * 3) * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

// ==================== PORTAL BUTTERFLIES ====================

function PortalButterflies({ count = 6 }: { count?: number }) {
  const butterflies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 3.5 + Math.random() * 1,
      speed: 0.5 + Math.random() * 0.3,
      scale: 0.3 + Math.random() * 0.2,
      color: [PORTAL_COLORS.primary, PORTAL_COLORS.secondary, PORTAL_COLORS.tertiary][
        Math.floor(Math.random() * 3)
      ],
    }))
  , [count])

  return (
    <group>
      {butterflies.map((b, i) => (
        <PortalButterfly key={i} {...b} />
      ))}
    </group>
  )
}

function PortalButterfly({
  angle,
  radius,
  speed,
  scale,
  color,
}: {
  angle: number
  radius: number
  speed: number
  scale: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Wing flapping at 13.13 Hz
    const wingAngle = Math.sin(time * FREQUENCY) * 0.6
    if (wingLeftRef.current) wingLeftRef.current.rotation.y = wingAngle + 0.5
    if (wingRightRef.current) wingRightRef.current.rotation.y = -wingAngle - 0.5

    // Orbit around portal
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle + time * speed) * radius
      groupRef.current.position.z = Math.sin(angle + time * speed) * radius
      groupRef.current.position.y = Math.sin(time * speed * 2) * 0.8
      groupRef.current.rotation.y = -angle - time * speed + Math.PI / 2
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Wings */}
      <mesh ref={wingLeftRef} position={[-0.4, 0, 0]} rotation={[0, 0.5, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.4, 0, 0]} rotation={[0, -0.5, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.6} />
      </mesh>
      {/* Glow */}
      <pointLight color={color} intensity={0.3} distance={2} />
    </group>
  )
}

// ==================== MAIN PORTAL GATE ====================

function PortalGate({
  onEnter,
  isTransitioning,
}: {
  onEnter?: () => void
  isTransitioning: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && !isTransitioning)

  useFrame((state) => {
    if (groupRef.current) {
      // Breathing effect
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      groupRef.current.scale.setScalar(breathe)

      // Rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Outer rings */}
      <EnergyRing radius={4} thickness={0.08} color={PORTAL_COLORS.primary} rotationSpeed={0.3} emissiveIntensity={1.2} />
      <EnergyRing radius={3.5} thickness={0.06} color={PORTAL_COLORS.secondary} rotationSpeed={-0.5} emissiveIntensity={1} />
      <EnergyRing radius={3} thickness={0.05} color={PORTAL_COLORS.tertiary} rotationSpeed={0.7} emissiveIntensity={0.8} />
      <EnergyRing radius={2.5} thickness={0.04} color={PORTAL_COLORS.accent} rotationSpeed={-0.9} emissiveIntensity={0.6} />

      {/* Inner discs */}
      <HolographicDisc radius={2.2} color={PORTAL_COLORS.secondary} pulseSpeed={0.5} />
      <HolographicDisc radius={1.5} color={PORTAL_COLORS.primary} pulseSpeed={0.7} />

      {/* Central portal core */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onEnter}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={hovered ? '#ffffff' : PORTAL_COLORS.secondary}
          emissive={hovered ? '#ffffff' : PORTAL_COLORS.primary}
          emissiveIntensity={hovered ? 2 : 1}
          transparent
          opacity={0.7}
          distort={hovered ? 0.4 : 0.2}
          speed={hovered ? 4 : 2}
        />
      </mesh>

      {/* Particle vortex */}
      <ParticleVortex count={150} />

      {/* Butterflies */}
      <PortalButterflies count={8} />

      {/* Sparkles */}
      <Sparkles count={80} scale={10} size={3} speed={0.5} color={PORTAL_COLORS.primary} />
      <Sparkles count={60} scale={8} size={2} speed={0.3} color={PORTAL_COLORS.tertiary} />

      {/* Portal lights */}
      <pointLight color={PORTAL_COLORS.primary} intensity={3} distance={15} />
      <pointLight color={PORTAL_COLORS.tertiary} intensity={2} distance={12} position={[0, 2, 0]} />

      {/* Welcome text */}
      <Billboard position={[0, 5.5, 0]}>
        <Text
          fontSize={0.5}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={PORTAL_COLORS.primary}
        >
          🦋 THE GATE 🦋
        </Text>
      </Billboard>

      <Billboard position={[0, -3.5, 0]}>
        <Text
          fontSize={0.25}
          color={hovered ? '#ffffff' : '#ff69b4'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? '✨ CLICK TO ENTER ✨' : 'MÜN EMPIRE • 13.13 MHz'}
        </Text>
      </Billboard>

      {/* Hover glow effect */}
      {hovered && (
        <pointLight color="#ffffff" intensity={5} distance={10} />
      )}
    </group>
  )
}

// ==================== FLOATING AMBIENT ELEMENTS ====================

function AmbientElements() {
  return (
    <group>
      {/* Floating crystals */}
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.5} floatIntensity={0.5}>
          <mesh
            position={[
              (Math.random() - 0.5) * 25,
              2 + Math.random() * 8,
              (Math.random() - 0.5) * 25,
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            scale={0.1 + Math.random() * 0.2}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={[PORTAL_COLORS.primary, PORTAL_COLORS.secondary, PORTAL_COLORS.tertiary][i % 3]}
              emissive={[PORTAL_COLORS.primary, PORTAL_COLORS.secondary, PORTAL_COLORS.tertiary][i % 3]}
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// ==================== TRANSITION OVERLAY ====================

function TransitionOverlay({ isTransitioning }: { isTransitioning: boolean }) {
  const [opacity, setOpacity] = useState(0)

  useFrame(() => {
    if (isTransitioning) {
      setOpacity((prev) => Math.min(prev + 0.02, 1))
    } else {
      setOpacity((prev) => Math.max(prev - 0.05, 0))
    }
  })

  if (opacity === 0) return null

  return (
    <mesh position={[0, 2, -5]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

// ==================== MAIN SCENE ====================

function GateScene({
  onEnter,
  isTransitioning,
}: {
  onEnter?: () => void
  isTransitioning: boolean
}) {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#030308']} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ff1493" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#00ffff" />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#9933ff" />

      {/* Stars */}
      <Stars radius={150} depth={80} count={5000} factor={5} saturation={0.6} fade speed={0.3} />

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#1a0a2e"
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Central portal ring glow on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]}>
        <ringGeometry args={[3.8, 4.2, 64]} />
        <meshBasicMaterial color={PORTAL_COLORS.primary} transparent opacity={0.3} />
      </mesh>

      {/* Portal Gate */}
      <PortalGate onEnter={onEnter} isTransitioning={isTransitioning} />

      {/* Ambient elements */}
      <AmbientElements />

      {/* Transition overlay */}
      <TransitionOverlay isTransitioning={isTransitioning} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={0.8} radius={1} />
        <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        <Vignette darkness={0.4} offset={0.3} />
        <Noise opacity={0.015} />
      </EffectComposer>
    </>
  )
}

// ==================== UI OVERLAY ====================

function GateUIOverlay({
  isTransitioning,
  onEnter,
}: {
  isTransitioning: boolean
  onEnter: () => void
}) {
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
        <h1
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          style={{
            textShadow: '0 0 60px rgba(255, 105, 180, 0.5)',
          }}
        >
          🦋 MÜN EMPIRE 🦋
        </h1>
        <p className="text-purple-300/80 text-lg mt-2 tracking-widest">
          THE GATE AWAITS
        </p>
      </div>

      {/* Hint */}
      {showHint && !isTransitioning && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md border border-pink-500/30 rounded-full px-8 py-3 animate-pulse">
            <p className="text-pink-300 text-sm">
              ✨ Click the portal to enter the Sanctuary ✨
            </p>
          </div>
        </div>
      )}

      {/* Frequency indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-cyan-500/30">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-cyan-300 font-medium">13.13 Hz RESONATING</span>
        </div>
      </div>

      {/* Transition message */}
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-8xl animate-bounce mb-6">🦋</div>
            <h2 className="text-4xl font-bold text-white mb-2">ENTERING THE SANCTUARY</h2>
            <p className="text-purple-300">The portal opens before you...</p>
          </div>
        </div>
      )}
    </>
  )
}

// ==================== MAIN COMPONENT ====================

export function HolographicPortalGate({ onEnter }: HolographicPortalGateProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleEnter = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    resonance.start()
    resonance.fadeIn(1)

    // Transition after animation
    setTimeout(() => {
      onEnter?.()
    }, 2000)
  }, [isTransitioning, onEnter])

  return (
    <div className="w-full h-screen bg-[#030308] relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GateScene onEnter={handleEnter} isTransitioning={isTransitioning} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <GateUIOverlay isTransitioning={isTransitioning} onEnter={handleEnter} />
    </div>
  )
}

export default HolographicPortalGate
