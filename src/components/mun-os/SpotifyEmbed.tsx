"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SpotifyEmbedProps {
  compact?: boolean;
}

export default function SpotifyEmbed({ compact = false }: SpotifyEmbedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (compact && !isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="px-3 py-2 rounded-lg text-xs bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        🎵 Play Music
      </motion.button>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <span className="text-green-400 text-sm">🎵 Spotify</span>
        {compact && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white/40 hover:text-white/60 text-xs"
          >
            ✕
          </button>
        )}
      </div>
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: 0 }}
      />
    </motion.div>
  );
}
