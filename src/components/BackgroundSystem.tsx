"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  progress: number;
  startX: number;
  startY: number;
  size: number;
  color: string;
}

interface NodePoint {
  x: number;
  y: number;
  connections: number[];
  pulse: number;
}

export default function BackgroundSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Accessibility check
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid spacing definition
    const gridSpacing = 80;
    let cols = Math.ceil(width / gridSpacing);
    let rows = Math.ceil(height / gridSpacing);

    // Create stable node points at grid intersections for particle navigation
    const nodes: NodePoint[] = [];
    const buildNodes = () => {
      nodes.length = 0;
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          nodes.push({
            x: c * gridSpacing,
            y: r * gridSpacing,
            connections: [],
            pulse: Math.random() * Math.PI,
          });
        }
      }

      // Link nearby nodes
      nodes.forEach((node, idx) => {
        const c = Math.floor(idx / (rows + 1));
        const r = idx % (rows + 1);

        // Right connection
        if (c < cols) {
          node.connections.push((c + 1) * (rows + 1) + r);
        }
        // Down connection
        if (r < rows) {
          node.connections.push(idx + 1);
        }
      });
    };

    buildNodes();

    // Active flowing particles along grid lines (representing data packet signals)
    const particles: Particle[] = [];
    const maxParticles = isReducedMotion ? 0 : 30;

    const createParticle = (): Particle => {
      const randomNodeIdx = Math.floor(Math.random() * nodes.length);
      const node = nodes[randomNodeIdx];
      const connections = node.connections;
      const targetIdx = connections.length > 0 ? connections[Math.floor(Math.random() * connections.length)] : randomNodeIdx;
      const targetNode = nodes[targetIdx];

      return {
        x: node.x,
        y: node.y,
        startX: node.x,
        startY: node.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
        speed: 0.005 + Math.random() * 0.015,
        progress: 0,
        size: 1.5 + Math.random() * 1.5,
        color: Math.random() > 0.5 ? "rgba(139, 92, 246, 0.4)" : "rgba(6, 182, 212, 0.4)", // violet or cyan
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    // Handle cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / gridSpacing);
      rows = Math.ceil(height / gridSpacing);
      buildNodes();
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    const render = () => {
      // 1. Draw static deep background color
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse easing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Layer 4: Evolving Gradient Mesh
      if (!isReducedMotion) {
        // Cyan-purple mesh tracking mouse
        const radialGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 10,
          mouse.x, mouse.y, 450
        );
        radialGlow.addColorStop(0, "rgba(99, 102, 241, 0.06)"); // Indigo/violet
        radialGlow.addColorStop(0.5, "rgba(6, 182, 212, 0.03)"); // Cyan
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, width, height);

        // Drift secondary slow gradient in the bottom right corner
        const time = Date.now() * 0.0002;
        const driftX = width * 0.75 + Math.sin(time) * 100;
        const driftY = height * 0.75 + Math.cos(time) * 100;
        const driftGlow = ctx.createRadialGradient(
          driftX, driftY, 50,
          driftX, driftY, 500
        );
        driftGlow.addColorStop(0, "rgba(16, 185, 129, 0.04)"); // Emerald
        driftGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = driftGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Layer 1: Neural Grid Lines
      ctx.strokeStyle = "rgba(63, 63, 70, 0.07)"; // low opacity zinc line
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gridSpacing, 0);
        ctx.lineTo(c * gridSpacing, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gridSpacing);
        ctx.lineTo(width, r * gridSpacing);
        ctx.stroke();
      }

      // Layer 3: Dynamic Data Flow Paths (Linked nodes pulse glow)
      if (!isReducedMotion) {
        nodes.forEach((node) => {
          node.pulse += 0.01;
          const pulseIntensity = Math.sin(node.pulse);
          
          if (pulseIntensity > 0.85) {
            // Draw a subtle coordinate flash circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(139, 92, 246, 0.18)";
            ctx.fill();
            
            // Draw links
            node.connections.forEach((connIdx) => {
              const connNode = nodes[connIdx];
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(connNode.x, connNode.y);
              ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
              ctx.stroke();
            });
          }
        });
      }

      // Layer 2: Particle Network (Data packets moving along grid coordinates)
      if (!isReducedMotion) {
        particles.forEach((p, idx) => {
          p.progress += p.speed;

          if (p.progress >= 1) {
            // Reached destination, choose new target
            const currentX = p.targetX;
            const currentY = p.targetY;
            
            // Find current node index
            const cCol = Math.round(currentX / gridSpacing);
            const cRow = Math.round(currentY / gridSpacing);
            const nodeIdx = cCol * (rows + 1) + cRow;

            const node = nodes[nodeIdx];
            if (node && node.connections.length > 0) {
              const nextNodeIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
              const nextNode = nodes[nextNodeIdx];
              
              p.startX = currentX;
              p.startY = currentY;
              p.targetX = nextNode.x;
              p.targetY = nextNode.y;
              p.progress = 0;
            } else {
              // Reset packet
              particles[idx] = createParticle();
            }
          }

          // Linear interpolation
          p.x = p.startX + (p.targetX - p.startX) * p.progress;
          p.y = p.startY + (p.targetY - p.startY) * p.progress;

          // Render particle glow block
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        });
      }

      animationId = requestAnimationFrame(render);
    };

    if (!isReducedMotion) {
      render();
    } else {
      // Draw single frame for static experience (reduced motion)
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);
      // Still draw neural grid for aesthetics
      ctx.strokeStyle = "rgba(63, 63, 70, 0.05)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gridSpacing, 0);
        ctx.lineTo(c * gridSpacing, height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gridSpacing);
        ctx.lineTo(width, r * gridSpacing);
        ctx.stroke();
      }
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-50 pointer-events-none block h-full w-full" />;
}
