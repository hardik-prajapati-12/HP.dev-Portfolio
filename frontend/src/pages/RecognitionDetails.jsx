import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAward, FiCalendar, FiCheckCircle, FiExternalLink, FiShield, FiTarget, FiCpu, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { CERTIFICATIONS, ACHIEVEMENTS } from '../data/portfolioData';
import axios from 'axios';
import EmojiIcon from '../components/EmojiIcon';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';
// Helper to provide descriptive details and skills if db items are missing them
const FALLBACK_INFO = {
  certifications: {
    'AWS Certified Developer – Associate': {
      description: "AWS Certified Developer - Associate showcases key technical expertise in designing, building, and deploying secure, robust, and scalable applications on the Amazon Web Services platform. It validates the capability to write applications using AWS service APIs, write infrastructure-as-code using AWS CloudFormation, configure CI/CD pipelines, and implement cloud security best practices.",
      skills: "Cloud Architecture, AWS Serverless, Lambda, DynamoDB, CloudFormation, CI/CD, IAM Security, API Gateway"
    },
    'MongoDB Certified Developer': {
      description: "MongoDB Certified Developer Associate validates the key developer skills required to build applications using MongoDB. It covers data modeling patterns, indexing strategies, aggregation pipeline construction, CRUD operations optimization, and understanding the core mechanics of document storage under write and read concern configurations.",
      skills: "Document Modeling, Indexing, Aggregation Framework, Mongoose, NoSQL Architecture, Query Optimization"
    },
    'Meta React Developer Certificate': {
      description: "Issued by Meta through Coursera, this certification validates core frontend engineering principles, advanced React hooks, responsive web layouts, custom component designs, client-side routing structures, and state management optimization. It includes designing full-fledged reactive client-side interfaces and testing components using Jest and React Testing Library.",
      skills: "React.js, React Hooks, Frontend Design, State Management, Routing, Component Testing, CSS Frameworks"
    },
    'Node.js Application Developer': {
      description: "The OpenJS Node.js Application Developer (JSNAD) certificate validates competency in creating server-side applications, writing RESTful routers, configuring security measures, handling asynchronous operations, managing stream buffers, and integrating database connections using the official Node.js runtime and Express framework.",
      skills: "Node.js, Express.js, Asynchronous Programming, REST APIs, Stream Buffers, Event Loop, Server Security"
    },
    'Google Cloud Professional': {
      description: "Google Cloud Professional developer credentials validate the capabilities to design, build, and manage cloud-native developer applications on Google Cloud Platform. It verifies familiarity with Google Kubernetes Engine (GKE), Google Cloud Functions, Cloud Run, Firestore, BigQuery, and implementing secure cloud IAM policies.",
      skills: "Google Cloud Platform, Kubernetes (GKE), Serverless Compute, Cloud Run, IAM Policies, Firestore, Cloud Monitoring"
    },
    'Java SE 11 Developer': {
      description: "Oracle Java SE 11 Professional Certification demonstrates deep understanding of Java syntax, object-oriented design principles, functional interfaces, lambda expressions, stream API processing, concurrency frameworks, modules design, and database interaction using JDBC APIs.",
      skills: "Java 11, Object-Oriented Programming, Functional Programming, Java Streams, Concurrency, JDBC, Module System"
    }
  },
  achievements: {
    'Hackathon Winner': {
      details: "Achieved first place out of 200 competing developer teams in the annual TechHack 2023 Hackathon. Designed and built a fully functional MERN stack cooperative platform with real-time analytics in a high-pressure, 36-hour sprint.",
      skills: "Rapid Prototyping, Team Leadership, Full-Stack Architecture, Presentation, Real-time WebSockets"
    },
    'Open Source Stars': {
      details: "Earned more than 500 stars across various personal open-source GitHub repositories. Published reusable React components, custom Hooks, and Node.js middleware modules designed to help developers solve everyday logic problems.",
      skills: "Open Source, Git/GitHub, Library Design, Code Documentation, Package Maintenance"
    },
    'LeetCode Rank': {
      details: "Solved over 500 algorithm problems covering arrays, dynamic programming, graph traversal, greedy choices, and search methodologies, ranking in the top 5% of global competitors on LeetCode.",
      skills: "Data Structures, Algorithms, Problem Solving, Computational Complexity, Code Optimization"
    },
    'Published Articles': {
      details: "Authored and published over 15 high-quality technical articles on Medium and dev.to focused on JavaScript, React optimization, and backend architectures, collectively earning over 10K reads globally.",
      skills: "Technical Writing, Code Explanation, Developer Relations, Blogging, SEO Content"
    }
  }
};

export default function RecognitionDetails() {
  const { type, id } = useParams(); // type: 'certification' | 'achievement', id: mongoId or static index
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [siblings, setSiblings] = useState([]);

  // Fetch sibling list for sidebar navigation
  useEffect(() => {
    const fetchSiblings = async () => {
      try {
        const endpoint = type === 'certification' ? '/api/certifications' : '/api/achievements';
        const res = await axios.get(endpoint);
        if (Array.isArray(res.data)) {
          setSiblings(res.data);
        } else {
          setSiblings(type === 'certification' ? CERTIFICATIONS : ACHIEVEMENTS);
        }
      } catch (err) {
        setSiblings(type === 'certification' ? CERTIFICATIONS : ACHIEVEMENTS);
      }
    };
    fetchSiblings();
  }, [type]);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      
      if (isMongoId) {
        try {
          const endpoint = type === 'certification' ? `/api/certifications/${id}` : `/api/achievements/${id}`;
          const res = await axios.get(endpoint);
          if (res.data) {
            setItem(res.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Failed fetching from DB, falling back to static lookup:", err);
        }
      }
      
      // Fallback: search by index or by matching title
      const staticList = type === 'certification' ? CERTIFICATIONS : ACHIEVEMENTS;
      let found = null;
      
      if (!isNaN(id)) {
        found = staticList[parseInt(id, 10)];
      } else {
        found = staticList.find(x => x.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id);
      }

      if (found) {
        // Hydrate details and skills if missing in mock data
        const titleKey = found.title;
        const extraInfo = FALLBACK_INFO[type === 'certification' ? 'certifications' : 'achievements']?.[titleKey] || {};
        setItem({
          ...found,
          _id: id,
          description: found.description || found.desc || extraInfo.description || extraInfo.details || '',
          details: found.details || found.desc || extraInfo.details || extraInfo.description || '',
          skills: found.skills || extraInfo.skills || '',
          year: found.year || (found.date ? new Date(found.date).getFullYear().toString() : '2023')
        });
      } else {
        setItem(null);
      }
      setLoading(false);
    };

    fetchItem();
  }, [type, id]);

  if (loading && !item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#030712' : '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Poppins', textAlign: 'center', background: isDark ? '#030712' : '#F8FAFC', padding: '24px' }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Recognition Item Not Found</h1>
        <p style={{ color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px' }}>The item you are looking for does not exist or has been removed.</p>
        <Link to="/" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>Go Back Home</Link>
      </div>
    );
  }

  const themeColor = item.color || '#6366F1';
  const badgeVal = item.badge || item.icon || '🏆';
  
  // Format dates / years
  const displayYear = item.year || (item.date ? new Date(item.date).getFullYear().toString() : '2023');
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  // Extract skills string
  const skillsArray = typeof item.skills === 'string' && item.skills.trim()
    ? item.skills.split(',').map(s => s.trim())
    : (FALLBACK_INFO[type === 'certification' ? 'certifications' : 'achievements']?.[item.title]?.skills?.split(',').map(s => s.trim()) || []);

  const descText = item.description || item.details || item.desc || FALLBACK_INFO[type === 'certification' ? 'certifications' : 'achievements']?.[item.title]?.description || FALLBACK_INFO[type === 'certification' ? 'certifications' : 'achievements']?.[item.title]?.details || 'Detailed description is currently being updated.';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#F8FAFC', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Inter', transition: 'all 0.3s' }}>
      
      {/* Background ambient glowing spheres */}
      <div style={{ position: 'absolute', top: 0, left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${themeColor}08, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${themeColor}05, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* Header Bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', background: isDark ? 'rgba(3,7,18,0.8)' : 'rgba(248,250,252,0.8)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', transition: 'all 0.3s' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontFamily: 'Poppins', 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              color: isDark ? '#F1F5F9' : '#0F172A', 
              padding: '8px 0',
              transition: 'transform 0.22s ease, color 0.22s ease, text-shadow 0.22s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(-3px)';
              e.currentTarget.style.color = '#8B5CF6';
              e.currentTarget.style.textShadow = '0 8px 22px rgba(99,102,241,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.color = isDark ? '#F1F5F9' : '#0F172A';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            <FiArrowLeft size={16} /> Back to Portfolio
          </button>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '100px', objectFit: 'contain', marginRight: '-20px' }} />
          </Link>
        </div>
      </header>

      {/* Main Layout Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1, opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s ease-in-out' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', gap: '48px' }} className="recognition-details-layout">
          
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Title section */}
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: (type === 'achievement' && item.image) ? 'transparent' : `${themeColor}15`, border: (type === 'achievement' && item.image) ? 'none' : `1px solid ${themeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                {type === 'achievement' && item.image ? (
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : item.logo ? (
                  <img src={item.logo} alt={item.issuer} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <EmojiIcon emoji={badgeVal} size={30} color={themeColor} />
                )}
              </div>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.7rem)', color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.2 }}>
                {item.title}
              </h1>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1.2rem', lineHeight: 1.6, color: themeColor, filter: 'brightness(1.1)', marginBottom: (type === 'achievement' && item.desc && item.desc !== descText) ? '12px' : '0px' }}>
                {type === 'certification' ? `Issued by ${item.issuer}` : `Metric Achieved: ${item.value}`}
              </p>
              {type === 'achievement' && item.desc && item.desc !== descText && (
                <p style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '1.1rem', 
                  fontWeight: 500, 
                  lineHeight: 1.6, 
                  color: isDark ? '#CBD5E1' : '#475569', 
                  margin: '12px 0 0 0',
                  paddingLeft: '12px',
                  borderLeft: `3.5px solid ${themeColor}`
                }}>
                  {item.desc}
                </p>
              )}
            </div>

            {/* Description block */}
            <div style={{ padding: '28px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)', lineHeight: 1.8, fontSize: '1.05rem', color: isDark ? '#CBD5E1' : '#475569' }}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{descText}</p>
            </div>

            {/* Skills chip list */}
            {skillsArray.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.3rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCpu style={{ color: themeColor }} /> Key Skills & Focus Areas
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {skillsArray.map(skill => (
                    <span 
                      key={skill} 
                      style={{ 
                        padding: '6px 16px', 
                        borderRadius: '12px', 
                        background: `${themeColor}10`, 
                        border: `1.5px solid ${themeColor}20`, 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: isDark ? '#F1F5F9' : '#1F2937',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <FiCheckCircle size={13} style={{ color: themeColor }} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification & Meta details */}
            <div style={{ padding: '24px', borderRadius: '20px', background: `linear-gradient(135deg, ${themeColor}10, transparent)`, border: `1.5px solid ${themeColor}20`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: isDark ? '#FFFFFF' : '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                {type === 'certification' ? <FiShield style={{ color: themeColor }} /> : <FiTarget style={{ color: themeColor }} />}
                {type === 'certification' ? 'Credential Verification Details' : 'Achievement Summary'}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '4px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Poppins', fontWeight: 600 }}>Issuer</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{item.issuer || 'Portfolio Milestone'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Poppins', fontWeight: 600 }}>Date/Year</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{formattedDate || displayYear}</span>
                </div>
                {type === 'certification' && item.credentialId && (
                  <div>
                    <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Poppins', fontWeight: 600 }}>Credential ID</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'monospace', color: isDark ? '#F1F5F9' : '#1E293B' }}>{item.credentialId}</span>
                  </div>
                )}
              </div>

              {type === 'certification' && item.credentialUrl && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <a 
                    href={item.credentialUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '12px 24px', 
                      borderRadius: '12px', 
                      background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`, 
                      color: 'white', 
                      textDecoration: 'none', 
                      fontFamily: 'Poppins', 
                      fontWeight: 700, 
                      fontSize: '0.88rem', 
                      boxShadow: `0 4px 20px ${themeColor}35`,
                      transition: 'transform 0.2s, opacity 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = 0.95; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = 1; }}
                  >
                    Verify Credential <FiExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Navigation Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Visual media preview if it exists */}
            {((type === 'certification' && item.image) || (type === 'achievement' && item.certificateImage)) && (
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', background: isDark ? '#111827' : '#FFFFFF', padding: '12px' }}>
                <img src={type === 'certification' ? item.image : item.certificateImage} alt={item.title} style={{ width: '100%', borderRadius: '12px', objectFit: 'contain', display: 'block', maxHeight: '450px' }} />
              </div>
            )}

            {/* Sibling navigation card */}
            <div style={{ padding: '24px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '18px' }}>
                {type === 'certification' ? 'All Certifications' : 'Notable Achievements'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {siblings.map((sibling, idx) => {
                  const siblingId = sibling._id || idx.toString();
                  const isActive = siblingId === id || sibling.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id;
                  const siblingColor = sibling.color || themeColor;
                  const targetLink = `/recognition/${type}/${siblingId}`;
                  
                  return (
                    <Link 
                      key={siblingId} 
                      to={targetLink}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        background: isActive ? `${siblingColor}15` : 'transparent',
                        border: isActive ? `1px solid ${siblingColor}25` : '1px solid transparent',
                        color: isActive ? siblingColor : isDark ? '#94A3B8' : '#475569',
                        textDecoration: 'none',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                          e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = isDark ? '#94A3B8' : '#475569';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {type === 'certification' && sibling.logo ? (
                          <img src={sibling.logo} alt={sibling.issuer} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : type === 'achievement' && sibling.image ? (
                          <img src={sibling.image} alt={sibling.title} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                          <span>{sibling.badge || sibling.icon || '🏆'}</span>
                        )}
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{sibling.title}</span>
                      </div>
                      <FiChevronRight size={14} style={{ opacity: isActive ? 1 : 0.4 }} />
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .recognition-details-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
