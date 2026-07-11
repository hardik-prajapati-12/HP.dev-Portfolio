import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiStar, FiCode } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { PROJECTS } from '../data/portfolioData';
import axios from 'axios';

const FALLBACK_FILTERS = [
  { label:'All', value:'all' },
  { label:'MERN', value:'mern' },
  { label:'Web Apps', value:'web' },
  { label:'Java', value:'java' },
  { label:'UI/UX', value:'ui' },
];

const fallbackCategoryColors = {
  mern: '#10B981', // green
  web: '#3B82F6',  // blue
  java: '#EF4444', // red
  ui: '#8B5CF6',   // purple
  uncategorized: '#6B7280' // gray
};

function getCategoryColor(cat, projectCategories = []) {
  const match = projectCategories.find(c => c.name.toLowerCase() === cat?.toLowerCase());
  if (match) return match.color || '#6366F1';
  return fallbackCategoryColors[cat?.toLowerCase()] || '#6366F1';
}

export default function Projects() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.1 });
  const [dbProjects, setDbProjects] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        if (res.data?.success && res.data.data?.length) {
          setDbProjects(res.data.data);
        }
      })
      .catch(err => console.error("Error fetching projects from backend:", err));
    axios.get('/api/projects/categories')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProjectCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const projectsToDisplay = dbProjects.length > 0 ? dbProjects : PROJECTS;

  const hasUncategorized = projectsToDisplay.some(p => p.category && p.category.toLowerCase() === 'uncategorized');

  const FILTERS = projectCategories.length > 0
    ? [
        { label: 'All', value: 'all' },
        ...projectCategories.map(c => ({ label: c.name, value: c.name })),
        ...(hasUncategorized ? [{ label: 'Uncategorized', value: 'Uncategorized' }] : [])
      ]
    : [
        ...FALLBACK_FILTERS,
        ...(hasUncategorized ? [{ label: 'Uncategorized', value: 'Uncategorized' }] : [])
      ];

  const filtered = filter === 'all' ? projectsToDisplay : projectsToDisplay.filter(p => p.category && p.category.toLowerCase() === filter.toLowerCase());
  const cardBg = isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0';
  const projectActionBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease, color 0.22s ease',
    minHeight: '38px'
  };
  const liftAction = (e, shadow = '0 10px 22px rgba(99,102,241,0.24)') => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = shadow;
  };
  const resetAction = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <section id="projects" ref={ref} style={{ padding:'100px 0',position:'relative',background:'inherit' }}>
      <div style={{ position:'absolute',top:0,left:0,width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)',pointerEvents:'none' }} />

      <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              PROJECTS
            </span>
            <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'clamp(2rem,4vw,2.8rem)', marginTop:'8px', color: isDark?'#F1F5F9':'#0F172A', letterSpacing:'-0.02em', lineHeight: 1.2 }}>
              Featured <span style={{ background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Projects</span>
            </h2>
          </div>
          <a href="#projects" style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', color:'#6366F1', textDecoration:'none', display:'flex', alignItems: 'center', gap: '6px' }} onMouseEnter={e => e.currentTarget.style.color = '#8B5CF6'} onMouseLeave={e => e.currentTarget.style.color = '#6366F1'}>
            View All Projects <FiExternalLink size={14} />
          </a>
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity:0 }} animate={inView?{ opacity:1 }:{}} transition={{ delay:0.2 }}
          style={{ display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap',marginBottom:'48px' }}
        >
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              style={{ padding:'10px 22px',borderRadius:'50px',border:'none',cursor:'pointer',fontFamily:'Poppins',fontWeight:600,fontSize:'0.85rem',transition:'all 0.25s',background:filter===f.value?'linear-gradient(135deg,#6366F1,#8B5CF6)':isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',color:filter===f.value?'white':isDark?'#94A3B8':'#64748B',boxShadow:filter===f.value?'0 4px 14px rgba(99,102,241,0.35)':'none' }}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div layout style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,320px),1fr))',gap:'24px' }}>
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div key={project.id || project._id} layout
                initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
                transition={{ duration:0.4, delay:i*0.08 }}
                whileHover={{ 
                  y:-6,
                  borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                  boxShadow: isDark ? '0 20px 40px rgba(99, 102, 241, 0.15)' : '0 20px 40px rgba(99, 102, 241, 0.08)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC'
                }}
                style={{ 
                  borderRadius:'20px',
                  background:cardBg,
                  border:cardBorder,
                  overflow:'hidden',
                  cursor:'pointer',
                  transition:'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                  boxShadow:isDark?'0 4px 20px rgba(0,0,0,0.3)':'0 4px 20px rgba(0,0,0,0.06)' 
                }}
                onClick={() => navigate(`/project/${project._id || project.id}`)}
              >
                <div style={{ position:'relative',overflow:'hidden',height:'200px' }}>
                  <img src={project.image} alt={project.title} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s ease' }}
                    onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)' }} />
                  {project.featured && (
                    <div style={{ position:'absolute',top:'12px',left:'12px',padding:'4px 12px',borderRadius:'20px',background:'rgba(245,158,11,0.95)',color:'white',fontSize:'0.7rem',fontWeight:700,display:'flex',alignItems:'center',gap:'4px' }}>
                      <FiStar size={10} /> Featured
                    </div>
                  )}
                  <div style={{ position:'absolute',bottom:'12px',left:'12px',padding:'3px 10px',borderRadius:'6px',background:`${getCategoryColor(project.category, projectCategories)}CC`,color:'white',fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em' }}>
                    {project.category}
                  </div>
                </div>

                <div style={{ padding:'22px' }}>
                  <h3 style={{ fontFamily:'Poppins',fontWeight:700,fontSize:'1.1rem',color:isDark?'#F1F5F9':'#0F172A',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    {project.title}
                    <FiExternalLink size={14} style={{ color: '#6366F1' }} />
                  </h3>
                  <p style={{ fontFamily:'Inter',fontSize:'0.88rem',lineHeight:1.7,color:isDark?'#94A3B8':'#64748B',marginBottom:'16px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{project.description}</p>

                  <div style={{ display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px' }}>
                    {project.technologies.slice(0,4).map(t => (
                      <span key={t} style={{ padding:'4px 12px',borderRadius:'20px',background:isDark?'rgba(99,102,241,0.08)':'rgba(99,102,241,0.05)',color:'#6366F1',fontSize:'0.75rem',fontWeight:600,border:'1px solid rgba(99,102,241,0.15)' }}>{t}</span>
                    ))}
                    {project.technologies.length > 4 && <span style={{ padding:'4px 12px',borderRadius:'20px',background:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.04)',color:isDark?'#94A3B8':'#64748B',fontSize:'0.75rem',fontWeight:600 }}>+{project.technologies.length-4}</span>}
                  </div>

                  <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
                    {project.showGithub !== false && project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        style={{ ...projectActionBase, background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',border:isDark?'1px solid rgba(255,255,255,0.08)':'1px solid #E2E8F0',color:isDark?'#CBD5E1':'#475569' }}
                        onMouseEnter={e => {
                          liftAction(e, isDark ? '0 10px 24px rgba(0,0,0,0.28)' : '0 10px 24px rgba(15,23,42,0.12)');
                          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)';
                          e.currentTarget.style.color = '#6366F1';
                          e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)';
                        }}
                        onMouseLeave={e => {
                          resetAction(e);
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
                          e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569';
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
                        }}
                      ><FiGithub size={14} /> GitHub</a>
                    )}
                    {project.showLive !== false && project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        style={{ ...projectActionBase, background:'linear-gradient(135deg,#6366F1,#8B5CF6)',color:'white',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'0 4px 14px rgba(99,102,241,0.18)' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.36)';
                          e.currentTarget.style.background = 'linear-gradient(135deg,#4F46E5,#7C3AED)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.18)';
                          e.currentTarget.style.background = 'linear-gradient(135deg,#6366F1,#8B5CF6)';
                        }}
                      ><FiExternalLink size={14} /> Live</a>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/project/${project._id || project.id}`); }}
                      style={{ ...projectActionBase, background:'transparent',border:'1px solid rgba(99,102,241,0.3)',color:'#6366F1' }}
                      onMouseEnter={e => {
                        liftAction(e);
                        e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
                      }}
                      onMouseLeave={e => {
                        resetAction(e);
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                      }}
                    ><FiCode size={14} /> Details</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
