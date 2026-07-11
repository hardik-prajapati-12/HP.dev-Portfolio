import { motion } from 'framer-motion';
import CountUpModule from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FiCode, FiPhone } from 'react-icons/fi';
import EmojiIcon from './EmojiIcon';
import { useTheme } from '../context/ThemeContext';
import { PERSONAL_INFO, STATS, EDUCATION } from '../data/portfolioData';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CountUp = typeof CountUpModule === 'function' ? CountUpModule : (CountUpModule.default || CountUpModule);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function ProfilePhotoShowcase({ profile, isDark, inView }) {
  const avatarSrc = profile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hardik&backgroundColor=0F172A';

  // The card bg must be very close to black so the photo's black bg blends naturally
  const cardBgColor = '#070B14';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: 2 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      style={{
        position: 'relative', gridColumn: 'span 2', borderRadius: '20px', overflow: 'hidden',
        minHeight: '460px', background: `linear-gradient(180deg, ${cardBgColor} 0%, #030712 100%)`,
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(99,102,241,0.12)',
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.45)' : '0 20px 40px rgba(99,102,241,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="profile-photo-showcase"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = isDark ? '0 28px 60px rgba(99,102,241,0.3)' : '0 28px 60px rgba(99,102,241,0.2)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isDark ? '0 20px 50px rgba(0,0,0,0.45)' : '0 20px 40px rgba(99,102,241,0.08)';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.12)';
      }}
    >
      {/* Decorative glow behind the person */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Dot pattern */}
      <div style={{ position: 'absolute', top: '18%', right: '8%', width: '120px', height: '160px', opacity: 0.35, backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.55) 1.2px, transparent 1.2px)', backgroundSize: '16px 16px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Faded "Developer" text */}
      <div style={{ position: 'absolute', left: '-8px', top: '38%', transform: 'translateY(-50%)', fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', lineHeight: 1, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', opacity: 0.22, userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>Developer</div>


      {/* Floating code icon */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', left: '15%', top: '32%', width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(99,102,241,0.25)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.2)', zIndex: 4 }}>
        <FiCode size={22} color="#A78BFA" />
      </motion.div>

      {/* Floating experience badge */}
      {profile.yearsExp && profile.yearsExp > 0 && (
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ position: 'absolute', right: '12%', top: '15%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.35)', zIndex: 4 }}>
          <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.25rem', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
            {profile.yearsExp}+
          </span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
            Years Exp
          </span>
        </motion.div>
      )}

      {/* ── Profile Photo (large, centered at bottom) ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2 }}>
        <img
          src={avatarSrc}
          alt={profile.name}
          style={{
            width: 'min(85%, 380px)',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            position: 'relative',
          }}
        />
      </div>

      {/* ── Edge blending gradients (fade photo edges into card bg) ── */}
      {/* Left fade */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '25%', background: `linear-gradient(to right, ${cardBgColor} 0%, transparent 100%)`, zIndex: 3, pointerEvents: 'none' }} />
      {/* Right fade */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '25%', background: `linear-gradient(to left, ${cardBgColor} 0%, transparent 100%)`, zIndex: 3, pointerEvents: 'none' }} />
      {/* Top fade */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: `linear-gradient(to bottom, ${cardBgColor} 0%, transparent 100%)`, zIndex: 3, pointerEvents: 'none' }} />
      {/* Bottom fade (stronger, for name overlay) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', background: `linear-gradient(to top, ${cardBgColor} 0%, ${cardBgColor}dd 30%, transparent 100%)`, zIndex: 3, pointerEvents: 'none' }} />

      {/* ── Name & Title overlay ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 24px 22px', zIndex: 5 }}>
        <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.1rem', color: '#F1F5F9', margin: 0 }}>{profile.name}</p>
        <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>{profile.title}</p>
      </div>

      {/* Decorative circle */}
      <div style={{ position: 'absolute', top: '45%', right: '15%', width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.35)', zIndex: 4, pointerEvents: 'none' }} />
    </motion.div>
  );
}

export default function About() {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0 });
  const [profile, setProfile] = useState(PERSONAL_INFO);
  const [education, setEducation] = useState([]);
  const [eduLoaded, setEduLoaded] = useState(false);
  const [stats, setStats] = useState([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      if (res.data && res.data.name) setProfile(res.data);
    }).catch(() => { });
    axios.get('/api/education').then(res => {
      if (Array.isArray(res.data)) {
        setEducation(res.data);
        setEduLoaded(true);
      }
    }).catch(() => { });
    axios.get('/api/stats').then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setStats(res.data);
        setStatsLoaded(true);
      }
    }).catch(() => { });
  }, []);

  const educationToDisplay = eduLoaded ? education : EDUCATION;
  const statsToDisplay = statsLoaded ? stats : STATS;

  const cardBg = isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0';

  // Card descriptions corresponding to stats
  const statDescriptions = {
    "Projects Completed": "Delivering high-quality, scalable, and responsive web applications.",
    "Technologies Mastered": "Proficient across the full stack, from frontend frameworks to databases.",
    "Certifications": "Validated expertise from leading cloud providers and technology partners.",
    "Problems Solved": "Strong foundation in data structures, algorithms, and logical reasoning."
  };

  const statColors = ["#6366F1", "#3B82F6", "#8B5CF6", "#EC4899"];

  return (
    <section id="about" ref={ref} style={{ padding: '100px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

          {/* Left Column — Bio & Education */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ABOUT ME
            </span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: isDark ? '#F1F5F9' : '#0F172A', letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: 1.2 }}>
              Crafting Solutions with <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Code</span>
            </h2>

            <p style={{ fontFamily: 'Inter', fontSize: '1rem', lineHeight: 1.8, color: isDark ? '#94A3B8' : '#475569', marginBottom: '32px', whiteSpace: 'pre-line' }}>
              {profile.bio || PERSONAL_INFO.bio}
            </p>

            <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 26px', borderRadius: '8px', border: isDark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '40px', transition: 'all 0.2s' }}
            >
              <FiPhone size={15} /> More About Me
            </motion.a>

            {/* Education sub-list */}
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '16px' }}>Education</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {educationToDisplay.map((edu, i) => (
                <div key={i} className="education-card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: cardBg,
                  border: isDark
                    ? `1px solid ${edu.color || '#6366F1'}12`
                    : `1px solid ${edu.color || '#6366F1'}22`,
                }}>
                  {edu.image && edu.image.trim() !== '' ? (
                    <img src={edu.image} alt={edu.degree} style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }} />
                  ) : (
                    <span style={{ minWidth: '30px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}><EmojiIcon emoji={edu.icon} size={20} color={edu.color || '#10B981'} /></span>
                  )}
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>{edu.degree}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: isDark ? '#94A3B8' : '#64748B' }}>{edu.institution} · {edu.year}</p>
                  </div>
                  {(edu.currentlyPursuing || edu.grade) && (
                    <div style={{
                      marginLeft: 'auto',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: isDark
                        ? `${edu.color || '#6366F1'}15`
                        : `${edu.color || '#6366F1'}08`,
                      color: edu.color || '#6366F1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `1px solid ${edu.color || '#6366F1'}20`,
                      whiteSpace: 'nowrap'
                    }}>
                      {edu.currentlyPursuing ? 'Pursuing' : edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Profile Photo & 2x2 Stats Feature Grid */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}
            className="about-stats-grid"
          >
            <ProfilePhotoShowcase profile={profile} isDark={isDark} inView={inView} />

            {statsToDisplay.map((stat, i) => {
              const color = statColors[i % statColors.length];
              return (
                <div key={i} className="stat-card"
                  style={{ padding: '28px 24px', borderRadius: '16px', background: cardBg, border: cardBorder, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', transition: 'all 0.25s' }}
                >
                  {/* Icon container */}
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: stat.image ? 'transparent' : `${color}12`, border: stat.image ? 'none' : `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {stat.image && stat.image.trim() !== '' ? (
                      <img src={stat.image} alt={stat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <EmojiIcon emoji={stat.icon} size={20} color={color} />
                    )}
                  </div>

                  {/* Title / Stat Value */}
                  <div>
                    <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: isDark ? '#F1F5F9' : '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {inView ? <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} /> : `0${stat.suffix}`}
                    </h4>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: isDark ? '#F3F4F6' : '#0F172A', marginTop: '2px' }}>
                      {stat.label}
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5 }}>
                    {stat.description || statDescriptions[stat.label] || "Experienced and dedicated to deliver exceptional and scalable digital solutions."}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>

      <style>{`
        .education-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .education-card:hover {
          transform: translateY(-4px);
          box-shadow: ${isDark ? '0 12px 32px rgba(99,102,241,0.2)' : '0 12px 32px rgba(99,102,241,0.12)'};
          border-color: rgba(99,102,241,0.4);
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: ${isDark ? '0 16px 40px rgba(99,102,241,0.25)' : '0 16px 40px rgba(99,102,241,0.15)'};
          border-color: rgba(99,102,241,0.5);
        }

        .profile-photo-showcase {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-photo-showcase:hover {
          transform: translateY(-8px);
          box-shadow: ${isDark ? '0 20px 50px rgba(99,102,241,0.25)' : '0 20px 50px rgba(99,102,241,0.15)'};
          border-color: rgba(99,102,241,0.4);
        }

        .about-grid {
          grid-template-columns: 1fr 1.1fr!important;
        }
        @media (max-width: 991px) {
          .about-grid {
            grid-template-columns: 1fr!important;
            gap: 48px!important;
          }
          .about-stats-grid {
            grid-template-columns: 1fr!important;
          }
          .profile-photo-showcase {
            min-height: 360px!important;
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
