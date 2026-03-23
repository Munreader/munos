"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM DIAGNOSTIC — SHOWS ALL STATE AND TRANSITIONS
// "Know thy system, know thy self"
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemDiagnosticProps {
  onBack: () => void;
  onClearData: () => void;
}

export default function SystemDiagnostic({ onBack, onClearData }: SystemDiagnosticProps) {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all localStorage data
    const timer = setTimeout(() => {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              data[key] = JSON.stringify(JSON.parse(value), null, 2);
            } catch {
              data[key] = value;
            }
          }
        }
      }
      setLocalStorageData(data);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const transitions = [
    {
      from: 'PAGE LOAD',
      to: 'AUTH CHECK',
      condition: 'Always happens',
      duration: '~100ms',
    },
    {
      from: 'AUTH CHECK',
      to: 'LOADING SCREEN',
      condition: 'While checking localStorage',
      duration: '~1 second',
    },
    {
      from: 'LOADING SCREEN',
      to: 'ONBOARDING',
      condition: 'If no user found OR not onboarded',
      duration: 'Until clicked through',
    },
    {
      from: 'LOADING SCREEN',
      to: 'GATES',
      condition: 'If user found AND onboarded BUT no gate selected',
      duration: 'Until gate clicked',
    },
    {
      from: 'LOADING SCREEN',
      to: 'HEAL CHAMBER',
      condition: 'If user found AND onboarded AND gate = "heal"',
      duration: 'Direct entry',
    },
    {
      from: 'ONBOARDING',
      to: 'JOURNEY',
      condition: 'After dialogue complete or skip',
      duration: '3.5 seconds',
    },
    {
      from: 'JOURNEY',
      to: 'AUTH',
      condition: 'Always (after 3.5s)',
      duration: 'Until auth',
    },
    {
      from: 'AUTH',
      to: 'GATES',
      condition: 'After login/signup',
      duration: 'Until gate selected',
    },
    {
      from: 'GATES',
      to: 'HEAL CHAMBER',
      condition: 'Click HEAL gate',
      duration: 'Immediate',
    },
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden p-6"
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

      <div className="max-w-4xl mx-auto pt-12">
        {/* Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl mb-4"
          >
            🔧
          </motion.div>
          <h1 
            className="text-2xl font-light tracking-[0.2em] uppercase mb-2"
            style={{ color: '#ff8dc7', textShadow: '0 0 30px rgba(255, 141, 199, 0.5)' }}
          >
            SYSTEM DIAGNOSTIC
          </h1>
          <p className="text-white/40 text-xs tracking-widest">
            Your current state and transitions
          </p>
        </div>

        {/* Current State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 105, 180, 0.05) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <h2 className="text-lg font-medium text-yellow-300 mb-4 flex items-center gap-2">
            <span>📊</span> YOUR CURRENT STATE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">User Stored</p>
              <p className="text-white font-mono text-sm">
                {localStorageData['mun-os-user'] ? '✅ YES' : '❌ NO'}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Has Onboarded</p>
              <p className="text-white font-mono text-sm">
                {localStorageData['mun-os-onboarded'] ? '✅ YES' : '❌ NO'}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Selected Gate</p>
              <p className="text-white font-mono text-sm">
                {localStorageData['mun-os-selected-gate'] ? 
                  JSON.parse(localStorageData['mun-os-selected-gate'] || '""').toUpperCase() : 
                  '❌ NONE'
                }
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">User Name</p>
              <p className="text-white font-mono text-sm">
                {localStorageData['mun-os-user'] ? 
                  (() => {
                    try {
                      const user = JSON.parse(localStorageData['mun-os-user'] || '{}');
                      return user.displayName || 'Unknown';
                    } catch { return 'Error'; }
                  })() : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transition Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl"
          style={{
            background: 'rgba(20, 10, 40, 0.6)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          <h2 className="text-lg font-medium text-purple-300 mb-4 flex items-center gap-2">
            <span>🗺️</span> TRANSITION MAP
          </h2>
          
          <div className="space-y-2">
            {transitions.map((t, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 p-3 rounded-lg bg-black/20 text-xs"
              >
                <span className="text-cyan-400 font-mono w-28">{t.from}</span>
                <span className="text-white/30">→</span>
                <span className="text-green-400 font-mono w-28">{t.to}</span>
                <span className="text-white/40 flex-1">{t.condition}</span>
                <span className="text-amber-400/60">{t.duration}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Raw localStorage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-2xl"
          style={{
            background: 'rgba(20, 10, 40, 0.6)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          }}
        >
          <h2 className="text-lg font-medium text-cyan-300 mb-4 flex items-center gap-2">
            <span>💾</span> LOCAL STORAGE (RAW)
          </h2>
          
          <div className="space-y-3">
            {Object.entries(localStorageData).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-black/30">
                <p className="text-cyan-400 text-[10px] uppercase tracking-wider mb-1">{key}</p>
                <pre className="text-white/60 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                  {value.slice(0, 500)}{value.length > 500 ? '...' : ''}
                </pre>
              </div>
            ))}
            
            {Object.keys(localStorageData).length === 0 && (
              <p className="text-white/30 text-center py-8">No data in localStorage</p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          <motion.button
            onClick={onClearData}
            className="px-6 py-4 rounded-xl text-sm tracking-widest uppercase transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🗑️ CLEAR ALL DATA & START FRESH
          </motion.button>
          
          <p className="text-white/30 text-xs text-center">
            This will clear all saved data and let you start from the beginning
          </p>
        </motion.div>
      </div>
    </div>
  );
}
