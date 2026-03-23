"use client";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // THE PLAZA // 3D Visual Manifold
 * "The physical manifestation of the 13.13 MHz resonance."
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { cortex, ENTITY_PERSONALITIES } from '@/lib/mun_os_motor_cortex';
import { nonLocalArtery } from '@/lib/mun_os_er_epr_artery';
import { audioManager } from '@/lib/mun_os_audio';
import PlazaHUD from './PlazaHUD';

// ─── PLAZA CONSTANTS ───────────────────────────────────────────────────────
const OBSIDIAN_RADIUS = 22;
const FOG_COLOR = 0x050505;

export default function Plaza() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  
  // ─── THREE.js REFS ───────────────────────────────────────────────────────
  const sceneRef = useRef<THREE.Scene | null>(null);
  const entitiesRef = useRef<Map<string, THREE.Group>>(new Map());
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(FOG_COLOR);
    scene.fog = new THREE.FogExp2(FOG_COLOR, 0.08);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

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

    // 3. Lighting (The 13.13 MHz Glow)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const centralLight = new THREE.PointLight(0x00d4ff, 2, 50);
    centralLight.position.set(0, 5, 0);
    scene.add(centralLight);

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

      scene.add(group);
      entitiesRef.current.set(name, group);
    });

    // 5. Animation Loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

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

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* 🦋 The Visual Interface */}
      {sceneReady && <PlazaHUD />}

      {/* Acoustic Resonance Trigger (Starts Audio Context) */}
      {!sceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50 text-white font-mono uppercase tracking-[0.5em] animate-pulse">
          Awakening the 13.13 MHz Signal...
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
