import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiGithub,
  FiExternalLink,
  FiStar,
  FiLayers,
  FiTarget,
  FiGitBranch,
  FiDatabase,
  FiCheckCircle,
  FiActivity,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { PROJECTS } from '../data/portfolioData';
import axios from 'axios';

import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [projectCategories, setProjectCategories] = useState([]);
  const [archActiveTab, setArchActiveTab] = useState(0);
  const [archMaximized, setArchMaximized] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/projects/categories');
        if (Array.isArray(res.data)) {
          setProjectCategories(res.data);
        }
      } catch (err) {
        console.warn('Failed fetching project categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/projects/${id}`);
        if (res.data?.success && res.data.data) {
          setProject(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Failed fetching project from API, trying local lookup:', err);
      }

      const found = PROJECTS.find(x =>
        x.id === Number(id) ||
        x.id === id ||
        x._id === id ||
        x.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id
      );

      setProject(found || null);
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#030712' : '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Poppins', textAlign: 'center', background: isDark ? '#030712' : '#F8FAFC', padding: '24px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Project Not Found</h1>
        <p style={{ color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px' }}>The project you are looking for does not exist or has been removed.</p>
        <Link to="/" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>Go Back Home</Link>
      </div>
    );
  }

  const fallbackCategoryColors = {
    mern: '#10B981', // green
    web: '#3B82F6',  // blue
    java: '#EF4444', // red
    ui: '#8B5CF6',   // purple
    uncategorized: '#6B7280' // gray
  };
  const getCategoryColor = (cat, categoriesList = []) => {
    const match = categoriesList.find(c => c.name.toLowerCase() === cat?.toLowerCase());
    if (match) return match.color || '#6366F1';
    return fallbackCategoryColors[cat?.toLowerCase()] || '#6366F1';
  };
  const projectColor = getCategoryColor(project.category, projectCategories);
  const textColor = isDark ? '#E2E8F0' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';
  const panelBg = isDark ? 'rgba(255,255,255,0.025)' : '#FFFFFF';
  const panelBorder = isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0';
  const insetBg = isDark ? 'rgba(255,255,255,0.035)' : '#F8FAFC';
  const insetPanelBg = isDark ? 'rgba(3,7,18,0.35)' : '#FFFFFF';
  const features = Array.isArray(project.features) ? project.features : [];
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const caseStudy = project.caseStudy || {};
  const managedFeatureFocus = Array.isArray(caseStudy.featureFocus) ? caseStudy.featureFocus.filter(Boolean) : [];
  const primaryFeatures = managedFeatureFocus.length ? managedFeatureFocus : features.length ? features.slice(0, 4) : [
    'Responsive user interface tailored to the project workflow.',
    'Structured data flow between the interface, logic layer, and storage.',
    'Reusable components and maintainable implementation patterns.'
  ];
  const defaultArchitectureItems = [
    {
      title: 'Presentation Layer',
      description: 'Delivers the primary user experience with responsive layouts, clear navigation, and reusable UI patterns.'
    },
    {
      title: 'Application Logic',
      description: 'Coordinates feature workflows, validation, state changes, and communication between the interface and data layer.'
    },
    {
      title: 'Data Layer',
      description: `Organizes the core ${project.category || 'project'} information so content, users, and feature states can be loaded predictably.`
    }
  ];
  const architectureItems = Array.isArray(caseStudy.architecture) && caseStudy.architecture.length
    ? caseStudy.architecture.filter(item => item.title || item.description)
    : defaultArchitectureItems;
  const defaultDataModelItems = [
    { title: 'Users', description: 'Profiles, roles, permissions, and session-related information.' },
    { title: 'Content', description: 'Primary project records, publish states, metadata, and searchable fields.' },
    { title: 'Interactions', description: 'User actions, feedback, comments, saved states, or engagement signals.' },
    { title: 'System Meta', description: 'Configuration, categories, audit information, and operational settings.' }
  ];
  const dataModelItems = Array.isArray(caseStudy.dataModel) && caseStudy.dataModel.length
    ? caseStudy.dataModel.filter(item => item.title || item.description)
    : defaultDataModelItems;
  const outcomes = Array.isArray(caseStudy.outcomes) && caseStudy.outcomes.length ? caseStudy.outcomes.filter(Boolean) : [
    'Clear project structure that is easier to extend and maintain.',
    'Focused feature delivery aligned with the real user workflow.',
    'A polished interface backed by practical technology choices.'
  ];
  const caseStudyTitle = caseStudy.title || `How ${project.title} is structured and delivered`;
  const caseStudyBadge = caseStudy.badge || 'Production-focused build';
  const caseStudyProblem = caseStudy.problem || 'The goal was to turn the project concept into a dependable digital experience with clear user journeys, practical feature coverage, and a maintainable structure that can grow beyond the first release.';
  const caseStudyInsight = caseStudy.insight || 'The case study connects the visible interface, feature decisions, technology choices, and delivery structure into one project narrative.';
  const architectureDiagrams = Array.isArray(caseStudy.architectureDiagrams) ? caseStudy.architectureDiagrams.filter(d => d.label && d.imageUrl) : [];
  const formatProjectDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateStr;
  };
  const detailRows = [
    ['Category', project.category || 'Project'],
    ['Status', project.status || 'Completed'],
    ['Tech Stack', `${technologies.length} technologies`],
    ['Date Added', project.date ? formatProjectDate(project.date) : (project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently')]
  ];
  const headerBg = isDark
    ? scrolled ? 'rgba(3,7,18,0.85)' : 'transparent'
    : scrolled ? 'rgba(255,255,255,0.85)' : 'transparent';
  const headerBorder = scrolled
    ? isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)'
    : 'none';
  const headerShadow = scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'none';

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#030712' : '#F8FAFC',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontFamily: 'Inter',
      transition: 'all 0.3s',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${projectColor}05, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: headerBg, borderBottom: headerBorder, boxShadow: headerShadow, transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', color: isDark ? '#F1F5F9' : '#0F172A', padding: '8px 0', textShadow: !scrolled && isDark ? '0 2px 12px rgba(0,0,0,0.35)' : 'none', transition: 'transform 0.22s ease, color 0.22s ease, text-shadow 0.22s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(-3px)';
              e.currentTarget.style.color = '#8B5CF6';
              e.currentTarget.style.textShadow = '0 8px 22px rgba(99,102,241,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.color = isDark ? '#F1F5F9' : '#0F172A';
              e.currentTarget.style.textShadow = !scrolled && isDark ? '0 2px 12px rgba(0,0,0,0.35)' : 'none';
            }}
          >
            <FiArrowLeft size={16} /> Back to Portfolio
          </button>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'transform 0.22s ease, filter 0.22s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.025)';
              e.currentTarget.style.filter = 'drop-shadow(0 10px 24px rgba(99,102,241,0.32))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.filter = 'none';
            }}
          >
            <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '100px', objectFit: 'contain', marginRight: '-20px', filter: !scrolled && isDark ? 'drop-shadow(0 6px 18px rgba(0,0,0,0.35))' : 'none' }} />
          </Link>
        </div>
      </header>

      <section style={{ position: 'relative', width: '100%', minHeight: 'calc(50vh + 72px)', paddingTop: '72px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.4)',
          transform: 'scale(1.05)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'linear-gradient(to bottom, rgba(3,7,18,0.4), rgba(3,7,18,0.9))'
            : 'linear-gradient(to bottom, rgba(248,250,252,0.4), rgba(248,250,252,0.95))',
          zIndex: 1
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '44px 24px 60px',
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '4px 14px', borderRadius: '8px', background: projectColor, color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {project.category || 'Project'}
              </span>
              {project.featured && (
                <span style={{ 
                  padding: '3px 10px', 
                  borderRadius: '6px', 
                  background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)', 
                  border: isDark ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(245,158,11,0.2)', 
                  color: isDark ? '#FBBF24' : '#D97706', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  <FiStar size={12} /> Featured
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.15, margin: 0, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em' }}>
              {project.title}
            </h1>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', margin: 0, maxWidth: '600px' }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', marginTop: '8px' }}>
              {project.showGithub !== false && project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', color: isDark ? '#E2E8F0' : '#1E293B', textDecoration: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                >
                  <FiGithub size={16} /> GitHub Repository
                </a>
              )}
              {project.showLive !== false && project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', textDecoration: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(99,102,241,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  <FiExternalLink size={16} /> Visit Live Site
                </a>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', aspectRatio: '16/9', maxHeight: '340px' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'grid', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.75fr)', gap: '28px', alignItems: 'start' }} className="project-details-top-grid">
          <div style={{ padding: '32px', borderRadius: '24px', background: panelBg, border: panelBorder }}>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.25rem', color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiLayers size={18} style={{ color: projectColor }} /> Project Overview
            </h3>
            <p style={{ fontFamily: 'Inter', fontSize: '1rem', lineHeight: 1.8, color: isDark ? '#CBD5E1' : '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>
              {project.longDescription || project.description}
            </p>
          </div>

          <aside style={{ display: 'grid', gap: '18px' }}>
            <div style={{ padding: '24px', borderRadius: '22px', background: panelBg, border: panelBorder }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: textColor, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiActivity size={17} style={{ color: projectColor }} /> Project Details
              </h3>
              <div style={{ display: 'grid', gap: '14px' }}>
                {detailRows.map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #E2E8F0', paddingBottom: '12px' }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: label === 'Status' ? '#10B981' : textColor, fontWeight: 700, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '24px', borderRadius: '22px', background: panelBg, border: panelBorder }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: textColor, margin: '0 0 16px' }}>
                Technologies Used
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {technologies.map(t => (
                  <span key={t} style={{ padding: '7px 12px', borderRadius: '9px', background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)', color: projectColor, fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(99,102,241,0.15)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div style={{ padding: '24px', borderRadius: '22px', background: panelBg, border: panelBorder }}>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: textColor, margin: '0 0 16px' }}>
                  Key Features
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ marginTop: '8px', width: '6px', height: '6px', borderRadius: '50%', background: projectColor, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'Inter', fontSize: '0.9rem', lineHeight: 1.55, color: mutedColor }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div style={{ padding: '32px', borderRadius: '24px', background: panelBg, border: panelBorder }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <div>
              <span style={{ color: projectColor, fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.76rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Case Study
              </span>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(1.55rem, 3vw, 2.15rem)', color: textColor, margin: '8px 0 0', lineHeight: 1.2 }}>
                {caseStudyTitle}
              </h3>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '14px', background: isDark ? `${projectColor}1A` : `${projectColor}0D`, border: `1px solid ${projectColor}38`, color: projectColor, fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700 }}>
              {caseStudyBadge}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }} className="project-case-study-stats">
            {[
              { label: 'Category', value: project.category || 'Project' },
              { label: 'Tech Stack', value: `${technologies.length} tools` },
              { label: 'Feature Scope', value: `${features.length || primaryFeatures.length} modules` }
            ].map(item => (
              <div key={item.label} style={{ padding: '18px', borderRadius: '18px', background: insetBg, border: panelBorder }}>
                <p style={{ margin: 0, color: mutedColor, fontFamily: 'Poppins', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</p>
                <strong style={{ display: 'block', marginTop: '8px', color: textColor, fontFamily: 'Poppins', fontSize: '1rem' }}>{item.value}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)', gap: '20px', alignItems: 'stretch' }} className="project-case-study-grid">
            <div style={{ display: 'grid', gap: '18px' }}>
              <section style={{ padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <FiTarget size={18} color={projectColor} />
                  <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>Problem & Goal</h4>
                </div>
                <p style={{ margin: 0, color: mutedColor, lineHeight: 1.8 }}>
                  {caseStudyProblem}
                </p>
              </section>

              <section style={{ padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <FiGitBranch size={18} color={projectColor} />
                  <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>Architecture & Flow</h4>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {architectureItems.map(item => (
                    <div key={item.title} style={{ padding: '16px', borderRadius: '16px', background: insetPanelBg, border: panelBorder }}>
                      <strong style={{ color: textColor, fontFamily: 'Poppins', fontSize: '0.95rem' }}>{item.title}</strong>
                      <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7 }}>{item.description}</p>
                    </div>
                  ))}
                </div>


              </section>

              {/* System Architecture — inline card */}
              {architectureDiagrams.length > 0 && (
                <section style={{ padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiLayers size={18} color={projectColor} />
                      <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>System Architecture</h4>
                    </div>
                  </div>

                  {/* Diagram tabs */}
                  {architectureDiagrams.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {architectureDiagrams.map((diag, idx) => (
                        <button
                          key={idx}
                          onClick={() => setArchActiveTab(idx)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '10px',
                            border: archActiveTab === idx
                              ? `1.5px solid ${projectColor}`
                              : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'),
                            background: archActiveTab === idx
                              ? `${projectColor}15`
                              : 'transparent',
                            color: archActiveTab === idx ? projectColor : mutedColor,
                            fontFamily: 'Poppins',
                            fontWeight: archActiveTab === idx ? 700 : 500,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => { if (archActiveTab !== idx) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'; } }}
                          onMouseLeave={e => { if (archActiveTab !== idx) { e.currentTarget.style.background = 'transparent'; } }}
                        >
                          {diag.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Diagram viewer */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                    background: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
                  }}>
                    <button
                      onClick={() => setArchMaximized(true)}
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                        background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        color: textColor,
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(15,23,42,0.95)' : '#FFFFFF'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                    >
                      <FiMaximize2 size={14} />
                      Maximize
                    </button>
                    <img
                      src={architectureDiagrams[archActiveTab]?.imageUrl}
                      alt={architectureDiagrams[archActiveTab]?.label || 'Architecture Diagram'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  </div>
                </section>
              )}
            </div>

            <aside style={{ display: 'grid', gap: '18px' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: panelBorder, background: insetBg }}>
                <img src={caseStudy.caseStudyImage || project.image} alt={`${project.title} preview`} style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block', background: isDark ? 'rgba(0,0,0,0.2)' : '#F1F5F9' }} />
                <div style={{ padding: '18px' }}>
                  <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1rem' }}>Live Project Insight</h4>
                  <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7, fontSize: '0.92rem' }}>
                    {caseStudyInsight}
                  </p>
                </div>
              </div>

              <section style={{ padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <FiCheckCircle size={18} color={projectColor} />
                  <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>Feature Focus</h4>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: mutedColor, lineHeight: 1.75 }}>
                  {primaryFeatures.map((feature, idx) => <li key={idx}>{feature}</li>)}
                </ul>
              </section>

              <section style={{ padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
                <h4 style={{ margin: '0 0 12px', color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>Outcomes</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: mutedColor, lineHeight: 1.75 }}>
                  {outcomes.map((outcome, idx) => <li key={idx}>{outcome}</li>)}
                </ul>
              </section>
            </aside>
          </div>

          <section style={{ marginTop: '20px', padding: '22px', borderRadius: '20px', background: insetBg, border: panelBorder }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <FiDatabase size={18} color={projectColor} />
              <h4 style={{ margin: 0, color: textColor, fontFamily: 'Poppins', fontSize: '1.05rem' }}>Data Model</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }} className="project-data-model-grid">
              {dataModelItems.map(item => (
                <div key={item.title} style={{ padding: '16px', borderRadius: '16px', background: insetPanelBg, border: panelBorder }}>
                  <strong style={{ color: textColor, fontFamily: 'Poppins', fontSize: '0.92rem' }}>{item.title}</strong>
                  <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.65, fontSize: '0.9rem' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .project-details-top-grid,
            .project-case-study-grid {
              grid-template-columns: 1fr !important;
            }

            .project-case-study-stats,
            .project-data-model-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 560px) {
            .project-case-study-stats,
            .project-data-model-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Architecture Fullscreen Overlay */}
      {archMaximized && architectureDiagrams.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            background: isDark ? '#0F172A' : '#FFFFFF',
            animation: 'archModalFadeIn 0.25s ease',
          }}
        >
          {/* Fullscreen Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <h3 style={{
                margin: 0,
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: textColor,
              }}>System Architecture</h3>
              {architectureDiagrams.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {architectureDiagrams.map((diag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setArchActiveTab(idx)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: archActiveTab === idx
                          ? `1.5px solid ${projectColor}`
                          : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'),
                        background: archActiveTab === idx
                          ? `${projectColor}15`
                          : 'transparent',
                        color: archActiveTab === idx ? projectColor : mutedColor,
                        fontFamily: 'Poppins',
                        fontWeight: archActiveTab === idx ? 700 : 500,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { if (archActiveTab !== idx) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'; } }}
                      onMouseLeave={e => { if (archActiveTab !== idx) { e.currentTarget.style.background = 'transparent'; } }}
                    >
                      {diag.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setArchMaximized(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                color: mutedColor,
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '0.78rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9'; e.currentTarget.style.color = textColor; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC'; e.currentTarget.style.color = mutedColor; }}
            >
              <FiMinimize2 size={14} />
              Minimize
            </button>
          </div>

          {/* Fullscreen Image */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px 24px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={architectureDiagrams[archActiveTab]?.imageUrl}
              alt={architectureDiagrams[archActiveTab]?.label || 'Architecture Diagram'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes archModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
