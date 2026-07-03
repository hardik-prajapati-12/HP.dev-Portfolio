import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';
import { PERSONAL_INFO } from '../data/portfolioData';
import axios from 'axios';

export default function Contact() {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(PERSONAL_INFO);
  const [form,   setForm]   = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      if (res.data && res.data.name) setProfile(res.data);
    }).catch(() => {});
  }, []);

  const CONTACT_INFO = [
    { icon: FiMail,   label: 'Email',    value: profile.email },
    { icon: FiPhone,  label: 'Phone',    value: profile.phone },
    { icon: FiMapPin, label: 'Location', value: profile.location },
  ];
  const SOCIAL = [
    { icon: FiGithub,   href: profile.github },
    { icon: FiLinkedin, href: profile.linkedin },
    { icon: FaXTwitter,  href: profile.twitter },
  ];


  const cardBg     = isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0';
  const inputBase  = { width:'100%', padding:'14px 16px', borderRadius:'12px', border: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #E2E8F0', background: isDark?'rgba(255,255,255,0.05)':'#FFFFFF', color: isDark?'#E2E8F0':'#1E293B', fontFamily:'Inter', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/contact', form);
      setStatus('success');
      setForm({ name:'', email:'', subject:'', message:'' });
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <section id="contact" style={{ padding:'100px 0', position:'relative' }}>
      <div style={{ position:'absolute', bottom:0, right:0, width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:'72px' }}
        >
          <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Let's Connect
          </span>
          <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,2.8rem)', marginTop:'12px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em', lineHeight: 1.2 }}>
            Get In <span style={{ background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Touch</span>
          </h2>
          <div style={{ width:'60px', height:'4px', borderRadius:'2px', background:'linear-gradient(to right,#8B5CF6,#3B82F6)', margin:'20px auto 0' }} />
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'48px', alignItems:'start' }}>

          {/* Info */}
          <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, amount:0 }} transition={{ duration:0.6, delay:0.1 }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.5rem', color: isDark?'#F1F5F9':'#0F172A', marginBottom:'16px' }}>
              Let's build something great together
            </h3>
            <p style={{ fontFamily:'Inter', fontSize:'1rem', lineHeight:1.8, color: isDark?'#94A3B8':'#64748B', marginBottom:'32px' }}>
              Whether you have a project in mind, a job opportunity, or just want to chat about technology — my inbox is always open.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'32px' }}>
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <motion.div key={label}
                  whileHover={{
                    y: -4,
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                    boxShadow: isDark ? '0 12px 30px rgba(99, 102, 241, 0.15)' : '0 12px 30px rgba(99, 102, 241, 0.08)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9'
                  }}
                  style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    gap:'16px', 
                    padding:'16px 20px', 
                    borderRadius:'14px', 
                    background:cardBg, 
                    border:cardBorder, 
                    transition:'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease' 
                  }}
                >
                  <div style={{ width:'42px', height:'42px', borderRadius:'10px', background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.12))', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366F1', flexShrink:0 }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'0.78rem', color: isDark?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'2px' }}>{label}</p>
                    <p style={{ fontFamily:'Inter', fontSize:'0.9rem', color: isDark?'#E2E8F0':'#1E293B', fontWeight:500 }}>{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {SOCIAL.map(({ icon: Icon, href }) => (
                <motion.a key={href} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ 
                    y:-3, 
                    scale:1.1,
                    color: '#6366F1',
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)'
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    width:'46px', 
                    height:'46px', 
                    borderRadius:'12px', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center', 
                    background:cardBg, 
                    border:cardBorder, 
                    color: isDark?'#94A3B8':'#64748B', 
                    textDecoration:'none',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity:0, x:40 }} 
            whileInView={{ opacity:1, x:0 }} 
            viewport={{ once:true, amount:0 }} 
            transition={{ duration:0.6, delay:0.2 }}
            whileHover={{
              y: -4,
              borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
              boxShadow: isDark ? '0 12px 30px rgba(99, 102, 241, 0.15)' : '0 12px 30px rgba(99, 102, 241, 0.08)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9'
            }}
            style={{ 
              padding:'36px', 
              borderRadius:'24px', 
              background:cardBg, 
              border:cardBorder,
              transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <form onSubmit={handleSubmit}
              style={{ display:'flex', flexDirection:'column', gap:'18px' }}
            >
              <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.2rem', color: isDark?'#F1F5F9':'#0F172A' }}>Send a Message</h3>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <input placeholder="Your Name"  name="name"  value={form.name}  onChange={handleChange} required style={inputBase} />
                <input placeholder="Your Email" name="email" type="email" value={form.email} onChange={handleChange} required style={inputBase} />
              </div>
              <input placeholder="Subject" name="subject" value={form.subject} onChange={handleChange} required style={inputBase} />
              <textarea placeholder="Your message..." name="message" value={form.message} onChange={handleChange} required rows={5}
                style={{ ...inputBase, resize:'vertical', minHeight:'120px' }}
              />

              {status === 'success' && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'10px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', color:'#6366F1', fontFamily:'Inter', fontSize:'0.9rem' }}>
                  <FiCheckCircle /> Message sent! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#EF4444', fontFamily:'Inter', fontSize:'0.9rem' }}>
                  <FiAlertCircle /> Something went wrong. Please try again.
                </div>
              )}

              <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                disabled={status==='loading'}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'15px', borderRadius:'12px', border:'none', cursor: status==='loading'?'not-allowed':'pointer', background: status==='loading'?'rgba(99,102,241,0.5)':'linear-gradient(135deg,#6366F1,#8B5CF6)', color:'white', fontFamily:'Poppins', fontWeight:700, fontSize:'0.95rem', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}
              >
                {status === 'loading' ? 'Sending...' : <><FiSend /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
