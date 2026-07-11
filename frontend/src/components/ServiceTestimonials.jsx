import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { SERVICES, TESTIMONIALS } from '../data/portfolioData';
import axios from 'axios';
import { resolveImageUrl } from '../utils/adminApi';
import EmojiIcon from './EmojiIcon';

const getThemeColor = (color) => {
  return color || '#6366F1';
};

export function Services() {
  const { isDark } = useTheme();
  const [dbServices, setDbServices] = useState([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    axios.get('/api/services').then(res => {
      if (Array.isArray(res.data)) {
        setDbServices(res.data);
        setServicesLoaded(true);
      }
    }).catch(() => {});
  }, []);

  const servicesToDisplay = servicesLoaded ? dbServices : SERVICES;

  return (
    <section id="services" style={{ padding:'100px 0' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px' }}>
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'56px' }}
        >
          <span className="section-eyebrow">What I Offer</span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,3rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em' }}>
            My <span className="gradient-text">Services</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#6366F1,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap:'24px' }}>
          {servicesToDisplay.map((svc, i) => {
            const mappedColor = getThemeColor(svc.color);
            const serviceSlug = svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const targetRoute = `/service/${serviceSlug}`;
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, amount:0 }} transition={{ delay: i*0.08 }}
                whileHover={{ y:-6, boxShadow:`0 20px 50px ${mappedColor}15` }}
                style={{ padding:'30px', borderRadius:'20px', background: isDark?'rgba(255,255,255,0.02)':'#F8FAFC', border: isDark?'1px solid rgba(255,255,255,0.05)':'1px solid #E2E8F0', transition:'all 0.3s', position:'relative', overflow:'hidden' }}
              >
                <div style={{ position:'absolute', top:0, right:0, width:'120px', height:'120px', borderRadius:'50%', background:`radial-gradient(circle,${mappedColor}15,transparent 70%)`, transform:'translate(30%,-30%)', pointerEvents:'none' }} />
                <div style={{ width:'56px', height:'56px', borderRadius:'14px', background: svc.image ? 'transparent' : `${mappedColor}12`, border: svc.image ? 'none' : `1px solid ${mappedColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', overflow: 'hidden' }}>
                  {svc.image && svc.image.trim() !== '' ? (
                    <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <EmojiIcon emoji={svc.icon} size={24} color={mappedColor} />
                  )}
                </div>
                <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.1rem', color: isDark?'#F1F5F9':'#0F172A', marginBottom:'10px' }}>{svc.title}</h3>
                <p style={{ fontFamily:'Inter', fontSize:'0.9rem', lineHeight:1.7, color: isDark?'#94A3B8':'#64748B' }}>{svc.desc}</p>
                <Link 
                  to={targetRoute}
                  style={{ 
                    marginTop:'20px', 
                    display:'inline-flex', 
                    alignItems:'center', 
                    gap:'6px', 
                    color:mappedColor, 
                    fontFamily:'Poppins', 
                    fontWeight:600, 
                    fontSize:'0.82rem',
                    textDecoration:'none',
                    transition:'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  Learn more →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { isDark } = useTheme();
  const [current, setCurrent] = useState(0);
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = useState(false);

  useEffect(() => {
    axios.get('/api/testimonials')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setDbTestimonials(res.data);
          setTestimonialsLoaded(true);
        }
      })
      .catch(err => console.error("Error fetching testimonials:", err));
  }, []);

  const testimonialsToDisplay = testimonialsLoaded ? dbTestimonials.map(t => ({
    ...t,
    message: t.content || t.message
  })) : TESTIMONIALS;

  useEffect(() => {
    if (testimonialsToDisplay.length === 0) return;
    const t = setInterval(() => setCurrent(c => (c+1) % testimonialsToDisplay.length), 5000);
    return () => clearInterval(t);
  }, [testimonialsToDisplay.length]);

  const prev = () => setCurrent(c => (c-1+testimonialsToDisplay.length) % testimonialsToDisplay.length);
  const next = () => setCurrent(c => (c+1) % testimonialsToDisplay.length);

  if (testimonialsToDisplay.length === 0) return null;

  return (
    <section id="testimonials" style={{ padding:'100px 0', overflow:'hidden' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px' }}>
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'56px' }}
        >
          <span className="section-eyebrow">Client Reviews</span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,3rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em' }}>
            What People <span className="gradient-text">Say</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#6366F1,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        <div className="testimonial-wrapper" style={{ position:'relative', padding:'0 48px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-60 }}
              transition={{ duration:0.35 }}
              style={{ padding:'40px', borderRadius:'24px', background: isDark?'rgba(255,255,255,0.02)':'#F8FAFC', border: isDark?'1px solid rgba(255,255,255,0.05)':'1px solid #E2E8F0', boxShadow: isDark?'0 20px 60px rgba(0,0,0,0.3)':'0 20px 60px rgba(0,0,0,0.06)', textAlign:'center' }}
            >
              <div style={{ display:'flex', justifyContent:'center', gap:'4px', marginBottom:'20px' }}>
                {[...Array(testimonialsToDisplay[current].rating || 5)].map((_,i) => (
                  <FiStar key={i} style={{ color:'#F59E0B', fill:'#F59E0B' }} size={18} />
                ))}
              </div>
              <div style={{ fontSize:'3rem', lineHeight:1, color: testimonialsToDisplay[current].color || '#6366F1', opacity:0.3, marginBottom:'4px' }}>"</div>
              <p style={{ fontFamily:'Inter', fontSize:'1.05rem', lineHeight:1.9, color: isDark?'#CBD5E1':'#475569', fontStyle:'italic', marginBottom:'28px', maxWidth:'600px', margin:'0 auto 28px' }}>
                {testimonialsToDisplay[current].message}
              </p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px' }}>
                <img src={resolveImageUrl(testimonialsToDisplay[current].avatar) || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + testimonialsToDisplay[current].name} alt={testimonialsToDisplay[current].name}
                  style={{ width:'52px', height:'52px', borderRadius:'50%', border:`2px solid ${testimonialsToDisplay[current].color || '#6366F1'}4d` }}
                />
                <div style={{ textAlign:'left' }}>
                  <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1rem', color: isDark?'#F1F5F9':'#0F172A' }}>{testimonialsToDisplay[current].name}</p>
                  <p style={{ fontFamily:'Inter', fontSize:'0.85rem', color: testimonialsToDisplay[current].color || '#6366F1', fontWeight:600 }}>
                    {testimonialsToDisplay[current].role}{testimonialsToDisplay[current].company ? ` · ${testimonialsToDisplay[current].company}` : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-controls" style={{ display: 'contents' }}>
            <button onClick={prev} className="testimonial-btn testimonial-btn-left" style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'40px', height:'40px', borderRadius:'50%', background: isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)', border: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: isDark?'#94A3B8':'#64748B' }}>
              <FiChevronLeft />
            </button>
            <button onClick={next} className="testimonial-btn testimonial-btn-right" style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'40px', height:'40px', borderRadius:'50%', background: isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)', border: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: isDark?'#94A3B8':'#64748B' }}>
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'28px' }}>
          {testimonialsToDisplay.map((_,i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i===current?'24px':'8px', height:'8px', borderRadius:'4px', border:'none', cursor:'pointer', transition:'all 0.3s', background: i===current?(testimonialsToDisplay[current].color || '#6366F1'):'rgba(99,102,241,0.2)' }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .testimonial-wrapper {
            padding: 0 !important;
          }
          .testimonial-controls {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
          }
          .testimonial-btn {
            position: static !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
