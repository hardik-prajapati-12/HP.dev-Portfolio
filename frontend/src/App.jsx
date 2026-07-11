import { useState, useEffect, Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AdminSessionProvider, useAdminSession } from './context/AdminSessionContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import { Experience, Certifications } from './components/ExperienceCerts';
import { Services, Testimonials } from './components/ServiceTestimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminDashboard from './pages/Admin';
import { LoadingScreen, CustomCursor } from './components/LoadingCursor';
import ServiceDetails from './pages/ServiceDetails';
import RecognitionDetails from './pages/RecognitionDetails';
import BlogDetails from './pages/BlogDetails';
import TagPage from './pages/TagPage';
import ProjectDetails from './pages/ProjectDetails';
import CaseStudyProject from './pages/CaseStudyProject';
import Maintenance from './pages/Maintenance';
import axios from 'axios';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', margin: '20px', borderRadius: '12px', fontFamily: 'monospace' }}>
          <h3>Error in {this.props.name || 'Component'}</h3>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ fontSize: '0.8rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SectionDivider() {
  const { isDark } = useTheme();
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <div style={{
        height: '1px',
        background: isDark
          ? 'linear-gradient(to right,transparent,rgba(16,185,129,0.25),transparent)'
          : 'linear-gradient(to right,transparent,rgba(16,185,129,0.4),transparent)',
      }} />
    </div>
  );
}

function PortfolioHome({ publicSettings }) {
  const [loading, setLoading] = useState(true);
  const visible = publicSettings?.visibleSections || {};

  const isVisible = (sectionKey) => {
    return visible[sectionKey] !== false;
  };

  return (
    <>
      {/* Loading screen sits on top — removed when done */}
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {/* Main content always in DOM — visible after loading */}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <CustomCursor />
        <ErrorBoundary name="Navbar"><Navbar visibleSections={visible} /></ErrorBoundary>
        <main>
          <ErrorBoundary name="Hero"><Hero /></ErrorBoundary>
          
          {isVisible('about') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="About"><About /></ErrorBoundary>
            </>
          )}

          {isVisible('skills') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Skills"><Skills /></ErrorBoundary>
            </>
          )}

          {isVisible('projects') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Projects"><Projects /></ErrorBoundary>
            </>
          )}

          {isVisible('experience') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Experience"><Experience /></ErrorBoundary>
            </>
          )}

          {isVisible('services') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Services"><Services /></ErrorBoundary>
            </>
          )}

          {isVisible('certifications') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Certifications"><Certifications /></ErrorBoundary>
            </>
          )}

          {isVisible('blog') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Blog"><Blog /></ErrorBoundary>
            </>
          )}

          {isVisible('testimonials') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Testimonials"><Testimonials /></ErrorBoundary>
            </>
          )}

          {isVisible('contact') && (
            <>
              <SectionDivider />
              <ErrorBoundary name="Contact"><Contact /></ErrorBoundary>
            </>
          )}
        </main>
        <ErrorBoundary name="Footer"><Footer /></ErrorBoundary>

        {publicSettings?.enableChatbot !== false && (
          <ErrorBoundary name="Chatbot"><Chatbot publicSettings={publicSettings} /></ErrorBoundary>
        )}
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px',
      fontFamily: 'Poppins', textAlign: 'center', padding: '24px',
    }}>
      <div style={{ fontSize: '5rem' }}>🚫</div>
      <h1 style={{
        fontWeight: 800, fontSize: '3rem',
        background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>404</h1>
      <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>This page doesn't exist.</p>
      <a href="/" style={{
        padding: '12px 28px', borderRadius: '12px',
        background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
        color: 'white', textDecoration: 'none', fontWeight: 700,
      }}>Go Home</a>
    </div>
  );
}

function AppRoutes() {
  const { isAdmin, checking } = useAdminSession();
  const location = useLocation();
  const [publicSettings, setPublicSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Safety timeout: force-render the app if API calls hang too long (backend down)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setSettingsLoading(false);
    }, 6000);
    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    axios.get('/api/settings/public', { timeout: 5000 })
      .then(res => {
        setPublicSettings(res.data);
      })
      .catch(err => {
        console.error('Error fetching public settings:', err);
      })
      .finally(() => {
        setSettingsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (publicSettings?.siteTitle) {
      const titleBase = publicSettings.siteTitle;
      if (location.pathname.startsWith('/admin')) {
        document.title = `Admin Dashboard | ${titleBase}`;
      } else {
        document.title = `Hardik Prajapati | ${titleBase} — Full Stack Developer`;
      }
    }
  }, [publicSettings, location.pathname]);

  // Don't block render if checking is taking too long — only block briefly
  if (settingsLoading && checking) {
    return <div style={{ background: '#0B1120', minHeight: '100vh' }} />;
  }

  const isMaintenanceMode = publicSettings?.maintenanceMode;
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isMaintenanceMode && !isAdmin && !isAdminPath) {
    return <Maintenance siteTitle={publicSettings?.siteTitle} siteLogoText={publicSettings?.siteLogoText} />;
  }

  return (
    <Routes>
      <Route path="/"      element={<PortfolioHome publicSettings={publicSettings} />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
      <Route path="/recognition/:type/:id" element={<RecognitionDetails />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/tag/:tag" element={<TagPage />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/case-study/:id" element={<CaseStudyProject />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*"      element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AdminSessionProvider>
          <AppRoutes />
        </AdminSessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
