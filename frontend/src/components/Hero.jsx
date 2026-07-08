import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiArrowRight, FiMail, FiCode } from 'react-icons/fi';
import { FaJava, FaReact, FaNodeJs, FaBrain } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiMongodb } from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';
import { PERSONAL_INFO, ROLES } from '../data/portfolioData';
import axios from 'axios';
import { getSkillIconDetails } from '../utils/skillIcons';
import heroLogoWhite from '../assets/hero-logo-white.png';
import heroLogoDark from '../assets/hero-logo-dark.png';


const PARTICLE_COUNT = 45;

function useParticles(canvasRef, isDark) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
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
      // Indigo/cyan particle color theme
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(99,102,241,${p.a * 0.3})` : `rgba(99,102,241,0.15)`;
        ctx.fill();
      });
      // Connected lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isDark
              ? `rgba(99,102,241,${0.1 * (1 - dist / 130)})`
              : `rgba(99,102,241,${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [canvasRef, isDark]);
}

function CodeEditorMockup({ name, title, skills, passion }) {
  const devName = name || "Hardik Prajapati";
  const devTitle = title || "Full Stack Engineer";
  const devPassion = passion || "Turning ideas into impact";
  const devSkills = Array.isArray(skills) && skills.length > 0 
    ? skills 
    : ["React", "Node.js", "Express", "MongoDB", "Java", "AI/ML", "DSA"];

  const skillsKey = devSkills.join(',');

  const codeLines = useMemo(() => {
    // Format skills dynamically (chunked into lines of 3 elements)
    const skillsLines = [];
    const chunkSize = 3;
    for (let i = 0; i < devSkills.length; i += chunkSize) {
      const chunk = devSkills.slice(i, i + chunkSize);
      const lineText = `    ` + chunk.map(s => `"${s}"`).join(', ') + (i + chunkSize < devSkills.length ? ',' : '');
      skillsLines.push({ text: lineText, color: '#f9e2af' });
    }

    return [
      { text: 'const developer = {', color: '#89b4fa' },
      { text: `  name: "${devName}",`, color: '#a6e3a1' },
      { text: `  title: "${devTitle}",`, color: '#a6e3a1' },
      { text: '  skills: [', color: '#cdd6f4' },
      ...skillsLines,
      { text: '  ],', color: '#cdd6f4' },
      { text: `  passion: "${devPassion}",`, color: '#f5c2e7' },
      { text: '  code: () => {', color: '#cba6f7' },
      { text: '    while (learning) {', color: '#f38ba8' },
      { text: '      build();', color: '#89b4fa' },
      { text: '      innovate();', color: '#94e2d5' },
      { text: '    }', color: '#f38ba8' },
      { text: '  }', color: '#cba6f7' },
      { text: '};', color: '#89b4fa' },
    ];
  }, [devName, devTitle, skillsKey, devPassion]);

  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  // Restart animation if data changes
  useEffect(() => {
    setVisibleLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
  }, [devName, devTitle, skillsKey, devPassion]);

  useEffect(() => {
    if (currentLineIdx >= codeLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines([]);
        setCurrentLineIdx(0);
        setCurrentCharIdx(0);
      }, 6000);
      return () => clearTimeout(timeout);
    }

    const line = codeLines[currentLineIdx];
    const timeout = setTimeout(() => {
      if (currentCharIdx === 0) {
        setVisibleLines(prev => [...prev, { text: '', color: line.color }]);
      }

      setVisibleLines(prev => {
        const copy = [...prev];
        if (copy[currentLineIdx]) {
          copy[currentLineIdx] = {
            text: line.text.substring(0, currentCharIdx + 1),
            color: line.color,
          };
        }
        return copy;
      });

      if (currentCharIdx + 1 < line.text.length) {
        setCurrentCharIdx(prev => prev + 1);
      } else {
        setCurrentLineIdx(prev => prev + 1);
        setCurrentCharIdx(0);
      }
    }, 25);

    return () => clearTimeout(timeout);
  }, [currentLineIdx, currentCharIdx, codeLines]);

  return (
    <div style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', lineHeight: '1.6', padding: '16px', color: '#cdd6f4' }}>
      {visibleLines.map((line, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '12px' }}>
          <span style={{ color: '#585b70', width: '20px', textAlign: 'right', userSelect: 'none' }}>{idx + 1}</span>
          <span style={{ color: line.color, whiteSpace: 'pre' }}>{line.text}</span>
        </div>
      ))}
      <span className="code-cursor" style={{ display: 'inline-block', width: '6px', height: '14px', background: '#89b4fa', marginLeft: '2px', animation: 'blink 0.8s step-end infinite' }} />
    </div>
  );
}

function BinaryStream({ isDark }) {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const cols = 6;
    const newStreams = Array.from({ length: cols }, (_, i) => ({
      id: i,
      x: 15 + i * 16,
      speed: 1.2 + Math.random() * 1.5,
      delay: Math.random() * -10,
      opacity: 0.08 + Math.random() * 0.1,
      chars: Array.from({ length: 12 }, () => Math.round(Math.random()).toString()),
    }));
    setStreams(newStreams);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
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

function GridDots({ color, style }) {
  return (
    <svg width="120" height="120" style={style}>
      <defs>
        <pattern id="grid-dots-pattern-hero" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-dots-pattern-hero)" />
    </svg>
  );
}

function CircuitBrain({ isDark }) {
  const brainColorLeft = '#00e5ff'; // Cyan
  const brainColorRight = '#00a8ff'; // Blue
  const innerCircuitColor = '#06b6d4'; // Light cyan

  return (
    <svg viewBox="-20 -20 240 240" width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.45))', overflow: 'visible' }}>
      <defs>
        <linearGradient id="brainLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="brainRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00a8ff" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="centralBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Surrounding Dashboard HUD Ticks and Rings */}
      <circle cx="100" cy="100" r="82" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="100" cy="100" r="92" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="98" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" strokeDasharray="15 6 4 6" />

      {/* Double Neon Outline Lobe Left */}
      <path
        d="M 96,32 C 80,32 70,38 62,50 C 52,48 42,58 38,72 C 28,72 20,86 20,100 C 10,102 8,116 14,126 C 10,132 12,144 22,150 C 20,158 26,166 36,168 C 48,172 65,168 78,164 C 86,166 92,168 96,168"
        stroke="#00e5ff"
        strokeWidth="4.5"
        fill="none"
        opacity="0.35"
        style={{ filter: 'blur(2.5px)', animation: 'left-lobe-glow 4s ease-in-out infinite' }}
      />
      <path
        d="M 96,32 C 80,32 70,38 62,50 C 52,48 42,58 38,72 C 28,72 20,86 20,100 C 10,102 8,116 14,126 C 10,132 12,144 22,150 C 20,158 26,166 36,168 C 48,172 65,168 78,164 C 86,166 92,168 96,168"
        stroke="url(#brainLeftGrad)"
        strokeWidth="1.5"
        fill="none"
        style={{ animation: 'left-lobe-glow 4s ease-in-out infinite' }}
      />

      {/* Double Neon Outline Lobe Right */}
      <path
        d="M 104,32 C 120,32 130,38 138,50 C 148,48 158,58 162,72 C 172,72 180,86 180,100 C 190,102 192,116 186,126 C 190,132 188,144 178,150 C 180,158 174,166 164,168 C 152,172 135,168 122,164 C 114,166 108,168 104,168"
        stroke="#00a8ff"
        strokeWidth="4.5"
        fill="none"
        opacity="0.35"
        style={{ filter: 'blur(2.5px)', animation: 'right-lobe-glow 4s ease-in-out infinite', animationDelay: '2s' }}
      />
      <path
        d="M 104,32 C 120,32 130,38 138,50 C 148,48 158,58 162,72 C 172,72 180,86 180,100 C 190,102 192,116 186,126 C 190,132 188,144 178,150 C 180,158 174,166 164,168 C 152,172 135,168 122,164 C 114,166 108,168 104,168"
        stroke="url(#brainRightGrad)"
        strokeWidth="1.5"
        fill="none"
        style={{ animation: 'right-lobe-glow 4s ease-in-out infinite', animationDelay: '2s' }}
      />

      {/* Center AI Box - Double Border */}
      <rect
        x="78" y="78" width="44" height="44" rx="7" ry="7"
        stroke={brainColorLeft}
        strokeWidth="1.5"
        fill="none"
        style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.5))', animation: 'left-lobe-glow 4s ease-in-out infinite' }}
      />
      <rect
        x="82" y="82" width="36" height="36" rx="5" ry="5"
        stroke={brainColorLeft}
        strokeWidth="2"
        fill="url(#centralBoxGrad)"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.75))', animation: 'left-lobe-glow 4s ease-in-out infinite', animationDelay: '1s' }}
      />
      <text
        x="100" y="105"
        fill="#00e5ff"
        fontSize="15"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="Poppins"
        style={{ letterSpacing: '0.5px', filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.5))', animation: 'left-lobe-glow 4s ease-in-out infinite' }}
      >
        AI
      </text>

      {/* 8 Top & 8 Bottom Vertical Parallel Traces */}
      <g stroke={innerCircuitColor} strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Top */}
        <path d="M 97,78 L 97,45" />
        <path d="M 103,78 L 103,45" />
        <path d="M 92,78 L 92,60 L 86,54 L 86,38" />
        <path d="M 108,78 L 108,60 L 114,54 L 114,38" />
        <path d="M 87,78 L 87,68 L 79,60 L 79,42" />
        <path d="M 113,78 L 113,68 L 121,60 L 121,42" />
        <path d="M 82,78 L 82,74 L 70,62 L 70,48" />
        <path d="M 118,78 L 118,74 L 130,62 L 130,48" />

        {/* Bottom */}
        <path d="M 97,122 L 97,155" />
        <path d="M 103,122 L 103,155" />
        <path d="M 92,122 L 92,140 L 86,146 L 86,162" />
        <path d="M 108,122 L 108,140 L 114,146 L 114,162" />
        <path d="M 87,122 L 87,132 L 79,140 L 79,158" />
        <path d="M 113,122 L 113,132 L 121,140 L 121,158" />
        <path d="M 82,122 L 82,126 L 70,138 L 70,152" />
        <path d="M 118,122 L 118,126 L 130,138 L 130,152" />
      </g>

      {/* Left Hemisphere Circuits (6 Horizontal Tracks) */}
      <g stroke={innerCircuitColor} strokeWidth="1.2" fill="none" opacity="0.75">
        <path d="M 78,86 L 70,86 L 60,76 L 45,76" />
        <path d="M 78,92 L 65,92 L 55,82 L 35,82" />
        <path d="M 78,98 L 28,98" />
        <path d="M 78,104 L 28,104" />
        <path d="M 78,110 L 65,110 L 55,120 L 35,120" />
        <path d="M 78,116 L 70,116 L 60,126 L 45,126" />
      </g>

      {/* Right Hemisphere Circuits (6 Horizontal Tracks) */}
      <g stroke={brainColorRight} strokeWidth="1.2" fill="none" opacity="0.75">
        <path d="M 122,86 L 130,86 L 140,76 L 155,76" />
        <path d="M 122,92 L 135,92 L 145,82 L 165,82" />
        <path d="M 122,98 L 172,98" />
        <path d="M 122,104 L 172,104" />
        <path d="M 122,110 L 135,110 L 145,120 L 165,120" />
        <path d="M 122,116 L 130,116 L 140,126 L 155,126" />
      </g>

      {/* Animated Pulses flowing continuously */}
      <g stroke="#ffffff" strokeWidth="1.8" fill="none" strokeDasharray="8 35" style={{ animation: 'brain-circuit-flow 3.5s linear infinite' }}>
        {/* Top */}
        <path d="M 97,78 L 97,45" />
        <path d="M 103,78 L 103,45" />
        <path d="M 92,78 L 92,60 L 86,54 L 86,38" />
        <path d="M 108,78 L 108,60 L 114,54 L 114,38" />
        <path d="M 87,78 L 87,68 L 79,60 L 79,42" />
        <path d="M 113,78 L 113,68 L 121,60 L 121,42" />
        <path d="M 82,78 L 82,74 L 70,62 L 70,48" />
        <path d="M 118,78 L 118,74 L 130,62 L 130,48" />

        {/* Bottom */}
        <path d="M 97,122 L 97,155" />
        <path d="M 103,122 L 103,155" />
        <path d="M 92,122 L 92,140 L 86,146 L 86,162" />
        <path d="M 108,122 L 108,140 L 114,146 L 114,162" />
        <path d="M 87,122 L 87,132 L 79,140 L 79,158" />
        <path d="M 113,122 L 113,132 L 121,140 L 121,158" />
        <path d="M 82,122 L 82,126 L 70,138 L 70,152" />
        <path d="M 118,122 L 118,126 L 130,138 L 130,152" />

        {/* Left */}
        <path d="M 78,86 L 70,86 L 60,76 L 45,76" />
        <path d="M 78,92 L 65,92 L 55,82 L 35,82" />
        <path d="M 78,98 L 28,98" />
        <path d="M 78,104 L 28,104" />
        <path d="M 78,110 L 65,110 L 55,120 L 35,120" />
        <path d="M 78,116 L 70,116 L 60,126 L 45,126" />

        {/* Right */}
        <path d="M 122,86 L 130,86 L 140,76 L 155,76" />
        <path d="M 122,92 L 135,92 L 145,82 L 165,82" />
        <path d="M 122,98 L 172,98" />
        <path d="M 122,104 L 172,104" />
        <path d="M 122,110 L 135,110 L 145,120 L 165,120" />
        <path d="M 122,116 L 130,116 L 140,126 L 155,126" />
      </g>

      {/* Glowing Endpoint circles */}
      <g fill="#00e5ff">
        {/* Top left */}
        <circle cx="97" cy="45" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.1s' }} />
        <circle cx="86" cy="38" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.3s' }} />
        <circle cx="79" cy="42" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.5s' }} />
        <circle cx="70" cy="48" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.7s' }} />

        {/* Bottom left */}
        <circle cx="97" cy="155" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.2s' }} />
        <circle cx="86" cy="162" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <circle cx="79" cy="158" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.6s' }} />
        <circle cx="70" cy="152" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.8s' }} />

        {/* Mid left */}
        <circle cx="45" cy="76" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.3s' }} />
        <circle cx="35" cy="82" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.5s' }} />
        <circle cx="28" cy="98" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.7s' }} />
        <circle cx="28" cy="104" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.9s' }} />
        <circle cx="35" cy="120" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '1.1s' }} />
        <circle cx="45" cy="126" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '1.3s' }} />
      </g>
      <g fill="#00a8ff">
        {/* Top right */}
        <circle cx="103" cy="45" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.1s' }} />
        <circle cx="114" cy="38" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.3s' }} />
        <circle cx="121" cy="42" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.5s' }} />
        <circle cx="130" cy="48" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.7s' }} />

        {/* Bottom right */}
        <circle cx="103" cy="155" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.2s' }} />
        <circle cx="114" cy="162" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <circle cx="121" cy="158" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.6s' }} />
        <circle cx="130" cy="152" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.8s' }} />

        {/* Mid right */}
        <circle cx="155" cy="76" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.3s' }} />
        <circle cx="165" cy="82" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.5s' }} />
        <circle cx="172" cy="98" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.7s' }} />
        <circle cx="172" cy="104" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '0.9s' }} />
        <circle cx="165" cy="120" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '1.1s' }} />
        <circle cx="155" cy="126" r="2" style={{ animation: 'node-pulse 3s ease-in-out infinite', animationDelay: '1.3s' }} />
      </g>
    </svg>
  );
}

export default function Hero() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  useParticles(canvasRef, isDark);
  const [profile, setProfile] = useState(PERSONAL_INFO);
  const [roles, setRoles] = useState(ROLES);
  const [dbSkills, setDbSkills] = useState([]);
  const [skillsLoaded, setSkillsLoaded] = useState(false);

  // Parallax mouse interaction logic
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: x * 24, y: y * 24 }); // 24px movement range
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 }); // smooth spring reset
  };

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      if (res.data && res.data.name) {
        setProfile(res.data);
        if (res.data.roles) {
          if (res.data.roles.length > 0) {
            setRoles(res.data.roles);
          } else {
            setRoles(["MERN Stack Developer", "Full Stack Engineer"]);
          }
        }
      }
    }).catch(() => { });

    axios.get('/api/skills').then(res => {
      if (Array.isArray(res.data)) {
        setDbSkills(res.data);
        setSkillsLoaded(true);
      }
    }).catch(() => { });
  }, []);

  const typeSequence = roles.flatMap(r => [r, 1800]);

  const socialLinks = [
    { icon: FiGithub, href: profile.github, label: 'GitHub' },
    { icon: FiLinkedin, href: profile.linkedin, label: 'LinkedIn' },
    { icon: FaXTwitter, href: profile.twitter, label: 'X' },
    { icon: FiMail, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`, label: 'Email' },
  ];

  const HERO_TECH_KEYS = ['Java', 'React', 'Node.js', 'MongoDB', 'AI / ML', 'DSA'];
  const techStacks = [];

  if (skillsLoaded) {
    HERO_TECH_KEYS.forEach(techKey => {
      const normTech = techKey.toLowerCase().replace(/[\s\.\-\/]+/g, '');
      const dbSkill = dbSkills.find(s => {
        const normName = s.name.toLowerCase().replace(/[\s\.\-\/]+/g, '');
        return normName === normTech || normName.startsWith(normTech) || normTech.startsWith(normName);
      });

      if (dbSkill) {
        const iconDetails = getSkillIconDetails(dbSkill.name, isDark) || {};
        techStacks.push({
          name: dbSkill.name,
          image: dbSkill.image || '',
          icon: iconDetails.icon || null,
          color: iconDetails.color || '#6366F1',
          glow: iconDetails.glow || 'rgba(99,102,241,0.15)'
        });
      }
    });
  } else {
    // Default static fallback before DB loads
    techStacks.push(
      { name: 'Java', icon: <FaJava />, color: '#F89820', glow: 'rgba(248,152,32,0.15)' },
      { name: 'React', icon: <FaReact className="animate-spin-slow" style={{ animationDuration: '10s' }} />, color: '#61DAFB', glow: 'rgba(97,218,251,0.15)' },
      { name: 'Node.js', icon: <FaNodeJs />, color: '#339933', glow: 'rgba(51,153,51,0.15)' },
      { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248', glow: 'rgba(71,162,72,0.15)' },
      { name: 'AI / ML', icon: <FaBrain />, color: '#A855F7', glow: 'rgba(168,85,247,0.15)' },
      { name: 'DSA', icon: <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>{"{}"}</span>, color: '#06B6D4', glow: 'rgba(6,182,212,0.15)' }
    );
  }

  return (
    <section id="home" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '100px', background: 'inherit' }}>
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Binary Matrix Drops */}
      <BinaryStream isDark={isDark} />

      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: isDark ? `linear-gradient(rgba(99,102,241,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.015) 1px,transparent 1px)` : `linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* Corner dot grids */}
      <GridDots color={isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'} style={{ position: 'absolute', left: '40px', top: '110px', zIndex: 1, pointerEvents: 'none' }} />
      <GridDots color={isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.12)'} style={{ position: 'absolute', right: '40px', bottom: '150px', zIndex: 1, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 2 }}>
        <div className="hero-container">

          {/* Left Column — Text & CTAs & Tech ribbon */}
          <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>


            {/* Headline Logo */}
            <div style={{ margin: '0 0 24px 0', maxWidth: '480px', width: '100%' }}>
              <img 
                src={isDark ? heroLogoWhite : heroLogoDark} 
                alt="HARDIK. PRAJAPATI." 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </div>

            {/* Subtitle / Tagline */}
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)', color: isDark ? '#CBD5E1' : '#334155', marginBottom: '16px', lineHeight: 1.3 }}>
              {profile.heroTitle || PERSONAL_INFO.heroTitle}
            </h2>

            {/* Description */}
            <p style={{ fontFamily: 'Inter', fontSize: '1rem', lineHeight: 1.8, color: isDark ? '#CBD5E1' : '#475569', marginBottom: '24px', maxWidth: '600px' }}>
              {profile.heroDesc || PERSONAL_INFO.heroDesc}
            </p>

            {/* Role cycler (Typing animation) */}
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 'clamp(1.05rem, 2vw, 1.5rem)', marginBottom: '24px', minHeight: '1.5em' }}>
              <TypeAnimation key={roles.join(',')} sequence={typeSequence} wrapper="span" repeat={Infinity} style={{ background: 'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <motion.a href="#projects" whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 30px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.25)', transition: 'all 0.25s' }}
              >
                View My Work <FiArrowRight />
              </motion.a>

              <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 30px', borderRadius: '8px', background: 'transparent', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', border: isDark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid rgba(0,0,0,0.15)', transition: 'all 0.25s' }}
              >
                Contact Me <FiMail />
              </motion.a>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '44px' }}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.95 }}
                  title={label}
                  style={{ color: isDark ? '#94A3B8' : '#64748B', textDecoration: 'none', display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>

            {/* Tech Stack Ribbon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', width: '100%', padding: '12px 0', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
              {techStacks.map((tech, idx) => {
                const hasImage = tech.image && tech.image.trim() !== '';
                return (
                  <div key={tech.name} style={{ display: 'flex', alignItems: 'center' }}>
                    {idx > 0 && (
                      <div style={{ height: '32px', width: '1px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', marginRight: '20px' }} />
                    )}
                    <div className="tech-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div className="tech-icon" style={{
                        color: tech.color,
                        fontSize: '1.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: `drop-shadow(0 0 6px ${tech.glow})`,
                        transition: 'transform 0.3s',
                        width: hasImage ? '32px' : 'auto',
                        height: hasImage ? '32px' : 'auto',
                        overflow: 'hidden',
                        borderRadius: hasImage ? '6px' : 'none'
                      }}>
                        {hasImage ? (
                          <img src={tech.image} alt={tech.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          tech.icon
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#475569', fontFamily: 'Poppins' }}>
                        {tech.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column — IDE Laptop & AI Brain HUD */}
          <div className="hero-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%', height: '100%' }}>

            {/* Radial glow background */}
            <div style={{ position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Glowing Circuit paths behind the laptop */}
            <div
              style={{ position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '8%', zIndex: 0, pointerEvents: 'none' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                  <linearGradient id="cyanBlueCircuit" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d8ff" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#00f0ff" />
                  </linearGradient>

                  {/* Subtle blur filters for glow */}
                  <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="blueGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* --- Background Static Dark Blue Traces (Layer 1) --- */}
                <g stroke="rgba(30, 64, 175, 0.15)" strokeWidth="1.2" fill="none">
                  {/* Bank 1: Mid-Bottom Horizontal Parallel Traces */}
                  <path d="M 80 420 L 400 420 L 460 480 L 700 480" />
                  <path d="M 110 460 L 380 460 L 440 520 L 670 520" />
                  <path d="M 50 380 L 420 380 L 480 440 L 730 440" />

                  {/* Bank 2: Mid-Top Horizontal Parallel Traces */}
                  <path d="M 100 350 L 350 350 L 410 290 L 650 290" />
                  <path d="M 130 310 L 330 310 L 390 250 L 620 250" />
                  <path d="M 160 270 L 310 270 L 370 210 L 590 210" />

                  {/* Bank 3: Top Traces */}
                  <path d="M 150 140 L 320 140 L 380 80 L 600 80" />
                  <path d="M 180 180 L 300 180 L 360 120 L 570 120" />
                  <path d="M 220 220 L 280 220 L 340 160 L 540 160" />

                  {/* New Right-to-Bottom Vertical Background Traces */}
                  <path d="M 720 200 L 720 380 L 620 480 L 620 560" />
                  <path d="M 690 220 L 690 370 L 600 460 L 600 540" />
                  <path d="M 660 240 L 660 360 L 580 440 L 580 520" />

                  {/* Background Parallel Diagonals (Top Right area, matches reference photo) */}
                  <path d="M 380 50 L 530 200" />
                  <path d="M 410 50 L 560 200" />
                  <path d="M 440 50 L 590 200" />
                  <path d="M 470 50 L 620 200" />
                  <path d="M 500 50 L 650 200" />

                  {/* Background Parallel Diagonals (Bottom Right area) */}
                  <path d="M 250 450 L 370 570" strokeOpacity="0.7" />
                  <path d="M 280 450 L 400 570" strokeOpacity="0.7" />
                  <path d="M 310 450 L 430 570" strokeOpacity="0.7" />
                </g>

                {/* --- Foreground Glowing Blue/Cyan Active Traces (Layer 2) --- */}
                <g stroke="url(#cyanBlueCircuit)" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#cyanGlow)">
                  {/* Pulse lines flowing over paths. pathLength="100" ensures standard scaling for flow synchronization */}
                  <path d="M 80 420 L 400 420 L 460 480 L 700 480" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3.5s linear infinite' }} />
                  <path d="M 110 460 L 380 460 L 440 520 L 670 520" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 2.8s linear infinite', animationDelay: '0.5s' }} />
                  <path d="M 50 380 L 420 380 L 480 440 L 730 440" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 4s linear infinite', animationDelay: '1.2s' }} />

                  <path d="M 100 350 L 350 350 L 410 290 L 650 290" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3.2s linear infinite', animationDelay: '0.2s' }} />
                  <path d="M 130 310 L 330 310 L 390 250 L 620 250" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 2.5s linear infinite', animationDelay: '0.8s' }} />
                  <path d="M 160 270 L 310 270 L 370 210 L 590 210" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3.8s linear infinite', animationDelay: '1.5s' }} />

                  <path d="M 150 140 L 320 140 L 380 80 L 600 80" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3s linear infinite', animationDelay: '0.4s' }} />
                  <path d="M 220 220 L 280 220 L 340 160 L 540 160" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3.6s linear infinite', animationDelay: '1s' }} />

                  {/* New Active Right-to-Bottom Vertical Traces */}
                  <path d="M 720 200 L 720 380 L 620 480 L 620 560" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 3.5s linear infinite' }} />
                  <path d="M 690 220 L 690 370 L 600 460 L 600 540" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 2.8s linear infinite', animationDelay: '0.5s' }} />
                  <path d="M 660 240 L 660 360 L 580 440 L 580 520" pathLength="100" strokeDasharray="25 120" style={{ animation: 'circuit-flow 4.2s linear infinite', animationDelay: '1.2s' }} />
                </g>

                {/* --- Glowing Double-Circle Nodes (Layer 3) --- */}
                {/* Node brightness/glow flares up using node-pulse-hit synchronized with line animation durations and delays */}
                <g>
                  {/* Left-side Nodes */}
                  <g>
                    <circle cx="80" cy="420" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="80" cy="420" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="100" cy="350" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="100" cy="350" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="130" cy="310" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="130" cy="310" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="150" cy="140" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="150" cy="140" r="2.5" fill="#ffffff" />
                  </g>

                  {/* Mid/Junction Nodes */}
                  <g>
                    <circle cx="350" cy="350" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="350" cy="350" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="410" cy="290" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="410" cy="290" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="380" cy="460" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="380" cy="460" r="2.5" fill="#ffffff" />
                  </g>

                  {/* Right-side Terminus Nodes (Pulsing in sync with active line animation arrival) */}
                  <g>
                    <circle cx="650" cy="290" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3.2s linear infinite', animationDelay: '0.2s' }} />
                    <circle cx="650" cy="290" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3.2s linear infinite', animationDelay: '0.2s' }} />
                  </g>
                  <g>
                    <circle cx="620" cy="250" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 2.5s linear infinite', animationDelay: '0.8s' }} />
                    <circle cx="620" cy="250" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 2.5s linear infinite', animationDelay: '0.8s' }} />
                  </g>
                  <g>
                    <circle cx="590" cy="210" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3.8s linear infinite', animationDelay: '1.5s' }} />
                    <circle cx="590" cy="210" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3.8s linear infinite', animationDelay: '1.5s' }} />
                  </g>
                  <g>
                    <circle cx="700" cy="480" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3.5s linear infinite' }} />
                    <circle cx="700" cy="480" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3.5s linear infinite' }} />
                  </g>
                  <g>
                    <circle cx="730" cy="440" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 4s linear infinite', animationDelay: '1.2s' }} />
                    <circle cx="730" cy="440" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 4s linear infinite', animationDelay: '1.2s' }} />
                  </g>
                  <g>
                    <circle cx="670" cy="520" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 2.8s linear infinite', animationDelay: '0.5s' }} />
                    <circle cx="670" cy="520" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 2.8s linear infinite', animationDelay: '0.5s' }} />
                  </g>
                  <g>
                    <circle cx="600" cy="80" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3s linear infinite', animationDelay: '0.4s' }} />
                    <circle cx="600" cy="80" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3s linear infinite', animationDelay: '0.4s' }} />
                  </g>
                  <g>
                    <circle cx="540" cy="160" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3.6s linear infinite', animationDelay: '1s' }} />
                    <circle cx="540" cy="160" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3.6s linear infinite', animationDelay: '1s' }} />
                  </g>

                  {/* New Right-to-Bottom Start Nodes */}
                  <g>
                    <circle cx="720" cy="200" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="720" cy="200" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="690" cy="220" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="690" cy="220" r="2.5" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="660" cy="240" r="5" fill="#00d8ff" opacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx="660" cy="240" r="2.5" fill="#ffffff" />
                  </g>

                  {/* New Right-to-Bottom Terminus Nodes */}
                  <g>
                    <circle cx="620" cy="560" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 3.5s linear infinite' }} />
                    <circle cx="620" cy="560" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 3.5s linear infinite' }} />
                  </g>
                  <g>
                    <circle cx="600" cy="540" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 2.8s linear infinite', animationDelay: '0.5s' }} />
                    <circle cx="600" cy="540" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 2.8s linear infinite', animationDelay: '0.5s' }} />
                  </g>
                  <g>
                    <circle cx="580" cy="520" r="6" fill="#0055ff" opacity="0.4" filter="url(#blueGlow)"
                      style={{ animation: 'node-pulse-hit 4.2s linear infinite', animationDelay: '1.2s' }} />
                    <circle cx="580" cy="520" r="2.5" fill="#ffffff"
                      style={{ animation: 'node-pulse-hit 4.2s linear infinite', animationDelay: '1.2s' }} />
                  </g>
                </g>
              </svg>
            </div>

            {/* Interactive IDE / Laptop Component */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px', zIndex: 2 }}>

              {/* Laptop Screen Body */}
              <div style={{
                position: 'relative',
                width: '90%',
                margin: '0 auto',
                background: '#151521',
                borderRadius: '12px 12px 0 0',
                border: isDark ? '8px solid #1e1e2e' : '8px solid #2e2f3e',
                boxShadow: isDark
                  ? '0 20px 50px rgba(0,0,0,0.5), 0 0 35px rgba(99,102,241,0.18)'
                  : '0 20px 40px rgba(0,0,0,0.15), 0 0 25px rgba(99,102,241,0.08)',
                aspectRatio: '16/10.2',
                overflow: 'hidden'
              }}>
                {/* Editor Top Tab Bar */}
                <div style={{ height: '26px', background: '#0f0f15', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />

                  {/* File tab */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#151521', padding: '0 10px', height: '100%', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', marginLeft: '12px', gap: '6px' }}>
                    <FiCode size={10} color="#89b4fa" />
                    <span style={{ fontSize: '0.65rem', color: '#cdd6f4', fontFamily: 'monospace', fontWeight: 600 }}>developer.js</span>
                  </div>
                </div>

                {/* Inside Screen Terminal */}
                <div style={{ height: 'calc(100% - 26px)', overflow: 'auto', background: '#0e0e15' }}>
                  <CodeEditorMockup 
                    name={profile.laptopName || profile.name} 
                    title={profile.laptopTitle || profile.title} 
                    skills={profile.laptopSkills} 
                    passion={profile.laptopPassion} 
                  />
                </div>
              </div>

              {/* Laptop Keyboard Chassis Base */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '10px',
                background: isDark ? '#2e2f3e' : '#e2e8f0',
                borderRadius: '0 0 12px 12px',
                borderTop: isDark ? '1px solid #45475a' : '1px solid #cbd5e1',
                boxShadow: '0 8px 16px rgba(0,0,0,0.25)'
              }}>
                {/* Center trackpad slot */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%)',
                  width: '54px',
                  height: '3px',
                  background: isDark ? '#0f0f15' : '#94a3b8',
                  borderRadius: '0 0 3px 3px'
                }} />
              </div>
            </div>

            {/* Glowing circular AI / Brain HUD on the side */}
            <div
              style={{
                position: 'absolute',
                right: '-70px',
                top: '0%',
                width: '230px',
                height: '230px',
                zIndex: 3,
                pointerEvents: 'none'
              }}
            >
              {/* Outer dashed spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1.5px dashed rgba(6, 182, 212, 0.45)',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.3))'
                }}
              />
              {/* Inner dashed spinning ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: '16px',
                  border: '1px dashed rgba(139, 92, 246, 0.45)',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.3))'
                }}
              />
              {/* Central glowing hub card with custom CircuitBrain */}
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: isDark ? 'rgba(15, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isDark ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid rgba(139, 92, 246, 0.15)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                padding: '2px',
                overflow: 'visible'
              }}>
                <CircuitBrain isDark={isDark} />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Cyber Wave SVGs at the bottom */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none" style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: '80px', pointerEvents: 'none', zIndex: 1 }}>
        <defs>
          <linearGradient id="pinkPurpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path d="M0,80 C240,110 480,50 720,90 C960,130 1200,60 1440,90 L1440,120 L0,120 Z" fill={isDark ? 'rgba(99,102,241,0.015)' : 'rgba(99,102,241,0.01)'} />
        <path d="M0,80 C240,110 480,50 720,90 C960,130 1200,60 1440,90" stroke="url(#pinkPurpleGrad)" strokeWidth="2.5" opacity="0.45" />
        <path d="M0,95 C240,65 480,125 720,85 C960,45 1200,115 1440,85" stroke="url(#cyanBlueGrad)" strokeWidth="1.5" opacity="0.35" />
      </svg>

      <style>{`
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 48px;
          width: 100%;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes pulse-brain-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.5)); }
          50%      { filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.9)); }
        }
        @keyframes circuit-flow {
          0% { stroke-dashoffset: 145; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes node-pulse {
          0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 2px #06b6d4); }
          50%      { opacity: 1; filter: drop-shadow(0 0 8px #06b6d4); }
        }
        @keyframes node-glow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 3px #00d8ff); }
          50%      { opacity: 1; filter: drop-shadow(0 0 12px #00f0ff) drop-shadow(0 0 22px #0055ff); }
        }
        @keyframes node-pulse-hit {
          0%, 75% { opacity: 0.35; filter: drop-shadow(0 0 2px #00d8ff); }
          85%      { opacity: 1; filter: drop-shadow(0 0 12px #00f0ff) drop-shadow(0 0 22px #0055ff); }
          100%     { opacity: 0.35; filter: drop-shadow(0 0 2px #00d8ff); }
        }
        @keyframes left-lobe-glow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.95; }
        }
        @keyframes right-lobe-glow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.95; }
        }
        @keyframes brain-circuit-flow {
          0% { stroke-dashoffset: 43; }
          100% { stroke-dashoffset: 0; }
        }
        .tech-item:hover .tech-icon {
          transform: translateY(-5px) scale(1.15);
        }
        @media (max-width: 991px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 56px;
          }
          .hero-left {
            align-items: center!important;
            text-align: center;
          }
          .hero-left h1, .hero-left h2 {
            text-align: center!important;
          }
          .hero-left div {
            align-self: center!important;
          }
        }
      `}</style>
    </section>
  );
}
