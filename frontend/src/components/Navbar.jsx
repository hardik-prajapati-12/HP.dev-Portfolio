import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiDownload, FiLock, FiGrid } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAdminSession } from '../context/AdminSessionContext';
import { PERSONAL_INFO } from '../data/portfolioData';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ visibleSections }) {
  const { isDark, toggleTheme } = useTheme();
  const { isAdmin, canShowAdminAccess, checking } = useAdminSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');

  const visible = visibleSections || {};
  const activeLinks = navLinks.filter(link => {
    const key = link.label.toLowerCase();
    if (key === 'home') return true;
    return visible[key] !== false;
  });
  const [indicator, setIndicator] = useState({ left: 0 });
  const navRef = useRef(null);
  const linkRefs = useRef({});
  const manualNavRef = useRef(false);
  const manualTimeoutRef = useRef(null);

  const showAdminLogin = !checking && !isAdmin && canShowAdminAccess;
  const showAdminDashboard = !checking && isAdmin;

  const adminBtnStyle = {
    textDecoration: 'none', padding: '8px 16px', borderRadius: '8px',
    border: isDark ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(99,102,241,0.25)',
    background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
    color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem',
    display: 'flex', alignItems: 'center', gap: '7px',
  };
  const dashboardBtnStyle = {
    ...adminBtnStyle, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    border: 'none', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (manualNavRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          if (scrollPosition < 100) {
            setActive('#home');
            ticking = false;
            return;
          }

          if (windowHeight + scrollPosition >= documentHeight - 80) {
            setActive('#contact');
            ticking = false;
            return;
          }

          const sections = activeLinks.map(link => {
            const el = document.querySelector(link.href);
            if (!el) return null;
            return { id: link.href, offsetTop: el.offsetTop };
          }).filter(Boolean);

          const offset = 220;
          let currentSection = '#home';

          for (const section of sections) {
            if (scrollPosition + offset >= section.offsetTop) {
              currentSection = section.id;
            }
          }

          setActive(currentSection);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeLink = linkRefs.current[active];
      if (!activeLink || !navRef.current) return;

      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - navRect.left + linkRect.width / 2 - 3,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [active]);

  const navBg = isDark
    ? scrolled ? 'rgba(3,7,18,0.85)' : 'transparent'
    : scrolled ? 'rgba(255,255,255,0.85)' : 'transparent';

  const linkColor = isDark ? '#94A3B8' : '#64748B';
  const linkHoverColor = isDark ? '#FFFFFF' : '#0F172A';
  const linkActiveColor = isDark ? '#FFFFFF' : '#0F172A';

  const handleNavLinkClick = (event, href) => {
    event.preventDefault();
    if (manualTimeoutRef.current) {
      clearTimeout(manualTimeoutRef.current);
    }

    manualNavRef.current = true;
    manualTimeoutRef.current = window.setTimeout(() => {
      manualNavRef.current = false;
      manualTimeoutRef.current = null;
    }, 650);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = href;
    }

    setActive(href);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <>


      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position:'fixed',top:0,left:0,right:0,zIndex:9998,backdropFilter:'blur(16px)',background:navBg,
          boxShadow:scrolled?'0 4px 30px rgba(0,0,0,0.15)':'none',
          borderBottom:scrolled?(isDark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(0,0,0,0.08)'):'none',
          transition:'all 0.3s',
          '--navbar-link-color': linkColor,
          '--navbar-link-hover-color': linkHoverColor,
          '--navbar-link-active-color': linkActiveColor,
        }}
      >
        <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'72px' }}>
          {/* Logo */}
          <motion.a href="#home" whileHover={{ scale: 1.02 }} style={{ display:'flex',alignItems:'center',textDecoration:'none' }}>
            <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '100px', objectFit: 'contain', marginLeft: '-25px' }} />
          </motion.a>

          {/* Desktop nav */}
          <div style={{ display:'flex',alignItems:'center',gap:'32px',position:'relative' }} className="hidden-mobile" ref={navRef}>
            {activeLinks.map(({ href, label }) => (
              <a key={href} href={href}
                ref={(element) => { linkRefs.current[href] = element; }}
                onClick={(event) => handleNavLinkClick(event, href)}
                className={`navbar-link ${active === href ? 'navbar-link-active' : ''}`}
                style={{ textDecoration:'none',fontFamily:'Poppins',fontWeight:500,fontSize:'0.88rem',position:'relative',paddingBottom:'8px',transition:'color 0.2s' }}
              >
                {label}
              </a>
            ))}

            <motion.div
              className="navbar-dot"
              animate={{ left: indicator.left }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ position:'absolute',bottom:'-6px',width:'6px',height:'6px',borderRadius:'50%',background:'#6366F1' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
            {showAdminDashboard && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden-mobile">
                <Link to="/admin" style={dashboardBtnStyle} title="Admin Dashboard"><FiGrid size={14} /> Dashboard</Link>
              </motion.div>
            )}
            {showAdminLogin && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden-mobile">
                <Link to="/admin" style={adminBtnStyle} title="Admin Login"><FiLock size={14} /> Admin</Link>
              </motion.div>
            )}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
              style={{ width:'40px',height:'40px',borderRadius:'50%',border:isDark?'1px solid rgba(255,255,255,0.1)':'1px solid rgba(0,0,0,0.1)',background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:isDark?'#6366F1':'#0F172A',transition:'all 0.2s' }}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>

            <motion.a href={PERSONAL_INFO.resumeUrl || '#'} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ textDecoration:'none',padding:'8px 18px',borderRadius:'8px',border:isDark?'1px solid rgba(255,255,255,0.15)':'1px solid rgba(0,0,0,0.12)',background:'transparent',color:isDark?'#F3F4F6':'#0F172A',fontFamily:'Poppins',fontWeight:600,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:'8px' }}
              className="hidden-mobile"
            >
              Resume <FiDownload size={14} />
            </motion.a>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:'none',background:'none',border:'none',cursor:'pointer',color:isDark?'#E2E8F0':'#1E293B' }} className="show-mobile">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}
            style={{ position:'fixed',top:'72px',left:0,right:0,zIndex:9997,padding:'24px',background:isDark?'rgba(3,7,18,0.97)':'rgba(255,255,255,0.97)',backdropFilter:'blur(20px)',borderBottom:isDark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(0,0,0,0.08)' }}
          >
            {activeLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={(event) => handleNavLinkClick(event, href)}
                className={`navbar-link ${active === href ? 'navbar-link-active' : ''}`}
                style={{ display:'block',padding:'14px 0',textDecoration:'none',fontFamily:'Poppins',fontWeight:500,fontSize:'1.1rem',borderBottom:isDark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(0,0,0,0.05)',position:'relative',transition:'color 0.2s' }}
              >
                {label}
              </a>
            ))}

            {showAdminDashboard && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                style={{ display:'flex',alignItems:'center',gap:'8px',padding:'14px 0',textDecoration:'none',fontFamily:'Poppins',fontWeight:600,fontSize:'1.05rem',color:'#6366F1',borderBottom:isDark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(0,0,0,0.05)' }}>
                <FiGrid size={16} /> Dashboard
              </Link>
            )}
            {showAdminLogin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                style={{ display:'flex',alignItems:'center',gap:'8px',padding:'14px 0',textDecoration:'none',fontFamily:'Poppins',fontWeight:600,fontSize:'1.05rem',color:'#6366F1',borderBottom:isDark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(0,0,0,0.05)' }}>
                <FiLock size={16} /> Admin Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px) { .hidden-mobile{display:none!important} .show-mobile{display:flex!important} }
        @media(min-width:769px) { .show-mobile{display:none!important} }
      `}</style>
    </>
  );
}
