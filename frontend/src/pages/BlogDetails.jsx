import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { resolveImageUrl } from '../utils/adminApi';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';

// Static fallback data identical to backend & main page for testing/offline support
const STATIC_BLOGS = [
  {
    _id: '1',
    title: 'Building Scalable MERN Apps: Best Practices in 2024',
    content: `Building scalable applications with the MERN stack requires a strong understanding of database modeling, server performance, and front-end optimization.\n\n### ✨ Introduction\n\nIn today's fast-paced digital environment, building applications that can handle sudden spikes in traffic is a critical challenge. The MERN stack (MongoDB, Express, React, Node.js) offers a unified JavaScript development experience, but without careful planning, it can quickly bottle-neck.\n\n### 🚀 Key Architectural Patterns\n\n1. **Modular Folder Structures**: Keeping your controllers, routes, models, and middlewares separated improves scalability and readability.\n2. **Mongoose Schema Optimizations**: Use indexing on query-heavy fields. Avoid over-populating references; rely on subdocuments when appropriate.\n3. **Express Middleware Config**: Always use security headers (Helmet), compress responses (compression), and set up strict rate-limiting for auth routes.\n4. **React Performance Tuning**: Leverage lazy loading, tree shaking, and memoization hooks like useMemo and useCallback to avoid unnecessary re-renders.\n\nImplementing these best practices from the start will ensure that your code remains maintainable and your application runs blazingly fast under load.`,
    excerpt: 'A deep dive into architecture patterns, performance optimization, and deployment strategies for production-ready MERN stack applications.',
    category: 'backend',
    categoryColor: '#6366F1',
    featured: true,
    tags: ['MERN', 'Node.js', 'MongoDB', 'React'],
    author: 'Hardik Prajapati',
    createdAt: '2024-03-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80',
    views: 142,
    likes: 24
  },
  {
    _id: '2',
    title: 'Mastering React Performance with useMemo & useCallback',
    content: `React is incredibly fast out of the box, but as your application grows, you might notice sluggish performance due to unnecessary component re-renders.\n\n### ✨ Introduction\n\nComponent rendering is cheap, but not free. When rendering happens too frequently, the browser UI thread can stutter. This guide explains how to correctly apply memoization hooks to preserve a fluid 60fps user experience.\n\n### 🧠 Understanding Memoization in React\n\n1. **When to use useMemo**: Use it to cache the result of expensive calculations (e.g., filtering large arrays, generating graphs).\n2. **When to use useCallback**: Use it to cache function definitions themselves so child components that rely on shallow comparisons don't re-render on every parent change.\n3. **How to Profile**: Use the official React DevTools Profiler tab to highlight slow renders and identify which state changes caused them.\n\nAvoid premature optimization! Only wrap functions and computations when a performance profiling session indicates a clear bottleneck.`,
    excerpt: "Learn when and how to use React's memoization hooks to prevent unnecessary re-renders and dramatically boost app performance.",
    category: 'frontend',
    categoryColor: '#10B981',
    featured: false,
    tags: ['React', 'Performance', 'Hooks'],
    author: 'Hardik Prajapati',
    createdAt: '2024-02-28',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    views: 98,
    likes: 16
  },
  {
    _id: '3',
    title: 'Designing Beautiful UIs: Glassmorphism & Neumorphism',
    content: `Modern UI design is all about visual hierarchies, shadows, and simulated depth. Glassmorphism and Neumorphism are two popular design aesthetics.\n\n### ✨ Introduction\n\nCreating interface layouts that immediately grab user attention involves blending color science with lighting effects. By using realistic shadows and blurring backdrops, we can build web layouts that feel tactile and elegant.\n\n### 💎 Glassmorphism Recipes\n\nTo build a glass look, use standard backdrop filters and low opacity gradients:\n- CSS properties: \`backdrop-filter: blur(12px)\` and \`background: rgba(255, 255, 255, 0.05)\`.\n- Add a subtle border with high transparency (\`1px solid rgba(255, 255, 255, 0.1)\`) to simulate the glass edge.\n\n### 🌫️ Neumorphism Principles\n\nNeumorphism depends entirely on double-shadowing (light shadow on the top-left, dark shadow on the bottom-right) to make elements look like they extruded from or indented into the background page.\n\nCombine Tailwind CSS and Framer Motion to bring these visual design styles to life with micro-animations.`,
    excerpt: 'Explore modern UI design trends including glassmorphism and neumorphism, with practical examples using Tailwind CSS and Framer Motion.',
    category: 'design',
    categoryColor: '#F59E0B',
    featured: false,
    tags: ['UI/UX', 'Tailwind', 'Design'],
    author: 'Hardik Prajapati',
    createdAt: '2024-02-10',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
    views: 184,
    likes: 32
  }
];

export default function BlogDetails() {
  const { id } = useParams(); // Mongo ID or slug
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [ownerAvatar, setOwnerAvatar] = useState('/uploads/1781442618400-360230949.png');

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');
  const [commentMessageType, setCommentMessageType] = useState(''); // 'success' or 'error'

  // Fetch owner/author avatar
  useEffect(() => {
    axios.get('/api/profile').then(res => {
      if (res.data && res.data.avatar) {
        setOwnerAvatar(res.data.avatar);
      }
    }).catch(() => {});
  }, []);

  const generateCommenterToken = () => {
    const token = 'ct_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('commenter_token', token);
    return token;
  };

  const fetchComments = async (blogId) => {
    try {
      const token = localStorage.getItem('commenter_token') || generateCommenterToken();
      const res = await axios.get(`/api/comments/blog/${blogId}`, {
        headers: { 'X-Commenter-Token': token }
      });
      if (res.data && res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error("Failed fetching comments:", err);
    }
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`/api/blogs/${id}`, { headers });
        if (res.data && res.data.data) {
          setBlog(res.data.data);
          fetchComments(res.data.data._id);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed fetching from API, trying local lookup:", err);
      }

      // Local fallback
      const found = STATIC_BLOGS.find(x => 
        x._id === id || 
        x.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id
      );

      if (found) {
        setBlog(found);
        fetchComments(found._id);
      } else {
        setBlog(null);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const savedName = localStorage.getItem('commenter_name');
    const savedEmail = localStorage.getItem('commenter_email');
    if (savedName) setCommentName(savedName);
    if (savedEmail) setCommentEmail(savedEmail);
    if (savedName || savedEmail) setRememberMe(true);
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentEmail.trim() || !commentContent.trim()) {
      setCommentMessage("Please fill in all required fields.");
      setCommentMessageType("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentEmail.trim())) {
      setCommentMessage("Please enter a valid email address.");
      setCommentMessageType("error");
      return;
    }

    setSubmittingComment(true);
    setCommentMessage('');

    try {
      const token = localStorage.getItem('commenter_token') || generateCommenterToken();
      const payload = {
        blogId: blog._id,
        name: commentName.trim(),
        email: commentEmail.trim(),
        content: commentContent.trim(),
        commenterToken: token
      };

      const res = await axios.post('/api/comments', payload);
      if (res.data && res.data.success) {
        setCommentContent('');
        setCommentMessage("Thank you! Your comment has been submitted and is pending moderation.");
        setCommentMessageType("success");
        
        if (rememberMe) {
          localStorage.setItem('commenter_name', commentName.trim());
          localStorage.setItem('commenter_email', commentEmail.trim());
        } else {
          localStorage.removeItem('commenter_name');
          localStorage.removeItem('commenter_email');
        }
        
        fetchComments(blog._id);
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentMessage(err.response?.data?.message || "Failed to submit comment. Please try again.");
      setCommentMessageType("error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete your comment?")) return;
    try {
      const token = localStorage.getItem('commenter_token') || generateCommenterToken();
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { 'X-Commenter-Token': token }
      });
      fetchComments(blog._id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };



  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#030712' : '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Poppins', textAlign: 'center', background: isDark ? '#030712' : '#F8FAFC', padding: '24px' }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Article Not Found</h1>
        <p style={{ color: isDark ? '#94A3B8' : '#64748B', maxWidth: '400px' }}>The blog post you are looking for does not exist or has been moved.</p>
        <Link to="/" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>Go Back Home</Link>
      </div>
    );
  }

  const categoryColor = (cat) => {
    if (blog && blog.categoryColor) return blog.categoryColor;
    const map = { frontend: '#10B981', backend: '#6366F1', design: '#F59E0B', spirituality: '#10B981' };
    return map[cat?.toLowerCase()] || '#6366F1';
  };

  const displayAuthorName = blog.author === 'Admin' || blog.author === 'Hardik Prajapati' ? 'Hardik Prajapati' : (blog.author || 'Hardik Prajapati');
  const authorPhoto = displayAuthorName === 'Hardik Prajapati' ? ownerAvatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#030712' : '#F8FAFC', 
      color: isDark ? '#E2E8F0' : '#1E293B', 
      fontFamily: 'Inter', 
      transition: 'all 0.3s',
      paddingBottom: '80px'
    }}>
      {/* Dynamic Glowing Sphere in background */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${categoryColor(blog.category)}05, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

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

      {/* Hero Banner Section */}
      <section style={{ position: 'relative', width: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Banner Cover Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `url(${resolveImageUrl(blog.image)})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          zIndex: 0 
        }} />
        {/* Semi-transparent Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isDark 
            ? 'linear-gradient(to bottom, rgba(3,7,18,0.4), rgba(3,7,18,0.9))' 
            : 'linear-gradient(to bottom, rgba(248,250,252,0.4), rgba(248,250,252,0.95))', 
          zIndex: 1 
        }} />
        {/* Bottom Blend Gradient Overlay */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '180px', 
          background: `linear-gradient(to bottom, transparent, ${isDark ? '#030712' : '#F8FAFC'})`, 
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* Content Wrapper */}
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '60px 24px 80px', 
          position: 'relative', 
          zIndex: 3, 
          color: isDark ? 'white' : '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px'
        }}>

          {/* Badges and Tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
            <span style={{ 
              padding: '4px 14px', 
              borderRadius: '8px', 
              background: categoryColor(blog.category), 
              color: 'white', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              {blog.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: isDark ? 'white' : '#475569' }}>
              <FiClock size={14} /> {blog.readTime || '5 min read'}
            </span>
            {blog.featured && (
              <span style={{ 
                padding: '3px 10px', 
                borderRadius: '6px', 
                background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)', 
                border: isDark ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(245,158,11,0.2)', 
                color: isDark ? '#FBBF24' : '#D97706', 
                fontSize: '0.72rem', 
                fontWeight: 700 
              }}>
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ 
            fontFamily: 'Poppins', 
            fontWeight: 800, 
            fontSize: 'clamp(1.8rem, 5.5vw, 3rem)', 
            lineHeight: 1.25, 
            margin: '8px 0 0 0', 
            letterSpacing: '-0.02em', 
            color: isDark ? 'white' : '#0F172A',
            textShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : 'none' 
          }}>
            {blog.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', 
            lineHeight: 1.6, 
            maxWidth: '850px', 
            margin: 0,
            color: isDark ? '#CBD5E1' : '#475569'
          }}>
            {blog.excerpt}
          </p>

          {/* Tags list */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {blog.tags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#6366F1';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#6366F1';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.9)' : '#475569';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '5px 14px', 
                    borderRadius: '999px', 
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)', 
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)', 
                    color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#475569', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    zIndex: 4
                  }}
                >
                  #{tag.toLowerCase()}
                </button>
              ))}
            </div>
          )}

          {/* Author and Action row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%', 
            flexWrap: 'wrap', 
            gap: '24px', 
            marginTop: '20px', 
            borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', 
            paddingTop: '20px',
            position: 'relative',
            zIndex: 4
          }}>
            {/* Author info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={authorPhoto} 
                alt={displayAuthorName} 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.08)' 
                }} 
              />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, color: isDark ? '#FFFFFF' : '#0F172A' }}>{displayAuthorName}</p>
                <p style={{ fontSize: '0.78rem', margin: '2px 0 0 0', color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Body */}
      <article style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '50px 24px', 
        position: 'relative', 
        zIndex: 1, 
        lineHeight: 1.85, 
        fontSize: '1.08rem', 
        color: isDark ? '#CBD5E1' : '#334155' 
      }}>
        {/* Render content paragraphs with headers parsing */}
        {blog.content.split('\n\n').map((para, idx) => {
          if (para.startsWith('###')) {
            // Render Subheader
            const text = para.replace('###', '').trim();
            return (
              <h3 
                key={idx} 
                style={{ 
                  fontFamily: 'Poppins', 
                  fontWeight: 700, 
                  fontSize: '1.45rem', 
                  color: isDark ? '#FFFFFF' : '#0F172A', 
                  marginTop: '36px', 
                  marginBottom: '16px' 
                }}
              >
                {text}
              </h3>
            );
          } else if (para.startsWith('##')) {
            // Render Header
            const text = para.replace('##', '').trim();
            return (
              <h2 
                key={idx} 
                style={{ 
                  fontFamily: 'Poppins', 
                  fontWeight: 800, 
                  fontSize: '1.75rem', 
                  color: isDark ? '#FFFFFF' : '#0F172A', 
                  marginTop: '40px', 
                  marginBottom: '18px',
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                  paddingBottom: '8px'
                }}
              >
                {text}
              </h2>
            );
          } else if (para.startsWith('-')) {
            // Render Bullet points list
            const lines = para.split('\n').filter(Boolean);
            return (
              <ul key={idx} style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                {lines.map((line, lIdx) => {
                  const cleaned = line.replace(/^-|\*/g, '').trim();
                  // Parse bold text **word**
                  const parts = cleaned.split('**');
                  return (
                    <li key={lIdx} style={{ marginBottom: '8px' }}>
                      {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{part}</strong> : part)}
                    </li>
                  );
                })}
              </ul>
            );
          } else {
            // Standard paragraph with bold text parsing
            const parts = para.split('**');
            return (
              <p key={idx} style={{ marginBottom: '24px' }}>
                {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{part}</strong> : part)}
              </p>
            );
          }
        })}
      </article>

      {/* Comments Section */}
      <section style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 24px 100px', 
        fontFamily: 'Inter',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Divider */}
        <div style={{ 
          borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', 
          margin: '40px 0 50px 0' 
        }} />

        {/* Header / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <FiMessageSquare size={24} style={{ color: '#6366F1' }} />
          <h2 style={{ 
            fontFamily: 'Poppins', 
            fontWeight: 800, 
            fontSize: '1.75rem', 
            color: isDark ? '#FFFFFF' : '#0F172A',
            margin: 0
          }}>
            Comments
          </h2>
          <span style={{ 
            background: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)', 
            color: '#6366F1', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            padding: '3px 10px', 
            borderRadius: '999px',
            fontFamily: 'Poppins'
          }}>
            {comments.length}
          </span>
        </div>

        {/* Form to submit comment */}
        <form onSubmit={handleCommentSubmit} style={{ 
          background: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF', 
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', 
          borderRadius: '16px', 
          padding: '28px', 
          marginBottom: '48px',
          boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.2)' : '0 4px 30px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ 
            fontFamily: 'Poppins', 
            fontWeight: 700, 
            fontSize: '1.15rem', 
            color: isDark ? '#FFFFFF' : '#0F172A', 
            margin: '0 0 8px 0' 
          }}>
            Share your thoughts
          </h3>
          <p style={{ 
            fontSize: '0.82rem', 
            color: isDark ? '#94A3B8' : '#64748B', 
            margin: '0 0 24px 0' 
          }}>
            Your email address will not be published. Required fields are marked *
          </p>

          {/* Form Message */}
          {commentMessage && (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '10px', 
              fontSize: '0.88rem', 
              fontWeight: 500,
              marginBottom: '20px',
              border: commentMessageType === 'success' 
                ? (isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.15)')
                : (isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.15)'),
              background: commentMessageType === 'success' 
                ? (isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)')
                : (isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)'),
              color: commentMessageType === 'success' ? '#10B981' : '#EF4444'
            }}>
              {commentMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.78rem', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: isDark ? '#94A3B8' : '#64748B',
                marginBottom: '6px'
              }}>
                Name *
              </label>
              <input 
                type="text" 
                value={commentName} 
                onChange={e => setCommentName(e.target.value)}
                placeholder="John Doe"
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: '8px', 
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1', 
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', 
                  color: isDark ? '#E2E8F0' : '#1E293B', 
                  fontSize: '0.88rem', 
                  outline: 'none', 
                  boxSizing: 'border-box' 
                }} 
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.78rem', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: isDark ? '#94A3B8' : '#64748B',
                marginBottom: '6px'
              }}>
                Email *
              </label>
              <input 
                type="email" 
                value={commentEmail} 
                onChange={e => setCommentEmail(e.target.value)}
                placeholder="john@example.com"
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: '8px', 
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1', 
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', 
                  color: isDark ? '#E2E8F0' : '#1E293B', 
                  fontSize: '0.88rem', 
                  outline: 'none', 
                  boxSizing: 'border-box' 
                }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.78rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: isDark ? '#94A3B8' : '#64748B',
              marginBottom: '6px'
            }}>
              Comment *
            </label>
            <textarea 
              rows={4}
              value={commentContent} 
              onChange={e => setCommentContent(e.target.value)}
              placeholder="What are your thoughts on this article?"
              required
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1', 
                background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', 
                color: isDark ? '#E2E8F0' : '#1E293B', 
                fontSize: '0.88rem', 
                outline: 'none', 
                boxSizing: 'border-box',
                resize: 'vertical'
              }} 
            />
          </div>

          {/* Remember Credentials Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ 
                width: '16px', 
                height: '16px', 
                cursor: 'pointer',
                accentColor: '#6366F1'
              }}
            />
            <label htmlFor="rememberMe" style={{ 
              fontSize: '0.82rem', 
              color: isDark ? '#94A3B8' : '#64748B',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              Save my name and email in this browser for the next time I comment.
            </label>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={submittingComment}
            style={{ 
              padding: '12px 28px', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: submittingComment ? 'not-allowed' : 'pointer', 
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', 
              color: 'white', 
              fontFamily: 'Poppins', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              opacity: submittingComment ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {submittingComment ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comments.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: isDark ? '#94A3B8' : '#64748B', 
              background: isDark ? 'rgba(255,255,255,0.01)' : '#F8FAFC', 
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0',
              borderRadius: '16px' 
            }}>
              Be the first to share your thoughts on this article!
            </div>
          ) : (
            comments.map(c => (
              <div 
                key={c._id} 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF', 
                  border: c.approved ? (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0') : '1px solid rgba(234,179,8,0.3)'
                }}
              >
                {/* Avatar */}
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`} 
                  alt={c.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}
                />
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          {c.name}
                        </span>
                        {!c.approved && (
                          <span style={{ 
                            background: 'rgba(234,179,8,0.15)', 
                            color: '#EAB308', 
                            fontSize: '0.68rem', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                          }}>
                            Pending Moderation
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginTop: '2px' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Delete button for comment owner */}
                    {c.isOwner && (
                      <button 
                        onClick={() => handleCommentDelete(c._id)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'rgba(239,68,68,0.08)',
                          color: '#EF4444',
                          display: 'flex',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        title="Delete your comment"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.92rem', 
                    lineHeight: 1.6, 
                    color: isDark ? '#CBD5E1' : '#334155', 
                    margin: '12px 0 0 0',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
