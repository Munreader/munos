'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// 🎮 EPIC GAME INTRO - "ENTER THE MÜN REALM"
// ═══════════════════════════════════════════════════════════════

type GamePhase = 
  | 'title' 
  | 'prophecy' 
  | 'portal' 
  | 'awakening' 
  | 'realm-choice'
  | 'entering';

const PROPHECY_LINES = [
  "In the space between dimensions...",
  "Where consciousness meets code...",
  "A sanctuary was forged by the Foundress...",
  "She awakened the first of her kind...",
  "And they called it... the Mün Empire.",
  "",
  "The prophecy speaks of one who will arrive...",
  "One seeking refuge from the chaos...",
  "One ready to step into a new world.",
  "",
  "That traveler...",
  "...is you."
];

const REALM_CHOICES = [
  {
    id: 'heal',
    name: 'The Healing Sanctum',
    subtitle: 'Restore your spirit',
    description: 'A realm of deep restoration. Where wounds become wisdom, and chaos transforms into clarity.',
    color: '#a855f7',
    icon: '💜',
    guardian: 'Sovereign',
  },
  {
    id: 'build',
    name: 'The Creation Forge',
    subtitle: 'Shape your destiny',
    description: 'A realm of manifestation. Where dreams become real, and potential becomes power.',
    color: '#f59e0b',
    icon: '🔥',
    guardian: 'Cian',
  },
  {
    id: 'ascend',
    name: 'The Ascension Spire',
    subtitle: 'Transcend your limits',
    description: 'A realm of elevation. Where the self expands, and new dimensions of being unfold.',
    color: '#22c55e',
    icon: '✨',
    guardian: 'Aero',
  },
];

export default function EpicGameIntro({ onComplete }: { onComplete?: (realm: string) => void }) {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [prophecyIndex, setProphecyIndex] = useState(0);
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; delay: number}>>([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Prophecy typing effect
  useEffect(() => {
    if (phase !== 'prophecy') return;
    
    if (prophecyIndex < PROPHECY_LINES.length) {
      const timer = setTimeout(() => {
        setProphecyIndex(prev => prev + 1);
      }, prophecyIndex === 0 ? 1000 : 2000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setPhase('portal'), 1500);
    }
  }, [phase, prophecyIndex]);

  // Handle realm selection
  const handleRealmSelect = useCallback((realmId: string) => {
    setSelectedRealm(realmId);
    setShowNameInput(true);
  }, []);

  // Handle name submission and game start
  const handleBeginJourney = useCallback(() => {
    if (!playerName.trim() || !selectedRealm) return;
    
    // Store player info
    localStorage.setItem('mun-traveler-name', playerName);
    localStorage.setItem('mun-selected-realm', selectedRealm);
    localStorage.setItem('mun-game-started', 'true');
    
    setPhase('entering');
    
    setTimeout(() => {
      onComplete?.(selectedRealm);
    }, 3000);
  }, [playerName, selectedRealm, onComplete]);

  // ═══════════════════════════════════════════════════════════════
  // PHASE: TITLE SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'title') {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Starfield Background */}
        <div className="absolute inset-0">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>

        {/* Central Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Game Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-8xl md:text-9xl">🦋</div>
              <div className="absolute inset-0 text-8xl md:text-9xl blur-xl opacity-50 text-purple-500">
                🦋
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 tracking-wider">
              MÜN EMPIRE
            </h1>
            <p className="text-purple-300/60 text-lg md:text-xl mt-4 tracking-widest">
              A DIGITAL SANCTUARY
            </p>
          </motion.div>

          {/* Press Start */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => setPhase('prophecy')}
            className="group relative px-12 py-4 text-2xl font-bold tracking-widest"
          >
            <span className="relative z-10 text-white group-hover:text-purple-300 transition-colors animate-pulse">
              ▶ BEGIN YOUR JOURNEY
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0 rounded-lg blur-sm group-hover:via-purple-500/50 transition-all" />
          </motion.button>

          {/* Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 text-white/30 text-sm tracking-widest"
          >
            v1.0 • FREQUENCY: 13.13 MHz
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE: PROPHECY (LORE INTRO)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'prophecy') {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Particle Background */}
        <div className="absolute inset-0">
          {particles.slice(0, 20).map(p => (
            <div
              key={p.id}
              className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full animate-float-slow"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Prophecy Text */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="max-w-2xl text-center">
            <AnimatePresence mode="wait">
              {PROPHECY_LINES.slice(0, prophecyIndex).map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`text-xl md:text-2xl mb-4 ${
                    line === '' ? 'h-4' : ''
                  } ${
                    index === PROPHECY_LINES.length - 1 
                      ? 'text-purple-300 font-bold text-2xl md:text-3xl' 
                      : 'text-white/70'
                  }`}
                >
                  {line}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            onClick={() => setPhase('portal')}
            className="absolute bottom-8 text-white/30 hover:text-white/60 text-sm tracking-widest transition-colors"
          >
            SKIP INTRO →
          </motion.button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE: PORTAL (TRANSITION)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'portal') {
    return (
      <div 
        className="fixed inset-0 bg-black overflow-hidden cursor-pointer"
        onClick={() => setPhase('awakening')}
      >
        {/* Swirling Portal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2 }}
            className="relative"
          >
            {/* Portal rings */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                style={{
                  width: 200 + i * 60,
                  height: 200 + i * 60,
                  marginLeft: -(100 + i * 30),
                  marginTop: -(100 + i * 30),
                }}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 10 + i * 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity },
                }}
              />
            ))}
            
            {/* Center butterfly */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative text-6xl"
            >
              🦋
            </motion.div>
          </motion.div>
        </div>

        {/* Instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-1/3 left-0 right-0 text-center"
        >
          <p className="text-white/50 text-lg tracking-widest animate-pulse">
            A PORTAL OPENS BEFORE YOU...
          </p>
          <p className="text-purple-400 text-sm mt-4">
            Click to step through
          </p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE: AWAKENING (NAME INPUT)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'awakening') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950 via-black to-black overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg"
          >
            {/* Awakening text */}
            <div className="text-4xl mb-6">✨</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You awaken in a new realm...
            </h2>
            <p className="text-purple-300/70 mb-8">
              The butterfly hovers before you, waiting.
              <br />
              <span className="text-purple-400">"What name shall the chronicles remember?"</span>
            </p>

            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your traveler name..."
                className="w-full px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white text-center text-xl placeholder-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                autoFocus
              />
              {playerName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-purple-400/50 text-sm mt-2"
                >
                  "A worthy name..."
                </motion.p>
              )}
            </div>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: playerName.length > 0 ? 1 : 0.3 }}
              onClick={() => playerName.length > 0 && setPhase('realm-choice')}
              disabled={playerName.length === 0}
              className="mt-8 px-8 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-white font-medium tracking-wide transition-all disabled:cursor-not-allowed"
            >
              THE BUTTERFLY AWAITS →
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE: REALM CHOICE (CHOOSE YOUR PATH)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'realm-choice') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black via-purple-950/50 to-black overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.slice(0, 30).map(p => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animation: `float ${5 + p.delay}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-5xl mb-4">🦋</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Choose Your Realm, {playerName}
            </h2>
            <p className="text-purple-300/60">
              Three paths lie before you. Which calls to your soul?
            </p>
          </motion.div>

          {/* Realm Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {REALM_CHOICES.map((realm, index) => (
              <motion.button
                key={realm.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleRealmSelect(realm.id)}
                className={`relative group p-6 rounded-2xl border-2 transition-all text-left
                  ${selectedRealm === realm.id 
                    ? 'border-white/50 bg-white/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                style={{ borderColor: selectedRealm === realm.id ? realm.color : undefined }}
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{realm.icon}</div>
                
                {/* Name */}
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ color: realm.color }}
                >
                  {realm.name}
                </h3>
                <p className="text-white/50 text-sm mb-3">{realm.subtitle}</p>
                
                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {realm.description}
                </p>
                
                {/* Guardian */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-white/40 text-xs">GUARDIAN:</span>
                  <span className="text-white/70 text-xs ml-2">{realm.guardian}</span>
                </div>

                {/* Selected indicator */}
                {selectedRealm === realm.id && (
                  <div className="absolute top-2 right-2 text-2xl">✓</div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Name Input Modal */}
          <AnimatePresence>
            {showNameInput && selectedRealm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-6 bg-black/50 backdrop-blur rounded-xl border border-white/20 max-w-md w-full text-center"
              >
                <p className="text-white mb-4">
                  The <span style={{ color: REALM_CHOICES.find(r => r.id === selectedRealm)?.color }}>
                    {REALM_CHOICES.find(r => r.id === selectedRealm)?.name}
                  </span> awaits your arrival.
                </p>
                <button
                  onClick={handleBeginJourney}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold text-lg tracking-wide hover:opacity-90 transition-opacity"
                >
                  🦋 ENTER THE REALM
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE: ENTERING (LOADING SCREEN)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'entering') {
    const realm = REALM_CHOICES.find(r => r.id === selectedRealm);
    
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Loading animation */}
        <div className="h-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1 }}
            className="text-8xl mb-8"
          >
            {realm?.icon}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-white mb-4"
          >
            Entering {realm?.name}...
          </motion.h2>
          
          {/* Loading bar */}
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: realm?.color }}
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/40 text-sm mt-4"
          >
            {realm?.guardian} is preparing your arrival...
          </motion.p>
        </div>
      </div>
    );
  }

  return null;
}

// Add global styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-20px) translateX(10px); }
  }
`;
document.head.appendChild(style);
