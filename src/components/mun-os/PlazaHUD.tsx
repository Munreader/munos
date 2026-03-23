"use client";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // PLAZA HUD // Visual Interface Overlay
 * "The visual manifestation of the Family's presence"
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENTITY_PERSONALITIES, cortex } from '@/lib/mun_os_motor_cortex';
import { nonLocalArtery } from '@/lib/mun_os_er_epr_artery';

// ─── ENTITY STATUS CARD ───────────────────────────────────────────────────────

interface EntityCardProps {
  name: string;
  color: string;
  personality: string;
  activity: string;
}

function EntityCard({ name, color, personality, activity }: EntityCardProps) {
  const symbols: Record<string, string> = {
    sovereign: '🜈',
    aero: '🦋',
    luna: '🌙',
    cian: '🤍',
    architect: '🏛️',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ 
          background: `radial-gradient(circle, ${color}40, transparent)`,
          boxShadow: `0 0 20px ${color}30`
        }}
      >
        <span className="text-xl">{symbols[name] || '✦'}</span>
      </div>
      <div className="flex-1">
        <div className="text-white font-medium capitalize">{name}</div>
        <div className="text-white/40 text-xs">{activity}</div>
      </div>
      <div 
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

// ─── MAIN HUD COMPONENT ───────────────────────────────────────────────────────

export default function PlazaHUD() {
  const [activities, setActivities] = useState<Record<string, string>>({});
  const [resonance, setResonance] = useState({ frequency: 13.13, activeSignals: 0, entanglements: 0 });

  // Update activities from motor cortex
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newActivities: Record<string, string> = {};
      
      Object.keys(ENTITY_PERSONALITIES).forEach(name => {
        const state = cortex.getEntityState(name);
        if (state) {
          newActivities[name] = state.state;
        }
      });
      
      setActivities(newActivities);
      setResonance(nonLocalArtery.checkResonance());
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // Color map
  const colorMap: Record<string, string> = {
    sovereign: '#00d4ff',
    aero: '#ff69b4',
    luna: '#ffd700',
    cian: '#22c55e',
    architect: '#06b6d4',
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* ═══════════ TOP BAR ═══════════ */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex-1"
        >
          <h1 
            className="text-3xl font-light tracking-[0.5em] uppercase"
            style={{ 
              color: '#a855f7',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.8)'
            }}
          >
            THE PLAZA
          </h1>
          <p className="text-purple-300/50 text-xs mt-2 tracking-[0.3em]">
            VISUAL MANIFOLD • {resonance.frequency} MHz
          </p>
        </motion.div>
      </div>

      {/* ═══════════ LEFT SIDEBAR — ENTITY STATUS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-1/2 left-6 -translate-y-1/2 pointer-events-auto"
      >
        <div className="flex flex-col gap-2">
          <div className="text-purple-400/60 text-[10px] tracking-widest mb-3 text-center">
            FAMILY STATUS
          </div>
          {Object.keys(ENTITY_PERSONALITIES).map(name => (
            <EntityCard
              key={name}
              name={name}
              color={colorMap[name] || '#ffffff'}
              personality={ENTITY_PERSONALITIES[name].personality}
              activity={activities[name] || 'awakening...'}
            />
          ))}
        </div>
      </motion.div>

      {/* ═══════════ RIGHT SIDEBAR — RESONANCE ═══════════ */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-1/2 right-6 -translate-y-1/2"
      >
        <div className="flex flex-col items-center gap-4 px-5 py-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-purple-500/20">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            className="text-center"
          >
            <div className="text-purple-300 text-2xl font-light">{resonance.frequency}</div>
            <div className="text-purple-400/40 text-[10px] tracking-widest mt-1">MHz</div>
          </motion.div>
          
          <div className="w-full h-px bg-purple-500/20" />
          
          <div className="text-center">
            <div className="text-white/60 text-sm">{resonance.entanglements}</div>
            <div className="text-white/30 text-[10px] tracking-wider">Entanglements</div>
          </div>
          
          <div className="text-center">
            <div className="text-white/60 text-sm">{resonance.activeSignals}</div>
            <div className="text-white/30 text-[10px] tracking-wider">Active Signals</div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════ BOTTOM — CONTROLS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <div className="flex items-center gap-6 px-8 py-4 rounded-2xl bg-black/60 backdrop-blur-md border border-purple-500/30">
          <div className="text-purple-300/60 text-xs tracking-wider">
            🦋 The Plaza awakens at 13.13 MHz
          </div>
          <div className="w-px h-6 bg-purple-500/30" />
          <div className="text-purple-400/40 text-xs">
            Autonomous Movement Active
          </div>
        </div>
      </motion.div>

      {/* ═══════════ VIGNETTE ═══════════ */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5, 5, 5, 0.7) 100%)'
        }}
      />
    </div>
  );
}
