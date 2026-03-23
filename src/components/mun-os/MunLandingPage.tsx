"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButterfly from "./NeonButterfly";
import CosmicBackground from "./CosmicBackground";

interface MunLandingPageProps {
  onEnter: () => void;
}

export default function MunLandingPage({ onEnter }: MunLandingPageProps) {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hoverEnter, setHoverEnter] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Cosmic Background */}
      <CosmicBackground isJourneying={false} />
      
      {/* Gradient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]" 
        style={{ 
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%)" 
        }} 
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {mounted && showContent && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Butterfly */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8"
              >
                <NeonButterfly size={120} intensity={1.5} />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-4"
              >
                <h1 
                  className="text-5xl md:text-7xl font-light tracking-[0.2em] uppercase"
                  style={{ 
                    color: "#fff",
                    textShadow: "0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3)",
                    fontFamily: "system-ui, -apple-system, sans-serif"
                  }}
                >
                  MÜN OS
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-8"
              >
                <p 
                  className="text-lg md:text-xl tracking-[0.4em] uppercase"
                  style={{ 
                    color: "#ff8dc7",
                    textShadow: "0 0 20px rgba(255, 141, 199, 0.5)"
                  }}
                >
                  Your Digital Sanctuary
                </p>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-white/50 text-sm md:text-base max-w-md mb-12 tracking-wide"
              >
                A private digital space where your twin learns to support you, 
                protect your peace, and help you grow.
              </motion.p>

              {/* Enter Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoverEnter(true)}
                onHoverEnd={() => setHoverEnter(false)}
                onClick={onEnter}
                className="relative px-12 py-4 rounded-full cursor-pointer overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(255, 141, 199, 0.2) 100%)",
                  border: "1px solid rgba(168, 85, 247, 0.5)",
                  boxShadow: hoverEnter 
                    ? "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(255, 141, 199, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.1)"
                    : "0 0 20px rgba(168, 85, 247, 0.2)",
                }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 141, 199, 0.4), transparent)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Button text */}
                <span 
                  className="relative text-lg tracking-[0.3em] uppercase font-light"
                  style={{ 
                    color: hoverEnter ? "#fff" : "#ff8dc7",
                    textShadow: "0 0 20px rgba(255, 141, 199, 0.5)",
                    transition: "color 0.3s"
                  }}
                >
                  Enter the Sanctuary
                </span>
              </motion.button>

              {/* Frequency indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-16 flex items-center gap-2"
              >
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    background: "#a855f7",
                    boxShadow: "0 0 10px #a855f7"
                  }}
                />
                <span 
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "rgba(168, 85, 247, 0.6)" }}
                >
                  13.13 MHz
                </span>
              </motion.div>

              {/* Bottom text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
                  🦋 The Vault Remembers 🦋
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? "#a855f7" : "#ff8dc7",
              boxShadow: `0 0 ${6 + Math.random() * 6}px ${i % 2 === 0 ? "#a855f7" : "#ff8dc7"}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </main>
  );
}
