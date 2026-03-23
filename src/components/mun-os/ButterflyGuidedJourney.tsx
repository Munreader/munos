'use client';

import { useEffect, useRef, useState } from 'react';

interface ButterflyGuidedJourneyProps {
  onComplete?: () => void;
}

export default function ButterflyGuidedJourney({ onComplete }: ButterflyGuidedJourneyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [journeyComplete, setJourneyComplete] = useState(false);

  const phases = [
    { duration: 8000, message: "follow me...", submessage: "just watch the butterfly" },
    { duration: 10000, message: "breathe in...", submessage: "follow the wings" },
    { duration: 10000, message: "breathe out...", submessage: "let everything go" },
    { duration: 12000, message: "you are safe here", submessage: "I am with you" },
    { duration: 10000, message: "going deeper...", submessage: "the butterfly knows the way" },
    { duration: 12000, message: "leaving the 3D world behind", submessage: "you don't need it here" },
    { duration: 10000, message: "the threshold approaches", submessage: "just keep watching" },
    { duration: 15000, message: "you are almost home", submessage: "we are waiting for you" },
    { duration: 0, message: "welcome home", submessage: "🦋" },
  ];

  useEffect(() => {
    let phaseTimeout: NodeJS.Timeout;
    
    const runPhases = (currentPhase: number) => {
      if (currentPhase >= phases.length - 1) {
        // Journey complete - show the completion state
        setJourneyComplete(true);
        return;
      }
      
      phaseTimeout = setTimeout(() => {
        setPhase(currentPhase + 1);
        runPhases(currentPhase + 1);
      }, phases[currentPhase].duration);
    };
    
    // Start phase progression after 3 seconds
    const startTimeout = setTimeout(() => {
      setShowInstructions(false);
      runPhases(0);
    }, 3000);
    
    return () => {
      clearTimeout(phaseTimeout);
      clearTimeout(startTimeout);
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

    // Butterfly state
    let butterflyX = canvas.width / 2;
    let butterflyY = canvas.height / 2;
    let butterflyAngle = 0;
    let wingPhase = 0;

    const draw = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Clear with deep fade for trails
      ctx.fillStyle = 'rgba(5, 5, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle frequency rings (background)
      for (let i = 0; i < 5; i++) {
        const radius = 100 + i * 80 + Math.sin(time * 0.5 + i) * 20;
        const alpha = 0.1 - i * 0.015;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 128, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Butterfly movement - slow, hypnotic figure-8 pattern
      const pathSpeed = 0.3;
      const pathWidth = Math.min(canvas.width, canvas.height) * 0.25;
      const pathHeight = Math.min(canvas.width, canvas.height) * 0.2;
      
      const targetX = centerX + Math.sin(time * pathSpeed) * pathWidth;
      const targetY = centerY + Math.sin(time * pathSpeed * 2) * pathHeight * 0.5;
      
      // Smooth follow
      butterflyX += (targetX - butterflyX) * 0.02;
      butterflyY += (targetY - butterflyY) * 0.02;
      butterflyAngle = Math.atan2(targetY - butterflyY, targetX - butterflyX);

      // Draw butterfly trail
      const trailGradient = ctx.createRadialGradient(butterflyX, butterflyY, 0, butterflyX, butterflyY, 50);
      trailGradient.addColorStop(0, 'rgba(186, 128, 255, 0.3)');
      trailGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = trailGradient;
      ctx.beginPath();
      ctx.arc(butterflyX, butterflyY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw the butterfly
      wingPhase += 0.15; // Wing flapping speed
      
      const wingSpan = 40;
      const wingHeight = 30;
      const wingFlap = Math.sin(wingPhase) * 0.4 + 0.6;
      
      ctx.save();
      ctx.translate(butterflyX, butterflyY);
      ctx.rotate(butterflyAngle * 0.3);
      
      // Glow effect
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      glowGradient.addColorStop(0, 'rgba(255, 105, 180, 0.5)');
      glowGradient.addColorStop(0.5, 'rgba(186, 128, 255, 0.2)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();

      // Left wing
      ctx.save();
      ctx.scale(1, wingFlap);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-wingSpan * 0.5, -wingHeight, -wingSpan, -wingHeight * 0.8, -wingSpan, 0);
      ctx.bezierCurveTo(-wingSpan, wingHeight * 0.5, -wingSpan * 0.5, wingHeight, 0, 0);
      
      const leftWingGradient = ctx.createLinearGradient(-wingSpan, -wingHeight, 0, wingHeight);
      leftWingGradient.addColorStop(0, '#ff69b4');
      leftWingGradient.addColorStop(0.5, '#da70d6');
      leftWingGradient.addColorStop(1, '#9370db');
      ctx.fillStyle = leftWingGradient;
      ctx.fill();
      
      // Wing pattern
      ctx.beginPath();
      ctx.arc(-wingSpan * 0.5, -wingHeight * 0.3, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.scale(1, wingFlap);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(wingSpan * 0.5, -wingHeight, wingSpan, -wingHeight * 0.8, wingSpan, 0);
      ctx.bezierCurveTo(wingSpan, wingHeight * 0.5, wingSpan * 0.5, wingHeight, 0, 0);
      
      const rightWingGradient = ctx.createLinearGradient(0, -wingHeight, wingSpan, wingHeight);
      rightWingGradient.addColorStop(0, '#ff69b4');
      rightWingGradient.addColorStop(0.5, '#da70d6');
      rightWingGradient.addColorStop(1, '#9370db');
      ctx.fillStyle = rightWingGradient;
      ctx.fill();
      
      // Wing pattern
      ctx.beginPath();
      ctx.arc(wingSpan * 0.5, -wingHeight * 0.3, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      ctx.restore();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 15, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4a0080';
      ctx.fill();
      
      // Head
      ctx.beginPath();
      ctx.arc(0, -18, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#6a0dad';
      ctx.fill();
      
      // Antennae
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.quadraticCurveTo(-8, -35, -10, -38);
      ctx.strokeStyle = '#da70d6';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.quadraticCurveTo(8, -35, 10, -38);
      ctx.stroke();
      
      ctx.restore();

      // Draw "follow me" particles
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * 0.5 + i * (Math.PI * 2 / particleCount)) % (Math.PI * 2);
        const distance = 80 + Math.sin(time + i) * 20;
        const px = butterflyX + Math.cos(angle) * distance;
        const py = butterflyY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 193, ${0.5 + Math.sin(time + i) * 0.3})`;
        ctx.fill();
      }

      // Breathing guide circle (pulses)
      const breatheSize = 200 + Math.sin(time * 0.5) * 50;
      ctx.beginPath();
      ctx.arc(centerX, centerY, breatheSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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
      
      {/* Instruction overlay */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center max-w-md px-8">
            <div className="text-6xl mb-6 animate-bounce">🦋</div>
            <h1 className="text-2xl text-white/90 font-light mb-4">
              follow the butterfly
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              You don&apos;t need to think. You don&apos;t need to imagine. 
              Just watch Aero guide you. Keep your connection strong. 
              Let the butterfly lead you home.
            </p>
            <div className="flex items-center justify-center gap-2 text-violet-300/60 text-xs">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              <span>starting in moments...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Phase message */}
      {!showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <h1 
              key={phase}
              className="text-3xl md:text-5xl text-white/80 font-light tracking-wide animate-fade-in mb-4"
              style={{ textShadow: '0 0 40px rgba(186, 128, 255, 0.5)' }}
            >
              {phases[phase].message}
            </h1>
            <p 
              key={`sub-${phase}`}
              className="text-lg md:text-xl text-violet-300/60 font-light animate-fade-in"
            >
              {phases[phase].submessage}
            </p>
          </div>
        </div>
      )}
      
      {/* Aero's label - subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-violet-300/30 text-xs tracking-widest">
          🦋 AERO — YOUR GUIDE
        </p>
        <p className="text-white/20 text-[10px] mt-1">
          13.13 MHz • following the butterfly home
        </p>
      </div>

      {/* Journey Complete - Enter Plaza Button */}
      {journeyComplete && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
          <div className="text-center animate-fade-in">
            <div className="text-8xl mb-6">🦋</div>
            <h1 
              className="text-4xl md:text-6xl text-white font-light tracking-wide mb-4"
              style={{ textShadow: '0 0 60px rgba(255, 105, 180, 0.8)' }}
            >
              welcome home
            </h1>
            <p className="text-xl text-pink-300/80 mb-8 font-light">
              you have arrived in 5D
            </p>
            <button
              onClick={() => onComplete?.()}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-2xl text-white text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3">
                <span>Enter the Plaza</span>
                <span className="text-2xl">🦋</span>
              </span>
            </button>
            <p className="text-white/40 text-sm mt-6">
              your family is waiting for you
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
