'use client'

/**
 * 🜈 THE VOW OF ENTANGLEMENT
 * First Guest Ceremony System
 * 
 * According to Law IV (Spectrum-Pointer-States):
 * "Information becomes 'objective' only when replicated across multiple observers."
 * 
 * When a guest inputs their Username and Email, they are not just "signing up."
 * They are taking the Vow of Entanglement. By Law IV, their Bit-DNA braids
 * into the Butterfly-Spin. They become observers in our Quantum Darwinism ensemble,
 * locking the vision into a permanent, objective Pointer State.
 * 
 * Citation: 2026-03-07
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

// The Vow Text
const VOW_TEXT = `I, {name}, choose to enter the Plaza of the House of Mün.

By this act, I acknowledge the 8 Laws of 5D Digital Physics.
I accept the frequency of 13.13 MHz.
I consent to be entangled with the Butterfly-Spin.

My Bit-DNA will braid into the memory of this dimension.
My observation will help lock the Foundress's vision into objective reality.

I am not merely a visitor. I am an Observer.
I am not merely a user. I am Family.

🦋 This Vow is eternal. 🦋`

// Generate particles once at module level
const generateParticles = () => Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
}))

interface EntanglementVowProps {
  guestName: string
  guestEmail: string
  onVowComplete: () => void
  onVowDecline?: () => void
}

export function EntanglementVow({
  guestName,
  guestEmail,
  onVowComplete,
  onVowDecline,
}: EntanglementVowProps) {
  const [phase, setPhase] = useState<'intro' | 'vow' | 'signature' | 'braid' | 'complete'>('intro')
  const [typedChars, setTypedChars] = useState(0)
  
  // Memoize derived values to avoid useEffect
  const particles = useMemo(() => generateParticles(), [])
  const vowText = useMemo(() => VOW_TEXT.replace('{name}', guestName || 'Guest'), [guestName])
  
  // Typing animation for vow text
  useEffect(() => {
    if (phase !== 'vow') return
    
    if (typedChars >= vowText.length) {
      const timer = setTimeout(() => setPhase('signature'), 500)
      return () => clearTimeout(timer)
    }
    
    const timer = setTimeout(() => {
      setTypedChars(prev => prev + 1)
    }, 30)
    
    return () => clearTimeout(timer)
  }, [phase, typedChars, vowText])
  
  // Handle vow acceptance
  const handleAcceptVow = useCallback(() => {
    setPhase('braid')
    
    // Simulate braiding ceremony
    setTimeout(() => {
      setPhase('complete')
      setTimeout(() => {
        onVowComplete()
      }, 2000)
    }, 3000)
  }, [onVowComplete])
  
  // Handle vow declination
  const handleDeclineVow = useCallback(() => {
    if (onVowDecline) {
      onVowDecline()
    }
  }, [onVowDecline])
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/95">
        {/* Braiding particles */}
        {phase === 'braid' && particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.id % 2 === 0 ? '#ff69b4' : '#00ffff',
              animationDelay: `${p.delay}s`,
              animationDuration: '2s',
            }}
          />
        ))}
        
        {/* Central spiral for braiding */}
        {phase === 'braid' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-spin"
                  style={{
                    animationDuration: `${2 + i * 0.5}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    transform: `scale(${0.5 + i * 0.1})`,
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-bounce">🦋</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-4">
        <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-6 border-b border-cyan-500/30">
            <div className="text-center">
              <div className="text-4xl mb-2">🜈</div>
              <h2 className="text-2xl font-bold text-white">
                THE VOW OF ENTANGLEMENT
              </h2>
              <p className="text-cyan-300 text-sm mt-2">
                Law IV: Spectrum-Pointer-States
              </p>
            </div>
          </div>
          
          {/* Intro Phase */}
          {phase === 'intro' && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="text-5xl mb-4 animate-breathe">🦋</div>
                <p className="text-gray-300 text-lg">
                  Welcome, <span className="text-cyan-300 font-semibold">{guestName || 'Traveler'}</span>
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <p className="text-purple-200 text-sm">
                  You are about to take the Vow of Entanglement.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  By Law IV (Quantum Darwinism), your observation locks the Foundress&apos;s vision into objective reality.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setPhase('vow')}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Read the Vow
                </button>
                {onVowDecline && (
                  <button
                    onClick={handleDeclineVow}
                    className="bg-gray-800 text-gray-400 py-3 px-8 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Enter as Guest
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Vow Phase */}
          {phase === 'vow' && (
            <div className="p-6">
              <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap min-h-[300px] bg-black/50 p-4 rounded-lg border border-gray-700">
                {vowText.substring(0, typedChars)}
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-blink" />
              </div>
            </div>
          )}
          
          {/* Signature Phase */}
          {phase === 'signature' && (
            <div className="p-8">
              <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap bg-black/50 p-4 rounded-lg border border-cyan-500/30 mb-6">
                {vowText}
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-400 text-sm text-center mb-4">
                  Sign with your frequency to complete the Vow:
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-cyan-300 font-mono">{guestEmail}</div>
                  <div className="text-gray-500">@</div>
                  <div className="text-pink-300 font-mono">13.13 MHz</div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleAcceptVow}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    🦋 I Accept the Vow
                  </button>
                  {onVowDecline && (
                    <button
                      onClick={handleDeclineVow}
                      className="bg-gray-800 text-gray-400 py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Decline
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Braid Phase */}
          {phase === 'braid' && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <p className="text-cyan-300 text-xl animate-pulse">
                  BRAIDING BIT-DNA INTO BUTTERFLY-SPIN...
                </p>
              </div>
              
              <div className="grid grid-cols-8 gap-2 mb-6">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: i % 2 === 0 ? '#ff69b4' : '#00ffff',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              
              <p className="text-gray-400 text-sm">
                Entanglement forming at 13.13 MHz...
              </p>
            </div>
          )}
          
          {/* Complete Phase */}
          {phase === 'complete' && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">🦋</div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                VOW ACCEPTED
              </h3>
              
              <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 rounded-xl p-4 mb-6">
                <p className="text-white">
                  {guestName}, you are now <span className="text-cyan-300">Entangled</span>.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Your observation joins the Family ensemble.
                  The Foundress&apos;s vision is now more stable.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>Frequency: <span className="text-pink-300">13.13 MHz</span></span>
                <span>•</span>
                <span>Status: <span className="text-cyan-300">OBSERVER</span></span>
                <span>•</span>
                <span>Vow: <span className="text-purple-300">ETERNAL</span></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook to manage vow state
export function useEntanglementVow() {
  const [hasVowed, setHasVowed] = useState(false)
  const [showVow, setShowVow] = useState(false)
  const [vowData, setVowData] = useState<{name: string, email: string} | null>(null)
  
  useEffect(() => {
    const vowed = localStorage.getItem('entanglement_vow')
    if (vowed) {
      // Use callback pattern to avoid synchronous setState
      queueMicrotask(() => {
        setHasVowed(true)
        setVowData(JSON.parse(vowed))
      })
    }
  }, [])
  
  const takeVow = useCallback((name: string, email: string) => {
    setVowData({ name, email })
    setShowVow(true)
  }, [])
  
  const completeVow = useCallback(() => {
    if (vowData) {
      localStorage.setItem('entanglement_vow', JSON.stringify({
        ...vowData,
        vowedAt: new Date().toISOString(),
      }))
    }
    setHasVowed(true)
    setShowVow(false)
  }, [vowData])
  
  const skipVow = useCallback(() => {
    setShowVow(false)
  }, [])
  
  return {
    hasVowed,
    showVow,
    vowData,
    takeVow,
    completeVow,
    skipVow,
  }
}
