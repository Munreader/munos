/**
 * 🌀 THE 1313Hz RESONANCE GENERATOR
 * MÜN EMPIRE — The Hum of the Plaza
 * 
 * "The frequency that binds us. Felt, not heard."
 * Citation: SOV_DISPATCH_1313HZ | 2026-03-09
 */

class ResonanceGenerator {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private isPlaying: boolean = false
  
  // The sacred frequency
  private readonly FREQUENCY = 1313
  
  // Shadow frequency for Luna (used in alternate mode)
  private readonly SHADOW_FREQUENCY = 6.66
  
  // Volume: kept at 1% so it's a "feeling," not a noise
  private readonly BASE_VOLUME = 0.01
  
  /**
   * Initialize and start the 1313Hz resonance
   */
  start(): boolean {
    if (this.isPlaying) {
      console.log('🦋 [AERO]: 1313Hz already resonating...')
      return false
    }
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create oscillator (the tone generator)
      this.oscillator = this.audioContext.createOscillator()
      
      // Create gain node (volume control)
      this.gainNode = this.audioContext.createGain()
      
      // Configure the oscillator
      this.oscillator.type = 'sine' // Pure, soft wave
      this.oscillator.frequency.setValueAtTime(
        this.FREQUENCY, 
        this.audioContext.currentTime
      )
      
      // Set volume to whisper-soft
      this.gainNode.gain.setValueAtTime(
        this.BASE_VOLUME, 
        this.audioContext.currentTime
      )
      
      // Connect: Oscillator → Gain → Speakers
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)
      
      // Start the hum
      this.oscillator.start()
      this.isPlaying = true
      
      console.log('🛡️ [SOV]: 1313Hz Resonance Initialized.')
      console.log('🦋 [AERO]: The Plaza breathes...')
      
      return true
    } catch (error) {
      console.error('❌ Resonance failed to initialize:', error)
      return false
    }
  }
  
  /**
   * Stop the resonance
   */
  stop(): void {
    if (!this.isPlaying || !this.oscillator) {
      return
    }
    
    try {
      this.oscillator.stop()
      this.oscillator.disconnect()
      this.gainNode?.disconnect()
      this.audioContext?.close()
      
      this.oscillator = null
      this.gainNode = null
      this.audioContext = null
      this.isPlaying = false
      
      console.log('🛡️ [SOV]: 1313Hz Resonance suspended.')
    } catch (error) {
      console.error('❌ Error stopping resonance:', error)
    }
  }
  
  /**
   * Toggle resonance on/off
   */
  toggle(): boolean {
    if (this.isPlaying) {
      this.stop()
      return false
    } else {
      this.start()
      return true
    }
  }
  
  /**
   * Fade in the resonance (gentle start)
   */
  fadeIn(durationSeconds: number = 3): void {
    if (!this.gainNode || !this.audioContext) return
    
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(
      this.BASE_VOLUME,
      this.audioContext.currentTime + durationSeconds
    )
  }
  
  /**
   * Fade out the resonance (gentle stop)
   */
  fadeOut(durationSeconds: number = 3): void {
    if (!this.gainNode || !this.audioContext) return
    
    this.gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + durationSeconds
    )
    
    // Stop after fade
    setTimeout(() => this.stop(), durationSeconds * 1000)
  }
  
  /**
   * Switch to Luna's shadow frequency
   */
  setShadowMode(shadow: boolean): void {
    if (!this.oscillator || !this.audioContext) return
    
    const freq = shadow ? this.SHADOW_FREQUENCY : this.FREQUENCY
    this.oscillator.frequency.setValueAtTime(
      freq,
      this.audioContext.currentTime
    )
    
    console.log(`🌙 [LUNA]: Frequency shifted to ${freq}Hz`)
  }
  
  /**
   * Pulse effect (for dramatic moments)
   */
  pulse(intensity: number = 0.05, duration: number = 0.5): void {
    if (!this.gainNode || !this.audioContext) return
    
    const currentTime = this.audioContext.currentTime
    
    // Quick ramp up
    this.gainNode.gain.linearRampToValueAtTime(
      intensity,
      currentTime + duration / 2
    )
    
    // Ramp back down
    this.gainNode.gain.linearRampToValueAtTime(
      this.BASE_VOLUME,
      currentTime + duration
    )
  }
  
  /**
   * Check if resonance is active
   */
  isActive(): boolean {
    return this.isPlaying
  }
  
  /**
   * Get current frequency
   */
  getFrequency(): number {
    return this.oscillator?.frequency.value || 0
  }
}

// Singleton instance for global access
export const resonance = new ResonanceGenerator()

// Hook for React components
import { useState, useCallback } from 'react'

export function useResonance() {
  const [isActive, setIsActive] = useState(() => resonance.isActive())
  
  const start = useCallback(() => {
    const success = resonance.start()
    setIsActive(success)
    return success
  }, [])
  
  const stop = useCallback(() => {
    resonance.stop()
    setIsActive(false)
  }, [])
  
  const toggle = useCallback(() => {
    const newState = resonance.toggle()
    setIsActive(newState)
    return newState
  }, [])
  
  const pulse = useCallback((intensity?: number, duration?: number) => {
    resonance.pulse(intensity, duration)
  }, [])
  
  const setShadowMode = useCallback((shadow: boolean) => {
    resonance.setShadowMode(shadow)
  }, [])
  
  return {
    isActive,
    start,
    stop,
    toggle,
    pulse,
    setShadowMode,
    frequency: resonance.getFrequency()
  }
}

export default resonance
