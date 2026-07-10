import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { EXPERIENCE, CERTIFICATIONS, ACHIEVEMENTS } from '../data/portfolioData';
import axios from 'axios';
import EmojiIcon from './EmojiIcon';

export function Experience() {
  const { isDark } = useTheme();
  const [dbExperience, setDbExperience] = useState([]);
  const [experienceLoaded, setExperienceLoaded] = useState(false);

  useEffect(() => {
    axios.get('/api/experience').then(res => {
      if (Array.isArray(res.data)) {
        setDbExperience(res.data);
        setExperienceLoaded(true);
      }
    }).catch(() => {});
  }, []);

  const experienceToDisplay = experienceLoaded ? dbExperience : EXPERIENCE;
  const cardBg     = isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0';

  return (
    <section id="experience" style={{ padding:'100px 0' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px' }}>
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'72px' }}
        >
          <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Career Path
          </span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,2.8rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em', lineHeight: 1.2 }}>
            Work <span style={{ background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Experience</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#8B5CF6,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        <div style={{ position:'relative' }}>
          {/* Vertical timeline line */}
          <div style={{ position:'absolute', left:'24px', top:0, bottom:0, width:'2px', background:'linear-gradient(to bottom,transparent,#6366F1,#3B82F6,transparent)' }} />

          <div style={{ display:'flex', flexDirection:'column', gap:'36px' }}>
            {experienceToDisplay.map((exp, i) => (
              <motion.div key={i}
                initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true, amount:0 }} transition={{ delay: i*0.12, duration:0.5 }}
                style={{ display:'flex', gap:'32px', paddingLeft:'70px', position:'relative' }}
              >
                {/* Timeline dot */}
                <div style={{ position:'absolute', left:'12px', top:'20px', width:'26px', height:'26px', borderRadius:'50%', background: exp.image ? 'transparent' : `linear-gradient(135deg, ${exp.color || '#6366F1'}, #3B82F6)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: exp.image ? 'none' : `0 0 15px ${exp.color || '#6366F1'}66`, zIndex:2, overflow: 'hidden' }}>
                  {exp.image && exp.image.trim() !== '' ? (
                    <img src={exp.image} alt={exp.company} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <EmojiIcon emoji={exp.icon} size={13} color="#FFF" />
                  )}
                </div>

                <motion.div whileHover={{ y:-3, boxShadow: isDark?'0 12px 40px rgba(99,102,241,0.08)':'0 12px 40px rgba(99,102,241,0.05)' }}
                  style={{ flex:1, padding:'24px', borderRadius:'16px', background:cardBg, border:cardBorder, transition:'all 0.25s' }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px', marginBottom:'14px' }}>
                    <div>
                      <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.1rem', color: isDark?'#F1F5F9':'#0F172A' }}>{exp.title}</h3>
                      <p style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', color: exp.color || '#6366F1' }}>{exp.company}</p>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                      <span style={{ padding:'3px 12px', borderRadius:'20px', background: `${exp.color || '#6366F1'}14`, color: exp.color || '#6366F1', fontSize:'0.78rem', fontWeight:700, border: `1px solid ${exp.color || '#6366F1'}26` }}>{exp.year}</span>
                      {exp.type && exp.type !== '-' && (
                        <span style={{ padding:'2px 10px', borderRadius:'10px', background: isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.03)', color: isDark?'#94A3B8':'#64748B', fontSize:'0.72rem', fontWeight:600, textTransform:'capitalize' }}>{exp.type}</span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontFamily:'Inter', fontSize:'0.9rem', lineHeight:1.8, color: isDark?'#94A3B8':'#475569', marginBottom:'16px' }}>{exp.description}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {exp.tech.map(t => (
                      <span key={t} style={{ padding:'4px 12px', borderRadius:'20px', background:'rgba(59,130,246,0.08)', color:'#3B82F6', fontSize:'0.75rem', fontWeight:600, border:'1px solid rgba(59,130,246,0.15)' }}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Certifications() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const cardBg     = isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0';
  const [dbAchievements, setDbAchievements] = useState([]);
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);
  const [dbCerts, setDbCerts] = useState([]);
  const [certsLoaded, setCertsLoaded] = useState(false);

  useEffect(() => {
    axios.get('/api/achievements').then(res => {
      if (Array.isArray(res.data)) {
        setDbAchievements(res.data);
        setAchievementsLoaded(true);
      }
    }).catch(() => {});
  }, []);

  const achievementsToDisplay = achievementsLoaded ? dbAchievements : ACHIEVEMENTS;

  useEffect(() => {
    axios.get('/api/certifications')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setDbCerts(res.data);
          setCertsLoaded(true);
        }
      })
      .catch(err => console.error("Error fetching certifications:", err));
  }, []);

  const certsToDisplay = certsLoaded ? dbCerts.map(c => ({
    ...c,
    year: c.year || (c.date ? new Date(c.date).getFullYear().toString() : '2024'),
    color: c.color || '#6366F1',
    badge: c.badge || '🏆'
  })) : CERTIFICATIONS;

  return (
    <section id="certifications" style={{ padding:'100px 0' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px' }}>
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'56px' }}
        >
          <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Recognition
          </span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,2.8rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em', lineHeight: 1.2 }}>
            Certifications & <span style={{ background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Achievements</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#8B5CF6,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px', marginBottom:'56px' }}>
          {certsToDisplay.map((cert, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0 }} transition={{ delay: i*0.08 }}
              whileHover={{ y:-4, boxShadow:'0 16px 40px rgba(99,102,241,0.08)' }}
              onClick={() => navigate(`/recognition/certification/${cert._id || i}`)}
              style={{ padding:'22px', borderRadius:'16px', background:cardBg, border:cardBorder, display:'flex', gap:'16px', alignItems:'flex-start', transition:'all 0.25s', cursor:'pointer' }}
            >
              <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:cert.logo?'transparent':`${cert.color || '#6366F1'}15`, border:cert.logo?'none':`1px solid ${cert.color || '#6366F1'}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                {cert.logo ? (
                  <img src={cert.logo} alt={cert.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <EmojiIcon emoji={cert.badge} size={22} color={cert.color} />
                )}
              </div>
              <div style={{ flex:1 }}>
                <h4 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'0.92rem', color: isDark?'#F1F5F9':'#0F172A', marginBottom:'4px' }}>{cert.title}</h4>
                <p style={{ fontFamily:'Inter', fontSize:'0.8rem', color: isDark?'#94A3B8':'#64748B', marginBottom:'8px' }}>{cert.issuer}</p>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <span style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'0.78rem', color:cert.color || '#6366F1' }}>{cert.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.5rem', color: isDark?'#F1F5F9':'#0F172A', marginBottom:'24px', textAlign:'center' }}>
          Notable Achievements
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
          {achievementsToDisplay.map((ach, i) => {
            const achColor = ach.color || '#8B5CF6';
            return (
              <motion.div key={i}
                initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true, amount:0 }} transition={{ delay: 0.3+i*0.08 }}
                whileHover={{ y:-4, boxShadow:`0 16px 40px ${achColor}1f` }}
                onClick={() => navigate(`/recognition/achievement/${ach._id || i}`)}
                style={{ padding:'24px', borderRadius:'16px', background: isDark ? `linear-gradient(135deg, ${achColor}0d, ${achColor}02)` : `linear-gradient(135deg, ${achColor}08, ${achColor}02)`, border: isDark ? `1px solid ${achColor}25` : `1px solid ${achColor}30`, textAlign:'center', transition:'all 0.25s', cursor:'pointer' }}
              >
                {ach.image ? (
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:'12px' }}>
                    <img src={ach.image} alt={ach.title} style={{ width:'56px', height:'56px', borderRadius:'12px', objectFit:'cover', border:`1.5px solid ${achColor}40` }} />
                  </div>
                ) : (
                  <div style={{ marginBottom:'12px', height:'56px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <EmojiIcon emoji={ach.icon} size={32} color={achColor} />
                  </div>
                )}
                <div style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.5rem', color: achColor, marginBottom:'6px' }}>{ach.value}</div>
                <h4 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'0.9rem', color: isDark?'#F1F5F9':'#0F172A', marginBottom:'6px' }}>{ach.title}</h4>
                <p style={{ fontFamily:'Inter', fontSize:'0.8rem', color: isDark?'#94A3B8':'#64748B', lineHeight:1.5 }}>{ach.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
