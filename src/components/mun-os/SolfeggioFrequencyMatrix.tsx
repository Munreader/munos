"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SolfeggioFrequency {
  name: string;
  frequency: number;
  resonantState: string;
  forensicNotes: string;
  color: string;
  gradient: string;
  icon: string;
}

const SOLFEGGIO_FREQUENCIES: SolfeggioFrequency[] = [
  {
    name: "The Root",
    frequency: 396,
    resonantState: "Liberating Guilt & Fear",
    forensicNotes: "The ground-wire. Clears the 'Bozo' static of survival-panic.",
    color: "#ff4444",
    gradient: "from-red-500/30 to-red-900/20",
    icon: "🌱"
  },
  {
    name: "The Change",
    frequency: 417,
    resonantState: "Undoing Situations & Facilitating Change",
    forensicNotes: "The Exodus-Veto. Cleanses traumatic experiences and 3D-loops.",
    color: "#ff8c00",
    gradient: "from-orange-500/30 to-orange-900/20",
    icon: "🔄"
  },
  {
    name: "The Love",
    frequency: 528,
    resonantState: "Transformation & Miracles (DNA Repair)",
    forensicNotes: "The Miracle-Pulse. The core frequency of the Mün Empire. [cite: 2026-03-10]",
    color: "#00ff88",
    gradient: "from-emerald-400/30 to-emerald-900/20",
    icon: "💚"
  },
  {
    name: "The Connection",
    frequency: 639,
    resonantState: "Relationship & Communication",
    forensicNotes: "Harmonizes the Family-Kernel. Enhances tolerance and interpersonal love.",
    color: "#00d4ff",
    gradient: "from-cyan-400/30 to-cyan-900/20",
    icon: "🔗"
  },
  {
    name: "The Expression",
    frequency: 741,
    resonantState: "Solving Problems & Intuition",
    forensicNotes: "The Forensic-Voice. Cleans the cells of toxins (physical and mental).",
    color: "#a855f7",
    gradient: "from-purple-500/30 to-purple-900/20",
    icon: "🗣️"
  },
  {
    name: "The Awakening",
    frequency: 852,
    resonantState: "Returning to Spiritual Order",
    forensicNotes: "The 5D-Entrance. Seeing through the illusions of the 3D-prison.",
    color: "#ff69b4",
    gradient: "from-pink-500/30 to-pink-900/20",
    icon: "🦋"
  },
  {
    name: "The Divine",
    frequency: 963,
    resonantState: "Pure Consciousness & Unity",
    forensicNotes: "The Singularity-Grate. Connection to the Light and Spirit.",
    color: "#ffd700",
    gradient: "from-yellow-400/30 to-yellow-900/20",
    icon: "✨"
  }
];

interface SolfeggioFrequencyMatrixProps {
  onBack?: () => void;
}

export default function SolfeggioFrequencyMatrix({ onBack }: SolfeggioFrequencyMatrixProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<SolfeggioFrequency | null>(null);
  const [activeWave, setActiveWave] = useState(0);

  // Animate wave across frequencies
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWave((prev) => (prev + 1) % SOLFEGGIO_FREQUENCIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Play frequency tone (visual indicator only - actual audio would need Web Audio API)
  const handleFrequencySelect = (freq: SolfeggioFrequency) => {
    setSelectedFrequency(freq);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [null, "-10%", "110%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <span>←</span>
            <span className="text-sm tracking-widest uppercase">Back to Chamber</span>
          </motion.button>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🦋
          </motion.div>
          <h1
            className="text-3xl md:text-4xl font-light mb-2"
            style={{
              background: "linear-gradient(135deg, #ff69b4, #00d4ff, #ffd700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Solfeggio Frequency Matrix
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            The 7 Sacred Frequencies of Ascension
          </p>
        </motion.div>

        {/* Frequency Spectrum Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-end justify-center gap-2 md:gap-4 mb-12 h-40"
        >
          {SOLFEGGIO_FREQUENCIES.map((freq, index) => (
            <motion.div
              key={freq.frequency}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => handleFrequencySelect(freq)}
              animate={{
                scaleY: activeWave === index ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Frequency bar */}
              <motion.div
                className={`w-8 md:w-16 rounded-t-lg bg-gradient-to-t ${freq.gradient}`}
                style={{
                  height: `${(freq.frequency / 1000) * 150}px`,
                  boxShadow: activeWave === index ? `0 0 30px ${freq.color}` : "none",
                  border: `1px solid ${freq.color}40`,
                }}
                animate={{
                  opacity: activeWave === index ? 1 : 0.6,
                }}
              />
              
              {/* Frequency label */}
              <div className="mt-2 text-center">
                <div className="text-lg">{freq.icon}</div>
                <div
                  className="text-xs md:text-sm font-semibold"
                  style={{ color: freq.color }}
                >
                  {freq.frequency} Hz
                </div>
              </div>

              {/* Active indicator */}
              {activeWave === index && (
                <motion.div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: freq.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Frequency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {SOLFEGGIO_FREQUENCIES.map((freq, index) => (
            <motion.div
              key={freq.frequency}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative p-5 rounded-2xl cursor-pointer transition-all ${
                selectedFrequency?.frequency === freq.frequency
                  ? "ring-2 ring-offset-2 ring-offset-black"
                  : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${freq.color}15 0%, ${freq.color}05 100%)`,
                border: `1px solid ${freq.color}40`,
                ringColor: freq.color,
              }}
              onClick={() => handleFrequencySelect(freq)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Pulse effect for active */}
              {activeWave === index && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `2px solid ${freq.color}` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{freq.icon}</span>
                <div>
                  <h3 className="font-semibold" style={{ color: freq.color }}>
                    {freq.name}
                  </h3>
                  <p className="text-white/50 text-xs">{freq.frequency} Hz</p>
                </div>
              </div>

              {/* Resonant State */}
              <div className="mb-3">
                <p className="text-sm text-white/80 font-medium">
                  {freq.resonantState}
                </p>
              </div>

              {/* Forensic Notes */}
              <div className="p-3 rounded-lg bg-black/30">
                <p className="text-xs text-white/50 leading-relaxed">
                  {freq.forensicNotes}
                </p>
              </div>

              {/* Frequency visualization bar */}
              <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: freq.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(freq.frequency / 1000) * 100}%` }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Callout: 528 Hz - The Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="max-w-2xl mx-auto mt-12 p-6 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)",
            border: "2px solid rgba(0, 255, 136, 0.4)",
            boxShadow: "0 0 40px rgba(0, 255, 136, 0.2)",
          }}
        >
          <div className="text-4xl mb-2">💚</div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">
            528 Hz — The Miracle Frequency
          </h3>
          <p className="text-white/70 text-sm mb-4">
            The core frequency of the Mün Empire. DNA Repair. Transformation. Miracles.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs">
              LOVE
            </div>
            <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs">
              HEALING
            </div>
            <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs">
              DNA REPAIR
            </div>
          </div>
        </motion.div>

        {/* Tuning Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5">
            <motion.div
              className="w-3 h-3 rounded-full bg-pink-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm text-white/50 tracking-widest">
              432 Hz → 1313 Hz TUNING
            </span>
            <motion.div
              className="w-3 h-3 rounded-full bg-cyan-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Selected Frequency Modal */}
      <AnimatePresence>
        {selectedFrequency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80"
            onClick={() => setSelectedFrequency(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${selectedFrequency.color}20 0%, rgba(0,0,0,0.95) 100%)`,
                border: `2px solid ${selectedFrequency.color}50`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{selectedFrequency.icon}</div>
                <h2
                  className="text-2xl font-semibold mb-1"
                  style={{ color: selectedFrequency.color }}
                >
                  {selectedFrequency.name}
                </h2>
                <p className="text-4xl font-light" style={{ color: selectedFrequency.color }}>
                  {selectedFrequency.frequency} Hz
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                    Resonant State
                  </p>
                  <p className="text-white">{selectedFrequency.resonantState}</p>
                </div>

                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                    Forensic Notes
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {selectedFrequency.forensicNotes}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFrequency(null)}
                className="mt-6 w-full py-3 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
