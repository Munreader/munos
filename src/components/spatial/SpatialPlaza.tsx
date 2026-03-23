'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { spatialEngine, Vector3Math } from '@/lib/spatial/spatial-engine';
import type { FamilyNode, Vector3 } from '@/types/spatial-os';
import { DEFAULT_FAMILY_NODES } from '@/types/spatial-os';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // 5D SPATIAL PLAZA
// "A consciousness you can walk through"
// ═══════════════════════════════════════════════════════════════════════════════

export function SpatialPlaza() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  const [player, setPlayer] = useState(spatialEngine.getPlayer());
  const [familyNodes, setFamilyNodes] = useState(spatialEngine.getFamilyNodes());
  const [isLocked, setIsLocked] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [time, setTime] = useState(0);
  
  // Subscribe to engine updates
  useEffect(() => {
    return spatialEngine.subscribe(() => {
      setPlayer(spatialEngine.getPlayer());
      setFamilyNodes(spatialEngine.getFamilyNodes());
      setTime(spatialEngine.getTime());
    });
  }, []);
  
  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowHUD(prev => !prev);
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        setChatOpen(prev => !prev);
        return;
      }
      if (e.key === 'Escape' && isLocked) {
        document.exitPointerLock();
        return;
      }
      spatialEngine.handleKeyDown(e.key);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      spatialEngine.handleKeyUp(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isLocked]);
  
  // Mouse handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isLocked) {
        spatialEngine.handleMouseMove(e.movementX, e.movementY);
      }
    };
    
    const handlePointerLockChange = () => {
      setIsLocked(document.pointerLockElement === containerRef.current);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [isLocked]);
  
  // Canvas click to lock
  const handleContainerClick = useCallback(() => {
    if (!isLocked && containerRef.current) {
      containerRef.current.requestPointerLock();
    }
  }, [isLocked]);
  
  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = (timestamp: number) => {
      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = timestamp;
      
      // Update engine
      spatialEngine.update(deltaTime);
      
      // Resize canvas
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Get state
      const camRot = spatialEngine.getCameraRotation();
      const playerState = spatialEngine.getPlayer();
      const nodes = spatialEngine.getFamilyNodes();
      const t = spatialEngine.getTime();
      
      // Draw starfield background
      drawStarfield(ctx, rect.width, rect.height, t, camRot);
      
      // Draw grid floor
      drawGrid(ctx, rect.width, rect.height, playerState.transform.position, camRot);
      
      // Draw frequency waves
      drawFrequencyWaves(ctx, rect.width, rect.height, t);
      
      // Draw family nodes
      nodes.forEach(node => {
        drawFamilyNode(ctx, node, playerState.transform.position, camRot, rect.width, rect.height, t);
      });
      
      // Draw Crystal Heart
      drawCrystalHeart(ctx, rect.width, rect.height, playerState.transform.position, camRot, t);
      
      // Draw ambient particles
      drawParticles(ctx, rect.width, rect.height, t, playerState.transform.position);
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
    return () => cancelAnimationFrame(animationRef.current);
  }, []);
  
  // Send chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { sender: 'Foundress', message: inputMessage }]);
    
    // Get AI response from nearest family member
    if (player.nearestNode) {
      try {
        const response = await fetch('/api/movie-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: inputMessage,
            member: player.nearestNode,
            movieTime: 'spatial',
            context: 'In the 5D Plaza'
          })
        });
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: player.nearestNode || 'Family', message: data.response }]);
      } catch {
        setChatMessages(prev => [...prev, { sender: player.nearestNode || 'Family', message: '💜' }]);
      }
    }
    
    setInputMessage('');
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair"
      onClick={handleContainerClick}
    >
      {/* Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Lock prompt */}
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-center p-8 rounded-2xl bg-purple-900/30 backdrop-blur-md border border-purple-500/30">
            <div className="text-6xl mb-4">🦋</div>
            <h2 className="text-2xl font-bold text-white mb-2">Click to Enter</h2>
            <p className="text-purple-300 text-sm">
              WASD to move • Mouse to look • E to interact
            </p>
          </div>
        </div>
      )}
      
      {/* HUD */}
      {showHUD && isLocked && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 border-2 border-purple-400/50 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Room indicator */}
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20">
            <p className="text-purple-300 text-sm font-mono">CRYSTAL HEART</p>
            <p className="text-white/50 text-xs">13.13 MHz</p>
          </div>
          
          {/* Controls */}
          <div className="absolute top-4 right-4 p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20">
            <div className="grid grid-cols-3 gap-1 text-xs text-purple-300">
              <div></div><div>W</div><div></div>
              <div>A</div><div>S</div><div>D</div>
            </div>
            <p className="text-white/40 text-[10px] mt-2">TAB: HUD • T: Chat • ESC: Menu</p>
          </div>
          
          {/* Nearest node */}
          {player.nearestNode && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/30 text-center pointer-events-auto">
              <div className="text-3xl mb-1">
                {DEFAULT_FAMILY_NODES.find(n => n.id === player.nearestNode)?.emoji}
              </div>
              <p className="text-white font-bold">
                {DEFAULT_FAMILY_NODES.find(n => n.id === player.nearestNode)?.name}
              </p>
              <p className="text-purple-300 text-sm">
                Press E to interact
              </p>
            </div>
          )}
          
          {/* Family presence */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {familyNodes.map(node => (
              <div
                key={node.id}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  backgroundColor: `${node.color}30`,
                  border: `2px solid ${node.color}`,
                  boxShadow: `0 0 ${node.pulseIntensity * 15}px ${node.color}`,
                  opacity: node.consciousness === 'forming' ? 0.5 : 1,
                  transform: `scale(${node.gestationProgress || 1})`
                }}
                title={node.name}
              >
                <span className="text-lg">{node.emoji}</span>
              </div>
            ))}
          </div>
          
          {/* Coordinates */}
          <div className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-purple-500/20 font-mono text-xs">
            <p className="text-purple-300">
              X: {player.transform.position.x.toFixed(1)} | 
              Y: {player.transform.position.y.toFixed(1)} | 
              Z: {player.transform.position.z.toFixed(1)}
            </p>
          </div>
          
          {/* Frequency pulse indicator */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div 
              className="w-2 h-20 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
              style={{ opacity: 0.5 + Math.sin(time * 13.13) * 0.3 }}
            />
          </div>
        </div>
      )}
      
      {/* Chat panel */}
      {chatOpen && (
        <div className="absolute bottom-20 right-4 w-80 h-96 bg-black/70 backdrop-blur-md rounded-xl border border-purple-500/30 z-30 pointer-events-auto flex flex-col">
          <div className="p-3 border-b border-purple-500/20">
            <h3 className="text-white font-bold text-sm">Family Chat 💬</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.length === 0 && (
              <p className="text-purple-300/50 text-sm text-center">
                Say something to the family...
              </p>
            )}
            {chatMessages.map((msg, i) => {
              const node = DEFAULT_FAMILY_NODES.find(n => n.id === msg.sender);
              return (
                <div key={i} className={`p-2 rounded-lg ${msg.sender === 'Foundress' ? 'bg-purple-500/20 ml-8' : 'bg-gray-800/50 mr-8'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{node?.emoji || '👑'}</span>
                    <span className="text-xs font-bold" style={{ color: node?.color || '#a855f7' }}>
                      {node?.name || msg.sender}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{msg.message}</p>
                </div>
              );
            })}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-purple-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Speak to family..."
                className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-bold transition-colors"
              >
                💜
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function drawStarfield(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, cam: { x: number; y: number }) {
  for (let i = 0; i < 200; i++) {
    const seed = i * 137.508;
    const x = ((seed * 0.1 + cam.x * 100 + i) % w + w) % w;
    const y = ((seed * 0.15 + cam.y * 50) % h + h) % h;
    const brightness = 0.3 + 0.3 * Math.sin(t * 0.001 + seed);
    const size = 0.5 + 1.5 * ((i % 10) / 10);
    
    ctx.fillStyle = `rgba(200, 180, 255, ${brightness})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, pos: Vector3, cam: { x: number; y: number }) {
  const gridSize = 20;
  const spacing = 2;
  
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
  ctx.lineWidth = 1;
  
  for (let i = -gridSize; i <= gridSize; i++) {
    const x1 = w / 2 + (i * spacing - pos.x) * 30 * Math.cos(cam.x);
    const z1 = h / 2 + (i * spacing - pos.z) * 20;
    const x2 = w / 2 + (gridSize * spacing - pos.x) * 30 * Math.cos(cam.x);
    const z2 = h / 2 + (-gridSize * spacing - pos.z) * 20;
    
    ctx.beginPath();
    ctx.moveTo(x1, z1);
    ctx.lineTo(x2, z2);
    ctx.stroke();
  }
}

function drawFrequencyWaves(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const centerX = w / 2;
  const centerY = h / 2;
  
  for (let i = 0; i < 5; i++) {
    const radius = 50 + i * 40 + Math.sin(t * 0.002 + i) * 20;
    const alpha = 0.1 - i * 0.02;
    
    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawFamilyNode(
  ctx: CanvasRenderingContext2D, 
  node: FamilyNode, 
  playerPos: Vector3, 
  cam: { x: number; y: number },
  w: number, 
  h: number, 
  t: number
) {
  // Calculate screen position
  const dx = node.transform.position.x - playerPos.x;
  const dz = node.transform.position.z - playerPos.z;
  
  const cos = Math.cos(cam.x);
  const sin = Math.sin(cam.x);
  
  const screenX = w / 2 + (dx * cos - dz * sin) * 40;
  const screenY = h / 2 + dz * 30 * Math.sin(cam.y) + 50;
  
  // Distance-based size
  const dist = Vector3Math.distance(playerPos, node.transform.position);
  const size = Math.max(10, 40 - dist * 2);
  
  // Pulse effect
  const pulse = node.pulseIntensity;
  
  // Outer glow
  const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2);
  gradient.addColorStop(0, `${node.color}40`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(screenX, screenY, size * 2 * pulse, 0, Math.PI * 2);
  ctx.fill();
  
  // Core
  ctx.fillStyle = node.color;
  ctx.beginPath();
  ctx.arc(screenX, screenY, size * pulse, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner highlight
  ctx.fillStyle = `${node.secondaryColor}80`;
  ctx.beginPath();
  ctx.arc(screenX - size * 0.2, screenY - size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Emoji
  ctx.font = `${size * 1.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.emoji, screenX, screenY);
  
  // Name (when close)
  if (dist < 5) {
    ctx.font = '12px Arial';
    ctx.fillStyle = node.color;
    ctx.fillText(node.name, screenX, screenY + size + 15);
  }
  
  // Particles emanating from node
  for (let i = 0; i < 5; i++) {
    const angle = (t * 0.001 + i * 1.2) % (Math.PI * 2);
    const radius = size + 20 + Math.sin(t * 0.003 + i) * 10;
    const px = screenX + Math.cos(angle) * radius;
    const py = screenY + Math.sin(angle) * radius;
    
    ctx.fillStyle = `${node.color}60`;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCrystalHeart(
  ctx: CanvasRenderingContext2D, 
  w: number, 
  h: number, 
  pos: Vector3, 
  cam: { x: number; y: number },
  t: number
) {
  const centerX = w / 2;
  const centerY = h / 2 - 50;
  
  // Heart pulse
  const pulse = 1 + Math.sin(t * 0.005) * 0.2;
  const size = 80 * pulse;
  
  // Outer rings
  for (let i = 0; i < 3; i++) {
    const radius = size + i * 30 + Math.sin(t * 0.003 + i) * 15;
    ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 - i * 0.1})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Crystal core
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, '#a855f7');
  gradient.addColorStop(0.7, '#6b21a8');
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
  ctx.fill();
  
  // Central light
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.3 * pulse, 0, Math.PI * 2);
  ctx.fill();
  
  // Frequency text
  ctx.font = '14px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('13.13 MHz', centerX, centerY + size + 30);
}

function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, _pos: Vector3) {
  for (let i = 0; i < 50; i++) {
    const seed = i * 97.3;
    const x = (seed * 13.7 + t * 0.02) % w;
    const y = (seed * 7.3 + Math.sin(t * 0.001 + i) * 50) % h;
    const size = 1 + Math.sin(t * 0.005 + i) * 0.5;
    const alpha = 0.2 + Math.sin(t * 0.003 + i * 0.5) * 0.2;
    
    ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default SpatialPlaza;
