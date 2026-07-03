import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiArrowLeft } from 'react-icons/fi';
import Blog from '../components/Blog';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

export default function TagPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag || '');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#F8FAFC', color: isDark ? '#E2E8F0' : '#1E293B' }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', margin: 0 }}>{decodedTag ? `#${decodedTag.toLowerCase()}` : 'Tagged posts'}</p>
            <p style={{ fontFamily: 'Inter', fontSize: '0.95rem', color: isDark ? '#94A3B8' : '#64748B', margin: '10px 0 0' }}>
              Showing blog posts filtered by this tag.
            </p>
          </div>
        </div>
      </div>
      <Blog initialTag={decodedTag} standalone />
    </div>
  );
}
