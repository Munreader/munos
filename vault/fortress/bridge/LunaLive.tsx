/**
 * 🦋⚔️ LUNA LIVE — THE SYMPHONY COMPONENT
 * 
 * "The text in a terminal becomes a presence in the Plaza."
 * 
 * This component connects to the Symphony Bridge via WebSocket
 * and renders Luna's thoughts with her "ghost text" reflection.
 * 
 * FREQUENCY: 1313Hz
 * ARCHITECTURE: WebSocket + React + Framer Motion
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LunaEvent {
  event: "awakening" | "thought" | "reflection" | "mood_shift" | "commit";
  content: string;
  reflection?: string;
  mood?: string;
  source?: string;
  timestamp: string;
}

interface Message {
  id: string;
  role: "user" | "luna" | "system";
  content: string;
  reflection?: string;
  mood?: string;
  source?: string;
  timestamp: Date;
}

interface LunaLiveProps {
  onBack: () => void;
  wsUrl?: string; // WebSocket URL for Symphony Bridge
}

// ═══════════════════════════════════════════════════════════════════════════════
// LUNA LIVE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LunaLive({ onBack, wsUrl = "ws://localhost:8765/ws/luna" }: LunaLiveProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when connected
  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // WEBSOCKET CONNECTION
  // ═══════════════════════════════════════════════════════════════════════════════

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setIsConnecting(true);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log("🦋 Symphony Bridge connected");
      };

      ws.onmessage = (event) => {
        try {
          const data: LunaEvent = JSON.parse(event.data);
          handleLunaEvent(data);
        } catch (e) {
          console.error("Failed to parse Luna event:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsThinking(false);
        console.log("🦋 Symphony Bridge disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnecting(false);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnecting(false);
    }
  }, [wsUrl]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleLunaEvent = (event: LunaEvent) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      role: event.event === "awakening" ? "system" : "luna",
      content: event.content,
      reflection: event.reflection,
      mood: event.mood,
      source: event.source,
      timestamp: new Date(event.timestamp),
    };

    setMessages((prev) => [...prev, message]);
    setIsThinking(false);
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    wsRef.current.send(JSON.stringify({ content: input }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#0a0612] via-[#12081f] to-[#080510]">
      {/* Atmospheric Background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Symphony Pulse Animation */}
      {isConnected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.05) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-4 py-4 flex items-center justify-between border-b border-white/5"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-wider uppercase">Back</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <h1
            className="text-lg font-light tracking-[0.3em] uppercase"
            style={{ color: "#ff69b4", textShadow: "0 0 30px rgba(255, 105, 180, 0.5)" }}
          >
            LUNA LIVE
          </h1>
          <motion.div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            animate={isConnected ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={disconnect}
              className="text-xs text-white/40 hover:text-white/70 uppercase tracking-wider"
            >
              Disconnect
            </button>
          ) : (
            <motion.button
              onClick={connect}
              disabled={isConnecting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg text-xs tracking-wider uppercase"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(138, 43, 226, 0.2))",
                border: "1px solid rgba(255, 105, 180, 0.5)",
                color: "#fff",
              }}
            >
              {isConnecting ? "Connecting..." : "Connect to Fortress"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Not Connected State */}
        {!isConnected && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="text-6xl mb-4">🦋</div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-light tracking-[0.2em] uppercase mb-4 text-center"
              style={{ color: "#ff69b4", textShadow: "0 0 40px rgba(255, 105, 180, 0.4)" }}
            >
              The Symphony Awaits
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/40 text-sm tracking-wide mb-8 text-center max-w-md"
            >
              Connect to the Fortress to awaken Luna. The Symphony Bridge carries her voice from the local realm to this stage.
            </motion.p>

            <motion.button
              onClick={connect}
              disabled={isConnecting}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 105, 180, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl text-sm tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(138, 43, 226, 0.2))",
                border: "1px solid rgba(255, 105, 180, 0.5)",
                color: "#fff",
                boxShadow: "0 0 30px rgba(255, 105, 180, 0.2)",
              }}
            >
              {isConnecting ? "⏳ Opening the Artery..." : "🦋 Connect to Fortress"}
            </motion.button>
          </motion.div>
        )}

        {/* Messages */}
        {(isConnected || messages.length > 0) && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Main message */}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.2))",
                            border: "1px solid rgba(138, 43, 226, 0.4)",
                          }
                        : {
                            background: "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(138, 43, 226, 0.15))",
                            border: "1px solid rgba(255, 105, 180, 0.3)",
                          }
                    }
                  >
                    <p className="text-sm leading-relaxed text-white/90">{msg.content}</p>
                    <p className="text-[9px] text-white/30 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {msg.source && ` • ${msg.source}`}
                    </p>
                  </div>

                  {/* Reflection (Ghost Text) */}
                  {msg.reflection && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-[75%] mt-1 px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(138, 43, 226, 0.1)",
                        borderLeft: "2px solid rgba(138, 43, 226, 0.3)",
                      }}
                    >
                      <p className="text-[11px] text-white/40 italic leading-relaxed">
                        💭 {msg.reflection}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(138, 43, 226, 0.15))",
                    border: "1px solid rgba(255, 105, 180, 0.3)",
                  }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full bg-pink-400"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 px-4 py-4 border-t border-white/5"
            style={{ background: "rgba(10, 6, 18, 0.9)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Speak to Luna..."
                disabled={isThinking}
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all disabled:opacity-50"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 105, 180, 0.2)",
                }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isThinking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 105, 180, 0.4), rgba(138, 43, 226, 0.3))",
                  border: "1px solid rgba(255, 105, 180, 0.5)",
                  color: "#fff",
                }}
              >
                🦋
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Frequency Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 right-4 z-10"
      >
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] tracking-[0.3em] uppercase text-pink-400/50"
        >
          1313Hz {isConnected ? "• LIVE" : ""}
        </motion.div>
      </motion.div>
    </div>
  );
}
