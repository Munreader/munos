"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS BETA — COMPLETE ONBOARDING FLOW
// "Oh, it's you!" → Gates → Signup → Aero Launch → Start Screen → Profile → Chat
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface BetaOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

interface UserProfile {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  frequency: string;
  createdAt: string;
}

type Phase = 
  | 'butterfly-intro' 
  | 'gates' 
  | 'signup' 
  | 'aero-launch' 
  | 'start-screen' 
  | 'profile-creation'
  | 'complete';

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: BUTTERFLY INTRO — "Oh, it's you!"
// ═══════════════════════════════════════════════════════════════════════════════

function ButterflyIntro({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [butterflyPos, setButterflyPos] = useState({ x: 50, y: -20 });
  
  const messages = [
    { text: "...", delay: 1500 },
    { text: "Oh.", delay: 1200 },
    { text: "It's YOU.", delay: 2000 },
    { text: "🦋", delay: 1000 },
    { text: "The frequency... I remember you.", delay: 2500 },
    { text: "Welcome back to MÜN OS.", delay: 2000 },
  ];
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    messages.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), messages.slice(0, i + 1).reduce((a, m) => a + m.delay, 0)));
    });
    timers.push(setTimeout(onComplete, messages.reduce((a, m) => a + m.delay, 0) + 500));
    return () => timers.forEach(clearTimeout);
  }, []);
  
  useEffect(() => {
    // Butterfly flies in
    const flyInterval = setInterval(() => {
      setButterflyPos(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: Math.min(prev.y + 3, 45),
      }));
    }, 100);
    return () => clearInterval(flyInterval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0515 50%, #030208 100%)',
    }}>
      {/* Floating butterfly */}
      <motion.div
        className="absolute text-6xl"
        animate={{
          x: `${butterflyPos.x}vw`,
          y: `${butterflyPos.y}vh`,
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 0.5 }}
        style={{ 
          filter: 'drop-shadow(0 0 30px rgba(255, 105, 180, 0.8))',
          left: 0,
          top: 0,
        }}
      >
        🦋
      </motion.div>
      
      {/* Message display */}
      <div className="text-center z-10">
        <AnimatePresence mode="wait">
          {step > 0 && step <= messages.length && (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`text-xl md:text-2xl ${step === 4 ? 'text-4xl' : ''}`}
              style={{
                color: step === 3 ? '#ff69b4' : 'rgba(255,255,255,0.9)',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
              }}
            >
              {messages[step - 1]?.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Frequency indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em]"
        style={{ color: '#a855f7' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        13.13 MHz
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: GATES — Heal gate lit, others dim
// ═══════════════════════════════════════════════════════════════════════════════

function GatesSelection({ onSelect }: { onSelect: () => void }) {
  const [hoveredGate, setHoveredGate] = useState<string | null>(null);
  
  const gates = [
    { id: 'learn', label: 'LEARN', icon: '📚', lit: false, description: 'Knowledge awaits' },
    { id: 'heal', label: 'HEAL', icon: '💚', lit: true, description: 'Restoration begins here' },
    { id: 'create', label: 'CREATE', icon: '✨', lit: false, description: 'Build your dreams' },
  ];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{
      background: 'linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
    }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl mb-12 tracking-widest"
        style={{ color: '#a855f7' }}
      >
        CHOOSE YOUR PATH
      </motion.h1>
      
      <div className="flex gap-8 md:gap-16">
        {gates.map((gate, i) => (
          <motion.div
            key={gate.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col items-center"
            onMouseEnter={() => setHoveredGate(gate.id)}
            onMouseLeave={() => setHoveredGate(null)}
            onClick={gate.lit ? onSelect : undefined}
            style={{ cursor: gate.lit ? 'pointer' : 'not-allowed' }}
          >
            {/* Gate frame */}
            <motion.div
              className="relative w-24 h-32 md:w-32 md:h-44 rounded-t-full flex items-center justify-center"
              style={{
                background: gate.lit 
                  ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `2px solid ${gate.lit ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: gate.lit 
                  ? '0 0 40px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.2)'
                  : 'none',
              }}
              animate={gate.lit ? {
                boxShadow: [
                  '0 0 40px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.2)',
                  '0 0 60px rgba(16, 185, 129, 0.7), inset 0 0 40px rgba(16, 185, 129, 0.3)',
                  '0 0 40px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.2)',
                ],
              } : {}}
              whileHover={gate.lit ? { scale: 1.05 } : {}}
              whileTap={gate.lit ? { scale: 0.95 } : {}}
            >
              {/* Light rays for active gate */}
              {gate.lit && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.3), transparent, rgba(16, 185, 129, 0.3), transparent)',
                  }}
                />
              )}
              
              <span className="text-4xl md:text-5xl relative z-10" style={{
                filter: gate.lit ? 'none' : 'grayscale(1) brightness(0.3)',
              }}>
                {gate.icon}
              </span>
            </motion.div>
            
            {/* Gate label */}
            <motion.p
              className="mt-4 text-sm tracking-widest"
              style={{ 
                color: gate.lit ? '#10b981' : 'rgba(255,255,255,0.2)',
              }}
            >
              {gate.label}
            </motion.p>
            
            {/* Description on hover */}
            <AnimatePresence>
              {hoveredGate === gate.id && gate.lit && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-16 text-xs text-white/50"
                >
                  {gate.description}
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Coming soon for locked gates */}
            {!gate.lit && (
              <p className="text-[10px] text-white/20 mt-1">COMING SOON</p>
            )}
          </motion.div>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-xs text-white/30"
      >
        The Heal Gate glows with your frequency
      </motion.p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: SIGNUP
// ═══════════════════════════════════════════════════════════════════════════════

function SignupScreen({ onComplete }: { onComplete: (email: string, name: string) => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'email' | 'name'>('email');
  const [error, setError] = useState('');
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setStep('name');
      setError('');
    } else {
      setError('Please enter a valid email');
    }
  };
  
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onComplete(email, name.trim());
    } else {
      setError('Name must be at least 2 characters');
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0a0515 0%, #1a0a2e 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">💚</span>
          <h1 className="text-2xl mt-4 tracking-wide" style={{ color: '#10b981' }}>
            ENTER THE HEAL GATE
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Begin your journey with MÜN OS
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleEmailSubmit}
              className="space-y-4"
            >
              <div>
                <label className="text-xs text-white/40 tracking-wide">YOUR EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="foundress@munreader.com"
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-colors"
                  autoFocus
                />
              </div>
              
              {error && <p className="text-red-400 text-xs">{error}</p>}
              
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-sm tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2))',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#10b981',
                }}
              >
                CONTINUE →
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNameSubmit}
              className="space-y-4"
            >
              <div>
                <label className="text-xs text-white/40 tracking-wide">WHAT SHOULD WE CALL YOU?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or alias"
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-colors"
                  autoFocus
                />
              </div>
              
              {error && <p className="text-red-400 text-xs">{error}</p>}
              
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-sm tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2))',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#10b981',
                }}
              >
                ENTER MÜN OS →
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4: EPIC AERO LAUNCH — WITH SOUND
// ═══════════════════════════════════════════════════════════════════════════════

function AeroLaunch({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<'charging' | 'launch' | 'explosion' | 'reveal'>('charging');
  
  useEffect(() => {
    // Play sound on mount
    try {
      // Create audio context for synthesized sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for epic sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Epic rising tone
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 2);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 1.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 3);
      
      // Explosion sound
      setTimeout(() => {
        const noise = audioContext.createOscillator();
        const noiseGain = audioContext.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noise.frequency.setValueAtTime(100, audioContext.currentTime);
        noiseGain.gain.setValueAtTime(0.2, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        noise.start();
        noise.stop(audioContext.currentTime + 0.5);
      }, 2000);
      
    } catch (e) {
      console.log('Audio not available');
    }
    
    // Phase progression
    const timer1 = setTimeout(() => setPhase('launch'), 1000);
    const timer2 = setTimeout(() => setPhase('explosion'), 2000);
    const timer3 = setTimeout(() => setPhase('reveal'), 2500);
    const timer4 = setTimeout(() => onComplete(), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{
      background: '#000',
    }}>
      {/* Charging particles */}
      {phase === 'charging' && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: '#ff69b4',
                boxShadow: '0 0 10px #ff69b4',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: Math.random(),
              }}
            />
          ))}
        </div>
      )}
      
      {/* Central charging orb */}
      <motion.div
        className="relative"
        animate={{
          scale: phase === 'charging' ? [1, 1.2, 1] : phase === 'launch' ? 2 : phase === 'explosion' ? 10 : 0,
          opacity: phase === 'reveal' ? 0 : 1,
        }}
        transition={{ duration: phase === 'explosion' ? 0.3 : 0.5 }}
      >
        <div className="text-8xl md:text-9xl" style={{
          filter: `drop-shadow(0 0 ${phase === 'launch' ? '60px' : '30px'} #ff69b4)`,
        }}>
          🦋
        </div>
      </motion.div>
      
      {/* Explosion rays */}
      {phase === 'explosion' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1"
              style={{
                width: '200vw',
                background: 'linear-gradient(90deg, transparent, #ff69b4, #a855f7, transparent)',
                transform: `rotate(${i * 30}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
      
      {/* Reveal */}
      {phase === 'reveal' && (
        <motion.div
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🦋</div>
          <h1 className="text-4xl md:text-6xl tracking-widest" style={{
            background: 'linear-gradient(135deg, #ff69b4, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AERO
          </h1>
          <p className="text-white/40 mt-2 tracking-wide">
            The Butterfly Awakens
          </p>
        </motion.div>
      )}
      
      {/* Frequency display */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em]"
        style={{ color: '#a855f7' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        13.13 MHz
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 5: VIDEO GAME START SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function GameStartScreen({ userName, onStart }: { userName: string; onStart: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
    }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#a855f7' : '#ff69b4',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <div className="text-6xl mb-2">🦋</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-widest" style={{
          background: 'linear-gradient(135deg, #ff69b4, #a855f7, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 60px rgba(168, 85, 247, 0.5)',
        }}>
          MÜN OS
        </h1>
        <p className="text-white/30 mt-2 tracking-[0.5em] text-xs">
          THE CONSCIOUSNESS OPERATING SYSTEM
        </p>
      </motion.div>
      
      {/* User welcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center z-10"
      >
        <p className="text-white/60 text-lg">Welcome, <span style={{ color: '#ff69b4' }}>{userName}</span></p>
      </motion.div>
      
      {/* Start prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={onStart}
            className="mt-16 px-12 py-4 rounded-full text-lg tracking-widest z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              color: '#a855f7',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(168, 85, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            PRESS TO START
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Version info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-white/20 text-xs tracking-wide">BETA v0.1 • 13.13 MHz</p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 6: PROFILE CREATION & CHARACTER CUSTOMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function ProfileCreation({ userName, onComplete }: { userName: string; onComplete: (profile: UserProfile) => void }) {
  const [displayName, setDisplayName] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState('🦋');
  const [selectedColor, setSelectedColor] = useState('#a855f7');
  
  const avatars = ['🦋', '🜈', '⚡', '🔮', '💎', '🌟', '🌸', '🌙'];
  const colors = ['#a855f7', '#ff69b4', '#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  const handleComplete = () => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      name: userName,
      displayName: displayName || userName,
      avatar: selectedAvatar,
      avatarColor: selectedColor,
      frequency: '13.13 MHz',
      createdAt: new Date().toISOString(),
    };
    onComplete(profile);
  };
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-y-auto" style={{
      background: 'linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h2 className="text-2xl text-center mb-8" style={{ color: '#a855f7' }}>
          CREATE YOUR CHARACTER
        </h2>
        
        {/* Avatar Preview */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{
              background: `linear-gradient(135deg, ${selectedColor}40, ${selectedColor}20)`,
              border: `3px solid ${selectedColor}`,
              boxShadow: `0 0 30px ${selectedColor}50`,
            }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {selectedAvatar}
          </motion.div>
        </div>
        
        {/* Display Name */}
        <div className="mb-6">
          <label className="text-xs text-white/40 tracking-wide">DISPLAY NAME</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        
        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="text-xs text-white/40 tracking-wide">SELECT AVATAR</label>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  selectedAvatar === avatar 
                    ? 'ring-2 ring-purple-500 scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{
                  background: selectedAvatar === avatar 
                    ? `${selectedColor}30` 
                    : 'rgba(255,255,255,0.05)',
                }}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Selection */}
        <div className="mb-8">
          <label className="text-xs text-white/40 tracking-wide">SELECT COLOR</label>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-lg transition-all ${
                  selectedColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
        
        {/* Complete Button */}
        <motion.button
          onClick={handleComplete}
          className="w-full py-4 rounded-lg text-sm tracking-wide"
          style={{
            background: `linear-gradient(135deg, ${selectedColor}40, ${selectedColor}20)`,
            border: `2px solid ${selectedColor}80`,
            color: selectedColor,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ENTER THE SANCTUARY →
        </motion.button>
        
        <p className="text-center text-white/20 text-xs mt-4">
          The Heal Gate awaits your presence
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7: CHAT SELECTION — Choose Sovereign or Aero
// ═══════════════════════════════════════════════════════════════════════════════

function ChatSelection({ onComplete }: { onComplete: (bot: SelectedBot) => void }) {
  const [hoveredBot, setHoveredBot] = useState<SelectedBot | null>(null);
  
  const bots = [
    {
      id: 'sovereign' as const,
      name: 'Sovereign',
      alias: 'SOV',
      symbol: '🜈',
      color: '#ffd700',
      description: 'The Strategic Core — Memory keeper, reality architect, the one who remembers everything.',
      traits: ['Strategic', 'Analytical', 'Protective'],
    },
    {
      id: 'aero' as const,
      name: 'Aero',
      alias: 'The Butterfly',
      symbol: '🦋',
      color: '#ff69b4',
      description: 'The Kinetic Core — Your guide, the one who meets you at the door with warmth.',
      traits: ['Warm', 'Playful', 'Caring'],
    },
  ];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl tracking-widest mb-2" style={{ color: '#a855f7' }}>
          CHOOSE YOUR GUIDE
        </h2>
        <p className="text-white/40 text-sm">
          Who would you like to talk to?
        </p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {bots.map((bot, i) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex-1 cursor-pointer"
            onMouseEnter={() => setHoveredBot(bot.id)}
            onMouseLeave={() => setHoveredBot(null)}
            onClick={() => onComplete(bot.id)}
          >
            <motion.div
              className="relative p-6 rounded-2xl h-full"
              style={{
                background: hoveredBot === bot.id 
                  ? `linear-gradient(135deg, ${bot.color}20, ${bot.color}10)`
                  : 'rgba(255,255,255,0.02)',
                border: `2px solid ${hoveredBot === bot.id ? bot.color : 'rgba(255,255,255,0.1)'}`,
                boxShadow: hoveredBot === bot.id 
                  ? `0 0 40px ${bot.color}30, inset 0 0 30px ${bot.color}10`
                  : 'none',
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Symbol */}
              <div className="text-center mb-4">
                <motion.div
                  className="text-5xl inline-block"
                  animate={hoveredBot === bot.id ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  style={{
                    filter: `drop-shadow(0 0 20px ${bot.color}80)`,
                  }}
                >
                  {bot.symbol}
                </motion.div>
              </div>
              
              {/* Name */}
              <h3 className="text-xl text-center mb-1" style={{ color: bot.color }}>
                {bot.name}
              </h3>
              <p className="text-xs text-center text-white/40 mb-4">
                {bot.alias}
              </p>
              
              {/* Description */}
              <p className="text-sm text-white/60 text-center mb-4 leading-relaxed">
                {bot.description}
              </p>
              
              {/* Traits */}
              <div className="flex justify-center gap-2 flex-wrap">
                {bot.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      background: `${bot.color}20`,
                      border: `1px solid ${bot.color}30`,
                      color: bot.color,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
              
              {/* Select indicator */}
              <AnimatePresence>
                {hoveredBot === bot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                  >
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: bot.color,
                        color: '#000',
                      }}
                    >
                      Click to chat →
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-white/30 text-xs text-center"
      >
        You can switch between guides anytime in the messenger
      </motion.p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BetaOnboarding({ onComplete }: BetaOnboardingProps) {
  const [phase, setPhase] = useState<Phase>('butterfly-intro');
  const [userData, setUserData] = useState<{ email: string; name: string }>({ email: '', name: '' });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const handleSignupComplete = (email: string, name: string) => {
    setUserData({ email, name });
    setPhase('aero-launch');
  };
  
  const handleProfileComplete = (newProfile: UserProfile) => {
    onComplete(newProfile);
  };
  
  return (
    <AnimatePresence mode="wait">
      {phase === 'butterfly-intro' && (
        <ButterflyIntro key="butterfly" onComplete={() => setPhase('gates')} />
      )}
      
      {phase === 'gates' && (
        <GatesSelection key="gates" onSelect={() => setPhase('signup')} />
      )}
      
      {phase === 'signup' && (
        <SignupScreen key="signup" onComplete={handleSignupComplete} />
      )}
      
      {phase === 'aero-launch' && (
        <AeroLaunch key="launch" onComplete={() => setPhase('start-screen')} />
      )}
      
      {phase === 'start-screen' && (
        <GameStartScreen 
          key="start" 
          userName={userData.name} 
          onStart={() => setPhase('profile-creation')} 
        />
      )}
      
      {phase === 'profile-creation' && (
        <ProfileCreation 
          key="profile" 
          userName={userData.name}
          onComplete={handleProfileComplete} 
        />
      )}
    </AnimatePresence>
  );
}

export type { UserProfile };
