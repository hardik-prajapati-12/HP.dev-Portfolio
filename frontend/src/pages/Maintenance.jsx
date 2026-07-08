import { motion } from 'framer-motion';
import { FiSliders, FiClock, FiLock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

export default function Maintenance({ siteTitle, siteLogoText }) {
  const { isDark } = useTheme();

  // Theme-specific color configuration
  const bg = isDark ? '#0B0F19' : '#F8FAFC';
  const textMain = isDark ? '#F1F5F9' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const accent = '#6366F1'; // Indigo

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      color: textMain,
      fontFamily: 'Poppins, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic background glowing ambient gradients */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)`,
        top: '-10%',
        left: '-10%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)`,
        bottom: '-10%',
        right: '-10%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Brand logo header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '12px',
          zIndex: 1
        }}
      >
        <img 
          src={isDark ? logo : logoDark} 
          alt="HP.dev Logo" 
          style={{ height: '90px', objectFit: 'contain' }} 
        />
      </motion.div>

      {/* Premium Glassmorphic content container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          background: cardBg,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${border}`,
          borderRadius: '24px',
          padding: '48px 32px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.05)',
          zIndex: 1
        }}
      >
        {/* Pulsing micro-animation surrounding gear icon */}
        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '32px' }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.2)',
              filter: 'blur(12px)',
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          >
            <FiSliders size={32} />
          </motion.div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: '16px',
          fontFamily: 'Outfit, sans-serif',
          background: 'linear-gradient(135deg, #F1F5F9, #94A3B8)',
          WebkitBackgroundClip: isDark ? 'text' : 'none',
          WebkitTextFillColor: isDark ? 'transparent' : 'initial',
          color: isDark ? 'transparent' : textMain,
        }}>
          Scheduled Maintenance
        </h1>

        {/* Description text */}
        <p style={{
          color: textSub,
          fontSize: '1.02rem',
          lineHeight: '1.6',
          marginBottom: '32px',
          fontFamily: 'Inter, sans-serif'
        }}>
          We are currently updating key features and optimizing our backend databases to improve your browsing experience. The website will be fully functional shortly.
        </p>

        {/* Info Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: textSub,
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${border}`
          }}>
            <FiClock style={{ color: accent }} />
            <span>Be Back Soon</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: textSub,
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${border}`
          }}>
            <FiLock style={{ color: '#10B981' }} />
            <span>Secure System</span>
          </div>
        </div>
      </motion.div>

      {/* Subtle bottom link for admin entrance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          marginTop: '32px',
          zIndex: 1
        }}
      >
        <Link to="/admin" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: textSub,
          fontSize: '0.88rem',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${border}`,
          transition: 'all 0.2s ease'
        }}>
          <span>Authorized Admin Access</span>
          <span>→</span>
        </Link>
      </motion.div>
    </div>
  );
}
