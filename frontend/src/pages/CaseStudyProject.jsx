import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiLayers, FiDatabase, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { PROJECTS } from '../data/portfolioData';
import axios from 'axios';

export default function CaseStudyProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.warn('Project API lookup failed, falling back to local data.', err);
      }

      const found = PROJECTS.find(x =>
        x.id === Number(id) ||
        x.id === id ||
        x._id === id ||
        x.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
      );

      setProject(found || null);
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#030712' : '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Poppins', textAlign: 'center', background: isDark ? '#030712' : '#F8FAFC', padding: '24px' }}>
        <div style={{ fontSize: '4rem' }}>📄</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Case Study Not Found</h1>
        <p style={{ color: isDark ? '#94A3B8' : '#64748B', maxWidth: '440px' }}>We couldn't load the case study for that project. Head back to the project gallery or check the project identifier.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/')} style={{ padding: '12px 22px', borderRadius: '12px', border: 'none', background: '#6366F1', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Back Home</button>
          <Link to={`/project/${id}`} style={{ padding: '12px 22px', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`, background: isDark ? '#111827' : '#FFFFFF', color: isDark ? '#F1F5F9' : '#0F172A', textDecoration: 'none', fontWeight: 700 }}>View Project</Link>
        </div>
      </div>
    );
  }

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const textColor = isDark ? '#E2E8F0' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';
  const projectColor = '#6366F1';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#050812' : '#F8FAFC', color: textColor, fontFamily: 'Inter, sans-serif', padding: '24px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24 }}>
        <header style={{ display: 'grid', gap: 20, padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <p style={{ margin: 0, color: '#10B981', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Project Case Study</p>
                <h1 style={{ margin: '10px 0 0', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05 }}>{project.title}</h1>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={() => navigate(`/project/${project._id || project.id}`)} style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid transparent', background: isDark ? '#111827' : '#FFFFFF', color: textColor, cursor: 'pointer', fontWeight: 700, boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(15,23,42,0.08)' }}>View Project</button>
                <button onClick={() => navigate('/')} style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid transparent', background: '#6366F1', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Back Home</button>
              </div>
            </div>
            <p style={{ margin: 0, maxWidth: 820, color: mutedColor, fontSize: '1rem', lineHeight: 1.8 }}>{project.description}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 24, borderRadius: 24, background: isDark ? '#111827' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
              <h2 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 700, color: textColor }}>Project Snapshot</h2>
              <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7 }}>A concise architecture case study for how this project is structured, modelled, and delivered.</p>
              <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: mutedColor }}><span>Category</span><strong style={{ color: textColor }}>{project.category || 'General'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: mutedColor }}><span>Tech stack</span><strong style={{ color: textColor }}>{project.technologies?.length || 0} items</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: mutedColor }}><span>Features</span><strong style={{ color: textColor }}>{project.features?.length || 0}</strong></div>
              </div>
            </div>
            <div style={{ padding: 24, borderRadius: 24, background: isDark ? '#111827' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
              <h2 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 700, color: textColor }}>Quick Outcomes</h2>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                <li>Design a reusable content and data flow strategy</li>
                <li>Model NoSQL collections for fast reads</li>
                <li>Define publish, search, and engagement subsystems</li>
              </ul>
            </div>
          </div>
        </header>

        <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FiMapPin size={20} color={projectColor} />
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Context Level 0</h2>
              </div>
              <p style={{ color: mutedColor, lineHeight: 1.8 }}>The system is framed as one platform interacting with external users and services. It receives content input from authors, serves pages to readers, and exposes the admin interface for management and analytics.</p>
              <div style={{ marginTop: 18, padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                <strong style={{ display: 'block', marginBottom: 10, color: textColor }}>Key External Actors</strong>
                <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                  <li>Author / Creator</li>
                  <li>Reader / Visitor</li>
                  <li>Admin / Moderator</li>
                </ul>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FiLayers size={20} color={projectColor} />
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Architecture & Data Flow</h2>
              </div>
              <p style={{ color: mutedColor, lineHeight: 1.8 }}>The platform consists of a content engine, a user management layer, a search/indexing subsystem, and a reporting/analytics pipeline. Data flows from creation to publication and then into user engagement metrics.</p>
              <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                <div style={{ padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                  <strong style={{ color: textColor }}>Content Engine</strong>
                  <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7 }}>Handles post creation, editing, draft workflow, and publication state.</p>
                </div>
                <div style={{ padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                  <strong style={{ color: textColor }}>Search / Indexing</strong>
                  <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7 }}>Supports fast lookups, tag filtering, and keyword search across published content.</p>
                </div>
                <div style={{ padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                  <strong style={{ color: textColor }}>Reader Experience</strong>
                  <p style={{ margin: '8px 0 0', color: mutedColor, lineHeight: 1.7 }}>Delivers responsive UI, comment handling, and site navigation for high engagement.</p>
                </div>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FiDatabase size={20} color={projectColor} />
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>NoSQL Data Model</h2>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { title: 'UserCollection', description: 'User profiles, roles, author metadata, and authentication details.' },
                  { title: 'PostsCollection', description: 'Articles, drafts, publish status, author refs, and tags.' },
                  { title: 'CategoryCollection', description: 'Taxonomy, category slugs, and post relationships.' },
                  { title: 'CommentsCollection', description: 'Post comments, moderation flags, and author references.' },
                ].map((item) => (
                  <div key={item.title} style={{ padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: textColor }}>{item.title}</h3>
                    <p style={{ margin: '10px 0 0', color: mutedColor, lineHeight: 1.7 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ display: 'grid', gap: 24 }}>
            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: '20px', objectFit: 'cover', maxHeight: '260px' }} />
              <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiCheckCircle size={18} color={projectColor} />
                  <h3 style={{ margin: 0, fontSize: '1rem', color: textColor }}>Live Project Insight</h3>
                </div>
                <p style={{ margin: 0, color: mutedColor, lineHeight: 1.7 }}>This case study uses the actual project details to show how the architecture connects to the real feature set and technology choices.</p>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: textColor }}>Feature Focus</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                {project.features?.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: textColor }}>Tech Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {project.technologies?.map((tech) => (
                  <span key={tech} style={{ padding: '8px 12px', borderRadius: '14px', background: isDark ? 'rgba(99,102,241,0.08)' : '#E0E7FF', color: projectColor, fontWeight: 700, fontSize: '0.83rem' }}>{tech}</span>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
