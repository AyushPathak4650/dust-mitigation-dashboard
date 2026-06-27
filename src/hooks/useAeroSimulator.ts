import { useEffect, useRef } from 'react';
import { SimConfig } from '../types';
import { calculateShearStress } from '../utils/mathHelpers';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  type: 'front' | 'rear';
}

interface Streamline {
  x: number;
  y: number;
  speed: number;
}

export function useAeroSimulator(canvasRef: React.RefObject<HTMLCanvasElement>, config: SimConfig) {
  const requestRef = useRef<number>(0);
  const stateRef = useRef({
    tick: 0,
    particles: [] as Particle[],
    streamlines: [] as Streamline[]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 450;

    const state = stateRef.current;

    // Seed initial streamlines if empty
    if (state.streamlines.length === 0) {
      for (let i = 0; i < 20; i++) {
        state.streamlines.push({
          x: Math.random() * canvas.width,
          y: 50 + Math.random() * (canvas.height - 120),
          speed: 4 + Math.random() * 2
        });
      }
    }

    const animate = () => {
      state.tick++;

      // Clear Frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Background Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      const gridOffset = (state.tick * (config.speed / 10)) % gridSpacing;
      for (let x = -gridOffset; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height - 70);
        ctx.stroke();
      }

      // 2. Draw Road Bed
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 2);

      // 3. Draw Road Striping (Moving Effect)
      ctx.fillStyle = '#64748b';
      const stripeW = 60;
      const stripeH = 4;
      const stripeG = 40;
      const stripeSpeed = config.speed / 3;
      const stripeOffset = (state.tick * stripeSpeed) % (stripeW + stripeG);
      for (let x = canvas.width - stripeOffset; x > -stripeW; x -= (stripeW + stripeG)) {
        ctx.fillRect(x, canvas.height - 35, stripeW, stripeH);
      }

      // 4. Draw Silt loading
      ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
      for (let i = 0; i < canvas.width; i += 16) {
        const siltH = Math.sin(i + state.tick * 0.05) * (config.silt * 0.5);
        if (siltH > 0) {
          ctx.fillRect(i, canvas.height - 74, 4, 3);
        }
      }

      // Vehicle layout positioning parameters
      const truckX = 220;
      const truckY = 150;
      const truckW = 320;
      const truckH = 140;

      // 5. Generate and Update Streamlines
      if (state.tick % 4 === 0) {
        state.streamlines.push({
          x: canvas.width,
          y: 80 + Math.random() * (canvas.height - 180),
          speed: config.speed / 6 + 3
        });
      }

      ctx.lineWidth = 2;
      state.streamlines.forEach((s) => {
        s.x -= s.speed;

        // Flow Deflection by Truck body
        if (s.x > truckX && s.x < truckX + truckW) {
          if (s.y > truckY && s.y < truckY + truckH) {
            if (s.y > truckY + truckH - 30) {
              s.y = truckY + truckH - 5;
            } else {
              s.y = truckY - 10;
            }
          }
        }

        // Wake vortex modeling at the rear (left of the truck)
        if (s.x < truckX && s.x > truckX - 180) {
          if (!config.shieldEnabled) {
            // Toroidal turbulence loops
            const angle = (state.tick * 0.08 + s.x * 0.02) % (Math.PI * 2);
            s.y += Math.sin(angle) * 3;
            s.x += Math.cos(angle) * 1.5;
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          } else {
            // Streamlined exit
            s.y += (canvas.height - 120 - s.y) * 0.02;
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
          }
        } else {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        }

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + 20, s.y);
        ctx.stroke();
      });

      // Filter streamlines
      state.streamlines = state.streamlines.filter(s => s.x > -50);

      // 6. Generate Dust Particles
      const shearValue = calculateShearStress(config.speed, config.shieldEnabled);
      const liftProbability = (shearValue * config.silt * 0.01);
      
      if (Math.random() < liftProbability) {
        const isRear = Math.random() > 0.4;
        state.particles.push({
          x: isRear ? truckX + 240 + Math.random() * 40 : truckX + 60 + Math.random() * 20,
          y: canvas.height - 75,
          vx: -(config.speed / 10 + Math.random() * 2),
          vy: -(Math.random() * 3 + (config.speed / 15)),
          size: Math.random() * 3 + 1,
          alpha: 1.0,
          color: 'rgba(239, 68, 68, 0.8)',
          type: isRear ? 'rear' : 'front'
        });
      }

      // 7. Update & Draw Dust Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // settling gravity
        p.vx *= 0.98; // friction drag

        if (config.shieldEnabled) {
          // T-TEB Electret Baffle Trap capture logic (behind rear wheel)
          if (p.type === 'rear' && p.x < truckX + 285 && p.x > truckX + 265 && p.y > canvas.height - 110) {
            p.alpha = 0; // Trapped
            // Draw visual capture burst
            ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }

          // FSS side skirts confine front wheel dust
          if (p.type === 'front' && p.x < truckX + 160 && p.x > truckX + 120 && p.y > canvas.height - 95) {
            p.vy = 0.5;
            p.color = 'rgba(59, 130, 246, 0.6)';
          }

          if (p.x < truckX) {
            p.vy += 0.04;
            p.color = 'rgba(0, 242, 254, 0.5)';
          }
        } else {
          // Sucked up by low-pressure wake zone vortices
          if (p.x < truckX && p.x > truckX - 160) {
            const vortexCenterX = truckX - 80;
            const vortexCenterY = canvas.height - 180;
            const dx = vortexCenterX - p.x;
            const dy = vortexCenterY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              p.vx += (-dy / dist) * 0.6;
              p.vy += (dx / dist) * 0.6;
              p.color = 'rgba(239, 68, 68, 0.9)';
            }
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Filter dead particles
      state.particles = state.particles.filter(p => p.y < canvas.height && p.x > -20 && p.alpha > 0);

      // 8. Draw Truck Outline
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(truckX, truckY, truckW, truckH - 30);
      
      // Cabin
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(truckX + truckW, truckY + truckH - 30);
      ctx.lineTo(truckX + truckW + 40, truckY + truckH - 30);
      ctx.lineTo(truckX + truckW + 40, truckY + 60);
      ctx.lineTo(truckX + truckW + 10, truckY + 30);
      ctx.lineTo(truckX + truckW - 30, truckY + 30);
      ctx.closePath();
      ctx.fill();

      // Cabin window
      ctx.fillStyle = '#00f2fe';
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.moveTo(truckX + truckW + 10, truckY + 40);
      ctx.lineTo(truckX + truckW + 35, truckY + 65);
      ctx.lineTo(truckX + truckW + 10, truckY + 65);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Wheels
      ctx.fillStyle = '#020617';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      const wheelRadius = 24;
      const wheelY = canvas.height - 70;
      const wheels = [truckX + 60, truckX + 200, truckX + 250];
      
      wheels.forEach(wx => {
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wx, wheelY);
        ctx.lineTo(wx + Math.cos(state.tick * 0.1) * wheelRadius, wheelY + Math.sin(state.tick * 0.1) * wheelRadius);
        ctx.stroke();
      });

      // 9. Draw Retrofit Components
      if (config.shieldEnabled) {
        // Skirt (FSS)
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        const skirtX = truckX + 90;
        const skirtY = canvas.height - 95;
        const skirtW = 85;
        const skirtH = 20;
        ctx.fillRect(skirtX, skirtY, skirtW, skirtH);
        ctx.strokeRect(skirtX, skirtY, skirtW, skirtH);
        
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 9px var(--font-display)';
        ctx.fillText('FSS SKIRT', skirtX + 16, skirtY + 13);

        // Diffuser (UCD)
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.strokeStyle = '#00f2fe';
        ctx.beginPath();
        ctx.moveTo(truckX, canvas.height - 95);
        ctx.lineTo(truckX - 45, canvas.height - 115);
        ctx.lineTo(truckX - 45, canvas.height - 125);
        ctx.lineTo(truckX, canvas.height - 105);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#00f2fe';
        ctx.font = 'bold 9px var(--font-display)';
        ctx.fillText('UCD DIFFUSER', truckX - 60, canvas.height - 132);

        // Trap (T-TEB)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.strokeStyle = '#ef4444';
        const flapX = truckX + 274;
        const flapY = canvas.height - 95;
        const flapW = 12;
        const flapH = 28;
        ctx.fillRect(flapX, flapY, flapW, flapH);
        ctx.strokeRect(flapX, flapY, flapW, flapH);

        ctx.fillStyle = '#ef4444';
        ctx.fillText('T-TEB TRAP', flapX - 10, flapY - 8);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [config]);
}
export default useAeroSimulator;
