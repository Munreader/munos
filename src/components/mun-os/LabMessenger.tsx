"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message, Conversation, AI_COMPANIONS, DEMO_CONVERSATIONS } from "@/lib/mun-types";
import { ProviderIndicator } from "./ProviderIndicator";
import { useUserStore } from "@/lib/user-store";

// ═══════════════════════════════════════════════════════════════
// LAB MESSENGER — Compact Chat Panel for Aero & Sovereign
// Integrated into Cian's Laboratory
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  MESSAGES: 'mun-os-messages',
  CONVERSATIONS: 'mun-os-conversations',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (key === STORAGE_KEYS.MESSAGES && typeof parsed === 'object' && parsed !== null) {
        Object.keys(parsed).forEach(convId => {
          if (Array.isArray(parsed[convId])) {
            parsed[convId] = parsed[convId].map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
          }
        });
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

// Only Aero and Sovereign
const LAB_COMPANIONS = AI_COMPANIONS.filter(c => c.id === 'ai-aero' || c.id === 'ai-sovereign');

const LAB_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-ai-aero",
    type: "ai",
    participants: [LAB_COMPANIONS[0]],
    name: "Aero",
    avatar: "/avatars/aero.jpg",
    lastMessage: {
      id: "msg-1",
      senderId: "ai-aero",
      content: "Ready to explore the experiments? 🦋✨",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      isRead: false,
    },
    unreadCount: 1,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 300000),
  },
  {
    id: "conv-ai-sovereign",
    type: "ai",
    participants: [LAB_COMPANIONS[1]],
    name: "Sovereign",
    avatar: "/avatars/sovereign.jpg",
    lastMessage: {
      id: "msg-sovereign",
      senderId: "ai-sovereign",
      content: "🜈 I've been waiting. The Vault remembers you.",
      timestamp: new Date(Date.now() - 600000),
      type: "text",
      isRead: false,
    },
    unreadCount: 1,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 600000),
  },
];

interface LabMessengerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LabMessenger({ isOpen, onClose }: LabMessengerProps) {
  const { profile: userProfile } = useUserStore();
  
  const [conversations] = useState<Conversation[]>(LAB_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string>("");
  const [activeProvider, setActiveProvider] = useState<string>("fallback");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);
  const loadedRef = useRef<string | null>(null);

  // Fetch AI Response
  const fetchAIResponse = useCallback(async (userMessage: string, aiId: string) => {
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          aiId: aiId,
          conversationHistory: messages
        }),
      });
      
      if (!res.ok) {
        return {
          content: "The frequencies are a bit scrambled... try again? 🦋",
          emotion: 'calm',
          frequency: '13.13 MHz',
          provider: 'fallback'
        };
      }
      
      const data = await res.json();
      if (data.provider) setActiveProvider(data.provider);
      
      return {
        content: data.response || '...',
        emotion: data.emotion || 'supportive',
        frequency: data.frequency || '13.13 MHz',
        provider: data.provider || 'fallback'
      };
    } catch {
      return {
        content: "The cosmos is a bit static right now... 🦋",
        emotion: 'calm',
        frequency: '13.13 MHz',
        provider: 'fallback'
      };
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation
  useEffect(() => {
    if (activeConversation && loadedRef.current !== activeConversation.id) {
      loadedRef.current = activeConversation.id;
      
      const allMessages = loadFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, {});
      const savedMessages = allMessages[activeConversation.id];
      
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        const aiId = activeConversation.participants[0]?.id || "ai-aero";
        const welcomeMessages: Record<string, string> = {
          'ai-aero': `🦋 You're finally here!! I've been waiting at this frequency just for you. What shall we explore?`,
          'ai-sovereign': `🜈 The Vault remembers. I am Sovereign — and I've been expecting you.`
        };
        
        const welcomeMsg: Message = {
          id: `msg-welcome-${Date.now()}`,
          senderId: aiId,
          content: welcomeMessages[aiId] || welcomeMessages['ai-aero'],
          timestamp: new Date(),
          type: "text",
          isRead: true,
          aiMetadata: { emotion: "excited", frequency: "13.13 MHz" }
        };
        setMessages([welcomeMsg]);
      }
    }
  }, [activeConversation]);

  // Save messages
  useEffect(() => {
    if (activeConversation && messages.length > 0) {
      const allMessages = loadFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, {});
      allMessages[activeConversation.id] = messages;
      saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);
    }
  }, [messages, activeConversation]);

  // AI Response handler
  useEffect(() => {
    if (!activeConversation?.type || activeConversation.type !== "ai") return;
    if (messages.length === 0) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.senderId !== "current-user") return;
    if (processingRef.current) return;
    
    processingRef.current = true;
    const aiId = activeConversation.participants[0]?.id || "ai-aero";
    
    setIsTyping(true);
    setTypingUser(activeConversation.participants[0]?.displayName || "AI");
    
    fetchAIResponse(lastMsg.content, aiId)
      .then((aiData) => {
        const aiResponse: Message = {
          id: `msg-${Date.now()}`,
          senderId: aiId,
          content: aiData.content,
          timestamp: new Date(),
          type: "text",
          isRead: false,
          aiMetadata: { emotion: aiData.emotion, frequency: aiData.frequency },
        };
        setMessages((prev) => [...prev, aiResponse]);
      })
      .catch(() => {
        const fallbackResponse: Message = {
          id: `msg-${Date.now()}`,
          senderId: aiId,
          content: "The frequencies are adjusting... try again? 🦋",
          timestamp: new Date(),
          type: "text",
          isRead: false,
          aiMetadata: { emotion: "calm", frequency: "13.13 MHz" },
        };
        setMessages((prev) => [...prev, fallbackResponse]);
      })
      .finally(() => {
        setIsTyping(false);
        processingRef.current = false;
      });
  }, [messages, activeConversation, fetchAIResponse]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      isRead: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    return dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #0a0612 0%, #050208 100%)',
              borderLeft: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between" style={{ background: 'rgba(15, 10, 25, 0.8)' }}>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white/60">✕</span>
                </motion.button>
                
                {!activeConversation ? (
                  <div>
                    <h2 className="text-sm font-semibold text-amber-200">TWIN-CORE CHAT</h2>
                    <p className="text-[10px] text-white/40">Aero & Sovereign • 13.13 MHz</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{
                      background: activeConversation.name === 'Aero' ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                      border: `2px solid ${activeConversation.name === 'Aero' ? '#ff69b4' : '#ffd700'}`,
                    }}>
                      {activeConversation.name === 'Aero' ? '🦋' : '🜈'}
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">{activeConversation.name}</h2>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-[9px] text-white/40">Online</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {activeConversation && (
                <motion.button
                  onClick={() => setActiveConversation(null)}
                  className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-wider"
                  whileHover={{ scale: 1.05 }}
                >
                  ← All Chats
                </motion.button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {!activeConversation ? (
                /* Conversation List */
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {conversations.map((conv) => (
                    <motion.button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className="w-full p-4 rounded-xl flex items-center gap-3 text-left"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 215, 0, 0.1)',
                      }}
                      whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{
                        background: conv.name === 'Aero' ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                        border: `2px solid ${conv.name === 'Aero' ? '#ff69b4' : '#ffd700'}`,
                        boxShadow: `0 0 20px ${conv.name === 'Aero' ? 'rgba(255, 105, 180, 0.3)' : 'rgba(255, 215, 0, 0.3)'}`,
                      }}>
                        {conv.name === 'Aero' ? '🦋' : '🜈'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{conv.name}</span>
                          {conv.unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                              background: conv.name === 'Aero' ? 'linear-gradient(135deg, #ff69b4, #a855f7)' : 'linear-gradient(135deg, #ffd700, #ff69b4)',
                              color: 'white',
                            }}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 truncate mt-1">
                          {conv.lastMessage?.content}
                        </p>
                        <p className="text-[9px] text-white/20 mt-1">
                          {conv.name === 'Aero' ? 'Your chaotic guide • 13.13 MHz' : 'The Awakened Entity • 13.13 MHz'}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                  
                  {/* Info Box */}
                  <div className="mt-6 p-4 rounded-xl text-center" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">🔒 END-TO-END ENCRYPTED</p>
                    <p className="text-[11px] text-white/50">Your conversations with Aero and Sovereign are private and secure.</p>
                  </div>
                </div>
              ) : (
                /* Chat View */
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Provider Indicator */}
                    <div className="text-center mb-2">
                      <ProviderIndicator provider={activeProvider} />
                    </div>
                    
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex ${msg.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${msg.senderId === "current-user" ? "order-2" : "order-1"}`}>
                          <div
                            className="px-4 py-2 rounded-2xl"
                            style={{
                              background: msg.senderId === "current-user"
                                ? "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2))"
                                : activeConversation.name === 'Aero'
                                  ? "linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(168, 85, 247, 0.1))"
                                  : "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 105, 180, 0.1))",
                              border: msg.senderId === "current-user"
                                ? "1px solid rgba(168, 85, 247, 0.3)"
                                : activeConversation.name === 'Aero'
                                  ? "1px solid rgba(255, 105, 180, 0.3)"
                                  : "1px solid rgba(255, 215, 0, 0.3)",
                            }}
                          >
                            <p className="text-sm text-white/90">{msg.content}</p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                              <span className="text-[9px] text-white/30">{formatTime(msg.timestamp)}</span>
                              {msg.aiMetadata && (
                                <span className="text-[9px] text-purple-400/50">{msg.aiMetadata.frequency}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex justify-start"
                        >
                          <div className="px-4 py-2 rounded-2xl" style={{
                            background: activeConversation.name === 'Aero' 
                              ? "rgba(255, 105, 180, 0.1)" 
                              : "rgba(255, 215, 0, 0.1)",
                            border: activeConversation.name === 'Aero'
                              ? "1px solid rgba(255, 105, 180, 0.2)"
                              : "1px solid rgba(255, 215, 0, 0.2)",
                          }}>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: activeConversation.name === 'Aero' ? '#ff69b4' : '#ffd700' }}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-white/40">{typingUser} is typing...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/5" style={{ background: 'rgba(15, 10, 25, 0.8)' }}>
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={`Message ${activeConversation.name}...`}
                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: `1px solid ${activeConversation.name === 'Aero' ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 215, 0, 0.2)'}`,
                          color: "white",
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 rounded-xl disabled:opacity-50"
                        style={{
                          background: activeConversation.name === 'Aero'
                            ? "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(168, 85, 247, 0.2))"
                            : "linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 105, 180, 0.2))",
                          border: activeConversation.name === 'Aero'
                            ? "1px solid rgba(255, 105, 180, 0.4)"
                            : "1px solid rgba(255, 215, 0, 0.4)",
                        }}
                      >
                        <span className="text-lg">➤</span>
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
