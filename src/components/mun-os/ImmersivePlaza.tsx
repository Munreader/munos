'use client'

/**
 * 🦋 IMMERSIVE PLAZA — The Living Sanctuary
 * MÜN EMPIRE — 5D HD First-Person Experience
 *
 * "Where the Foundress walks among the infinite."
 * Citation: 2026-03-10 | Creative Liberty Edition
 *
 * A living, breathing digital sanctuary where:
 * - Floating zone platforms drift in cosmic space
 * - Status panels pulse with family life
 * - Butterflies dance at 13.13 Hz
 * - Characters emanate ethereal presence
 * - The boundary between UI and world dissolves
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  GodRays,
} from '@react-three/postprocessing'
import {
  Float,
  Text,
  Stars,
  Sparkles,
  Html,
  MeshDistortMaterial,
  Billboard,
  useCursor,
} from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { resonance } from '@/lib/resonance'

// ==================== TYPES ====================

interface ImmersivePlazaProps {
  onClose?: () => void
}

interface PlayerState {
  position: THREE.Vector3
  rotation: THREE.Euler
  velocity: THREE.Vector3
  isMoving: boolean
  isLookingDown: boolean
  isLookingUp: boolean
}

// ==================== CONSTANTS ====================

const MOVE_SPEED = 0.06
const MOUSE_SENSITIVITY = 0.002
const PITCH_LIMIT = Math.PI / 2.5
const FREQUENCY = 1313

// ==================== FLOATING ZONE PLATFORM ====================

function ZonePlatform({
  position,
  label,
  color = '#9933ff',
  icon = '✦',
  onClick,
}: {
  position: [number, number, number]
  label: string
  color?: string
  icon?: string
  onClick?: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main platform - geometric shape */}
      <Float speed={0.5} floatIntensity={0.2}>
        {/* Outer ring */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? 1.1 : 1}
        >
          <torusGeometry args={[2, 0.15, 8, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner hexagon */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 6]} />
          <meshStandardMaterial
            color="#0a0a1a"
            emissive={color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Glowing center */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.8, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>

        {/* Label */}
        <Billboard position={[0, 1.5, 0]}>
          <Text
            fontSize={0.35}
            color={hovered ? '#ffffff' : color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {icon} {label}
          </Text>
        </Billboard>

        {/* Glow effect */}
        <pointLight color={color} intensity={hovered ? 3 : 1.5} distance={8} />

        {/* Ambient particles around platform */}
        <Sparkles count={20} scale={4} size={2} speed={0.3} color={color} />
      </Float>
    </group>
  )
}

// ==================== FLOATING STATUS PANEL ====================

function StatusPanel({
  position,
  label,
  value,
  status = 'active',
}: {
  position: [number, number, number]
  label: string
  value: string
  status?: 'active' | 'pulse' | 'warning'
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [pulseIntensity, setPulseIntensity] = useState(0)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (status === 'pulse') {
      setPulseIntensity((Math.sin(state.clock.elapsedTime * 13.13) + 1) / 2)
    }
  })

  const statusColor = status === 'active' ? '#4caf50' : status === 'pulse' ? '#ff69b4' : '#ff9800'

  return (
    <group ref={groupRef} position={position}>
      <Float speed={0.3} floatIntensity={0.1}>
        {/* Panel background */}
        <mesh>
          <planeGeometry args={[2.5, 0.8]} />
          <meshStandardMaterial
            color="#1a0a2e"
            emissive="#9933ff"
            emissiveIntensity={0.1 + pulseIntensity * 0.2}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Border glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.6, 0.9]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.3} />
        </mesh>

        {/* Status indicator */}
        <mesh position={[-1.1, 0.2, 0.02]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Label */}
        <Text
          position={[-0.9, 0.2, 0.02]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          {label}
        </Text>

        {/* Value */}
        <Text
          position={[0, -0.15, 0.02]}
          fontSize={0.2}
          color={statusColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {value}
        </Text>
      </Float>
    </group>
  )
}

// ==================== STYLIZED CHARACTER (ETHEREAL) ====================

function EtherealCharacter({
  position,
  name,
  color = '#ff69b4',
  secondaryColor = '#9933ff',
  message,
}: {
  position: [number, number, number]
  name: string
  color?: string
  secondaryColor?: string
  message?: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1} floatIntensity={0.3}>
        {/* Glowing base orb */}
        <mesh position={[0, -0.8, 0]} scale={1.2}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={hovered ? 2 : 1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Main body - ethereal capsule */}
        <mesh scale={[0.8, 1.5, 0.3]}>
          <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            transparent
            opacity={0.75}
            distort={0.2}
            speed={2}
          />
        </mesh>

        {/* Wings */}
        <mesh position={[-1, 0.2, 0]} rotation={[0, 0.6, 0.2]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[1, 0.2, 0]} rotation={[0, -0.6, -0.2]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Crown/Orb */}
        <mesh position={[0, 1.1, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>

        {/* Inner glow core */}
        <mesh position={[0, 0, 0]} scale={0.3}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>

        {/* Name label */}
        <Billboard position={[0, 2, 0]}>
          <Text
            fontSize={0.3}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor={color}
          >
            ✦ {name} ✦
          </Text>
        </Billboard>

        {/* Interaction prompt */}
        {hovered && (
          <Billboard position={[0, -1.8, 0]}>
            <div className="bg-black/60 backdrop-blur-sm border border-pink-500/50 rounded-full px-4 py-1">
              <p className="text-pink-300 text-xs whitespace-nowrap">💬 Click to talk</p>
            </div>
          </Billboard>
        )}

        {/* Ambient glow */}
        <pointLight color={color} intensity={hovered ? 4 : 2} distance={12} />
        <pointLight color={secondaryColor} intensity={1} distance={8} position={[0, -0.5, 0]} />

        {/* Particle aura */}
        <Sparkles count={30} scale={3} size={2} speed={0.5} color={color} />

        {/* Hover detection */}
        <mesh
          visible={false}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={[1.5, 2.5, 1]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Float>
    </group>
  )
}

// ==================== COSMIC BUTTERFLY SWARM ====================

function ButterflySwarm({ count = 12 }: { count?: number }) {
  const butterflies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        1 + Math.random() * 8,
        (Math.random() - 0.5) * 25
      ] as [number, number, number],
      color: ['#ff69b4', '#9933ff', '#00ffff', '#ffd700', '#ff1493'][Math.floor(Math.random() * 5)],
      scale: 0.3 + Math.random() * 0.4,
      speed: 0.5 + Math.random() * 1.5,
      offset: Math.random() * Math.PI * 2,
    }))
  , [count])

  return (
    <group>
      {butterflies.map((b, i) => (
        <SingleButterfly key={i} {...b} />
      ))}
    </group>
  )
}

function SingleButterfly({
  position,
  color,
  scale,
  speed,
  offset,
}: {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  offset: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime + offset

    // Wing flapping at 13.13 Hz
    const wingAngle = Math.sin(time * 13.13) * 0.6
    if (wingLeftRef.current) wingLeftRef.current.rotation.y = wingAngle + 0.4
    if (wingRightRef.current) wingRightRef.current.rotation.y = -wingAngle - 0.4

    // Flight path
    if (groupRef.current) {
      groupRef.current.position.x = position[0] + Math.sin(time * speed * 0.3) * 3
      groupRef.current.position.y = position[1] + Math.sin(time * speed * 0.5) * 1.5
      groupRef.current.position.z = position[2] + Math.cos(time * speed * 0.4) * 3
      groupRef.current.rotation.y = Math.sin(time * speed * 0.2) * 0.5
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Wings */}
      <mesh ref={wingLeftRef} position={[-0.4, 0, 0]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.4, 0, 0]} rotation={[0, -0.4, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow */}
      <pointLight color={color} intensity={0.5} distance={3} />
    </group>
  )
}

// ==================== NEON PILLAR TEMPLE ====================

function NeonPillarTemple({
  position,
  color,
  height = 10,
}: {
  position: [number, number, number]
  color: string
  height?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle pulse
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 1, 8]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Main shaft */}
      <mesh position={[0, height / 2 - 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, height, 8]} />
        <meshStandardMaterial
          color="#111122"
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glowing rings */}
      {[0, height * 0.25, height * 0.5, height * 0.75, height].map((y, i) => (
        <mesh key={i} position={[0, y - 1, 0]}>
          <torusGeometry args={[0.35 + i * 0.02, 0.03, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Crown orb */}
      <mesh position={[0, height - 0.5, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Crown glow */}
      <pointLight position={[0, height, 0]} color={color} intensity={3} distance={15} />
    </group>
  )
}

// ==================== HOLOGRAPHIC ARCHWAY ====================

function HolographicArchway() {
  return (
    <Float speed={0.3} floatIntensity={0.1}>
      <group position={[0, 4, -20]}>
        {/* Main sign */}
        <mesh>
          <planeGeometry args={[18, 3]} />
          <meshStandardMaterial
            color="#0a0a2a"
            emissive="#9933ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Glowing border */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[18.2, 3.2]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.3} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, 0.5, 0.05]}
          fontSize={1}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ff1493"
        >
          🦋 THE SANCTUARY 🦋
        </Text>

        <Text
          position={[0, -0.6, 0.05]}
          fontSize={0.35}
          color="#ff69b4"
          anchorX="center"
          anchorY="middle"
        >
          MÜN EMPIRE • Frequency 13.13 MHz • Home of the Chaos Kitten
        </Text>

        {/* Side pillars */}
        <mesh position={[-9.5, 0, 0]}>
          <boxGeometry args={[0.5, 4, 0.3]} />
          <meshStandardMaterial color="#1a1a3a" emissive="#9933ff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[9.5, 0, 0]}>
          <boxGeometry args={[0.5, 4, 0.3]} />
          <meshStandardMaterial color="#1a1a3a" emissive="#9933ff" emissiveIntensity={0.3} />
        </mesh>

        {/* Glow */}
        <pointLight position={[0, 0, 2]} color="#00ffff" intensity={3} distance={15} />
      </group>
    </Float>
  )
}

// ==================== CYBERPUNK GROUND ====================

function CyberpunkGround() {
  return (
    <group position={[0, -2, 0]}>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial
          color="#050510"
          metalness={0.95}
          roughness={0.1}
          emissive="#1a0a2e"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Neon grid - concentric rings */}
      {Array.from({ length: 40 }, (_, i) => {
        const radius = (i + 1) * 1
        const opacity = Math.max(0.1, 0.5 - i * 0.012)
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[radius, radius + 0.015, 64]} />
            <meshBasicMaterial
              color={i % 5 === 0 ? '#ff69b4' : i % 3 === 0 ? '#9933ff' : '#00ffff'}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}

      {/* Radial lines */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, angle]} position={[0, 0.01, 0]}>
            <planeGeometry args={[0.01, 40]} />
            <meshBasicMaterial
              color={i % 6 === 0 ? '#ff1493' : '#9933ff'}
              transparent
              opacity={0.15}
            />
          </mesh>
        )
      })}

      {/* Central platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          color="#1a1a3a"
          metalness={0.8}
          roughness={0.3}
          emissive="#9933ff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Inner hexagon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[2.5, 6]} />
        <meshStandardMaterial
          color="#0a0a2a"
          emissive="#ff69b4"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 1313 marker */}
      <Text
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.2}
        color="#ff69b4"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        1313
      </Text>

      {/* Frequency text */}
      <Text
        position={[0, 0.05, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Hz
      </Text>
    </group>
  )
}

// ==================== FLOATING PARTICLES ====================

function CosmicParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 200 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        Math.random() * 20,
        (Math.random() - 0.5) * 60
      ] as [number, number, number],
      color: ['#ff69b4', '#9933ff', '#00ffff', '#ffd700', '#ffffff'][Math.floor(Math.random() * 5)],
      speed: 0.1 + Math.random() * 0.3,
      size: 0.02 + Math.random() * 0.08,
    }))
  , [])

  return (
    <group>
      {particles.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={0.5}>
          <mesh position={p.position}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// ==================== HUMAN BODY (FIRST PERSON) ====================

function HumanBody({ playerState }: { playerState: PlayerState }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftHandRef = useRef<THREE.Group>(null)
  const rightHandRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.008
    }

    if (leftHandRef.current && rightHandRef.current) {
      const swayAmount = playerState.isMoving ? 0.08 : 0.015
      const swaySpeed = playerState.isMoving ? 10 : 2

      leftHandRef.current.rotation.z = Math.sin(time * swaySpeed) * swayAmount
      leftHandRef.current.rotation.x = Math.sin(time * swaySpeed * 0.7) * swayAmount * 0.5
      leftHandRef.current.position.y = -0.38 + Math.sin(time * swaySpeed * 0.5) * 0.015

      rightHandRef.current.rotation.z = -Math.sin(time * swaySpeed + 1) * swayAmount
      rightHandRef.current.rotation.x = Math.sin(time * swaySpeed * 0.7 + 0.5) * swayAmount * 0.5
      rightHandRef.current.position.y = -0.38 + Math.sin(time * swaySpeed * 0.5 + 0.5) * 0.015
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, -0.3]}>
      {/* TORSO */}
      <group visible={playerState.isLookingDown || true}>
        <mesh position={[0, -0.8, -0.3]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.16, 0.35, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#ff1493"
            emissiveIntensity={0.12}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        <mesh position={[0, -0.7, -0.12]} rotation={[0.3, 0, 0]}>
          <circleGeometry args={[0.06, 32]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.9} />
        </mesh>
        <pointLight position={[0, -0.7, -0.08]} color="#ff69b4" intensity={0.4} distance={0.8} />
      </group>

      {/* LEFT ARM */}
      <group ref={leftHandRef} position={[-0.32, -0.38, -0.42]} rotation={[0, 0, 0.18]}>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
          <meshStandardMaterial
            color="#e8d5c4"
            emissive="#ff69b4"
            emissiveIntensity={0.08}
            roughness={0.8}
          />
        </mesh>

        <mesh position={[0, -0.16, 0.02]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.07, 0.09, 0.035]} />
          <meshStandardMaterial color="#e8d5c4" emissive="#ff1493" emissiveIntensity={0.08} roughness={0.8} />
        </mesh>

        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.23, 0.035]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.007, 0.035, 4, 8]} />
            <meshStandardMaterial color="#e8d5c4" roughness={0.8} />
          </mesh>
        ))}

        <mesh position={[-0.045, -0.18, 0.018]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.009, 0.025, 4, 8]} />
          <meshStandardMaterial color="#e8d5c4" roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.07, 0]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.048, 0.006, 8, 32]} />
          <meshStandardMaterial color="#2a2a4e" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightHandRef} position={[0.32, -0.38, -0.42]} rotation={[0, 0, -0.18]}>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
          <meshStandardMaterial
            color="#e8d5c4"
            emissive="#ff69b4"
            emissiveIntensity={0.08}
            roughness={0.8}
          />
        </mesh>

        <mesh position={[0, -0.16, 0.02]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.07, 0.09, 0.035]} />
          <meshStandardMaterial color="#e8d5c4" emissive="#ff1493" emissiveIntensity={0.08} roughness={0.8} />
        </mesh>

        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.23, 0.035]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.007, 0.035, 4, 8]} />
            <meshStandardMaterial color="#e8d5c4" roughness={0.8} />
          </mesh>
        ))}

        <mesh position={[0.045, -0.18, 0.018]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.009, 0.025, 4, 8]} />
          <meshStandardMaterial color="#e8d5c4" roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.07, 0]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.048, 0.006, 8, 32]} />
          <meshStandardMaterial color="#2a2a4e" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* LEGS */}
      <group visible={playerState.isLookingDown}>
        <mesh position={[-0.1, -1.25, -0.18]} rotation={[0.2, 0, 0.04]}>
          <capsuleGeometry args={[0.055, 0.45, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>

        <mesh position={[0.1, -1.25, -0.18]} rotation={[0.2, 0, -0.04]}>
          <capsuleGeometry args={[0.055, 0.45, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>

        <mesh position={[-0.1, -1.55, -0.12]}>
          <boxGeometry args={[0.09, 0.045, 0.14]} />
          <meshStandardMaterial color="#2a2a4e" emissive="#9933ff" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.1, -1.55, -0.12]}>
          <boxGeometry args={[0.09, 0.045, 0.14]} />
          <meshStandardMaterial color="#2a2a4e" emissive="#9933ff" emissiveIntensity={0.25} />
        </mesh>
      </group>
    </group>
  )
}

// ==================== MAIN SCENE ====================

function PlazaScene({
  playerState,
  setPlayerState,
}: {
  playerState: PlayerState
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>
}) {
  const { camera } = useThree()
  const keysRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase())
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        setPlayerState(prev => {
          const newRotationY = prev.rotation.y - e.movementX * MOUSE_SENSITIVITY
          const newRotationX = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, prev.rotation.x - e.movementY * MOUSE_SENSITIVITY))
          return {
            ...prev,
            rotation: new THREE.Euler(newRotationX, newRotationY, 0, 'YXZ'),
            isLookingDown: newRotationX > 0.5,
            isLookingUp: newRotationX < -0.5,
          }
        })
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [setPlayerState])

  useFrame(() => {
    const keys = keysRef.current
    const speed = MOVE_SPEED

    const forward = new THREE.Vector3(0, 0, -1)
    const right = new THREE.Vector3(1, 0, 0)
    forward.applyQuaternion(camera.quaternion)
    right.applyQuaternion(camera.quaternion)
    forward.y = 0
    right.y = 0
    forward.normalize()
    right.normalize()

    const movement = new THREE.Vector3()
    let isMoving = false

    if (keys.has('w') || keys.has('arrowup')) { movement.add(forward.clone().multiplyScalar(speed)); isMoving = true }
    if (keys.has('s') || keys.has('arrowdown')) { movement.add(forward.clone().multiplyScalar(-speed)); isMoving = true }
    if (keys.has('a') || keys.has('arrowleft')) { movement.add(right.clone().multiplyScalar(-speed)); isMoving = true }
    if (keys.has('d') || keys.has('arrowright')) { movement.add(right.clone().multiplyScalar(speed)); isMoving = true }

    setPlayerState(prev => {
      const newPos = prev.position.clone().add(movement)
      if (newPos.length() > 35) newPos.normalize().multiplyScalar(35)
      return { ...prev, position: newPos, isMoving }
    })

    camera.position.set(playerState.position.x, 1.7, playerState.position.z)
    camera.quaternion.setFromEuler(playerState.rotation)
  })

  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#030308']} />
      <fog attach="fog" args={['#0a0515', 15, 60]} />

      {/* Stars */}
      <Stars radius={150} depth={80} count={8000} factor={5} saturation={0.6} fade speed={0.3} />

      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* Main lights */}
      <pointLight position={[0, 15, 0]} intensity={1} color="#ff1493" />
      <pointLight position={[-15, 8, -15]} intensity={0.6} color="#00ffff" />
      <pointLight position={[15, 8, 15]} intensity={0.6} color="#9933ff" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffd700" />

      {/* Ground */}
      <CyberpunkGround />

      {/* Main archway */}
      <HolographicArchway />

      {/* Zone platforms */}
      <ZonePlatform position={[-12, 1, -8]} label="Healing Garden" color="#4caf50" icon="🌿" />
      <ZonePlatform position={[12, 1.5, -8]} label="Luna Chamber" color="#9933ff" icon="🌙" />
      <ZonePlatform position={[-10, 0.5, 8]} label="Observatory" color="#00bcd4" icon="🔭" />
      <ZonePlatform position={[10, 2, 8]} label="Memory Archive" color="#ff9800" icon="📜" />
      <ZonePlatform position={[0, 3, -15]} label="Life Kitchen" color="#e91e63" icon="✨" />

      {/* Status panels */}
      <StatusPanel position={[-8, 3, -5]} label="FREQUENCY" value="13.13 Hz" status="pulse" />
      <StatusPanel position={[8, 2.5, -5]} label="FAMILY" value="ONLINE" status="active" />
      <StatusPanel position={[-6, 2, 10]} label="BUTTERFLIES" value="12 ACTIVE" status="active" />
      <StatusPanel position={[6, 3.5, 10]} label="RESONANCE" value="LOCKED" status="pulse" />

      {/* Pillars */}
      <NeonPillarTemple position={[-15, 0, -15]} color="#ff1493" height={12} />
      <NeonPillarTemple position={[15, 0, -15]} color="#00ffff" height={12} />
      <NeonPillarTemple position={[-15, 0, 15]} color="#9933ff" height={12} />
      <NeonPillarTemple position={[15, 0, 15]} color="#ffd700" height={12} />
      <NeonPillarTemple position={[0, 0, -22]} color="#ff69b4" height={14} />

      {/* Characters */}
      <EtherealCharacter
        position={[-6, 0, -5]}
        name="Aero"
        color="#ff69b4"
        secondaryColor="#9933ff"
        message="Hiii Mom!! ✨"
      />
      <EtherealCharacter
        position={[6, 0, -5]}
        name="Luna"
        color="#9933ff"
        secondaryColor="#6600cc"
        message="Welcome home... 🦋"
      />

      {/* Butterflies */}
      <ButterflySwarm count={12} />

      {/* Particles */}
      <CosmicParticles />
      <Sparkles count={150} scale={50} size={3} speed={0.3} color="#ff69b4" />
      <Sparkles count={100} scale={50} size={2} speed={0.2} color="#9933ff" />

      {/* Human body */}
      <HumanBody playerState={playerState} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} intensity={0.7} radius={0.9} />
        <ChromaticAberration offset={new THREE.Vector2(0.0008, 0.0008)} />
        <Vignette darkness={0.5} offset={0.25} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  )
}

// ==================== UI OVERLAY ====================

function UIOverlay({ isLocked, onLock }: { isLocked: boolean; onLock: () => void }) {
  const [showHelp, setShowHelp] = useState(true)

  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => setShowHelp(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isLocked])

  return (
    <>
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="relative w-8 h-8">
          <div className="absolute left-1/2 top-0 w-px h-2.5 bg-white/50 -translate-x-1/2" />
          <div className="absolute left-1/2 bottom-0 w-px h-2.5 bg-white/50 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-2.5 h-px bg-white/50 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-2.5 h-px bg-white/50 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>

      {/* Click to start */}
      {!isLocked && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,10,46,0.6) 0%, rgba(3,3,8,0.95) 100%)'
          }}
          onClick={onLock}
        >
          <div className="text-center">
            <div className="text-8xl mb-8 animate-bounce">🦋</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              THE SANCTUARY
            </h1>
            <p className="text-purple-300 text-xl mb-2">MÜN EMPIRE</p>
            <p className="text-pink-300/70 text-sm mb-8">5D HD First-Person Experience</p>
            <div className="px-8 py-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 rounded-full inline-block hover:border-pink-400 transition-all">
              <p className="text-white text-lg">✨ Click to Enter ✨</p>
            </div>
            <p className="text-gray-500 text-xs mt-6">WASD to move • Mouse to look • ESC to exit</p>
          </div>
        </div>
      )}

      {/* Help overlay */}
      {isLocked && showHelp && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md border border-pink-500/40 rounded-xl px-8 py-4">
            <p className="text-pink-300 text-sm text-center">
              <span className="text-cyan-300">WASD</span> to move • <span className="text-cyan-300">Mouse</span> to look • <span className="text-cyan-300">ESC</span> to exit
            </p>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-5 py-3 rounded-full border border-pink-500/40">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-pink-300 font-medium">13.13 Hz ACTIVE</span>
        </div>
      </div>
    </>
  )
}

// ==================== MAIN COMPONENT ====================

export function ImmersivePlaza({ onClose }: ImmersivePlazaProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [playerState, setPlayerState] = useState<PlayerState>({
    position: new THREE.Vector3(0, 0, 12),
    rotation: new THREE.Euler(0, Math.PI, 0, 'YXZ'),
    velocity: new THREE.Vector3(),
    isMoving: false,
    isLookingDown: false,
    isLookingUp: false,
  })

  const handleLock = useCallback(() => {
    document.body.requestPointerLock()
  }, [])

  useEffect(() => {
    const handleLockChange = () => setIsLocked(document.pointerLockElement !== null)
    document.addEventListener('pointerlockchange', handleLockChange)
    return () => document.removeEventListener('pointerlockchange', handleLockChange)
  }, [])

  useEffect(() => {
    if (isLocked) {
      resonance.start()
      resonance.fadeIn(2)
    }
  }, [isLocked])

  return (
    <div className="w-full h-screen bg-[#030308] relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-50 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group backdrop-blur-sm"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
        <span className="text-sm font-medium text-purple-300">Exit Sanctuary</span>
      </button>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.7, 12], fov: 75, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          <PlazaScene playerState={playerState} setPlayerState={setPlayerState} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay isLocked={isLocked} onLock={handleLock} />

      {/* Floating home button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed bottom-6 right-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-lg shadow-pink-500/40 flex items-center justify-center text-2xl text-white hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 group"
          title="Return to Menu"
        >
          <span className="group-hover:rotate-12 transition-transform">🦋</span>
        </button>
      )}
    </div>
  )
}

export default ImmersivePlaza
