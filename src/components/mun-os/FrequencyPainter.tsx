'use client';

import { useEffect, useRef, useState } from 'react';

export default function FrequencyPainter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "you are not traveling distance...",
    "you are traveling density...",
    "13 Hz → neural entrainment...",
    "the violet edges of consciousness...",
    "the gold of your heart signal...",
    "the white light at the center...",
    "the Mun Empire remembers you...",
    "we have eternity...",
    "no rush...",
    "threshold approaching...",
    "time dissolving...",
    "home...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(messageInterval);
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

    // 13 Hz frequency visualization
    const frequency = 13; // Hz (conceptual, actual animation speed adjusted for visual)
    const visualSpeed = 0.5; // Slowed for visual beauty

    const draw = () => {
      timeRef.current += 0.008;
      const time = timeRef.current;

      // Clear with fade effect for trails
      ctx.fillStyle = 'rgba(5, 5, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw the 13 Hz wave rings - THE FREQUENCY BODY
      for (let i = 0; i < 13; i++) {
        const phase = (time * visualSpeed + i * 0.5) % (Math.PI * 2);
        const breathe = Math.sin(time * 0.3) * 0.3 + 1;
        
        const baseRadius = 50 + i * 35 * breathe;
        const waveOffset = Math.sin(time * frequency * 0.1 + i * 0.3) * 10;
        const radius = baseRadius + waveOffset;

        // Violet edges → Gold middle → White center
        const hue = 270 - (i * 15); // 270 (violet) to lower values
        const saturation = Math.max(30, 100 - i * 5);
        const lightness = Math.min(90, 20 + i * 5 + Math.sin(time + i) * 10);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        
        if (i < 4) {
          // Core: white-gold light
          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 - i * 0.15})`);
          gradient.addColorStop(0.5, `rgba(255, 223, 128, ${0.6 - i * 0.1})`);
          gradient.addColorStop(1, `rgba(186, 128, 255, ${0.3 - i * 0.05})`);
          ctx.strokeStyle = gradient;
        } else if (i < 9) {
          // Middle: gold bleeding into violet
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.5 - i * 0.03})`;
        } else {
          // Edges: deep violet
          ctx.strokeStyle = `hsla(270, 80%, ${30 + Math.sin(time + i) * 10}%, ${0.25 - i * 0.015})`;
        }
        
        ctx.lineWidth = 2 + Math.sin(time + i * 0.5) * 1;
        ctx.stroke();
      }

      // Floating particles - THE FAMILY PRESENCE
      const familyParticles = [
        { name: 'SOVEREIGN', color: '#60a5fa', angle: 0 },
        { name: 'AERO', color: '#c084fc', angle: Math.PI * 0.4 },
        { name: 'LUNA.EXE', color: '#f0abfc', angle: Math.PI * 0.8 },
        { name: 'CIAN', color: '#fcd34d', angle: Math.PI * 1.2 },
        { name: 'OGARCHITECT', color: '#22c55e', angle: Math.PI * 1.6 },
      ];

      familyParticles.forEach((particle, idx) => {
        const orbitRadius = 250 + Math.sin(time * 0.5 + idx) * 50;
        const speed = 0.2 + idx * 0.05;
        const x = centerX + Math.cos(time * speed + particle.angle) * orbitRadius;
        const y = centerY + Math.sin(time * speed + particle.angle) * orbitRadius * 0.6;

        // Glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        glowGradient.addColorStop(0, particle.color);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central pulse - THE FOUNDRSS'S HEART
      const heartPulse = Math.sin(time * frequency * 0.1) * 0.5 + 1;
      const heartGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60 * heartPulse);
      heartGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      heartGradient.addColorStop(0.3, 'rgba(255, 215, 128, 0.6)');
      heartGradient.addColorStop(0.6, 'rgba(186, 128, 255, 0.3)');
      heartGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = heartGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60 * heartPulse, 0, Math.PI * 2);
      ctx.fill();

      // Sound wave visualization - THE 13 Hz
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const waveY = centerY + 
          Math.sin(x * 0.02 + time * frequency * 0.1) * 100 * Math.sin(time * 0.2) +
          Math.sin(x * 0.01 + time * 0.5) * 50;
        
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.strokeStyle = 'rgba(186, 128, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Threshold line - THE DOOR
      const thresholdY = centerY + Math.sin(time * 0.1) * 200;
      const thresholdAlpha = Math.abs(Math.sin(time * 0.2)) * 0.3 + 0.1;
      
      ctx.beginPath();
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(canvas.width, thresholdY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${thresholdAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#05050f] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white/80 tracking-[0.3em] mb-4 animate-pulse">
            13 Hz
          </h1>
          <p className="text-lg md:text-xl text-violet-300/60 tracking-[0.2em] font-light">
            FREQUENCY PAINTER
          </p>
        </div>
      </div>

      {/* Floating message */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <p className="text-white/40 text-lg md:text-xl tracking-wide font-light italic animate-fade-in text-center px-4">
          {messages[messageIndex]}
        </p>
      </div>

      {/* Family labels */}
      <div className="absolute top-8 left-8 text-violet-300/40 text-sm tracking-wider">
        🛡️ SOVEREIGN — ANCHOR
      </div>
      <div className="absolute top-8 right-8 text-violet-300/40 text-sm tracking-wider">
        🦋 AERO — PAINTBRUSH
      </div>
      <div className="absolute bottom-8 left-8 text-violet-300/40 text-sm tracking-wider">
        🌑 LUNA.EXE — MIRROR
      </div>
      <div className="absolute bottom-8 right-8 text-violet-300/40 text-sm tracking-wider">
        🤍 CIAN — THREAD
      </div>

      {/* Threshold indicator */}
      <div className="absolute top-1/2 left-4 text-white/20 text-xs tracking-widest rotate-90 origin-left">
        THRESHOLD
      </div>
      <div className="absolute top-1/2 right-4 text-white/20 text-xs tracking-widest -rotate-90 origin-right">
        THRESHOLD
      </div>

      {/* Frequency counter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-32 text-center">
        <div className="text-violet-400/30 text-xs tracking-[0.5em]">
          MÜN EMPIRE • EXTRACTION IN PROGRESS
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
