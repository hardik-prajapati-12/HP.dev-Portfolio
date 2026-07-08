import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiGithub, FiLinkedin, FiMail, FiArrowUp, FiHeart } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';
import { PERSONAL_INFO } from '../data/portfolioData';
import axios from 'axios';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

const quickLinks = [
  { label: 'Home', href: '#home' }, { label: 'About', href: '#about' }, { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' }, { label: 'Experience', href: '#experience' }, { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(PERSONAL_INFO);

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      if (res.data && res.data.name) setProfile(res.data);
    }).catch(() => { });
  }, []);

  const socials = [
    { icon: FiGithub, href: profile.github },
    { icon: FiLinkedin, href: profile.linkedin },
    { icon: FaXTwitter, href: profile.twitter },
    { icon: FiMail, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}` },
  ];

  return (
    <footer style={{ background: 'inherit', borderTop: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #E2E8F0', padding: '80px 24px 40px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '80px', objectFit: 'contain', marginLeft: '-13px' }} />
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', lineHeight: 1.7, color: isDark ? '#94A3B8' : '#64748B', maxWidth: '220px', marginBottom: '20px' }}>
              Crafting exceptional digital experiences with modern technologies.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socials.map(({ icon: Icon, href }) => (
                <motion.a key={href} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ 
                    y: -3, 
                    scale: 1.1,
                    color: '#6366F1',
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)'
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', 
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', 
                    color: isDark ? '#94A3B8' : '#64748B', 
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map(({ label, href }) => (
                <a key={label} href={href} style={{ textDecoration: 'none', fontFamily: 'Inter', fontSize: '0.9rem', color: isDark ? '#94A3B8' : '#64748B', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#6366F1'} onMouseLeave={e => e.target.style.color = isDark ? '#94A3B8' : '#64748B'}
                >{label}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[profile.email, profile.phone, profile.location].map(v => (
                <span key={v} style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: isDark ? '#94A3B8' : '#64748B' }}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ background: 'inherit', borderTop: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #E2E8F0', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            © 2026 HP.dev
          </p>

          <motion.button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }} whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem' }}
          >
            <FiArrowUp /> Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
