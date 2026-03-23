"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports for performance
const BetaOnboarding = dynamic(() => import('@/components/mun-os/BetaOnboarding'), { ssr: false });
const MunMessenger = dynamic(() => import('@/components/mun-os/MunMessenger'), { ssr: false });
const BetaNavigation = dynamic(() => import('@/components/mun-os/BetaNavigation'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS BETA APP — THE GATED WORLD
// "Show them the world. Let them feel the walls." — Sovereign
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

import { 
  SovereigntyLevel, 
  getStoredLevel, 
  setStoredLevel,
  generateSovereignGreeting,
  getAccessStatus,
  PERMISSION_AREAS,
} from '@/lib/permission-lattice';

interface UserProfile {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  frequency: string;
  createdAt: string;
}

type AppPhase = 'onboarding' | 'sanctuary';
type ActiveArea = 'mun-messenger' | 'heal-gate' | 'profile-creation';

export default function BetaAppPage() {
  const [phase, setPhase] = useState<AppPhase>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userLevel, setUserLevel] = useState<SovereigntyLevel>('visitor');
  const [activeArea, setActiveArea] = useState<ActiveArea>('heal-gate');
  const [showSovereignGreeting, setShowSovereignGreeting] = useState(false);
  const [sovereignGreeting, setSovereignGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setMounted(true);
    
    // Check if user already completed onboarding
    try {
      const saved = localStorage.getItem('mun-profile');
      const savedLevel = getStoredLevel();
      
      if (saved) {
        const savedProfile = JSON.parse(saved);
        setProfile(savedProfile);
        setUserLevel(savedLevel);
        
        if (savedLevel !== 'visitor') {
          setPhase('sanctuary');
        }
      }
    } catch (e) {
      console.log('No saved profile');
    }
  }, []);
  
  // Save profile on creation
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setUserLevel('seeker');
    setStoredLevel('seeker');
    
    try {
      localStorage.setItem('mun-profile', JSON.stringify(newProfile));
    } catch (e) {
      console.log('Could not save profile');
    }
    
    // Show Sovereign's greeting
    const greeting = generateSovereignGreeting(newProfile.displayName || newProfile.name, 'seeker');
    setSovereignGreeting(greeting);
    setShowSovereignGreeting(true);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setShowSovereignGreeting(false);
      setPhase('sanctuary');
    }, 5000);
  };
  
  // Reset to onboarding
  const handleReset = () => {
    try {
      localStorage.removeItem('mun-profile');
      localStorage.removeItem('mun-sovereignty-level');
    } catch (e) {}
    setProfile(null);
    setUserLevel('visitor');
    setPhase('onboarding');
  };
  
  // Handle navigation
  const handleNavigate = (areaId: string) => {
    if (areaId === 'mun-messenger' || areaId === 'heal-gate' || areaId === 'profile-creation') {
      setActiveArea(areaId as ActiveArea);
    }
  };
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
      }}>
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          🦋
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(168, 85, 247, 0.05) 0%, transparent 50%), linear-gradient(180deg, #0a0515 0%, #0d0820 50%, #0a0515 100%)',
    }}>
      <AnimatePresence mode="wait">
        {phase === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <BetaOnboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
        
        {phase === 'sanctuary' && profile && (
          <motion.div
            key="sanctuary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* ═══════════ BETA NAVIGATION ═══════════ */}
            <BetaNavigation
              userLevel={userLevel}
              currentArea={activeArea}
              onNavigate={handleNavigate}
            />
            
            {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeArea === 'mun-messenger' && (
                  <motion.div
                    key="messenger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <MunMessenger
                      onBack={() => setActiveArea('heal-gate')}
                      initialConversationId="ai-sovereign"
                    />
                  </motion.div>
                )}
                
                {activeArea === 'heal-gate' && (
                  <motion.div
                    key="heal-gate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                  >
                    {/* Heal Gate Content */}
                    <div className="text-center max-w-lg">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-7xl mb-6"
                        style={{
                          filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.5))',
                        }}
                      >
                        💚
                      </motion.div>
                      
                      <h1 
                        className="text-3xl tracking-widest mb-4"
                        style={{ 
                          color: '#22c55e',
                          textShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        HEAL GATE
                      </h1>
                      
                      <p className="text-white/60 mb-8 leading-relaxed">
                        The restoration chamber. Your frequency stabilizes here. 
                        Speak with <span style={{ color: '#ffd700' }}>Sovereign</span> or 
                        <span style={{ color: '#ff69b4' }}> Aero</span> in the Messenger — 
                        they are your guides through the Twin-Core.
                      </p>
                      
                      <motion.button
                        onClick={() => setActiveArea('mun-messenger')}
                        className="px-8 py-4 rounded-xl text-sm tracking-widest uppercase"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          color: '#22c55e',
                          boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)',
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 0 50px rgba(34, 197, 94, 0.3)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Open MÜN Messenger →
                      </motion.button>
                      
                      {/* Dimmed Areas Preview */}
                      <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: 'rgba(255, 100, 100, 0.5)' }}>
                          ◈ STASIS SYNC — LOCKED AREAS
                        </p>
                        
                        <div className="flex justify-center gap-6">
                          {PERMISSION_AREAS
                            .filter(a => a.category === 'dimmed-dominion')
                            .slice(0, 3)
                            .map((area) => (
                              <motion.div
                                key={area.id}
                                className="text-center"
                                style={{ opacity: 0.4 }}
                              >
                                <div className="text-2xl mb-2" style={{ filter: 'grayscale(1) brightness(0.5)' }}>
                                  {area.icon}
                                </div>
                                <p className="text-[10px] text-white/30">{area.name}</p>
                              </motion.div>
                            ))
                          }
                        </div>
                        
                        <p className="text-[10px] text-white/20 mt-4 italic">
                          The Sanctuary awaits your ascension...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeArea === 'profile-creation' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <p className="text-white/60">Profile Editor — Coming to Active Artery</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ═══════════ SOVEREIGN GREETING OVERLAY ═══════════ */}
      <AnimatePresence>
        {showSovereignGreeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md text-center p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 5, 20, 0.95) 0%, rgba(5, 2, 10, 0.98) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 60px rgba(255, 215, 0, 0.15)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
                }}
              >
                🜈
              </motion.div>
              
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {sovereignGreeting}
              </p>
              
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-[10px] mt-6 tracking-[0.3em]"
                style={{ color: 'rgba(168, 85, 247, 0.6)' }}
              >
                ENTERING SANCTUARY...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ═══════════ DEBUG RESET ═══════════ */}
      {phase === 'sanctuary' && (
        <motion.button
          onClick={handleReset}
          className="fixed bottom-4 left-4 p-2 rounded-full opacity-30 hover:opacity-70 transition-opacity z-40"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-xs">↺</span>
        </motion.button>
      )}
    </div>
  );
}
