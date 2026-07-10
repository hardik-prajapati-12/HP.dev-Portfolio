import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiCpu, FiDatabase, FiLayers, FiGlobe, FiChevronRight, FiSettings, FiBriefcase } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import EmojiIcon from '../components/EmojiIcon';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

const SERVICE_DETAILS_DATA = {
  'full-stack-development': {
    title: 'Full Stack Development',
    subtitle: 'End-to-end web applications built for scale, performance, and accessibility.',
    icon: '🚀',
    color: '#10B981',
    description: 'Full stack development involves building both the user-facing frontend and the server-side backend databases and logic. This ensures that every layer of the application is designed to communicate efficiently and scale horizontally under high traffic demands.',
    pillars: [
      'Frontend client applications using React, Vite, and Next.js.',
      'Backend servers and business logic via Node.js, Express, and Python.',
      'Database integration, modeling, and aggregation.',
      'Deployment automation, containerization, and hosting (Docker, AWS, Vercel).',
      'Integration of third-party API services, web sockets, and serverless logic.'
    ],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Vercel'],
    workflow: [
      'Requirements analysis and wireframing.',
      'Database schema modeling and backend server architecture.',
      'Frontend user interface development and state management integration.',
      'End-to-end testing, security audits, and API documentation.',
      'Continuous deployment setup and production launch.'
    ],
    impact: 'Consolidating development under a full-stack architecture minimizes integration overhead, improves application responsiveness, and enables rapid iteration of product features.'
  },
  'api-development': {
    title: 'API Development',
    subtitle: 'Robust, secure, and well-documented server architectures to power frontends and integrations.',
    icon: '🔗',
    color: '#06B6D4',
    description: 'API development forms the backbone of modern software. We design RESTful and GraphQL APIs that handle complex workflows, implement secure token-based authentication, and guarantee fast response times through database optimizations and memory caching.',
    pillars: [
      'RESTful API routing and GraphQL resolver optimization.',
      'Secure token authentication (JWT, OAuth2) and role-based permissions.',
      'Rate-limiting, sanitization, and security headers to prevent DDoS/OWASP vulnerabilities.',
      'Caching layers using Redis for low-latency retrieval.',
      'Interactive documentation using Swagger / OpenAPI and Postman collections.'
    ],
    techStack: ['Node.js', 'Express', 'GraphQL', 'Apollo Server', 'JWT', 'Redis', 'Postman', 'Swagger'],
    workflow: [
      'Endpoint planning, design documentation, and payload definition.',
      'Routing schema setup, database querying, and business logic logic integration.',
      'Auth implementation and endpoint-level security policies validation.',
      'Performance testing, load testing, and caching optimizations.',
      'Interactive documentation generation and developer preview release.'
    ],
    impact: 'A clean, high-performance API reduces client loading times, simplifies frontend-backend communication, and serves as an integration layer for third-party partners.'
  },
  'frontend-development': {
    title: 'Frontend Development',
    subtitle: 'Stunning, responsive, and pixel-perfect interfaces designed for maximum user engagement.',
    icon: '🎨',
    color: '#8B5CF6',
    description: 'Frontend development is where user experience meets code. We construct responsive, fluid interfaces using React and modern CSS. Utilizing micro-interactions, smooth transition layers, and semantic structures, we ensure your site is readable, responsive, and accessible on all devices.',
    pillars: [
      'Component-driven architectures using React and Tailwind CSS.',
      'Fluid layouts using Flexbox, CSS Grid, and responsive viewport sizing.',
      'Interactive animations using Framer Motion and keyframe stylesheet layers.',
      'Semantic structure, search engine indexing (SEO), and accessibility standard checks.',
      'State management synchronization (Redux, Context API, Zustand).'
    ],
    techStack: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Figma'],
    workflow: [
      'UX design review and asset optimization.',
      'Component library setup and styling definitions.',
      'Interactive layout scripting, state mapping, and route configuration.',
      'Cross-browser and viewport responsiveness testing.',
      'SEO validation and final client bundle optimization.'
    ],
    impact: 'A premium, responsive frontend captivates users immediately, reduces bounce rates, and translates complex app interactions into natural, intuitive user flows.'
  },
  'database-design': {
    title: 'Database Design',
    subtitle: 'Highly optimized schemas, indexing architectures, and aggregation structures.',
    icon: '🗄️',
    color: '#F59E0B',
    description: 'Information architecture requires structural database designs. We build SQL and NoSQL databases structured for query speed, transactional integrity, and data safety. Whether it is relational PostgreSQL or document-based MongoDB, we optimize for speed.',
    pillars: [
      'Relational table normalization (PostgreSQL, MySQL) and SQL query tuning.',
      'NoSQL document schema design (MongoDB) for unstructured, dynamic data structures.',
      'Database indexing strategies, indexing analysis, and execution plan profiling.',
      'Data security compliance, encryption at rest, and automated backup setups.',
      'Data aggregation pipelines and analytics query structures.'
    ],
    techStack: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Mongoose', 'Prisma', 'Sequelize'],
    workflow: [
      'Entity relationship design and schema mapping.',
      'Database instance provisioning and configuration.',
      'Index configuration, query optimization, and trigger scripting.',
      'Migration pipeline creation and testing.',
      'Scale testing and backup orchestration.'
    ],
    impact: 'Robust database design ensures that your application data remains secure, queries respond in milliseconds even with millions of records, and storage requirements are minimized.'
  },
  'performance-optimization': {
    title: 'Performance Optimization',
    subtitle: 'Speed audits, caching configurations, Core Web Vitals compliance, and SEO optimization.',
    icon: '⚡',
    color: '#EF4444',
    description: 'Performance optimization is critical to retaining web users. We inspect your codebundles, database querying, server configurations, and image formats. We apply loading enhancements, server-side caching, and search engine optimization to make your site run fast.',
    pillars: [
      'Core Web Vitals auditing (LCP, FID, CLS improvements).',
      'JavaScript bundles analysis, lazy loading configurations, and tree shaking.',
      'Image conversion (WebP/AVIF), asset compression, and CDN distributions.',
      'Redis server-side caching and client database query indexing.',
      'SEO structure optimization (semantic tags, site map configurations, SSR metadata).'
    ],
    techStack: ['Lighthouse', 'Webpack Analyzer', 'Vite', 'Redis', 'CDN (Cloudflare)', 'Google Search Console'],
    workflow: [
      'Performance audit using Lighthouse and profiling tools.',
      'Asset compression, code-splitting, and lazy loading configurations.',
      'Database queries profiling and caching layers activation.',
      'Network layer tuning (CDN routing, compression setup).',
      'Post-optimization benchmarking and monitoring setup.'
    ],
    impact: 'Optimizing application performance lowers loading times by up to 70%, raises conversion rates, and increases visibility on search engine results lists.'
  },
  'technical-consulting': {
    title: 'Technical Consulting',
    subtitle: 'Strategic architecture mapping, developer audits, stack recommendations, and roadmap design.',
    icon: '💡',
    color: '#10B981',
    description: 'Technical consulting bridges business goals and engineering execution. We conduct code reviews, analyze your existing tech stack, recommend modernization routes, and lay down structured roadmaps to guide development without accumulating tech debt.',
    pillars: [
      'Architecture design patterns review (Monolith vs. Microservices).',
      'Engineering code audits, standard practice reviews, and workflow optimizations.',
      'Tech stack selection and feasibility studies matching budget and scale expectations.',
      'Scalability roadmaps, container orchestration guides, and security reviews.',
      'Technical mentorship and workflow advice for dev teams.'
    ],
    techStack: ['GitHub Enterprise', 'Jira / Confluence', 'Docker', 'AWS Calculator', 'Draw.io / Lucidchart'],
    workflow: [
      'Stakeholder interviews and business objectives collection.',
      'Codebase review, server log profiling, and architecture audit.',
      'Feasibility study and options analysis preparation.',
      'Detailed recommendations roadmap delivery.',
      'Post-delivery advisory sessions and developer handoffs.'
    ],
    impact: 'Strategic technical advice clarifies architectural directions, prevents expensive restarts, ensures codebases remain maintainable, and streamlines the developer workflow.'
  }
};

const ALL_SERVICES_LIST = [
  { id: 'full-stack-development', title: 'Full Stack Development', icon: '🚀', color: '#10B981' },
  { id: 'api-development', title: 'API Development', icon: '🔗', color: '#06B6D4' },
  { id: 'frontend-development', title: 'Frontend Development', icon: '🎨', color: '#8B5CF6' },
  { id: 'database-design', title: 'Database Design', icon: '🗄️', color: '#F59E0B' },
  { id: 'performance-optimization', title: 'Performance Optimization', icon: '⚡', color: '#EF4444' },
  { id: 'technical-consulting', title: 'Technical Consulting', icon: '💡', color: '#10B981' }
];

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    axios.get('/api/services')
      .then(res => {
        if (Array.isArray(res.data)) {
          setDbServices(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Find dynamic service details from DB
  const dbSvc = dbServices.find(s => {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return slug === id;
  });

  const staticSvc = SERVICE_DETAILS_DATA[id] || null;

  // If service ID is not found in either database or static mock data, render fallback message
  if (!dbSvc && !staticSvc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Poppins', textAlign: 'center', background: isDark ? '#030712' : '#F8FAFC', padding: '24px' }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Service Not Found</h1>
        <p style={{ color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px' }}>The service you are looking for does not exist or has been moved.</p>
        <Link to="/" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>Go Back Home</Link>
      </div>
    );
  }

  // Resolve values prioritizing DB dynamic fields, falling back to static mock data
  const title = dbSvc ? dbSvc.title : (staticSvc ? staticSvc.title : '');
  const subtitle = (dbSvc && dbSvc.subtitle && dbSvc.subtitle.trim() !== '') ? dbSvc.subtitle : (staticSvc ? staticSvc.subtitle : '');
  const icon = dbSvc ? dbSvc.icon : (staticSvc ? staticSvc.icon : '🚀');
  const fallbackColor = staticSvc ? staticSvc.color : '#10B981';
  const serviceColor = dbSvc && dbSvc.color ? dbSvc.color : fallbackColor;
  const serviceImage = dbSvc && dbSvc.image && dbSvc.image.trim() !== '' ? dbSvc.image : null;

  const shortDesc = (dbSvc && dbSvc.desc && dbSvc.desc.trim() !== '') 
    ? dbSvc.desc 
    : '';

  const description = (dbSvc && dbSvc.description && dbSvc.description.trim() !== '') 
    ? dbSvc.description 
    : (staticSvc ? staticSvc.description : '');

  const pillars = (dbSvc && Array.isArray(dbSvc.pillars) && dbSvc.pillars.length > 0) 
    ? dbSvc.pillars 
    : (staticSvc ? staticSvc.pillars : []);

  const techStack = (dbSvc && Array.isArray(dbSvc.techStack) && dbSvc.techStack.length > 0) 
    ? dbSvc.techStack 
    : (staticSvc ? staticSvc.techStack : []);

  const workflow = (dbSvc && Array.isArray(dbSvc.workflow) && dbSvc.workflow.length > 0) 
    ? dbSvc.workflow 
    : (staticSvc ? staticSvc.workflow : []);

  const impact = (dbSvc && dbSvc.impact && dbSvc.impact.trim() !== '') 
    ? dbSvc.impact 
    : (staticSvc ? staticSvc.impact : '');

  // Build the list of resolved services dynamically for navigation
  const resolvedServices = [];
  const addedSlugs = new Set();

  dbServices.forEach(s => {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    resolvedServices.push({
      id: slug,
      title: s.title,
      icon: s.icon || '🚀',
      color: s.color || '#10B981',
      image: s.image || ''
    });
    addedSlugs.add(slug);
  });

  ALL_SERVICES_LIST.forEach(item => {
    if (!addedSlugs.has(item.id)) {
      resolvedServices.push(item);
    }
  });

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#F8FAFC', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Inter', transition: 'all 0.3s' }}>
      
      {/* Background ambient glowing spheres */}
      <div style={{ position: 'absolute', top: 0, left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${serviceColor}08, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${serviceColor}05, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', gap: '48px' }} className="service-details-layout">
          
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Title section */}
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: serviceImage ? 'transparent' : `${serviceColor}15`, border: serviceImage ? 'none' : `1px solid ${serviceColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                {serviceImage ? (
                  <img src={serviceImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <EmojiIcon emoji={icon} size={28} color={serviceColor} />
                )}
              </div>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.7rem)', color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.2 }}>
                {title}
              </h1>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '1.2rem', lineHeight: 1.6, color: serviceColor, filter: 'brightness(1.1)' }}>
                {subtitle}
              </p>
            </div>

            {/* Short Description */}
            {shortDesc && (
              <div style={{ padding: '20px 24px', borderRadius: '14px', background: isDark ? `rgba(255,255,255,0.02)` : `rgba(0,0,0,0.015)`, borderLeft: `3px solid ${serviceColor}`, lineHeight: 1.75, fontSize: '1.05rem', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 500 }}>
                {shortDesc}
              </div>
            )}

            {/* Detailed Description block */}
            {description && (
              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)', lineHeight: 1.8, fontSize: '1.05rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                {description}
              </div>
            )}

            {/* Core Pillars */}
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.3rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiLayers style={{ color: serviceColor }} /> Core Pillars & Focus Areas
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pillars.map((pillar, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${serviceColor}15`, border: `1px solid ${serviceColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: serviceColor, flexShrink: 0, marginTop: '2px' }}>
                      <FiCheck size={12} />
                    </span>
                    <span style={{ fontSize: '0.98rem', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569' }}>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow / Roadmap */}
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.3rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiSettings style={{ color: serviceColor }} /> Delivery Process & Roadmap
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
                {/* Timeline vertical stem line */}
                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '16px', width: '2px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                
                {workflow.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isDark ? '#030712' : '#F8FAFC', border: `2.5px solid ${serviceColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '4px' }}>Stage {idx + 1}</h4>
                      <p style={{ fontSize: '0.92rem', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5 }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact section */}
            <div style={{ padding: '24px', borderRadius: '16px', background: `linear-gradient(135deg, ${serviceColor}10, transparent)`, border: `1px solid ${serviceColor}20`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: isDark ? '#FFFFFF' : '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBriefcase style={{ color: serviceColor }} /> Business Value & Outcome
              </h3>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: isDark ? '#94A3B8' : '#475569' }}>
                {(() => {
                  if (!impact) return null;
                  const lines = impact.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
                  const elements = [];
                  lines.forEach((line, idx) => {
                    // Detect bullet points (•, -, *)
                    const bulletMatch = line.match(/^[•\-\*]\s*(.+)/);
                    // Detect section headers ending with ":"
                    const isHeader = /^[A-Z][\w\s&,/]+:$/i.test(line) || line.endsWith(':');
                    if (isHeader) {
                      elements.push(
                        <h4 key={idx} style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#E2E8F0' : '#1E293B', marginTop: idx > 0 ? '16px' : '0', marginBottom: '8px' }}>
                          {line}
                        </h4>
                      );
                    } else if (bulletMatch) {
                      elements.push(
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px', paddingLeft: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: serviceColor, flexShrink: 0, marginTop: '8px' }} />
                          <span>{bulletMatch[1]}</span>
                        </div>
                      );
                    } else {
                      elements.push(
                        <p key={idx} style={{ margin: idx > 0 ? '8px 0 0 0' : '0' }}>{line}</p>
                      );
                    }
                  });
                  return elements;
                })()}
              </div>
            </div>

          </div>

          {/* Sidebar Navigation Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Tech Stack Box */}
            <div style={{ padding: '24px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCpu style={{ color: serviceColor }} /> Technology Stack
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {techStack.map(tech => (
                  <span key={tech} style={{ padding: '6px 14px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#F1F5F9' : '#334155' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Services Navigation Card */}
            <div style={{ padding: '24px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '18px' }}>
                All Services
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {resolvedServices.map(item => {
                  const activeItem = item.id === id;
                  
                  // Find corresponding db service for image logo and color
                  const siblingDbSvc = dbServices.find(s => {
                    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return slug === item.id;
                  });
                  const siblingImage = siblingDbSvc && siblingDbSvc.image && siblingDbSvc.image.trim() !== '' ? siblingDbSvc.image : (item.image || null);
                  const siblingColor = siblingDbSvc && siblingDbSvc.color ? siblingDbSvc.color : item.color;

                  return (
                    <Link 
                      key={item.id} 
                      to={`/service/${item.id}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        background: activeItem ? `${siblingColor}15` : 'transparent',
                        border: activeItem ? `1px solid ${siblingColor}25` : '1px solid transparent',
                        color: activeItem ? siblingColor : isDark ? '#94A3B8' : '#475569',
                        textDecoration: 'none',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        if (!activeItem) {
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                          e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!activeItem) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = isDark ? '#94A3B8' : '#475569';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px' }}>
                          {siblingImage ? (
                            <img src={siblingImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <EmojiIcon emoji={item.icon} size={14} color={siblingColor} />
                          )}
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <FiChevronRight size={14} style={{ opacity: activeItem ? 1 : 0.4 }} />
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
          .service-details-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
