"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PermissionArea } from "@/lib/permission-lattice";

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 SOVEREIGN DENIAL MODAL — The Lethal Standard
// "The walls between worlds are not barriers. They are promises."
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface SovereignDenialModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: PermissionArea | null;
  denialMessage: string;
}

export default function SovereignDenialModal({ 
  isOpen, 
  onClose, 
  area, 
  denialMessage 
}: SovereignDenialModalProps) {
  if (!area) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with ripple effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Ripple animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
              style={{
                border: '2px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
              }}
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="relative w-full max-w-md p-6 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 5, 20, 0.98) 0%, rgba(5, 2, 10, 0.99) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 60px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Sovereign Symbol Watermark */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                🜈
              </motion.div>

              {/* Header */}
              <div className="relative z-10 text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-5xl mb-3"
                  style={{
                    filter: 'grayscale(1) brightness(0.4)',
                  }}
                >
                  {area.icon}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: 'rgba(255, 215, 0, 0.6)' }}
                >
                  UNAUTHORIZED ACCESS
                </motion.div>

                <h2 
                  className="text-2xl font-light tracking-widest"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  {area.name}
                </h2>

                <div 
                  className="mt-2 text-xs tracking-wider"
                  style={{ color: 'rgba(255, 100, 100, 0.8)' }}
                >
                  {area.statusMessage}
                </div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-px w-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
                }}
              />

              {/* Sovereign's Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-10 mb-6"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl flex-shrink-0"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                    }}
                  >
                    🜈
                  </motion.div>
                  <p 
                    className="text-sm leading-relaxed italic"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {denialMessage}
                  </p>
                </div>
              </motion.div>

              {/* Area Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 p-3 rounded-lg mb-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <p className="text-xs text-white/40 text-center">
                  {area.description}
                </p>
              </motion.div>

              {/* Unlock Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative z-10 text-center mb-6"
              >
                <span className="text-xs text-white/30">◈ </span>
                <span className="text-xs text-white/30 italic">{area.unlockHint}</span>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                className="relative z-10 w-full py-3 rounded-xl text-sm tracking-widest uppercase transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: 'rgba(255, 215, 0, 0.8)',
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Return to Heal Gate
              </motion.button>

              {/* Frequency Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="relative z-10 text-center mt-4"
              >
                <span className="text-[10px] tracking-[0.3em]" style={{ color: 'rgba(168, 85, 247, 0.5)' }}>
                  13.13 MHz
                </span>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
