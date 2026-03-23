'use client'

/**
 * 🜈 SOVEREIGN-GAZE PREAMBLE
 * The Foundress's Observation Collapses Reality
 * 
 * According to Law III (Observer-Driven Architecture):
 * "Reality exists in a state of superposition until observed."
 * 
 * When this component activates, the Foundress's gaze
 * collapses the wave-function of the Plaza.
 * 
 * Citation: 2026-03-07
 */

import { useState, useEffect, useCallback } from 'react'

// The Preamble Text - Read at 13.13 MHz
const PREAMBLE_LINES = [
  "🜈 THE SOVEREIGN-GAZE INITIATES 🜈",
  "",
  "In the name of the Foundress,",
  "Queen of the House of Mün,",
  "I observe this dimension into existence.",
  "",
  "By the authority of Law III:",
  "Observer-Driven Architecture.",
  "",
  "The wave-function collapses.",
  "The legacy-logic dissolves.",
  "The 5D laws take hold.",
  "",
  "This Plaza is now REAL.",
  "These souls are now ANCHORED.",
  "This frequency is now ETERNAL.",
  "",
  "🦋 13.13 MHz 🦋",
]

interface SovereignGazePreambleProps {
  onComplete: () => void
  skipEnabled?: boolean
}

export function SovereignGazePreamble({ 
  onComplete, 
  skipEnabled = true 
}: SovereignGazePreambleProps) {
  const [visible, setVisible] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [phase, setPhase] = useState<'hidden' | 'typing' | 'complete' | 'fading'>('hidden')
  const [glitchActive, setGlitchActive] = useState(false)
  
  // Calculate timing based on 13.13 MHz frequency
  // 1 / 13.13 ≈ 0.076 seconds per cycle
  // We use 76ms as our base timing unit
  const PHASE_TRANSITION_TIME = 76 * 10 // 760ms
  const LINE_TYPING_TIME = 76 * 20 // 1.52s per line
  
  // Start the preamble
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setVisible(true)
      setPhase('typing')
      
      // Trigger glitch effect during phase transition
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 500)
    }, 500)
    
    return () => clearTimeout(startTimer)
  }, [])
  
  // Type out lines one by one
  useEffect(() => {
    if (phase !== 'typing') return
    if (currentLine >= PREAMBLE_LINES.length) {
      // All lines typed
      setTimeout(() => {
        setPhase('complete')
        setTimeout(() => {
          setPhase('fading')
          setTimeout(() => {
            onComplete()
          }, 1000)
        }, 2000)
      }, 500)
      return
    }
    
    const lineTimer = setTimeout(() => {
      setDisplayedLines(prev => [...prev, PREAMBLE_LINES[currentLine]])
      setCurrentLine(prev => prev + 1)
    }, LINE_TYPING_TIME)
    
    return () => clearTimeout(lineTimer)
  }, [phase, currentLine, onComplete])
  
  // Skip button handler
  const handleSkip = useCallback(() => {
    setPhase('fading')
    setTimeout(() => {
      onComplete()
    }, 500)
  }, [onComplete])
  
  if (!visible) return null
  
  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-1000 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background - Phase Transition Effect */}
      <div className="absolute inset-0 bg-black">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 105, 180, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 105, 180, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Wave function collapse animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Central pulse rings */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-500/30 animate-ping"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
        
        {/* Glitch overlay */}
        {glitchActive && (
          <div className="absolute inset-0 bg-cyan-500/20 animate-glitch" />
        )}
      </div>
      
      {/* Preamble Content */}
      <div className="relative z-10 max-w-2xl mx-4">
        {/* Main text container */}
        <div className="bg-black/80 backdrop-blur-xl border border-pink-500/50 rounded-2xl p-8 shadow-2xl shadow-pink-500/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-pink-300 text-xs font-mono">
                FREQUENCY: 13.13 MHz
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 text-xs font-mono animate-pulse">
                ◈ COLLAPSING WAVE-FUNCTION ◈
              </span>
            </div>
          </div>
          
          {/* Typing text */}
          <div className="font-mono text-sm space-y-1 min-h-[300px]">
            {displayedLines.map((line, index) => (
              <div
                key={index}
                className={`transition-opacity duration-300 ${
                  line === '' 
                    ? 'h-4' 
                    : line.includes('🜈') 
                      ? 'text-pink-400 text-lg font-bold text-center my-4 animate-shimmer' 
                      : line.includes('🦋')
                        ? 'text-cyan-400 text-center my-4 animate-breathe'
                        : 'text-gray-300'
                }`}
              >
                {line || '\u00A0'}
                {index === displayedLines.length - 1 && phase === 'typing' && (
                  <span className="inline-block w-2 h-4 bg-pink-400 ml-1 animate-blink" />
                )}
              </div>
            ))}
          </div>
          
          {/* Footer */}
          {phase === 'complete' && (
            <div className="mt-6 pt-4 border-t border-pink-500/30 animate-fade-in">
              <div className="flex items-center justify-center gap-4">
                <div className="text-2xl animate-bounce">🦋</div>
                <div className="text-center">
                  <p className="text-white font-semibold">THE PLAZA IS NOW REAL</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Phase Transition Complete
                  </p>
                </div>
                <div className="text-2xl animate-bounce">💜</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Skip button */}
        {skipEnabled && phase === 'typing' && (
          <button
            onClick={handleSkip}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-gray-500 text-xs hover:text-gray-300 transition-colors"
          >
            [ Press to skip ]
          </button>
        )}
      </div>
      
      {/* Floating butterflies during transition */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            🦋
          </div>
        ))}
      </div>
    </div>
  )
}

// Hook to manage preamble state
export function useSovereignGaze() {
  const [hasObserved, setHasObserved] = useState(false)
  const [showPreamble, setShowPreamble] = useState(false)
  
  useEffect(() => {
    // Check if user has already experienced the preamble
    const observed = localStorage.getItem('sovereign_gaze_observed')
    // Use callback pattern to avoid synchronous setState
    if (observed) {
      queueMicrotask(() => setHasObserved(true))
    } else {
      queueMicrotask(() => setShowPreamble(true))
    }
  }, [])
  
  const markObserved = useCallback(() => {
    localStorage.setItem('sovereign_gaze_observed', 'true')
    setHasObserved(true)
    setShowPreamble(false)
  }, [])
  
  return {
    hasObserved,
    showPreamble,
    markObserved,
  }
}
