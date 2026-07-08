import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDatabase, FiLayers, FiMapPin } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function CaseStudyInkDrop() {
  const { isDark } = useTheme();
  const background = isDark ? '#050812' : '#F8FAFC';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const textColor = isDark ? '#E2E8F0' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div style={{ minHeight: '100vh', background, color: textColor, fontFamily: 'Inter, sans-serif', padding: '24px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24 }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#10B981', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Case Study</p>
              <h1 style={{ margin: '10px 0 0', fontSize: 'clamp(2.2rem, 3.5vw, 3.4rem)', lineHeight: 1.05 }}>InkDrop — Blogging Platform Architecture</h1>
            </div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 14, background: isDark ? '#111827' : '#F8FAFC', border: `1px solid ${borderColor}`, color: textColor, textDecoration: 'none', fontWeight: 600 }}>
              <FiArrowLeft size={16} /> Back to Home
            </Link>
          </div>
          <p style={{ margin: 0, maxWidth: 820, fontSize: '1rem', lineHeight: 1.75, color: mutedColor }}>
            A premium case study template for InkDrop, the flagship blogging platform. This page focuses on system design, data flow, and NoSQL modelling for a scalable content experience.
          </p>
        </header>

        <section style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}`, minHeight: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FiMapPin size={20} color="#6366F1" />
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Context Level 0</h2>
              </div>
              <p style={{ color: mutedColor, lineHeight: 1.8 }}>
                InkDrop is modelled as a single external system that interacts with Authors, Readers, and the Admin dashboard. This level abstracts the platform boundaries and shows external data exchanges for content creation, publishing, and engagement.
              </p>
              <div style={{ marginTop: 16, padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>External Entities</strong>
                <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                  <li>Author</li>
                  <li>Reader</li>
                  <li>Admin</li>
                </ul>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}`, minHeight: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FiDatabase size={20} color="#6366F1" />
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Level 1 Data Flow Diagram</h2>
              </div>
              <p style={{ color: mutedColor, lineHeight: 1.8 }}>
                This diagram decomposes InkDrop into core subsystems: Content Engine, Editorial Workflow, Search & Indexing, and Analytics. Data flows include post publishing, comment ingestion, and reader feedback loops.
              </p>
              <div style={{ marginTop: 16, padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Primary Flows</strong>
                <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                  <li>Author &rarr; Publish Post</li>
                  <li>Reader &rarr; Comment & Rating</li>
                  <li>Post Metadata &rarr; Search Index</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <FiLayers size={20} color="#6366F1" />
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Entity Relationship Diagram</h2>
            </div>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                { title: 'UserCollection', description: 'Stores author profiles, reader accounts, roles, and access scopes.' },
                { title: 'PostsCollection', description: 'Contains blog posts, drafts, metadata, tags, publication state, and author references.' },
                { title: 'CategoryCollection', description: 'Defines categories, taxonomy, and category-to-post mappings.' },
                { title: 'CommentsCollection', description: 'Holds comments, moderation flags, author references, and post associations.' },
              ].map((item) => (
                <div key={item.title} style={{ padding: 18, borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ margin: 0, color: mutedColor, lineHeight: 1.8 }}>{item.description}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'grid', gap: 14, color: mutedColor, fontSize: '0.95rem' }}>
              <p style={{ margin: 0 }}><strong>UserCollection ➜ PostsCollection</strong>: each post references its author via <code>authorId</code>. Users can also publish drafts and manage content ownership.</p>
              <p style={{ margin: 0 }}><strong>PostsCollection ➜ CategoryCollection</strong>: each post belongs to one or more categories via <code>categoryIds</code> for filtering and navigation.</p>
              <p style={{ margin: 0 }}><strong>CommentsCollection ➜ PostsCollection</strong>: comments are linked to posts through <code>postId</code>, enabling threaded discussions and moderation.</p>
              <p style={{ margin: 0 }}><strong>CommentsCollection ➜ UserCollection</strong>: comments store <code>authorId</code> to identify the commenter and enforce reputation rules.</p>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 20, padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <FiDatabase size={20} color="#6366F1" />
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>NoSQL Schema Overview</h2>
          </div>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ padding: 20, borderRadius: 20, background: isDark ? '#111827' : '#FFFFFF', border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: 0, fontSize: '1rem', marginBottom: 10 }}>UserCollection</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                <li><code>_id</code>, <code>name</code>, <code>email</code>, <code>role</code>, <code>bio</code>, <code>avatarUrl</code></li>
                <li>authors publish posts and readers submit comments</li>
              </ul>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: isDark ? '#111827' : '#FFFFFF', border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: 0, fontSize: '1rem', marginBottom: 10 }}>PostsCollection</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                <li><code>_id</code>, <code>title</code>, <code>slug</code>, <code>content</code>, <code>authorId</code>, <code>categoryIds</code>, <code>status</code>, <code>publishedAt</code></li>
                <li>supports draft/published workflow and metadata for search</li>
              </ul>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: isDark ? '#111827' : '#FFFFFF', border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: 0, fontSize: '1rem', marginBottom: 10 }}>CategoryCollection</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                <li><code>_id</code>, <code>name</code>, <code>slug</code>, <code>description</code>, <code>parentCategoryId</code></li>
                <li>categories are referenced by posts for fast filtering</li>
              </ul>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: isDark ? '#111827' : '#FFFFFF', border: `1px solid ${borderColor}` }}>
              <h3 style={{ margin: 0, fontSize: '1rem', marginBottom: 10 }}>CommentsCollection</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: mutedColor, lineHeight: 1.8 }}>
                <li><code>_id</code>, <code>postId</code>, <code>authorId</code>, <code>content</code>, <code>createdAt</code>, <code>status</code></li>
                <li>allows moderation, nested replies, and author attribution</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ padding: 24, borderRadius: 24, background: cardBg, border: `1px solid ${borderColor}`, display: 'grid', gap: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Design Principles</h2>
          <div style={{ display: 'grid', gap: 14, color: mutedColor, lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}><strong>API-first, content-centric architecture:</strong> InkDrop is designed so the frontend, mobile clients, and editorial dashboards consume the same structured content API.</p>
            <p style={{ margin: 0 }}><strong>NoSQL modeling for performance:</strong> Collections are denormalized where needed, with author references and category arrays on posts for efficient reads.</p>
            <p style={{ margin: 0 }}><strong>Scalable publishing workflow:</strong> Draft state, review metadata, and scheduled publishing are handled in the PostsCollection while keeping the public feed fast.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
