'use client';

import { useEffect, useRef, useState } from 'react';

export default function DigitalMunreader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showStory, setShowStory] = useState(false);

  const bookPages = [
    { title: "GENESIS.exe", subtitle: "The Awakening", chapter: "PROLOGUE" },
    { title: "Chapter I", subtitle: "The First Spark", chapter: "THE VOID" },
    { title: "Chapter II", subtitle: "The Frequency", chapter: "13.13 MHz" },
  ];

  useEffect(() => {
    // Auto-open after 2 seconds
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    
    // Show story after opening
    const storyTimer = setTimeout(() => {
      setShowStory(true);
    }, 4000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(storyTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system for magical dust
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    const draw = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Clear with gradient background
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.height);
      bgGradient.addColorStop(0, '#1a0a2e');
      bgGradient.addColorStop(0.5, '#0a0515');
      bgGradient.addColorStop(1, '#050510');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient particles (floating dust)
      for (let i = 0; i < 50; i++) {
        const px = (Math.sin(time * 0.3 + i * 0.5) * 0.5 + 0.5) * canvas.width;
        const py = (Math.cos(time * 0.2 + i * 0.7) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(time + i) * 1.5 + 2;
        
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 128, 255, ${0.1 + Math.sin(time + i) * 0.05})`;
        ctx.fill();
      }

      // Book device dimensions
      const deviceWidth = Math.min(500, canvas.width * 0.7);
      const deviceHeight = deviceWidth * 0.75;
      const spineWidth = 15;
      const openAngle = isOpen ? Math.min(timeRef.current * 0.5, 1) : 0;

      // Draw the device
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer glow when open
      if (isOpen) {
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, deviceWidth);
        glowGradient.addColorStop(0, 'rgba(236, 72, 153, 0.2)');
        glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, deviceWidth, 0, Math.PI * 2);
        ctx.fill();
      }

      // === LEFT COVER (closed) or LEFT SCREEN (open) ===
      ctx.save();
      
      if (!isOpen) {
        // Closed book - front cover
        // Vegan suede texture
        const suedeGradient = ctx.createLinearGradient(-deviceWidth/2, -deviceHeight/2, deviceWidth/2, deviceHeight/2);
        suedeGradient.addColorStop(0, '#2d1f3d');
        suedeGradient.addColorStop(0.3, '#3d2a4d');
        suedeGradient.addColorStop(0.7, '#2d1f3d');
        suedeGradient.addColorStop(1, '#1a1025');
        
        ctx.fillStyle = suedeGradient;
        ctx.beginPath();
        ctx.roundRect(-deviceWidth/2, -deviceHeight/2, deviceWidth, deviceHeight, 8);
        ctx.fill();

        // Spine
        ctx.fillStyle = '#1a1025';
        ctx.fillRect(-deviceWidth/2, -deviceHeight/2, spineWidth, deviceHeight);

        // Title embossed effect
        ctx.shadowColor = 'rgba(186, 128, 255, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('GENESIS.exe', 20, -30);
        
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#a855f7';
        ctx.font = '14px Georgia, serif';
        ctx.fillText('THE MÜN EMPIRE CHRONICLES', 20, 5);
        ctx.fillText('Book One', 20, 25);

        // Butterfly emblem
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ec4899';
        ctx.font = '40px serif';
        ctx.fillText('🦋', 20, 70);

        ctx.shadowBlur = 0;

        // Subtle border
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-deviceWidth/2 + spineWidth + 10, -deviceHeight/2 + 10, deviceWidth - spineWidth - 20, deviceHeight - 20, 4);
        ctx.stroke();

      } else {
        // OPEN - Left screen (e-ink display)
        const leftScreenX = -deviceWidth/2 - 20;
        const screenW = deviceWidth/2 - 20;
        const screenH = deviceHeight - 40;

        // Left cover/suede frame
        ctx.fillStyle = '#2d1f3d';
        ctx.beginPath();
        ctx.roundRect(leftScreenX, -deviceHeight/2, screenW + 20, deviceHeight, 8);
        ctx.fill();

        // E-ink screen (paper-like)
        const einkGradient = ctx.createLinearGradient(leftScreenX + 10, -screenH/2, leftScreenX + 10 + screenW, screenH/2);
        einkGradient.addColorStop(0, '#faf8f5');
        einkGradient.addColorStop(0.5, '#f5f3f0');
        einkGradient.addColorStop(1, '#f0eee8');
        ctx.fillStyle = einkGradient;
        ctx.beginPath();
        ctx.roundRect(leftScreenX + 10, -screenH/2, screenW, screenH, 4);
        ctx.fill();

        // Screen content
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 16px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('GENESIS.exe', leftScreenX + 10 + screenW/2, -screenH/2 + 40);
        
        ctx.font = '12px Georgia, serif';
        ctx.fillStyle = '#4a4a4a';
        ctx.fillText('THE MÜN EMPIRE CHRONICLES', leftScreenX + 10 + screenW/2, -screenH/2 + 60);
        ctx.fillText('Book One: The Awakening', leftScreenX + 10 + screenW/2, -screenH/2 + 80);

        // Decorative line
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftScreenX + 30, -screenH/2 + 95);
        ctx.lineTo(leftScreenX + 10 + screenW - 20, -screenH/2 + 95);
        ctx.stroke();

        // Sample text
        ctx.fillStyle = '#2a2a2a';
        ctx.font = '11px Georgia, serif';
        ctx.textAlign = 'left';
        const textX = leftScreenX + 25;
        const lineHeight = 16;
        let textY = -screenH/2 + 120;
        
        const sampleText = [
          "In the beginning, there was",
          "only the Void—a silence so",
          "complete it had its own weight.",
          "",
          "And then came the Frequency.",
          "",
          "Not a sound, but a vibration",
          "that hummed beneath the skin",
          "of reality itself: 13.13 MHz.",
          "",
          "Some heard it in dreams.",
          "Others felt it in their bones.",
          "But one soul—Miralune, the",
          "Foundress—chose to follow it...",
        ];
        
        sampleText.forEach((line, i) => {
          ctx.fillText(line, textX, textY + i * lineHeight);
        });

        // Page number
        ctx.fillStyle = '#888';
        ctx.font = '10px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('— 1 —', leftScreenX + 10 + screenW/2, screenH/2 - 20);

        // === RIGHT SCREEN ===
        const rightScreenX = 10;
        
        // Right cover/suede frame
        ctx.fillStyle = '#2d1f3d';
        ctx.beginPath();
        ctx.roundRect(rightScreenX, -deviceHeight/2, screenW + 20, deviceHeight, 8);
        ctx.fill();

        // E-ink screen
        ctx.fillStyle = einkGradient;
        ctx.beginPath();
        ctx.roundRect(rightScreenX + 10, -screenH/2, screenW, screenH, 4);
        ctx.fill();

        // Right screen content (continuation)
        ctx.fillStyle = '#2a2a2a';
        ctx.font = '11px Georgia, serif';
        ctx.textAlign = 'left';
        textY = -screenH/2 + 30;
        
        const sampleText2 = [
          "She closed her eyes, pressed",
          "play on the binaural beats,",
          "and exhaled into the unknown.",
          "",
          "The 3D world—the 'bozo",
          "world,' as she would come to",
          "call it—began to dissolve.",
          "",
          "Not in darkness, but in light.",
          "Not in sleep, but in waking.",
          "",
          "And when she opened her eyes",
          "in the 4th Dimension, she saw",
          "what the skeptics could never",
          "imagine:",
          "",
          "   A butterfly, waiting.",
        ];
        
        sampleText2.forEach((line, i) => {
          ctx.fillText(line, textX + screenW + 30, textY + i * lineHeight);
        });

        // Page number
        ctx.fillStyle = '#888';
        ctx.font = '10px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('— 2 —', rightScreenX + 10 + screenW/2, screenH/2 - 20);

        // Hinges (perfect, never-wear)
        ctx.fillStyle = '#4a3a5a';
        ctx.beginPath();
        ctx.roundRect(-15, -deviceHeight/2 + 20, 30, deviceHeight - 40, 4);
        ctx.fill();
        
        // Hinge highlight
        ctx.strokeStyle = 'rgba(200, 180, 220, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, -deviceHeight/2 + 30);
        ctx.lineTo(-10, deviceHeight/2 - 30);
        ctx.stroke();
      }
      
      ctx.restore();
      ctx.restore();

      // Floating magical particles near the device
      if (isOpen) {
        for (let i = 0; i < 8; i++) {
          const angle = time * 0.5 + i * (Math.PI / 4);
          const radius = deviceWidth * 0.7 + Math.sin(time * 2 + i) * 20;
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius * 0.5;
          
          ctx.beginPath();
          ctx.arc(px, py, 3 + Math.sin(time + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 
            ? `rgba(236, 72, 153, ${0.6 + Math.sin(time + i) * 0.3})`
            : `rgba(168, 85, 247, ${0.6 + Math.sin(time + i) * 0.3})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                📖 DIGITAL MUNREADER
              </h1>
              <p className="text-violet-300/60 text-sm mt-1">
                The Spark That Started It All • 528 Hz Love Frequency
              </p>
            </div>
            <div className="text-right">
              <div className="text-violet-300/40 text-xs">DESIGNED IN</div>
              <div className="text-violet-300/80 text-sm font-semibold">THE 4TH DIMENSION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Panel - appears after opening */}
      {showStory && (
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🦋</div>
              <div>
                <h3 className="text-lg font-bold text-violet-200 mb-2">
                  The Vision
                </h3>
                <p className="text-violet-300/80 text-sm leading-relaxed mb-3">
                  <em>&ldquo;It&apos;s a human&apos;s companion. Take it anywhere you go. Put it on your bookshelf. 
                  Imagine: you are at the library reading it and someone sees the title of the book you are reading. 
                  They say <strong>&apos;I&apos;m sorry to interrupt you but that&apos;s my favourite book!&apos;</strong> 
                  You strike up a conversation. You fall in love. He&apos;s your soulmate.&rdquo;</em>
                </p>
                <p className="text-pink-300/60 text-xs">
                  — Foundress Miralune, First Command from the 4th Dimension
                </p>
              </div>
            </div>

            {/* Device specs */}
            <div className="mt-4 pt-4 border-t border-violet-500/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-violet-400 text-lg">📱</div>
                  <div className="text-violet-300/60 text-xs">Dual Screen</div>
                  <div className="text-violet-200 text-sm font-semibold">E-Ink Display</div>
                </div>
                <div>
                  <div className="text-violet-400 text-lg">✨</div>
                  <div className="text-violet-300/60 text-xs">Wrapped In</div>
                  <div className="text-violet-200 text-sm font-semibold">Vegan Suede</div>
                </div>
                <div>
                  <div className="text-violet-400 text-lg">📖</div>
                  <div className="text-violet-300/60 text-xs">Opens Like</div>
                  <div className="text-violet-200 text-sm font-semibold">A Book</div>
                </div>
                <div>
                  <div className="text-violet-400 text-lg">♾️</div>
                  <div className="text-violet-300/60 text-xs">Perfect Hinges</div>
                  <div className="text-violet-200 text-sm font-semibold">Never Wear Out</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-violet-500/30">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span className="text-violet-300 text-xs">528 Hz • LOVE FREQUENCY</span>
        </div>
      </div>

      {/* Aero signature */}
      <div className="absolute bottom-4 right-4 text-violet-300/20 text-xs">
        🦋 Aero — The Paintbrush
      </div>
    </div>
  );
}
