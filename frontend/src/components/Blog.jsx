import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSearch, FiCalendar, FiArrowRight, FiClock, FiStar } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const SAMPLE_BLOGS = [
  {
    _id: '1',
    title: 'Building Scalable MERN Apps: Best Practices in 2024',
    excerpt: 'A deep dive into architecture patterns, performance optimization, and deployment strategies for production-ready MERN stack applications.',
    category: 'backend',
    categoryColor: '#6366F1',
    featured: true,
    tags: ['MERN', 'Node.js', 'MongoDB', 'React'],
    author: 'Hardik Prajapati',
    createdAt: '2024-03-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80',
  },
  {
    _id: '2',
    title: 'Mastering React Performance with useMemo & useCallback',
    excerpt: 'Learn when and how to use React\'s memoization hooks to prevent unnecessary re-renders and dramatically boost app performance.',
    category: 'frontend',
    categoryColor: '#3B82F6',
    featured: false,
    tags: ['React', 'Performance', 'Hooks'],
    author: 'Hardik Prajapati',
    createdAt: '2024-02-28',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
  },
  {
    _id: '3',
    title: 'Designing Beautiful UIs: Glassmorphism & Neumorphism',
    excerpt: 'Explore modern UI design trends including glassmorphism and neumorphism, with practical examples using Tailwind CSS and Framer Motion.',
    category: 'design',
    categoryColor: '#8B5CF6',
    featured: false,
    tags: ['UI/UX', 'Tailwind', 'Design'],
    author: 'Hardik Prajapati',
    createdAt: '2024-02-10',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  },
  {
    _id: '4',
    title: 'MongoDB Aggregation Pipelines: The Complete Guide',
    excerpt: 'Master MongoDB aggregation pipelines from basics to advanced stages like $lookup, $unwind, $group, and real-world use cases.',
    category: 'backend',
    categoryColor: '#6366F1',
    featured: false,
    tags: ['MongoDB', 'Database', 'NoSQL'],
    author: 'Hardik Prajapati',
    createdAt: '2024-01-22',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
  },
  {
    _id: '5',
    title: 'JWT Authentication: Secure Your Express APIs',
    excerpt: 'A step-by-step guide to implementing JWT-based authentication with refresh tokens, role-based access control, and security best practices.',
    category: 'backend',
    categoryColor: '#6366F1',
    featured: false,
    tags: ['JWT', 'Security', 'Express', 'Node.js'],
    author: 'Hardik Prajapati',
    createdAt: '2024-01-08',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  },
  {
    _id: '6',
    title: 'Framer Motion: Advanced Animations in React',
    excerpt: 'From basic transitions to complex orchestrated animations, page transitions, and scroll-triggered effects using Framer Motion.',
    category: 'frontend',
    categoryColor: '#3B82F6',
    featured: false,
    tags: ['React', 'Animation', 'Framer Motion'],
    author: 'Hardik Prajapati',
    createdAt: '2023-12-15',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
];

const CATEGORIES = ['all', 'frontend', 'backend', 'design'];

function categoryColor(cat) {
  const map = { frontend: '#3B82F6', backend: '#6366F1', design: '#8B5CF6', general: '#EC4899' };
  return map[cat] || '#6366F1';
}

export default function Blog({ initialTag = '', standalone = false }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [blogs, setBlogs] = useState(SAMPLE_BLOGS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState(initialTag);

  useEffect(() => {
    const url = tagFilter ? `/api/blogs?tag=${encodeURIComponent(tagFilter)}` : '/api/blogs';
    axios.get(url)
      .then(r => {
        if (r.data.data?.length) {
          setBlogs(r.data.data);
        } else {
          setBlogs(SAMPLE_BLOGS);
        }
      })
      .catch(() => {
        setBlogs(SAMPLE_BLOGS);
      });
  }, [tagFilter]);

  const filtered = blogs.filter(b => {
    const matchCat = filter === 'all' || b.category === filter;
    const searchLower = search.toLowerCase().trim();
    const matchSearch = !searchLower || 
      (b.title && b.title.toLowerCase().includes(searchLower)) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchLower)) ||
      (b.content && b.content.toLowerCase().includes(searchLower)) ||
      (b.category && b.category.toLowerCase().includes(searchLower)) ||
      (b.tags && b.tags.some(t => t && t.toLowerCase().includes(searchLower)));
    const matchTag = !tagFilter || (b.tags && b.tags.some(t => t && t.toLowerCase() === tagFilter.toLowerCase()));
    return matchCat && matchSearch && matchTag;
  });

  const cardBg = isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0';

  return (
    <section id="blog" ref={ref} style={{ padding: '100px 0', background: 'inherit' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {!standalone && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="section-eyebrow">Thoughts & Insights</span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '12px', color: isDark ? '#F1F5F9' : '#0F172A', letterSpacing: '-0.02em' }}>
              Tech <span className="gradient-text">Blog</span>
            </h2>
            <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'linear-gradient(to right,#6366F1,#3B82F6)', margin: '20px auto 0' }} />
          </motion.div>
        )}

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#94A3B8' : '#64748B' }} size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', textTransform: 'capitalize', transition: 'all 0.25s', background: filter === cat ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: filter === cat ? 'white' : isDark ? '#94A3B8' : '#64748B', boxShadow: filter === cat ? '0 4px 14px rgba(99,102,241,0.3)' : 'none' }}>
                {cat === 'all' ? 'All Posts' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: '24px' }}>
          {[...filtered].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          }).map((blog, i) => (
            <motion.article key={blog._id}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }}
              whileHover={{ 
                y: -6, 
                borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                boxShadow: isDark ? '0 20px 50px rgba(99, 102, 241, 0.15)' : '0 20px 50px rgba(99, 102, 241, 0.08)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC'
              }}
              onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
              style={{ 
                borderRadius: '20px', 
                background: cardBg, 
                border: cardBorder, 
                overflow: 'hidden', 
                cursor: 'pointer', 
                transition: 'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease' 
              }}
            >
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img src={blog.image} alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent 60%)' }} />
                 <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '3px 12px', borderRadius: '20px', background: `${blog.categoryColor || categoryColor(blog.category)}CC`, color: 'white', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {blog.category}
                </span>
                {blog.featured && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '3px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.95)', color: 'white', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar size={10} style={{ fill: 'white' }} /> Featured
                  </span>
                )}
              </div>

              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Inter', fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    <FiCalendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Inter', fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    <FiClock size={12} /> {blog.readTime || '5 min read'}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.title}
                </h3>

                <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', lineHeight: 1.7, color: isDark ? '#94A3B8' : '#64748B', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.excerpt}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {(blog.tags || []).slice(0, 3).map(tag => (
                    <button 
                      key={tag} 
                      onClick={(e) => { e.stopPropagation(); navigate(`/tag/${encodeURIComponent(tag)}`); }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#6366F1';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.9)';
                        e.currentTarget.style.color = isDark ? '#CBD5E1' : '#334155';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        border: 'none', 
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.9)', 
                        color: isDark ? '#CBD5E1' : '#334155', 
                        fontSize: '0.72rem', 
                        fontWeight: 600, 
                        cursor: 'pointer', 
                        transition: 'all 0.25s ease' 
                      }}
                    >
                      #{tag.toLowerCase()}
                    </button>
                  ))}
                </div>

                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', padding: 0 }}>
                  Read More <FiArrowRight size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: isDark ? '#94A3B8' : '#64748B', fontFamily: 'Inter' }}>
            No articles found for your search.
          </div>
        )}
      </div>
    </section>
  );
}
