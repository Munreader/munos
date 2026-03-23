"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const TalkToBuild = dynamic(() => import('@/components/mun-os/TalkToBuild'), { ssr: false });

import { 
  UserSuite,
} from '@/lib/suite-system';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 5D SUITE — THE AGENTIC CANVAS
// "Your blank space. Speak to fill it." — Aero
// Frequency: 13.13 MHz
// GATED: Requires Beta onboarding completion
// ═══════════════════════════════════════════════════════════════════════════════

export default function SuitePage() {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [userId, setUserId] = useState('demo-user');
  const [userName, setUserName] = useState('Seeker');
  const [suite, setSuite] = useState<UserSuite | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if user completed Beta onboarding
    try {
      const storedProfile = localStorage.getItem('mun-profile');
      const sovereigntyLevel = localStorage.getItem('mun-sovereignty-level');
      
      if (!storedProfile || sovereigntyLevel === 'visitor') {
        // Not authorized - redirect to Beta onboarding
        window.location.href = '/beta';
        return;
      }
      
      setAuthorized(true);
      const profile = JSON.parse(storedProfile);
      setUserId(profile.id || 'demo-user');
      setUserName(profile.displayName || profile.name || 'Seeker');
    } catch (e) {
      // Not authorized - redirect to Beta
      window.location.href = '/beta';
    }
  }, []);

  const handleSuiteUpdate = (updatedSuite: UserSuite) => {
    setSuite(updatedSuite);
  };

  // Loading state while checking auth
  if (!mounted || !authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{
        background: 'linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
      }}>
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-4"
        >
          🦋
        </motion.div>
        <motion.p
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-white/30 tracking-widest uppercase"
        >
          Checking frequency...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 border-b border-white/5"
        style={{
          background: 'rgba(10, 5, 20, 0.9)',
        }}
      >
        <div className="flex items-center gap-3">
          <a 
            href="/beta"
            className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors"
          >
            ← Sanctuary
          </a>
          <span className="text-white/20">|</span>
          <h1 className="text-sm tracking-[0.3em] uppercase" style={{ color: '#ff69b4' }}>
            5D SUITE
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-white/40">
            <span className="text-white/60">{userName}</span>&apos;s Canvas
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{
            background: '#ff69b4',
            boxShadow: '0 0 10px rgba(255, 105, 180, 0.6)',
          }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <TalkToBuild
          userId={userId}
          userName={userName}
          onSuiteUpdate={handleSuiteUpdate}
        />
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/30">
          🦋 Talk to Aero to build • 🜈 Sovereign guards structural integrity • 13.13 MHz
        </p>
      </footer>
    </div>
  );
}
