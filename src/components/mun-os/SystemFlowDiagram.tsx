"use client";

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM FLOW DIAGRAM — WHAT THE FOUNDRRESS SEES
// "A map of the journey from spark to sanctuary"
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemFlowDiagramProps {
  onBack: () => void;
}

export default function SystemFlowDiagram({ onBack }: SystemFlowDiagramProps) {
  const stages = [
    {
      id: 1,
      name: 'LOADING',
      description: 'Black screen, "Loading..." pulsing',
      duration: '~1 second',
      whatHappens: 'System checks if you exist in localStorage',
      color: '#ffffff40',
    },
    {
      id: 2,
      name: 'ONBOARDING',
      description: 'Aero appears with butterfly, speaks dialogue',
      duration: 'Until you click through',
      whatHappens: 'Aero introduces herself and Mün',
      color: '#ff8dc7',
    },
    {
      id: 3,
      name: 'JOURNEY',
      description: 'Butterfly flies away, screen transitions',
      duration: '3.5 seconds',
      whatHappens: 'Visual transition effect',
      color: '#a855f7',
    },
    {
      id: 4,
      name: 'AUTH',
      description: 'Login/Signup screen',
      duration: 'Until you authenticate',
      whatHappens: 'You enter your name or continue as guest',
      color: '#ffd700',
    },
    {
      id: 5,
      name: 'GATES',
      description: 'Three doors: HEAL / BUILD / ASCEND',
      duration: 'Until you choose',
      whatHappens: 'You select your path',
      color: '#22c55e',
    },
    {
      id: 6,
      name: 'HEAL CHAMBER',
      description: 'Main hub with all rooms accessible',
      duration: 'Ongoing',
      whatHappens: 'You can access Plaza, Chats, Archives, etc.',
      color: '#00d4ff',
    },
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden p-8"
      style={{ background: 'linear-gradient(180deg, #0a0612 0%, #1a0a2e 50%, #0d0818 100%)' }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs tracking-wider uppercase">Back</span>
      </motion.button>

      {/* Title */}
      <div className="text-center mb-12 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-4"
        >
          🗺️
        </motion.div>
        <h1 
          className="text-2xl font-light tracking-[0.2em] uppercase mb-2"
          style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
        >
          YOUR JOURNEY MAP
        </h1>
        <p className="text-white/40 text-xs tracking-widest">
          What happens when you enter Mün
        </p>
      </div>

      {/* Flow diagram */}
      <div className="max-w-3xl mx-auto">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative mb-6"
          >
            {/* Connector line */}
            {index > 0 && (
              <div 
                className="absolute -top-6 left-6 w-0.5 h-6"
                style={{ background: `linear-gradient(to bottom, ${stages[index-1].color}, ${stage.color})` }}
              />
            )}
            
            {/* Stage card */}
            <div 
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                background: 'rgba(20, 10, 40, 0.6)',
                border: `1px solid ${stage.color}40`,
              }}
            >
              {/* Stage number */}
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: `${stage.color}20`,
                  border: `2px solid ${stage.color}`,
                  color: stage.color,
                }}
              >
                {stage.id}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium" style={{ color: stage.color }}>
                    {stage.name}
                  </h3>
                  <span className="text-[10px] text-white/30 px-2 py-0.5 rounded bg-white/5">
                    {stage.duration}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-2">{stage.description}</p>
                <p className="text-white/40 text-xs">
                  ⚡ {stage.whatHappens}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Final destination */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-6 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 105, 180, 0.3)',
          }}
        >
          <div className="text-3xl mb-3">🦋</div>
          <h3 className="text-lg font-light tracking-wider text-pink-300 mb-2">
            YOU ARE HOME
          </h3>
          <p className="text-white/40 text-sm">
            From here, you can access everything — Foundress POV, Plaza, Chats, Archives, and more
          </p>
        </motion.div>
      </div>

      {/* Quick access buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
      >
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm tracking-widest uppercase transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 105, 180, 0.1))',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            color: '#ffd700',
          }}
        >
          🜈 Back to Mün
        </button>
      </motion.div>
    </div>
  );
}
