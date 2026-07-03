import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SKILLS } from '../data/portfolioData';
import axios from 'axios';
import { FiCpu } from 'react-icons/fi';
import { getSkillIconDetails } from '../utils/skillIcons';

export default function Skills() {
  const { isDark } = useTheme();
  const [skillsData, setSkillsData] = useState(SKILLS);
  const [active, setActive] = useState('Frontend');

  useEffect(() => {
    axios.get('/api/skills').then(res => {
      if (Array.isArray(res.data)) {
        const grouped = {};
        res.data.forEach(s => {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s);
        });
        setSkillsData(grouped);
        const cats = Object.keys(grouped).filter(cat => cat.toLowerCase() !== 'uncategorized');
        if (cats.length && !cats.includes(active)) setActive(cats[0]);
      }
    }).catch(() => {});
  }, []);

  const CATEGORIES = Object.keys(skillsData).filter(cat => cat !== 'Learning' && cat.toLowerCase() !== 'uncategorized');
  const cardBg     = isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0';

  return (
    <section id="skills" style={{ padding: '100px 0', position: 'relative' }}>
      <div style={{ position:'absolute', top:0, right:0, width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position:'relative', zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'56px' }}
        >
          <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            SKILLS
          </span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,2.8rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em', lineHeight: 1.2 }}>
            My <span style={{ background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Expertise</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#8B5CF6,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true, amount:0 }} transition={{ delay:0.2 }}
          style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', marginBottom:'48px' }}
        >
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              style={{ padding:'10px 24px', borderRadius:'50px', border:'none', cursor:'pointer', fontFamily:'Poppins', fontWeight:600, fontSize:'0.85rem', transition:'all 0.25s', background: active===cat?'linear-gradient(135deg,#6366F1,#8B5CF6)':(isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)'), color: active===cat?'white':(isDark?'#94A3B8':'#64748B'), boxShadow: active===cat?'0 4px 14px rgba(99,102,241,0.35)':'none' }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills list */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="skills-container"
        >
          {(skillsData[active] || []).map((skill, i) => {
            const iconDetails = getSkillIconDetails(skill.name, isDark) || {
              icon: <FiCpu />,
              color: '#6366F1',
              glow: 'rgba(99,102,241,0.18)'
            };
            const hasCustomImage = skill.image && skill.image.trim() !== '';

            return (
              <div key={skill.name} className="skills-wrapper">
                {i > 0 && (
                  <div 
                    className="skills-divider" 
                    style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} 
                  />
                )}
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="animate-float-small"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    animationDelay: `${i * 0.2}s`,
                    minWidth: '90px'
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.2rem',
                      color: iconDetails.color,
                      filter: `drop-shadow(0 0 8px ${iconDetails.glow})`,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.filter = `drop-shadow(0 0 14px ${iconDetails.glow.replace('0.35', '0.6').replace('0.18', '0.4')})`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.filter = `drop-shadow(0 0 8px ${iconDetails.glow})`;
                    }}
                  >
                    {hasCustomImage ? (
                      <img 
                        src={skill.image} 
                        alt={skill.name} 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'contain', 
                          filter: `drop-shadow(0 0 6px ${iconDetails.glow})` 
                        }} 
                      />
                    ) : (
                      iconDetails.icon
                    )}
                  </div>
                  <span style={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 600, 
                    fontSize: '0.82rem', 
                    color: isDark ? '#94A3B8' : '#475569', 
                    textAlign: 'center', 
                    transition: 'color 0.2s' 
                  }}>
                    {skill.name}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Always learning */}
        {skillsData['Learning'] && skillsData['Learning'].length > 0 && (
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true, amount:0 }} transition={{ delay:0.4 }}
            style={{ marginTop:'64px', padding:'24px', borderRadius:'16px', background:cardBg, border:cardBorder, textAlign:'center' }}
          >
            <p style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'0.8rem', color: isDark?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'20px' }}>Always Learning</p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              {skillsData['Learning'].map(skill => {
                const iconDetails = getSkillIconDetails(skill.name, isDark) || {
                  icon: <FiCpu />,
                  color: '#6366F1',
                  glow: 'rgba(99,102,241,0.18)'
                };
                const hasCustomImage = skill.image && skill.image.trim() !== '';

                return (
                  <span key={skill.name} style={{ padding:'8px 16px', borderRadius:'20px', background: isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.03)', border: isDark?'1px solid rgba(255,255,255,0.06)':'1px solid rgba(0,0,0,0.05)', fontFamily:'Inter', fontSize:'0.82rem', color: isDark?'#94A3B8':'#64748B', fontWeight:500, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '1.05rem', color: iconDetails.color, filter: `drop-shadow(0 0 4px ${iconDetails.glow})` }}>
                      {hasCustomImage ? (
                        <img src={skill.image} alt={skill.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                      ) : (
                        iconDetails.icon
                      )}
                    </span>
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
