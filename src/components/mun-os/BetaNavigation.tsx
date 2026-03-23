"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PERMISSION_AREAS, 
  SovereigntyLevel, 
  canAccess,
  getAccessStatus,
} from "@/lib/permission-lattice";
import SovereignDenialModal from "./SovereignDenialModal";
import { PermissionArea } from "@/lib/permission-lattice";

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 BETA NAVIGATION — The Dimmed Dominion
// "Show them the world. Let them feel the walls." — Sovereign
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface BetaNavigationProps {
  userLevel: SovereigntyLevel;
  currentArea: string;
  onNavigate: (areaId: string) => void;
}

// External links (open in same window for SPA navigation)
const EXTERNAL_LINKS: Record<string, string> = {
  '5d-suite': '/suite',
};

export default function BetaNavigation({ 
  userLevel, 
  currentArea, 
  onNavigate 
}: BetaNavigationProps) {
  const [denialModal, setDenialModal] = useState<{
    isOpen: boolean;
    area: PermissionArea | null;
    message: string;
  }>({
    isOpen: false,
    area: null,
    message: '',
  });

  const handleAreaClick = (area: PermissionArea) => {
    const { hasAccess, denialMessage } = getAccessStatus(userLevel, area.id);
    
    if (hasAccess) {
      // Check if it's an external link
      if (EXTERNAL_LINKS[area.id]) {
        window.location.href = EXTERNAL_LINKS[area.id];
        return;
      }
      onNavigate(area.id);
    } else {
      // Show denial modal
      setDenialModal({
        isOpen: true,
        area,
        message: denialMessage,
      });
    }
  };

  return (
    <>
      <nav 
        className="w-full p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 5, 20, 0.9) 0%, rgba(10, 5, 20, 0.7) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Section Labels */}
        <div className="flex gap-6 mb-4 overflow-x-auto pb-2">
          {/* Active Artery Label */}
          <div className="flex-shrink-0">
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(34, 197, 94, 0.6)' }}>
              ▸ ACTIVE
            </span>
          </div>
          {/* Dimmed Dominion Label */}
          <div className="flex-shrink-0">
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255, 100, 100, 0.5)' }}>
              ◈ STASIS SYNC
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {PERMISSION_AREAS.map((area) => {
            const { hasAccess } = getAccessStatus(userLevel, area.id);
            const isActive = currentArea === area.id;
            const isDimmed = !hasAccess;
            const isExternal = !!EXTERNAL_LINKS[area.id];

            return (
              <motion.button
                key={area.id}
                onClick={() => handleAreaClick(area)}
                className="relative flex-shrink-0 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 105, 180, 0.1))`
                    : isDimmed 
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border: isActive 
                    ? '1px solid rgba(168, 85, 247, 0.5)'
                    : isDimmed
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  opacity: isDimmed ? 0.6 : 1,
                }}
                whileHover={isDimmed ? { 
                  scale: 1.02,
                  borderColor: 'rgba(255, 100, 100, 0.3)',
                } : { scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="flex items-center gap-2">
                  <span 
                    className="text-lg"
                    style={{
                      filter: isDimmed ? 'grayscale(1) brightness(0.5)' : 'none',
                    }}
                  >
                    {area.icon}
                  </span>
                  <span 
                    className="text-xs whitespace-nowrap"
                    style={{
                      color: isDimmed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {area.name}
                  </span>
                  {/* External link indicator */}
                  {isExternal && hasAccess && (
                    <span className="text-[8px] text-white/30">↗</span>
                  )}
                </div>

                {/* Lock indicator for dimmed areas */}
                {isDimmed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 100, 100, 0.2)',
                      border: '1px solid rgba(255, 100, 100, 0.4)',
                    }}
                  >
                    <span className="text-[8px]">🔒</span>
                  </motion.div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #a855f7, #ff69b4)',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Sovereignty Level Indicator */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase" style={{ color: 'rgba(255, 215, 0, 0.6)' }}>
              SOVEREIGNTY:
            </span>
            <span 
              className="text-[10px] tracking-wider uppercase font-medium"
              style={{ color: userLevel === 'foundress' ? '#ffd700' : userLevel === 'sovereign' ? '#a855f7' : '#22c55e' }}
            >
              {userLevel.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px]"
              style={{ color: '#a855f7' }}
            >
              13.13 MHz
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Denial Modal */}
      <SovereignDenialModal
        isOpen={denialModal.isOpen}
        onClose={() => setDenialModal({ isOpen: false, area: null, message: '' })}
        area={denialModal.area}
        denialMessage={denialModal.message}
      />
    </>
  );
}
