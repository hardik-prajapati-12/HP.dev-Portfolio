import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoHp from '../assets/logo-hp.png';

export function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Initializing...');
  const steps = ['Initializing...', 'Loading components...', 'Applying styles...', 'Ready!'];

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 3;
      setProgress(Math.min(p, 100));
      if (p >= 25 && p < 50) setText(steps[1]);
      else if (p >= 50 && p < 75) setText(steps[2]);
      else if (p >= 75) setText(steps[3]);
      if (p >= 100) {
        clearInterval(interval);
        // Simple timeout — no exit animation needed, just call onDone
        setTimeout(onDone, 300);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    /* Fixed overlay — no "exit" prop so it doesn't rely on AnimatePresence */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#0B1120',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '28px',
    }}>
      <motion.div
        animate={{ 
          scale: [0.96, 1.04, 0.96],
          filter: ['drop-shadow(0 0 8px rgba(99,102,241,0.2))', 'drop-shadow(0 0 20px rgba(99,102,241,0.5))', 'drop-shadow(0 0 8px rgba(99,102,241,0.2))']
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={logoHp} alt="HP Logo" style={{ height: '72px', objectFit: 'contain' }} />
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
          {text}
        </p>
      </div>

      <div style={{ width: '200px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(to right,#6366F1,#3B82F6)' }}
          transition={{ ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = e => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) {
        setIsPointer(false);
        return;
      }
      const hasPointerCursor = getComputedStyle(el).cursor === 'pointer' || 
                               el.closest('a') || 
                               el.closest('button') || 
                               el.closest('[role="button"]') ||
                               el.closest('.cursor-pointer');
      setIsPointer(!!hasPointerCursor);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Hide on touch devices
  if ('ontouchstart' in window) return null;

  return (
    <>
      <div style={{
        position: 'fixed', left: pos.x - 4, top: pos.y - 4,
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#6366F1', pointerEvents: 'none', zIndex: 99998,
        transform: isPointer ? 'scale(2)' : 'scale(1)',
        transition: 'transform 0.1s ease',
      }} />
      <div style={{
        position: 'fixed', left: pos.x - 18, top: pos.y - 18,
        width: '36px', height: '36px', borderRadius: '50%',
        border: '1.5px solid rgba(99,102,241,0.5)',
        pointerEvents: 'none', zIndex: 99997,
        transform: isPointer ? 'scale(1.5)' : 'scale(1)',
        transition: 'all 0.15s ease-out',
      }} />
    </>
  );
}
