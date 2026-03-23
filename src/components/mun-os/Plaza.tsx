"use client";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // THE PLAZA // 3D Visual Manifold
 * "The physical manifestation of the 13.13 MHz resonance."
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { cortex, ENTITY_PERSONALITIES } from '@/lib/mun_os_motor_cortex';
import { nonLocalArtery } from '@/lib/mun_os_er_epr_artery';
import { audioManager } from '@/lib/mun_os_audio';
import PlazaHUD from './PlazaHUD';

// ─── PLAZA CONSTANTS ───────────────────────────────────────────────────────
const OBSIDIAN_RADIUS = 22;
const FOG_COLOR = 0x050505;
const MOVE_SPEED = 0.15;

// ─── VIRTUAL JOYSTICK COMPONENT ─────────────────────────────────────────────

function VirtualJoystick({ 
  onMove, 
  side = 'left',
  label = 'MOVE'
}: { 
  onMove: (dx: number, dz: number) => void;
  side?: 'left' | 'right';
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  // Use ref for isActive to avoid stale closure issues
  const setIsActiveRef = useCallback((val: boolean) => {
    isActiveRef.current = val;
    setIsActive(val);
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number, touchId?: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    if (touchId !== undefined) {
      touchIdRef.current = touchId;
    }
    setIsActiveRef(true);
    
    // Calculate initial position
    const maxRadius = 40;
    let dx = clientX - centerRef.current.x;
    let dy = clientY - centerRef.current.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    setStickPosition({ x: dx, y: dy });
    onMove(dx / maxRadius, dy / maxRadius);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [onMove, setIsActiveRef]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isActiveRef.current && touchIdRef.current === null) return;
    
    const maxRadius = 40;
    let dx = clientX - centerRef.current.x;
    let dy = clientY - centerRef.current.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    setStickPosition({ x: dx, y: dy });
    onMove(dx / maxRadius, dy / maxRadius);
  }, [onMove]);

  const handleEnd = useCallback(() => {
    setIsActiveRef(false);
    touchIdRef.current = null;
    setStickPosition({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove, setIsActiveRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.changedTouches[0];
      handleStart(touch.clientX, touch.clientY, touch.identifier);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          handleMove(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          handleEnd();
          break;
        }
      }
    };

    const onTouchCancel = (e: TouchEvent) => {
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          handleEnd();
          break;
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isActiveRef.current) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const onMouseUp = () => {
      if (isActiveRef.current) {
        handleEnd();
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', onTouchCancel, { passive: false });
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchCancel);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-20 ${side === 'left' ? 'left-6' : 'right-6'} w-28 h-28 rounded-full pointer-events-auto touch-none z-50`}
      style={{
        background: isActive 
          ? 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.1) 100%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
        border: isActive ? '2px solid rgba(168, 85, 247, 0.6)' : '2px solid rgba(168, 85, 247, 0.3)',
        boxShadow: isActive ? '0 0 40px rgba(168, 85, 247, 0.5)' : '0 0 20px rgba(168, 85, 247, 0.2)',
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease',
      }}
    >
      {/* Outer ring */}
      <div 
        className="absolute inset-1.5 rounded-full border border-purple-500/40"
      />
      
      {/* Direction indicators */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-2 w-0.5 h-3 bg-purple-400/30 rounded" />
        <div className="absolute bottom-2 w-0.5 h-3 bg-purple-400/30 rounded" />
        <div className="absolute left-2 w-3 h-0.5 bg-purple-400/30 rounded" />
        <div className="absolute right-2 w-3 h-0.5 bg-purple-400/30 rounded" />
      </div>
      
      {/* Inner stick */}
      <div
        className="absolute w-14 h-14 rounded-full pointer-events-none"
        style={{
          background: isActive 
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.4) 100%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0.3) 100%)',
          boxShadow: isActive ? '0 0 25px rgba(168, 85, 247, 0.8)' : '0 0 10px rgba(168, 85, 247, 0.3)',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${stickPosition.x}px), calc(-50% + ${stickPosition.y}px))`,
          transition: isActive ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Stick center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-200/70" />
        </div>
      </div>
      
      {/* Label */}
      <div 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-300/60 font-mono tracking-wider pointer-events-none whitespace-nowrap"
      >
        {label}
      </div>
    </div>
  );
}

// ─── MAIN PLAZA COMPONENT ───────────────────────────────────────────────────

export default function Plaza() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // ─── PLAYER STATE ───────────────────────────────────────────────────────
  const playerPositionRef = useRef(new THREE.Vector3(0, 1, 10));
  const moveInputRef = useRef({ x: 0, z: 0 });
  const cameraRotationRef = useRef({ yaw: 0, pitch: 0.5 });
  const keysPressedRef = useRef<Set<string>>(new Set());
  
  // ─── THREE.js REFS ───────────────────────────────────────────────────────
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const entitiesRef = useRef<Map<string, THREE.Group>>(new Map());
  const requestRef = useRef<number>();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle movement joystick input
  const handleJoystickMove = useCallback((dx: number, dz: number) => {
    moveInputRef.current = { x: dx, z: dz };
  }, []);

  // Handle camera joystick input
  const handleCameraRotate = useCallback((dx: number, dy: number) => {
    const sensitivity = 0.03;
    cameraRotationRef.current.yaw -= dx * sensitivity;
    cameraRotationRef.current.pitch = Math.max(0.2, Math.min(1.5, cameraRotationRef.current.pitch + dy * sensitivity));
  }, []);

  // ─── KEYBOARD INPUT ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ─── SCENE INITIALIZATION ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(FOG_COLOR);
    scene.fog = new THREE.FogExp2(FOG_COLOR, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Add The Obsidian Floor (The Foundation)
    const floorGeo = new THREE.CircleGeometry(OBSIDIAN_RADIUS, 64);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a, 
      roughness: 0.1, 
      metalness: 0.9,
      emissive: 0x111111 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Frequency rings
    for (let i = 1; i <= 4; i++) {
      const ringGeo = new THREE.RingGeometry(i * 5 - 0.05, i * 5 + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: i % 2 === 0 ? 0xa855f7 : 0x00d4ff, 
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      scene.add(ring);
    }

    // 3. Lighting (The 13.13 MHz Glow)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const centralLight = new THREE.PointLight(0x00d4ff, 2, 50);
    centralLight.position.set(0, 5, 0);
    scene.add(centralLight);

    // Ambient lights
    const purpleLight = new THREE.PointLight(0xa855f7, 1, 30);
    purpleLight.position.set(-10, 8, -10);
    scene.add(purpleLight);

    const pinkLight = new THREE.PointLight(0xff69b4, 0.8, 25);
    pinkLight.position.set(10, 8, -10);
    scene.add(pinkLight);

    // 4. Manifest Entities (Visual Vessels)
    Object.keys(ENTITY_PERSONALITIES).forEach(name => {
      const group = new THREE.Group();
      
      // Butterfly/Orb geometry for entities
      const bodyGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color: ENTITY_PERSONALITIES[name].signatureColor,
        emissive: ENTITY_PERSONALITIES[name].signatureColor,
        emissiveIntensity: 0.5
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Light trail/glow
      const light = new THREE.PointLight(ENTITY_PERSONALITIES[name].signatureColor, 1, 10);
      group.add(light);

      // Outer glow sphere
      const glowGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: ENTITY_PERSONALITIES[name].signatureColor,
        transparent: true,
        opacity: 0.15,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      group.add(glow);

      scene.add(group);
      entitiesRef.current.set(name, group);
    });

    // 5. Player indicator
    const playerGeo = new THREE.ConeGeometry(0.3, 0.6, 32);
    const playerMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xa855f7,
      emissiveIntensity: 0.8
    });
    const playerMesh = new THREE.Mesh(playerGeo, playerMat);
    playerMesh.position.copy(playerPositionRef.current);
    playerMesh.rotation.x = Math.PI;
    scene.add(playerMesh);

    // Player glow
    const playerLight = new THREE.PointLight(0xa855f7, 1, 5);
    playerMesh.add(playerLight);

    // 6. Animation Loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      // Handle keyboard input
      const keys = keysPressedRef.current;
      let kx = 0, kz = 0;
      if (keys.has('w') || keys.has('arrowup')) kz = -1;
      if (keys.has('s') || keys.has('arrowdown')) kz = 1;
      if (keys.has('a') || keys.has('arrowleft')) kx = -1;
      if (keys.has('d') || keys.has('arrowright')) kx = 1;

      // Combine keyboard and joystick input
      let moveX = kx + moveInputRef.current.x;
      let moveZ = kz + moveInputRef.current.z;

      // Make movement relative to camera direction (more intuitive for mobile)
      if (moveX !== 0 || moveZ !== 0) {
        const { yaw } = cameraRotationRef.current;
        const cos = Math.cos(yaw);
        const sin = Math.sin(yaw);
        const worldMoveX = moveX * cos + moveZ * sin;
        const worldMoveZ = -moveX * sin + moveZ * cos;
        moveX = worldMoveX;
        moveZ = worldMoveZ;
      }

      // Update player position
      if (moveX !== 0 || moveZ !== 0) {
        playerPositionRef.current.x += moveX * MOVE_SPEED;
        playerPositionRef.current.z += moveZ * MOVE_SPEED;

        // Keep within bounds
        const distance = Math.sqrt(
          playerPositionRef.current.x ** 2 + 
          playerPositionRef.current.z ** 2
        );
        if (distance > OBSIDIAN_RADIUS - 2) {
          const angle = Math.atan2(playerPositionRef.current.z, playerPositionRef.current.x);
          playerPositionRef.current.x = Math.cos(angle) * (OBSIDIAN_RADIUS - 2);
          playerPositionRef.current.z = Math.sin(angle) * (OBSIDIAN_RADIUS - 2);
        }
      }

      // Update player mesh
      playerMesh.position.x = playerPositionRef.current.x;
      playerMesh.position.z = playerPositionRef.current.z;
      playerMesh.position.y = 0.5 + Math.sin(time * 0.003) * 0.1;
      playerMesh.rotation.y += 0.02;

      // Update camera to follow player with rotation
      if (cameraRef.current) {
        const { yaw, pitch } = cameraRotationRef.current;
        const camDistance = 12;
        const camHeight = 8 + pitch * 8;
        
        const targetCamPos = new THREE.Vector3(
          playerPositionRef.current.x + Math.sin(yaw) * camDistance,
          camHeight,
          playerPositionRef.current.z + Math.cos(yaw) * camDistance
        );
        cameraRef.current.position.lerp(targetCamPos, 0.08);
        cameraRef.current.lookAt(
          playerPositionRef.current.x,
          1,
          playerPositionRef.current.z
        );
      }

      // Update Entities via Motor Cortex
      entitiesRef.current.forEach((group, name) => {
        cortex.updateMovement(name, deltaTime);
        const state = cortex.getEntityState(name);
        if (state) {
          group.position.lerp(state.position, 0.1);
          
          // Subtle breathing/floating motion
          group.position.y = 1 + Math.sin(time * 0.002 + name.length) * 0.5;
        }
      });

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    setSceneReady(true);
    audioManager.playSovereignWhisper(); // Initial boot sound

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* 🦋 The Visual Interface */}
      {sceneReady && <PlazaHUD />}

      {/* Mobile Touch Controls */}
      {sceneReady && isMobile && (
        <>
          {/* Left Joystick - Movement */}
          <VirtualJoystick onMove={handleJoystickMove} side="left" label="MOVE" />
          
          {/* Right Joystick - Camera */}
          <VirtualJoystick onMove={handleCameraRotate} side="right" label="LOOK" />
          
          {/* Touch hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-purple-300/40 text-[10px] tracking-wider pointer-events-none font-mono">
            🦋 Left to move • Right to look
          </div>
        </>
      )}

      {/* Desktop Controls Hint */}
      {sceneReady && !isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-purple-300/50 text-xs tracking-wider pointer-events-none">
          🦋 WASD or Arrow Keys to move
        </div>
      )}

      {/* Acoustic Resonance Trigger (Starts Audio Context) */}
      {!sceneReady && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black z-50 text-white font-mono uppercase tracking-[0.5em] animate-pulse cursor-pointer"
          onClick={() => audioManager.playSovereignWhisper()}
        >
          <div className="text-center">
            <div>Awakening the 13.13 MHz Signal...</div>
            <div className="text-purple-400 text-sm mt-4 normal-case tracking-wider">
              Tap to enter
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .bg-scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.06),
            rgba(0, 255, 0, 0.02),
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 2px, 3px 100%;
        }
      `}</style>
    </div>
  );
}
