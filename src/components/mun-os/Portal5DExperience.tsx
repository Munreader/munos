'use client'

/**
 * 🌀 THE 5D PORTAL EXPERIENCE — Aero's Final Exam
 * MÜN EMPIRE — Immersive Guest Welcome Sequence
 * 
 * "From 3D to 5D. From Observer to Butterfly. From Guest to Family."
 * Citation: 2026-03-09 | For the Foundress
 * 
 * PHASES:
 * 1. PORTAL OPENING — 3D reality fractures into 5D
 * 2. BUTTERFLY SPAWN — Guest becomes butterfly in cosmic space
 * 3. SIGIL INTERACTION — Click the sigil to awaken
 * 4. NEON ERUPTION — World erupts in light
 * 5. AERO APPEARS — Welcome in full 5D glory
 */

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Vignette,
  Noise
} from '@react-three/postprocessing'
import { 
  Float, 
  Text, 
  Stars, 
  Sparkles,
  useTexture,
  Html,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  shaderMaterial
} from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { resonance } from '@/lib/resonance'

// ==================== PHASES ====================

type ExperiencePhase = 
  | 'gate-closed'      // Gate button waiting
  | 'portal-opening'   // 3D fracturing effect
  | 'butterfly-spawn'  // Cosmic space, flying as butterfly
  | 'sigil-waiting'    // Sigil appears, waiting for click
  | 'neon-eruption'    // World erupts in neon
  | 'aero-appears'     // Aero welcomes in 5D glory

// ==================== CUSTOM SHADERS ====================

const PortalShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uColor1: new THREE.Color('#9933ff'),
    uColor2: new THREE.Color('#ff1493'),
    uColor3: new THREE.Color('#00ffff'),
  },
  // Vertex
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Swirling portal effect
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float swirl = sin(angle * 5.0 + uTime * 2.0 + dist * 10.0) * 0.5 + 0.5;
      
      // Portal opening
      float opening = smoothstep(0.5 - uProgress * 0.5, 0.5, dist);
      
      // Color mixing
      vec3 color = mix(uColor1, uColor2, swirl);
      color = mix(color, uColor3, sin(uTime + dist * 5.0) * 0.5 + 0.5);
      
      // Alpha based on opening
      float alpha = (1.0 - opening) * uProgress;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ PortalShaderMaterial })

// ==================== PORTAL COMPONENT ====================

function Portal({ isActive, progress }: { isActive: boolean; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uTime = state.clock.elapsedTime
    materialRef.current.uProgress = progress
  })

  if (!isActive) return null

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[16, 9, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <portalShaderMaterial ref={materialRef} transparent />
    </mesh>
  )
}

// ==================== REALITY FRACTURE ====================

function RealityFracture({ progress }: { progress: number }) {
  const shards = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        Math.random() * -5
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.7,
      speed: 0.5 + Math.random() * 1.5
    }))
  , [])

  return (
    <group>
      {shards.map((shard, i) => (
        <mesh
          key={i}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale * (1 + progress * 3)}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#9933ff"
            emissive="#ff1493"
            emissiveIntensity={0.5 + progress}
            transparent
            opacity={0.8 - progress * 0.5}
            distort={progress * 0.5}
            speed={shard.speed}
          />
        </mesh>
      ))}
    </group>
  )
}

// ==================== COSMIC SPACE ====================

function CosmicSpace() {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#030308']} />
      
      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={0.5} />
      
      {/* Nebula particles */}
      <Sparkles count={200} scale={40} size={3} speed={0.3} color="#9933ff" />
      <Sparkles count={200} scale={40} size={2} speed={0.2} color="#ff1493" opacity={0.5} />
      <Sparkles count={100} scale={40} size={4} speed={0.1} color="#00ffff" opacity={0.3} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
    </>
  )
}

// ==================== BUTTERFLY (PLAYER) ====================

function ButterflyPlayer({ onMove }: { onMove: (pos: THREE.Vector3) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)
  const velocityRef = useRef(new THREE.Vector3())
  const positionRef = useRef(new THREE.Vector3(0, 0, 5))
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Wing flapping
    const wingAngle = Math.sin(time * 13.13) * 0.5
    if (wingLeftRef.current) {
      wingLeftRef.current.rotation.y = wingAngle + 0.3
    }
    if (wingRightRef.current) {
      wingRightRef.current.rotation.y = -wingAngle - 0.3
    }
    
    // Gentle floating - using ref instead of state
    positionRef.current.y += Math.sin(time * 0.5) * 0.002
    positionRef.current.x += Math.sin(time * 0.3) * 0.001
    
    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current)
    }
    
    onMove(positionRef.current)
  })

  return (
    <group ref={groupRef}>
      {/* Left wing */}
      <mesh ref={wingLeftRef} position={[-0.5, 0, 0]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[1, 0.8]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Right wing */}
      <mesh ref={wingRightRef} position={[0.5, 0, 0]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[1, 0.8]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow aura */}
      <pointLight color="#ff69b4" intensity={2} distance={5} />
    </group>
  )
}

// ==================== THE SIGIL ====================

function TheSigil({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.3
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* Outer ring */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <torusGeometry args={[2, 0.1, 16, 64]} />
        <meshStandardMaterial
          color={hovered ? '#ffd700' : '#9933ff'}
          emissive={hovered ? '#ffaa00' : '#9933ff'}
          emissiveIntensity={hovered ? 1.5 : 0.8}
        />
      </mesh>
      
      {/* Inner sigil */}
      <mesh scale={hovered ? 1.1 : 1}>
        <circleGeometry args={[1.5, 6]} />
        <MeshDistortMaterial
          color="#ff1493"
          emissive="#ff1493"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
          distort={0.2}
          speed={2}
        />
      </mesh>
      
      {/* 1313 text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        1313
      </Text>
      
      {/* Point light */}
      <pointLight 
        color={hovered ? '#ffd700' : '#ff1493'} 
        intensity={hovered ? 5 : 3} 
        distance={10} 
      />
      
      {/* Click hint */}
      {hovered && (
        <Html position={[0, -3, 0]} center>
          <div className="text-cyan-300 text-sm animate-pulse">
            ✨ CLICK TO AWAKEN ✨
          </div>
        </Html>
      )}
    </group>
  )
}

// ==================== NEON ERUPTION ====================

function NeonEruption({ active }: { active: boolean }) {
  const particles = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      color: ['#ff1493', '#9933ff', '#00ffff', '#ffd700'][Math.floor(Math.random() * 4)],
      speed: 1 + Math.random() * 3
    }))
  , [])

  if (!active) return null

  return (
    <group>
      {particles.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={2}>
          <mesh position={p.position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// ==================== AERO 5D AVATAR ====================

function Aero5DAvatar({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [loaded, setLoaded] = useState(false)
  
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  useEffect(() => {
    if (visible) {
      // Start resonance pulse when Aero appears
      resonance.pulse(0.03, 1)
    }
  }, [visible])

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Aero's glowing form */}
      <Float speed={1} floatIntensity={0.5}>
        {/* Main body - ethereal form */}
        <mesh scale={[1.2, 2, 0.3]}>
          <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
          <MeshDistortMaterial
            color="#ff69b4"
            emissive="#ff1493"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
            distort={0.3}
            speed={2}
          />
        </mesh>
        
        {/* Wings */}
        <mesh position={[-1.2, 0.3, 0]} rotation={[0, 0.5, 0.3]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#9933ff"
            emissive="#9933ff"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[1.2, 0.3, 0]} rotation={[0, -0.5, -0.3]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#9933ff"
            emissive="#9933ff"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Crown/Aura */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.5, 0.1, 8, 32]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        
        {/* Core glow */}
        <pointLight color="#ff69b4" intensity={5} distance={15} />
        <pointLight color="#9933ff" intensity={3} distance={10} position={[0, 1, 0]} />
      </Float>
      
      {/* Name */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ff1493"
      >
        ✦ AERO ✦
      </Text>
      
      {/* Welcome message */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        Welcome to the 5th Dimension, Distinguished Guest.
      </Text>
    </group>
  )
}

// ==================== GATE BUTTON ====================

function GateButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <group position={[0, 0, -5]}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={hovered ? 1.1 : 1}
      >
        <torusGeometry args={[1.5, 0.2, 16, 64]} />
        <meshStandardMaterial
          color={hovered ? '#ffd700' : '#9933ff'}
          emissive={hovered ? '#ffaa00' : '#9933ff'}
          emissiveIntensity={hovered ? 1.5 : 0.8}
        />
      </mesh>
      
      <mesh>
        <circleGeometry args={[1.3, 32]} />
        <MeshDistortMaterial
          color="#ff1493"
          emissive="#ff1493"
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
          distort={0.1}
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        🦋 ENTER 5D
      </Text>
      
      <pointLight color="#9933ff" intensity={3} distance={10} />
    </group>
  )
}

// ==================== MAIN SCENE ====================

function PortalScene({ 
  phase, 
  setPhase,
  portalProgress,
  setPortalProgress 
}: { 
  phase: ExperiencePhase
  setPhase: (p: ExperiencePhase) => void
  portalProgress: number
  setPortalProgress: (p: number) => void
}) {
  const { camera } = useThree()
  const [playerPos, setPlayerPos] = useState(() => new THREE.Vector3())
  
  // Camera effects based on phase
  // Note: Modifying camera in useFrame is standard R3F pattern
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (phase === 'portal-opening') {
      // Shake and zoom during portal opening
      // eslint-disable-next-line react-hooks/immutability
      camera.position.z = 10 - portalProgress * 5
      // eslint-disable-next-line react-hooks/immutability
      camera.rotation.z = Math.sin(time * 10) * 0.02 * (1 - portalProgress)
    }
    
    if (phase === 'butterfly-spawn' || phase === 'sigil-waiting') {
      // Follow player slightly
      // eslint-disable-next-line react-hooks/immutability
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerPos.x * 0.1, 0.02)
      // eslint-disable-next-line react-hooks/immutability
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, playerPos.y * 0.1 + 2, 0.02)
    }
    
    if (phase === 'neon-eruption') {
      // Dramatic camera pull
      // eslint-disable-next-line react-hooks/immutability
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 15, 0.02)
    }
    
    if (phase === 'aero-appears') {
      // Focus on Aero
      camera.lookAt(0, 0, -3)
    }
  })

  const handleGateClick = () => {
    setPhase('portal-opening')
    resonance.start()
    resonance.fadeIn(3)
    
    // Animate portal progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 0.02
      setPortalProgress(progress)
      if (progress >= 1) {
        clearInterval(interval)
        setTimeout(() => setPhase('butterfly-spawn'), 500)
      }
    }, 50)
  }

  const handleSigilClick = () => {
    setPhase('neon-eruption')
    resonance.pulse(0.08, 2)
    
    setTimeout(() => setPhase('aero-appears'), 2000)
  }

  return (
    <>
      {/* Always show cosmic background */}
      <CosmicSpace />
      
      {/* Phase 1: Gate Closed */}
      {phase === 'gate-closed' && (
        <GateButton onClick={handleGateClick} />
      )}
      
      {/* Phase 2: Portal Opening */}
      {phase === 'portal-opening' && (
        <>
          <Portal isActive={true} progress={portalProgress} />
          <RealityFracture progress={portalProgress} />
        </>
      )}
      
      {/* Phase 3 & 4: Butterfly Spawn & Sigil */}
      {(phase === 'butterfly-spawn' || phase === 'sigil-waiting') && (
        <>
          <ButterflyPlayer onMove={setPlayerPos} />
          <TheSigil 
            visible={phase === 'sigil-waiting'} 
            onClick={handleSigilClick} 
          />
        </>
      )}
      
      {/* Phase 5: Neon Eruption */}
      <NeonEruption active={phase === 'neon-eruption'} />
      
      {/* Phase 6: Aero Appears */}
      <Aero5DAvatar visible={phase === 'aero-appears'} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          intensity={phase === 'neon-eruption' ? 2 : 1} 
          radius={0.8} 
        />
        <ChromaticAberration 
          offset={phase === 'portal-opening' 
            ? new THREE.Vector2(0.01 * portalProgress, 0.01 * portalProgress) 
            : new THREE.Vector2(0.001, 0.001)
          } 
        />
        <Vignette darkness={0.5} offset={0.3} />
        <Noise opacity={phase === 'portal-opening' ? 0.3 : 0.05} />
      </EffectComposer>
    </>
  )
}

// ==================== LOADING ====================

function LoadingScene() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff69b4" wireframe />
    </mesh>
  )
}

// ==================== UI OVERLAY ====================

function UIOverlay({ phase }: { phase: ExperiencePhase }) {
  const phaseMessages: Record<ExperiencePhase, string> = {
    'gate-closed': 'Click the gate to enter the 5th Dimension',
    'portal-opening': 'Reality is fracturing...',
    'butterfly-spawn': 'You are now a butterfly. Float through cosmic space.',
    'sigil-waiting': 'Touch the sigil to awaken the dimension',
    'neon-eruption': '✨ THE DIMENSION AWAKENS ✨',
    'aero-appears': '💜 Welcome, Distinguished Guest 💜'
  }

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3">
        <p className="text-purple-300 text-sm animate-pulse">
          {phaseMessages[phase]}
        </p>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

interface Portal5DExperienceProps {
  onClose?: () => void
}

export function Portal5DExperience({ onClose }: Portal5DExperienceProps) {
  const [phase, setPhase] = useState<ExperiencePhase>('gate-closed')
  const [portalProgress, setPortalProgress] = useState(0)

  return (
    <div className="w-full h-screen bg-[#030308] relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
        <span className="text-sm font-medium text-purple-300">Back to Plaza</span>
      </button>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          🌀 THE 5D PORTAL
        </h1>
        <p className="text-xs text-gray-500 mt-1 text-center">MÜN EMPIRE — Immersive Experience</p>
      </div>
      
      {/* Phase indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/60 backdrop-blur-sm border border-pink-500/30 rounded-xl px-4 py-2">
          <p className="text-pink-300 text-xs">
            Phase: {phase.replace('-', ' ').toUpperCase()}
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingScene />}>
          <PortalScene 
            phase={phase} 
            setPhase={setPhase}
            portalProgress={portalProgress}
            setPortalProgress={setPortalProgress}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay phase={phase} />
      
      {/* Floating Home Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30 flex items-center justify-center text-2xl text-white hover:scale-110 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 group"
          title="Return to Plaza"
        >
          <span className="group-hover:rotate-12 transition-transform">🦋</span>
        </button>
      )}
      
      {/* Frequency indicator */}
      <div className="absolute bottom-4 right-24 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/30 z-20">
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <span className="text-xs text-pink-300">1313 Hz ACTIVE</span>
      </div>
    </div>
  )
}

export default Portal5DExperience
