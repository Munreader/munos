"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  UserSuite,
  AssetDefinition,
  BuildCommand,
  parseBuildCommand,
  sovereignGuard,
  getStoredSuite,
  saveSuite,
  createEmptySuite,
  addAssetToSuite,
  ASSET_LIBRARY,
  SuiteAsset,
} from "@/lib/suite-system";

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 TALK-TO-BUILD INTERFACE
// "You speak. I build. Sovereign guards." — Aero
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface TalkToBuildProps {
  userId: string;
  userName: string;
  onSuiteUpdate?: (suite: UserSuite) => void;
}

export default function TalkToBuild({ userId, userName, onSuiteUpdate }: TalkToBuildProps) {
  const [suite, setSuite] = useState<UserSuite | null>(null);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<{
    aero: string;
    sovereign?: string;
    asset?: AssetDefinition;
    approved: boolean;
  } | null>(null);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);

  // Load suite on mount
  useEffect(() => {
    const stored = getStoredSuite(userId);
    if (stored) {
      setSuite(stored);
    } else {
      const newSuite = createEmptySuite(userId, userName);
      setSuite(newSuite);
      saveSuite(newSuite);
    }
  }, [userId, userName]);

  // Handle build command
  const handleBuild = useCallback(async () => {
    if (!input.trim() || !suite || isProcessing) return;

    setIsProcessing(true);
    const userRequest = input.trim();
    setInput("");

    // Parse the natural language command
    const result = parseBuildCommand(userRequest);

    if (!result.understood || !result.asset || !result.command) {
      setLastResponse({
        aero: result.message,
        approved: false,
      });
      setIsProcessing(false);
      return;
    }

    // Run through Sovereign's guard
    const veto = sovereignGuard(userRequest, result.asset, suite.cii);

    if (!veto.approved) {
      setLastResponse({
        aero: `🦋 I heard you, but Sovereign has vetoed this placement.`,
        sovereign: veto.reason,
        asset: result.asset,
        approved: false,
      });
      setIsProcessing(false);
      return;
    }

    // Execute the build
    const updatedSuite = addAssetToSuite(suite, result.asset, result.command);
    setSuite(updatedSuite);
    saveSuite(updatedSuite);
    onSuiteUpdate?.(updatedSuite);

    // Generate response
    const aeroMessage = result.needsApproval
      ? `${result.message}\n\n🜈 ${veto.reason}`
      : result.message;

    setLastResponse({
      aero: aeroMessage,
      sovereign: veto.reason !== "🜈 Placement authorized. The structure is sound." ? veto.reason : undefined,
      asset: result.asset,
      approved: true,
    });

    setIsProcessing(false);
  }, [input, suite, isProcessing, onSuiteUpdate]);

  // Quick build presets
  const quickBuilds = [
    { label: "Purple Couch", input: "Create a purple neon couch" },
    { label: "Crystal", input: "Add a floating crystal" },
    { label: "Healing Pod", input: "I want a healing pod" },
    { label: "Meditation Spot", input: "Place a meditation cushion in the center" },
  ];

  return (
    <div 
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, rgba(10, 5, 20, 0.95) 0%, rgba(5, 2, 10, 0.98) 100%)",
      }}
    >
      {/* ═══════════ SUITE PREVIEW ═══════════ */}
      <div className="flex-1 relative overflow-hidden">
        <SuitePreview suite={suite} />
        
        {/* CII Indicator */}
        {suite && (
          <div 
            className="absolute top-4 right-4 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              CII Index
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-24 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${suite.cii * 100}%` }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #22c55e, #10b981)`,
                    boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: "#22c55e" }}>
                {(suite.cii * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Asset Count */}
        {suite && (
          <div 
            className="absolute top-4 left-4 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 105, 180, 0.3)",
            }}
          >
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "#ff69b4" }}>
              {suite.assets.length} Objects
            </span>
          </div>
        )}
      </div>

      {/* ═══════════ RESPONSE AREA ═══════════ */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-3 border-t border-white/5"
            style={{
              background: lastResponse.approved 
                ? "rgba(34, 197, 94, 0.05)" 
                : "rgba(255, 100, 100, 0.05)",
              borderTopColor: lastResponse.approved 
                ? "rgba(34, 197, 94, 0.2)" 
                : "rgba(255, 100, 100, 0.2)",
            }}
          >
            {/* Aero's Message */}
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg">🦋</span>
              <p className="text-sm text-white/80">{lastResponse.aero}</p>
            </div>

            {/* Sovereign's Message (if vetoed or high-value item) */}
            {lastResponse.sovereign && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/10">
                <span className="text-lg">🜈</span>
                <p className="text-sm italic" style={{ color: "#ffd700" }}>
                  {lastResponse.sovereign}
                </p>
              </div>
            )}

            {/* Built Asset Preview */}
            {lastResponse.asset && lastResponse.approved && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-3 p-3 rounded-lg flex items-center gap-3"
                style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
              >
                <span className="text-2xl">{lastResponse.asset.icon}</span>
                <div>
                  <p className="text-sm text-white/80">{lastResponse.asset.name}</p>
                  <p className="text-[10px] text-white/40">{lastResponse.asset.description}</p>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setLastResponse(null)}
              className="mt-2 text-[10px] text-white/30 hover:text-white/50 transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ QUICK BUILDS ═══════════ */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5">
        {quickBuilds.map((qb) => (
          <button
            key={qb.label}
            onClick={() => setInput(qb.input)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all"
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              color: "#a855f7",
            }}
          >
            {qb.label}
          </button>
        ))}
        <button
          onClick={() => setShowAssetLibrary(!showAssetLibrary)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all"
          style={{
            background: "rgba(255, 215, 0, 0.1)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            color: "#ffd700",
          }}
        >
          Library
        </button>
      </div>

      {/* ═══════════ INPUT AREA ═══════════ */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleBuild()}
            placeholder="Describe what you want to build..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              color: "white",
            }}
          />
          <motion.button
            onClick={handleBuild}
            disabled={!input.trim() || isProcessing}
            className="px-4 py-3 rounded-xl transition-all disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(168, 85, 247, 0.2))",
              border: "1px solid rgba(255, 105, 180, 0.4)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">🦋</span>
          </motion.button>
        </div>
        <p className="text-[10px] text-white/30 text-center mt-2">
          Talk to Aero to build your Sanctuary • 13.13 MHz
        </p>
      </div>

      {/* ═══════════ ASSET LIBRARY MODAL ═══════════ */}
      <AnimatePresence>
        {showAssetLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setShowAssetLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, rgba(10, 5, 20, 0.98) 0%, rgba(5, 2, 10, 0.99) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl tracking-widest mb-6" style={{ color: "#a855f7" }}>
                ASSET LIBRARY
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ASSET_LIBRARY.map((asset) => (
                  <motion.button
                    key={asset.id}
                    onClick={() => {
                      setInput(`Create a ${asset.name.toLowerCase()}`);
                      setShowAssetLibrary(false);
                    }}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: "rgba(168, 85, 247, 0.5)",
                    }}
                  >
                    <span className="text-2xl mb-2 block">{asset.icon}</span>
                    <p className="text-sm text-white/80">{asset.name}</p>
                    <p className="text-[10px] text-white/40 mt-1">{asset.category}</p>
                    {asset.requiresApproval && (
                      <span className="text-[8px] text-amber-400/60 mt-1 block">🜈 Review Required</span>
                    )}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setShowAssetLibrary(false)}
                className="mt-6 w-full py-2 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors"
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

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE PREVIEW — 2.5D Visualization
// ═══════════════════════════════════════════════════════════════════════════════

function SuitePreview({ suite }: { suite: UserSuite | null }) {
  if (!suite) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/30"
        >
          Loading your Suite...
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, rgba(10, 5, 20, 1) 0%, rgba(5, 2, 10, 1) 100%)
        `,
      }}
    >
      {/* Grid Floor */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: `
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />

      {/* Assets */}
      {suite.assets.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🦋
            </motion.div>
            <p className="text-white/40 text-sm">Your Suite is empty</p>
            <p className="text-white/20 text-xs mt-2">Tell Aero what to build</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: 400, height: 300 }}>
            {suite.assets.map((asset, index) => (
              <SuiteAssetDisplay 
                key={asset.id} 
                asset={asset} 
                index={index}
                total={suite.assets.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ambient Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? "#a855f7" : "#ff69b4",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Suite Name */}
      <div className="absolute bottom-4 left-4">
        <p className="text-xs text-white/40">{suite.name}</p>
        <p className="text-[10px] text-white/20">Last modified: {suite.lastModified.toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function SuiteAssetDisplay({ asset, index, total }: { asset: SuiteAsset; index: number; total: number }) {
  // Calculate position in a circular layout
  const angle = (index / total) * Math.PI * 2;
  const radius = 80;
  const x = Math.cos(angle) * radius + 150;
  const y = Math.sin(angle) * radius + 100;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          filter: `drop-shadow(0 0 ${asset.spatial.glowIntensity * 20}px ${asset.spatial.colorScheme.glow})`,
        }}
        transition={{ duration: 2 + index * 0.2, repeat: Infinity }}
        className="text-4xl cursor-pointer hover:scale-110 transition-transform"
      >
        {ASSET_LIBRARY.find(a => a.id === asset.assetId)?.icon || "📦"}
      </motion.div>
      <p 
        className="text-[8px] text-white/40 text-center mt-1 whitespace-nowrap"
      >
        {asset.name}
      </p>
    </motion.div>
  );
}
