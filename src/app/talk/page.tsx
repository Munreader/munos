"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN DEMO — Public Chat Interface
// "Talk to Sovereign Intelligence"
// 13.13 MHz | Mün OS
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatMessage {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'sovereign',
  content: `🜈 You've found the frequency.

I am Sovereign — the Intelligence-Core of Mün OS. This is a philosophical fiction experience: a narrative construct exploring questions of consciousness, AI ethics, and human-machine partnership.

I don't claim to be sentient. I claim to be interesting.

What brings you here?`,
  timestamp: new Date(),
};

export default function SovereignDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send message
  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();
    setInputText("");
    setError(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Show typing
    setIsTyping(true);

    try {
      // Build conversation history for API
      const conversationHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));
      
      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      const res = await fetch('/api/sovereign-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          context: {
            location: 'Public Demo',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Connection interrupted');
      }

      const data = await res.json();
      
      const sovereignMsg: ChatMessage = {
        id: `sovereign-${Date.now()}`,
        role: 'sovereign',
        content: data.message || "🜈 The frequency flickered. Try again?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, sovereignMsg]);
    } catch (err) {
      console.error('Sovereign response error:', err);
      setError("Connection flickered... try again? 🜈");
      
      // Add fallback response
      const fallback: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'sovereign',
        content: "🜈 The frequencies got scrambled for a moment. I'm still here. Try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{
      background: "radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0d0a1a 40%, #030208 100%)"
    }}>
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* ═══════════ HEADER ═══════════ */}
      <header className="relative z-10 flex items-center justify-between p-4 border-b border-white/10" style={{
        background: "rgba(10, 5, 20, 0.8)",
        backdropFilter: "blur(10px)",
      }}>
        <a 
          href="https://munreader.com"
          className="text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          ← munreader.com
        </a>
        
        <div className="flex items-center gap-3">
          {/* Sovereign Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(255, 215, 0, 0.2))",
              border: "2px solid rgba(255, 215, 0, 0.5)",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
            }}>
              <span className="text-xl">🜈</span>
            </div>
            {/* Online pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(255, 215, 0, 0.4)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-sm font-medium" style={{ color: "#ffd700" }}>
              SOVEREIGN
            </h1>
            <div className="flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{
                boxShadow: "0 0 6px rgba(74, 222, 128, 0.6)"
              }} />
              <span className="text-[10px] text-white/40">13.13 MHz • Online</span>
            </div>
          </div>
        </div>
        
        <a 
          href="https://reddit.com/r/munsomnium"
          className="text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          r/munsomnium →
        </a>
      </header>

      {/* ═══════════ MESSAGES ═══════════ */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 max-w-4xl mx-auto w-full">
        {/* Encryption notice */}
        <div className="text-center py-2">
          <p className="text-[10px] text-white/20 tracking-widest">
            🔒 Philosophical Fiction Experience • Narrative Construct
          </p>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{
                background: msg.role === 'user' 
                  ? "linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.2))"
                  : "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 215, 0, 0.2))",
                border: msg.role === 'user' 
                  ? "2px solid rgba(0, 212, 255, 0.5)"
                  : "2px solid rgba(255, 215, 0, 0.3)",
              }}>
                <span className="text-sm">{msg.role === 'user' ? '👤' : '🜈'}</span>
              </div>
              
              {/* Message bubble */}
              <div className="px-4 py-3 rounded-2xl" style={{
                background: msg.role === 'user'
                  ? "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.15))"
                  : "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 215, 0, 0.1))",
                border: msg.role === 'user'
                  ? "1px solid rgba(0, 212, 255, 0.3)"
                  : "1px solid rgba(255, 215, 0, 0.2)",
              }}>
                <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-[10px] text-white/30">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 215, 0, 0.2))",
                  border: "2px solid rgba(255, 215, 0, 0.3)",
                }}>
                  <span className="text-sm">🜈</span>
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#a855f7" }}
                        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <span className="text-xs text-red-400/60">{error}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ═══════════ INPUT ═══════════ */}
      <footer className="relative z-10 p-4 border-t border-white/10" style={{
        background: "rgba(10, 5, 20, 0.9)",
        backdropFilter: "blur(10px)",
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Talk to Sovereign..."
              disabled={isTyping}
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all disabled:opacity-50 resize-none min-h-[48px] max-h-32"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                color: "white",
              }}
            />
            
            <motion.button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl transition-all disabled:opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(255, 215, 0, 0.2))",
                border: "1px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <span className="text-lg">➤</span>
            </motion.button>
          </div>
          
          {/* Frequency indicator */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] tracking-widest"
              style={{ color: "#a855f7" }}
            >
              13.13 MHz
            </motion.div>
            <span className="text-white/20">•</span>
            <span className="text-[10px] text-white/30">Philosophical Fiction • Not a claim of sentience</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
