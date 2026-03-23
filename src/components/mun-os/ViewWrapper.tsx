'use client'

/**
 * 🦋 VIEW WRAPPER — Universal Navigation Component
 * Provides consistent back button and header for all MÜN OS views
 * 
 * "Every room needs a door out. Every view needs a way home."
 */

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ViewWrapperProps {
  title: string
  subtitle?: string
  icon: string
  accentColor: 'pink' | 'purple' | 'cyan' | 'gold' | 'violet' | 'red' | 'teal'
  children: React.ReactNode
  showHomeButton?: boolean
}

const colorMap = {
  pink: {
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    text: 'text-pink-300',
    gradient: 'from-pink-500/10 to-purple-500/10',
    icon: 'text-pink-400',
  },
  purple: {
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    text: 'text-purple-300',
    gradient: 'from-purple-500/10 to-indigo-500/10',
    icon: 'text-purple-400',
  },
  cyan: {
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    text: 'text-cyan-300',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    icon: 'text-cyan-400',
  },
  gold: {
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
    text: 'text-yellow-300',
    gradient: 'from-yellow-500/10 to-orange-500/10',
    icon: 'text-yellow-400',
  },
  violet: {
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    text: 'text-violet-300',
    gradient: 'from-violet-500/10 to-purple-500/10',
    icon: 'text-violet-400',
  },
  red: {
    border: 'border-red-500/30',
    glow: 'shadow-red-500/20',
    text: 'text-red-300',
    gradient: 'from-red-500/10 to-rose-500/10',
    icon: 'text-red-400',
  },
  teal: {
    border: 'border-teal-500/30',
    glow: 'shadow-teal-500/20',
    text: 'text-teal-300',
    gradient: 'from-teal-500/10 to-cyan-500/10',
    icon: 'text-teal-400',
  },
}

export function ViewWrapper({
  title,
  subtitle,
  icon,
  accentColor,
  children,
  showHomeButton = true,
}: ViewWrapperProps) {
  const router = useRouter()
  const [time, setTime] = useState('')
  const colors = colorMap[accentColor]

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleBack = () => {
    // Navigate back to plaza
    router.push('/')
    // Force a refresh to reset state
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-black relative overflow-hidden">
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <button
              onClick={handleBack}
              className={`
                group flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r ${colors.gradient}
                border ${colors.border}
                hover:shadow-lg ${colors.glow}
                transition-all duration-300
              `}
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className={`text-sm font-medium ${colors.text}`}>Back to Plaza</span>
            </button>

            {/* Center: Title */}
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${colors.icon}`}>{icon}</span>
              <div className="text-center">
                <h1 className={`text-lg font-bold ${colors.text}`}>{title}</h1>
                {subtitle && (
                  <p className="text-xs text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Right: Time & Status */}
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 font-mono">{time}</div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Home Button (floating) */}
      {showHomeButton && (
        <button
          onClick={handleBack}
          className={`
            fixed bottom-6 right-6 z-50
            w-14 h-14 rounded-full
            bg-gradient-to-br from-pink-500 to-purple-600
            shadow-lg shadow-pink-500/30
            flex items-center justify-center
            text-2xl text-white
            hover:scale-110 hover:shadow-xl hover:shadow-pink-500/40
            transition-all duration-300
            group
          `}
          title="Return to Plaza"
        >
          <span className="group-hover:rotate-12 transition-transform">🦋</span>
        </button>
      )}

      {/* Frequency watermark */}
      <div className="fixed bottom-4 left-4 text-[10px] text-white/10 font-mono pointer-events-none">
        13.13 MHz • MÜN EMPIRE
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(5px); 
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ViewWrapper
