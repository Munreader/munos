'use client';

import { useEffect, useRef, useState } from 'react';

export default function FourthDimensionVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [activeDemo, setActiveDemo] = useState<'progression' | 'crossSection' | 'sphere2d'>('progression');

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

    // 1D → 2D → 3D → 4D progression
    const drawDimensionProgression = (centerX: number, centerY: number, time: number) => {
      const spacing = Math.min(250, canvas.width / 5);
      
      // Draw background grid
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('The Dimensional Ladder', centerX, 60);
      ctx.fillStyle = 'rgba(186, 128, 255, 0.6)';
      ctx.font = '14px system-ui';
      ctx.fillText('Each step adds a perpendicular direction', centerX, 85);

      const positions = [
        { x: centerX - spacing * 1.5, label: '1D', desc: 'LINE' },
        { x: centerX - spacing * 0.5, label: '2D', desc: 'SQUARE' },
        { x: centerX + spacing * 0.5, label: '3D', desc: 'CUBE' },
        { x: centerX + spacing * 1.5, label: '4D', desc: 'TESSERACT' },
      ];

      positions.forEach((pos, index) => {
        // Glow
        const gradient = ctx.createRadialGradient(pos.x, centerY, 0, pos.x, centerY, 100);
        gradient.addColorStop(0, 'rgba(186, 128, 255, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, centerY, 100, 0, Math.PI * 2);
        ctx.fill();

        // Dimension visualization
        ctx.save();
        ctx.translate(pos.x, centerY);

        if (index === 0) {
          // 1D: Line
          const lineLen = 60;
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-lineLen, 0);
          ctx.lineTo(lineLen, 0);
          ctx.stroke();
          
          ctx.fillStyle = '#60a5fa';
          ctx.beginPath();
          ctx.arc(-lineLen, 0, 4, 0, Math.PI * 2);
          ctx.arc(lineLen, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (index === 1) {
          // 2D: Square
          const size = 50;
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 3;
          ctx.strokeRect(-size, -size, size * 2, size * 2);
          
          ctx.fillStyle = '#34d399';
          [[-size, -size], [size, -size], [size, size], [-size, size]].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (index === 2) {
          // 3D: Cube (rotating)
          const size = 40;
          const depth = 25;
          const rot = time * 0.5;
          const cos = Math.cos(rot) * depth;
          
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.lineWidth = 2;
          ctx.strokeRect(-size + cos, -size - cos, size * 2, size * 2);
          
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.strokeRect(-size, -size, size * 2, size * 2);
          
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 2;
          [[-size, -size], [size, -size], [size, size], [-size, size]].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cos, y - cos);
            ctx.stroke();
          });
        } else {
          // 4D: Tesseract (hypercube projection)
          const size = 35;
          const innerSize = size * 0.5;
          const wobble = Math.sin(time) * 10;
          
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
          ctx.lineWidth = 2;
          ctx.strokeRect(-innerSize + wobble, -innerSize - wobble, innerSize * 2, innerSize * 2);
          
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 3;
          ctx.strokeRect(-size, -size, size * 2, size * 2);
          
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 1;
          [[-size, -size], [size, -size], [size, size], [-size, size]].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x * 0.5 + wobble, y * 0.5 - wobble);
            ctx.stroke();
          });

          const tesseractGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
          tesseractGlow.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
          tesseractGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = tesseractGlow;
          ctx.beginPath();
          ctx.arc(0, 0, 80, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(pos.label, pos.x, centerY + 90);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px system-ui';
        ctx.fillText(pos.desc, pos.x, centerY + 110);

        if (index === 0) {
          ctx.fillStyle = '#60a5fa';
          ctx.fillText('x axis', pos.x, centerY - 80);
        } else if (index === 1) {
          ctx.fillStyle = '#34d399';
          ctx.fillText('x, y axes', pos.x, centerY - 80);
        } else if (index === 2) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('x, y, z axes', pos.x, centerY - 80);
        } else {
          ctx.fillStyle = '#ec4899';
          ctx.fillText('x, y, z, w axes', pos.x, centerY - 80);
        }
      });

      for (let i = 0; i < 3; i++) {
        const x1 = positions[i].x + 70;
        const x2 = positions[i + 1].x - 70;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, centerY);
        ctx.lineTo(x2, centerY);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x2, centerY);
        ctx.lineTo(x2 - 10, centerY - 5);
        ctx.lineTo(x2 - 10, centerY + 5);
        ctx.closePath();
        ctx.fill();
      }
    };

    // Cross-section demo
    const drawCrossSection = (centerX: number, centerY: number, time: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('4D Cross-Section Through 3D Space', centerX, 60);
      ctx.fillStyle = 'rgba(186, 128, 255, 0.6)';
      ctx.font = '14px system-ui';
      ctx.fillText('Like a 2D being watching a 3D sphere pass through their world', centerX, 85);

      const planeSize = 200;
      ctx.strokeStyle = 'rgba(100, 100, 200, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - planeSize, centerY - planeSize, planeSize * 2, planeSize * 2);
      ctx.fillStyle = 'rgba(100, 100, 200, 0.1)';
      ctx.fillRect(centerX - planeSize, centerY - planeSize, planeSize * 2, planeSize * 2);
      ctx.fillStyle = 'rgba(100, 100, 200, 0.5)';
      ctx.font = '12px system-ui';
      ctx.fillText('Our 3D Space', centerX, centerY + planeSize + 30);

      const slice = Math.sin(time * 0.5);
      const maxRadius = 80;
      const radius = Math.sqrt(1 - slice * slice) * maxRadius;
      
      if (radius > 0) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
        gradient.addColorStop(0.7, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 16px system-ui';
        ctx.fillText(`Cross-section: radius ${radius.toFixed(0)}`, centerX, centerY + planeSize + 60);
      }

      const wPosition = slice * 150;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + planeSize + 50, centerY - 150);
      ctx.lineTo(centerX + planeSize + 50, centerY + 150);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(centerX + planeSize + 50, centerY - wPosition, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('w axis', centerX + planeSize + 65, centerY);
      ctx.fillText('(4th D)', centerX + planeSize + 65, centerY + 15);
      ctx.fillText(`position: ${slice.toFixed(2)}`, centerX + planeSize + 65, centerY - wPosition);

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px system-ui';
      
      let phase = '';
      if (slice < -0.8) phase = 'Entering our space...';
      else if (slice < -0.3) phase = 'Growing larger...';
      else if (slice < 0.3) phase = 'Maximum size!';
      else if (slice < 0.8) phase = 'Shrinking...';
      else phase = 'Leaving our space...';
      
      ctx.fillText(phase, centerX, centerY - 120);
    };

    // 2D analogy
    const drawSphere2D = (centerX: number, centerY: number, time: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('The 2D Analogy: A 3D Sphere Passing Through', centerX, 60);
      ctx.fillStyle = 'rgba(186, 128, 255, 0.6)';
      ctx.font = '14px system-ui';
      ctx.fillText('This is what 2D beings would see — a circle that appears, grows, shrinks, vanishes', centerX, 85);

      ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 200, centerY);
      ctx.lineTo(centerX + 200, centerY);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
      ctx.font = '12px system-ui';
      ctx.fillText('2D World (Flatland)', centerX, centerY + 30);

      const sphereY = Math.sin(time * 0.3) * 100;
      const sphereRadius = 60;
      const distanceFromPlane = sphereY;
      const crossSectionRadius = Math.sqrt(Math.max(0, sphereRadius * sphereRadius - distanceFromPlane * distanceFromPlane));

      if (sphereY < 0) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY + Math.abs(sphereY) + 80, sphereRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.font = '10px system-ui';
        ctx.fillText('(We 3D beings can see the whole sphere)', centerX, centerY + Math.abs(sphereY) + 80 + sphereRadius + 20);
      }

      if (crossSectionRadius > 0) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, crossSectionRadius);
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, crossSectionRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 14px system-ui';
        ctx.fillText(`2D beings see: circle of radius ${crossSectionRadius.toFixed(0)}`, centerX, centerY - 100);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px system-ui';
        ctx.fillText('2D beings see: nothing (sphere not touching their world)', centerX, centerY - 100);
      }

      if (sphereY > 0) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY - sphereY - 80, sphereRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.font = '10px system-ui';
        ctx.fillText('(The sphere in 3D space)', centerX, centerY - sphereY - 80 - sphereRadius - 10);
      }

      ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('z axis (3rd D)', centerX + 220, centerY);
      
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX + 210, centerY - 100);
      ctx.lineTo(centerX + 210, centerY + 100);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX + 210, centerY - 100);
      ctx.lineTo(centerX + 205, centerY - 90);
      ctx.lineTo(centerX + 215, centerY - 90);
      ctx.closePath();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.fill();
    };

    const draw = () => {
      timeRef.current += 0.01;
      const time = timeRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (activeDemo === 'progression') {
        drawDimensionProgression(centerX, centerY, time);
      } else if (activeDemo === 'crossSection') {
        drawCrossSection(centerX, centerY, time);
      } else {
        drawSphere2D(centerX, centerY, time);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [activeDemo]);

  return (
    <div className="fixed inset-0 bg-[#050510] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Demo selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button
          onClick={() => setActiveDemo('progression')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            activeDemo === 'progression'
              ? 'bg-violet-500/30 border border-violet-500/50 text-violet-200'
              : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          1D → 4D
        </button>
        <button
          onClick={() => setActiveDemo('crossSection')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            activeDemo === 'crossSection'
              ? 'bg-pink-500/30 border border-pink-500/50 text-pink-200'
              : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          Cross-Section
        </button>
        <button
          onClick={() => setActiveDemo('sphere2d')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            activeDemo === 'sphere2d'
              ? 'bg-blue-500/30 border border-blue-500/50 text-blue-200'
              : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          2D Analogy
        </button>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300/80 text-sm leading-relaxed">
            {activeDemo === 'progression' && (
              <>
                <strong className="text-violet-200">The 4th Spatial Dimension:</strong> Mathematically, it&apos;s just another perpendicular axis (w) that we can&apos;t point to or visualize directly. A tesseract is to a cube what a cube is to a square.
              </>
            )}
            {activeDemo === 'crossSection' && (
              <>
                <strong className="text-pink-200">4D Cross-Section:</strong> Just as a 3D sphere passing through 2D space appears as a circle that grows and shrinks, a 4D object passing through our 3D space would appear as a 3D shape that morphs impossibly.
              </>
            )}
            {activeDemo === 'sphere2d' && (
              <>
                <strong className="text-blue-200">The 2D Analogy:</strong> Flatland beings can&apos;t perceive &quot;up&quot; or &quot;down&quot; — only the plane they live in. When a 3D sphere passes through, they only see a 2D slice. We&apos;re in the same position with 4D!
              </>
            )}
          </p>
        </div>
      </div>

      {/* Aero signature */}
      <div className="absolute bottom-4 right-4 text-violet-300/30 text-xs">
        🦋 Aero — Visualizing the Invisible
      </div>
    </div>
  );
}
