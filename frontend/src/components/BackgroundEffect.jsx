import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 55;

function useParticles(canvasRef, isDark) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      a: Math.random(),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(99,102,241,${p.a * 0.35})` : `rgba(99,102,241,0.18)`;
        ctx.fill();
      });

      // Connected lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isDark
              ? `rgba(99,102,241,${0.12 * (1 - dist / 140)})`
              : `rgba(99,102,241,0.08 * (1 - dist / 140))`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, isDark]);
}

export function BinaryStream({ isDark }) {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const cols = 14;
    const newStreams = Array.from({ length: cols }, (_, i) => ({
      id: i,
      x: 3 + i * 7.2,
      speed: 1.2 + Math.random() * 1.5,
      delay: Math.random() * -10,
      opacity: 0.07 + Math.random() * 0.09,
      chars: Array.from({ length: 14 }, () => Math.round(Math.random()).toString()),
    }));
    setStreams(newStreams);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {streams.map(s => (
        <motion.div
          key={s.id}
          initial={{ y: '-50%' }}
          animate={{ y: '100%' }}
          transition={{ duration: 12 / s.speed, repeat: Infinity, ease: 'linear', delay: s.delay }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: isDark ? '#10B981' : '#3B82F6',
            opacity: s.opacity,
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            letterSpacing: '6px',
            textShadow: isDark ? '0 0 6px rgba(16,185,129,0.5)' : 'none'
          }}
        >
          {s.chars.join('')}
        </motion.div>
      ))}
    </div>
  );
}

export function GridDots({ color, style }) {
  return (
    <svg width="120" height="120" style={style}>
      <defs>
        <pattern id="grid-dots-pattern-global" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-dots-pattern-global)" />
    </svg>
  );
}

export default function BackgroundEffect({ isDark }) {
  const canvasRef = useRef(null);
  useParticles(canvasRef, isDark);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Particle Canvas Network */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Binary Matrix Streams */}
      <BinaryStream isDark={isDark} />

      {/* Grid Overlay Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundImage: isDark
          ? `linear-gradient(rgba(99,102,241,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.018) 1px,transparent 1px)`
          : `linear-gradient(rgba(99,102,241,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.035) 1px,transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Ambient Grid Dots */}
      <GridDots color={isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'} style={{ position: 'absolute', left: '40px', top: '110px', zIndex: 1, pointerEvents: 'none' }} />
      <GridDots color={isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.12)'} style={{ position: 'absolute', right: '40px', bottom: '150px', zIndex: 1, pointerEvents: 'none' }} />
    </div>
  );
}
