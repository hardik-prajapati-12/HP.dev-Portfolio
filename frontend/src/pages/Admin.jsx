import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiFolder, FiMail, FiFileText, FiLogOut, FiMenu, FiX, FiTrash2, FiPlusCircle, FiUsers, FiBarChart2, FiAward, FiEdit2, FiCheckCircle, FiAlertCircle, FiUser, FiCpu, FiBriefcase, FiBookOpen, FiLayers, FiTrendingUp, FiUpload, FiImage, FiEye, FiEyeOff, FiArrowRight, FiHash, FiSettings, FiCornerUpLeft, FiSend, FiStar, FiMessageSquare, FiBell, FiMoon, FiSun, FiActivity } from 'react-icons/fi';
import EmojiIcon from '../components/EmojiIcon';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAdminSession } from '../context/AdminSessionContext';
import { adminApi, getAdminHeaders, isAdminAccessVerified, setAdminAccessKey } from '../utils/adminApi';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo-dark.png';
import { getSkillIconDetails } from '../utils/skillIcons';


/* ─────────── IMAGE UPLOAD ─────────── */
function ImageUpload({ label, value, onChange, token, isDark, labelStyle }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const muted = isDark ? '#94A3B8' : '#64748B';

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { ...getAdminHeaders(token), 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{label}</label>
      {value && (
        <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', display: 'inline-flex', flexDirection: 'column', gap: '8px' }}>
          <img src={value} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover' }} />
          <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: muted, wordBreak: 'break-all', maxWidth: '200px' }}>{value}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: isDark ? '1px dashed rgba(99,102,241,0.35)' : '1px dashed rgba(99,102,241,0.4)', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', color: '#6366F1', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
          {uploading ? <FiUpload size={15} /> : <FiImage size={15} />}
          {uploading ? 'Uploading...' : value ? 'Change Image' : 'Choose Image'}
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.15)',
              background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
              color: '#EF4444',
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)';
            }}
          >
            <FiTrash2 size={14} />
            Remove Image
          </button>
        )}
      </div>
      {error && <p style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '0.78rem', marginTop: '8px' }}>{error}</p>}
      <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: muted, marginTop: '8px' }}>JPG, PNG, GIF, WebP or SVG · Max 5MB</p>
    </div>
  );
}

/* ─────────── CRUD MODAL ─────────── */
function CrudModal({ isOpen, onClose, type, data, form, setForm, onSubmit, isDark, token, isPage = false, globalData }) {
  if (!isOpen) return null;

  const projectCategories = globalData?.projectCategories || [];
  const blogCategories = globalData?.blogCategories || [];
  const experienceTypes = globalData?.experienceTypes || [];
  const skillCategories = globalData?.skillCategories || [];

  const title = data ? `Edit ${type}` : `Add New ${type}`;
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    color: isDark ? '#E2E8F0' : '#1E293B',
    fontFamily: 'Inter',
    fontSize: '0.88rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '12px'
  };

  const optionStyle = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    color: isDark ? '#F1F5F9' : '#0F172A',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%2394A3B8' : '%2364748B'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
    paddingRight: '40px',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '0.78rem',
    color: isDark ? '#94A3B8' : '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '6px'
  };
  const shellStyle = isPage
    ? { width: '100%' }
    : { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '20px' };
  const panelStyle = isPage
    ? {
        width: '100%',
        maxWidth: '1080px',
        overflow: 'visible',
        background: isDark ? '#111827' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: isDark ? '0 18px 50px rgba(0,0,0,0.24)' : '0 18px 50px rgba(15,23,42,0.08)',
        boxSizing: 'border-box'
      }
    : {
        width: '100%',
        maxWidth: '580px',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: isDark ? '#111827' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      };

  return (
    <div style={shellStyle}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={panelStyle}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: isPage ? '1.55rem' : '1.25rem', color: isDark ? '#F1F5F9' : '#0F172A', textTransform: 'capitalize', margin: 0 }}>{title}</h3>
            {isPage && (
              <p style={{ margin: '6px 0 0', fontFamily: 'Inter', fontSize: '0.88rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                Manage every detail in the full workspace. The admin navigation remains available on the left.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="admin-close-button"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
              cursor: 'pointer',
              '--admin-close-color': isDark ? '#94A3B8' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={isPage ? 'admin-crud-page-form' : undefined}>
          {/* Projects fields */}
          {type === 'project' && (
            <>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={selectStyle} value={form.category || ''} onChange={e => {
                    const selectedCat = projectCategories.find(c => c.name === e.target.value);
                    setForm({ ...form, category: e.target.value, categoryColor: selectedCat?.color || '#6366F1' });
                  }} required>
                    <option value="" disabled style={optionStyle}>Select Category</option>
                    {projectCategories.map(cat => (
                      <option key={cat._id} value={cat.name} style={optionStyle}>{cat.name}</option>
                    ))}
                    <option value="Uncategorized" style={optionStyle}>Uncategorized</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Featured</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '44px', gap: '8px' }}>
                    <input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#6366F1' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>Yes, featured</span>
                  </div>
                </div>
              </div>

              <ImageUpload label="Project Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <label style={labelStyle}>Technologies (comma-separated)</label>
              <input style={inputStyle} value={form.technologies || ''} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />

              <label style={labelStyle}>Key Features (comma-separated)</label>
              <input style={inputStyle} value={form.features || ''} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="User Auth, Stripe Payments" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input style={inputStyle} value={form.githubUrl || ''} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <label style={labelStyle}>Live URL</label>
                  <input style={inputStyle} value={form.liveUrl || ''} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <label style={labelStyle}>Short Description</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} required />

              <label style={labelStyle}>Detailed Overview (Long Description)</label>
              <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' }} value={form.longDescription || ''} onChange={e => setForm({ ...form, longDescription: e.target.value })} placeholder="Detailed write-up, features, challenges, and implementation overview of this project..." />

              <div style={{ margin: '20px 0 16px', padding: '18px', borderRadius: '14px', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', border: isDark ? '1px solid rgba(99,102,241,0.18)' : '1px solid rgba(99,102,241,0.16)' }}>
                <h4 style={{ margin: '0 0 6px', fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: isDark ? '#F1F5F9' : '#0F172A' }}>Case Study Information</h4>
                <p style={{ margin: 0, fontFamily: 'Inter', fontSize: '0.82rem', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Manage the structured case study shown on the project details page.
                </p>
              </div>

              <ImageUpload label="Case Study Cover Image" value={form.caseStudyImage || ''} onChange={(url) => setForm({ ...form, caseStudyImage: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <div style={{ margin: '16px 0 20px', padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <label style={labelStyle}>System Architecture Diagrams</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                  {(form.caseStudyArchitectureDiagrams || []).map((diagram, idx) => (
                    <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>Diagram #{idx + 1}</span>
                        <button type="button" onClick={() => {
                          const newDiags = [...form.caseStudyArchitectureDiagrams];
                          newDiags.splice(idx, 1);
                          setForm({ ...form, caseStudyArchitectureDiagrams: newDiags });
                        }} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}><FiTrash2 size={13} /> Remove</button>
                      </div>
                      
                      <label style={{ ...labelStyle, fontSize: '0.72rem' }}>Diagram Label</label>
                      <input style={inputStyle} value={diagram.label || ''} onChange={e => {
                        const newDiags = [...form.caseStudyArchitectureDiagrams];
                        newDiags[idx] = { ...newDiags[idx], label: e.target.value };
                        setForm({ ...form, caseStudyArchitectureDiagrams: newDiags });
                      }} placeholder="e.g. System Flow" required />
                      
                      <ImageUpload label="Diagram Image" value={diagram.imageUrl || ''} onChange={(url) => {
                        const newDiags = [...form.caseStudyArchitectureDiagrams];
                        newDiags[idx] = { ...newDiags[idx], imageUrl: url };
                        setForm({ ...form, caseStudyArchitectureDiagrams: newDiags });
                      }} token={token} isDark={isDark} labelStyle={{ ...labelStyle, fontSize: '0.72rem' }} />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => {
                  const newDiags = [...(form.caseStudyArchitectureDiagrams || []), { label: '', imageUrl: '' }];
                  setForm({ ...form, caseStudyArchitectureDiagrams: newDiags });
                }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)', color: '#6366F1', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem' }}><FiPlusCircle size={14} /> Add Diagram</button>
              </div>

              <label style={labelStyle}>Case Study Title</label>
              <input style={inputStyle} value={form.caseStudyTitle || ''} onChange={e => setForm({ ...form, caseStudyTitle: e.target.value })} placeholder="How this project is structured and delivered" />

              <label style={labelStyle}>Case Study Badge</label>
              <input style={inputStyle} value={form.caseStudyBadge || ''} onChange={e => setForm({ ...form, caseStudyBadge: e.target.value })} placeholder="Production-focused build" />

              <label style={labelStyle}>Problem & Goal</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.caseStudyProblem || ''} onChange={e => setForm({ ...form, caseStudyProblem: e.target.value })} placeholder="Explain the project challenge, goals, and user needs..." />

              <label style={labelStyle}>Architecture & Flow</label>
              <textarea style={{ ...inputStyle, height: '130px', resize: 'vertical' }} value={form.caseStudyArchitecture || ''} onChange={e => setForm({ ...form, caseStudyArchitecture: e.target.value })} placeholder={'Presentation Layer: Responsive UI and navigation\nApplication Logic: Validation, state, and feature workflows\nData Layer: Database collections and storage strategy'} />

              <label style={labelStyle}>Data Model</label>
              <textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }} value={form.caseStudyDataModel || ''} onChange={e => setForm({ ...form, caseStudyDataModel: e.target.value })} placeholder={'Users: Profiles, roles, and sessions\nPosts: Published content, drafts, and metadata\nComments: Feedback and moderation state'} />

              <label style={labelStyle}>Feature Focus (one per line)</label>
              <textarea style={{ ...inputStyle, height: '110px', resize: 'vertical' }} value={form.caseStudyFeatureFocus || ''} onChange={e => setForm({ ...form, caseStudyFeatureFocus: e.target.value })} placeholder={'Secure authentication\nBlog post management\nResponsive design'} />

              <label style={labelStyle}>Outcomes (one per line)</label>
              <textarea style={{ ...inputStyle, height: '110px', resize: 'vertical' }} value={form.caseStudyOutcomes || ''} onChange={e => setForm({ ...form, caseStudyOutcomes: e.target.value })} placeholder={'Clear project structure\nMaintainable feature delivery\nProfessional user experience'} />

              <label style={labelStyle}>Live Project Insight</label>
              <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} value={form.caseStudyInsight || ''} onChange={e => setForm({ ...form, caseStudyInsight: e.target.value })} placeholder="Short note connecting the live project to the case study..." />
            </>
          )}

          {/* Blogs fields */}
          {type === 'blog' && (
            <>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={selectStyle} value={form.category || ''} onChange={e => {
                    const selectedCat = blogCategories.find(c => c.name === e.target.value);
                    setForm({ ...form, category: e.target.value, categoryColor: selectedCat?.color || '#6366F1' });
                  }} required>
                    <option value="" disabled style={optionStyle}>Select Category</option>
                    {blogCategories.map(cat => (
                      <option key={cat._id} value={cat.name} style={optionStyle}>{cat.name}</option>
                    ))}
                    <option value="Uncategorized" style={optionStyle}>Uncategorized</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Category Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        style={{ ...inputStyle, marginBottom: 0 }}
                        value={form.categoryColor || '#6366F1'}
                        onChange={e => setForm({ ...form, categoryColor: e.target.value })}
                        placeholder="#6366F1"
                      />
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: form.categoryColor && form.categoryColor.startsWith('#') && form.categoryColor.length === 7 ? form.categoryColor : '#6366F1',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                      title="Choose Category Color"
                    >
                      <input
                        type="color"
                        value={form.categoryColor && form.categoryColor.startsWith('#') && form.categoryColor.length === 7 ? form.categoryColor : '#6366F1'}
                        onChange={e => setForm({ ...form, categoryColor: e.target.value.toUpperCase() })}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Read Time</label>
                  <input style={inputStyle} value={form.readTime || ''} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read" />
                </div>
                <div>
                  <label style={labelStyle}>Featured</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '44px', gap: '8px' }}>
                    <input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#6366F1' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>Yes, featured</span>
                  </div>
                </div>
              </div>

              <ImageUpload label="Blog Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <label style={labelStyle}>Tags (comma-separated)</label>
              <input style={inputStyle} value={form.tags || ''} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, performance" />

              <label style={labelStyle}>Excerpt (Short summary)</label>
              <input style={inputStyle} value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} required />

              <label style={labelStyle}>Content (Markdown / Text)</label>
              <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' }} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} required />
            </>
          )}

          {/* Testimonials fields */}
          {type === 'testimonial' && (
            <>
              <label style={labelStyle}>Client Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Role</label>
                  <input style={inputStyle} value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. CTO" required />
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input style={inputStyle} value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Corp" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <ImageUpload label="Client Avatar" value={form.avatar || ''} onChange={(url) => setForm({ ...form, avatar: url })} token={token} isDark={isDark} labelStyle={labelStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Rating (1-5)</label>
                  <select style={selectStyle} value={form.rating || 5} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                    <option value={5} style={optionStyle}>5 Stars</option>
                    <option value={4} style={optionStyle}>4 Stars</option>
                    <option value={3} style={optionStyle}>3 Stars</option>
                    <option value={2} style={optionStyle}>2 Stars</option>
                    <option value={1} style={optionStyle}>1 Star</option>
                  </select>
                </div>
              </div>

              <label style={labelStyle}>Content</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} required />
            </>
          )}

          {/* Certifications fields */}
          {type === 'certification' && (
            <>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Issuer</label>
                  <input style={inputStyle} value={form.issuer || ''} onChange={e => setForm({ ...form, issuer: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" style={inputStyle} value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Badge Icon (Emoji)</label>
                  <input style={inputStyle} value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="🏆" />
                </div>
                <div>
                  <label style={labelStyle}>Theme Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        style={{ ...inputStyle, marginBottom: 0 }}
                        value={form.color || ''}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        placeholder="#6366F1"
                      />
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        marginBottom: '12px',
                      }}
                      title="Choose Color"
                    >
                      <input
                        type="color"
                        value={form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1'}
                        onChange={e => setForm({ ...form, color: e.target.value.toUpperCase() })}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <label style={labelStyle}>Credential URL</label>
              <input style={inputStyle} value={form.credentialUrl || ''} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://..." />

              <ImageUpload label="Issuer Logo" value={form.logo || ''} onChange={(url) => setForm({ ...form, logo: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <ImageUpload label="Certificate Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description of the certification..." />

              <label style={labelStyle}>Skills Learned (comma-separated)</label>
              <input style={inputStyle} value={form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Express" />
            </>
          )}

          {/* Skill fields */}
          {type === 'skill' && (
            <>
              <label style={labelStyle}>Skill Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={selectStyle} value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="" disabled style={optionStyle}>Select Category</option>
                    {skillCategories.map(cat => (
                      <option key={cat._id} value={cat.name} style={optionStyle}>{cat.name}</option>
                    ))}
                    <option value="Learning" style={optionStyle}>Always Learning</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" style={inputStyle} value={form.order || 0} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
              </div>

              <ImageUpload label="Skill Image (Original Technology Logo)" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />
            </>
          )}

          {/* Experience fields */}
          {type === 'experience' && (
            <>
              <label style={labelStyle}>Job Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input style={inputStyle} value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Year / Duration</label>
                  <input style={inputStyle} value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2023 – Present" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select style={selectStyle} value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} required>
                    <option value="" disabled style={optionStyle}>Select Type</option>
                    {experienceTypes.map(t => (
                      <option key={t._id} value={t.name} style={optionStyle}>{t.name}</option>
                    ))}
                    <option value="-" style={optionStyle}>-</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Icon (Emoji)</label>
                  <input style={inputStyle} value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="💼" />
                </div>
              </div>

              <label style={labelStyle}>Technologies (comma-separated)</label>
              <input style={inputStyle} value={form.tech || ''} onChange={e => setForm({ ...form, tech: e.target.value })} placeholder="React, Node.js" />

              <ImageUpload label="Company Logo / Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
            </>
          )}

          {/* Education fields */}
          {type === 'education' && (
            <>
              <label style={labelStyle}>Degree / Qualification</label>
              <input style={inputStyle} value={form.degree || ''} onChange={e => setForm({ ...form, degree: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Institution</label>
                  <input style={inputStyle} value={form.institution || ''} onChange={e => setForm({ ...form, institution: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input style={inputStyle} value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2019 – 2023" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Grade / GPA</label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={!!form.currentlyPursuing}
                        onChange={e => {
                          const checked = e.target.checked;
                          setForm({
                            ...form,
                            currentlyPursuing: checked,
                            grade: checked ? '' : (form.grade || '')
                          });
                        }}
                        style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: '#6366F1' }}
                      />
                      Currently Pursuing
                    </label>
                  </div>
                  <input
                    style={{
                      ...inputStyle,
                      marginBottom: 0,
                      opacity: form.currentlyPursuing ? 0.5 : 1,
                      cursor: form.currentlyPursuing ? 'not-allowed' : 'text',
                      background: form.currentlyPursuing ? (isDark ? 'rgba(255,255,255,0.02)' : '#F1F5F9') : (isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF')
                    }}
                    value={form.grade || ''}
                    onChange={e => setForm({ ...form, grade: e.target.value })}
                    placeholder={form.currentlyPursuing ? 'N/A (Pursuing)' : 'GPA: 3.8 / 4.0'}
                    disabled={!!form.currentlyPursuing}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Icon (Emoji)</label>
                  <input style={{ ...inputStyle, marginBottom: 0 }} value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🎓" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Theme Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        style={{ ...inputStyle, marginBottom: 0 }}
                        value={form.color || ''}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        placeholder="#6366F1"
                      />
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                      title="Choose Color"
                    >
                      <input
                        type="color"
                        value={form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1'}
                        onChange={e => setForm({ ...form, color: e.target.value.toUpperCase() })}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={form.order !== undefined ? form.order : 0}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <ImageUpload label="Institution Logo / Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />
            </>
          )}

          {/* Service fields */}
          {type === 'service' && (
            <>
              <label style={labelStyle}>Service Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.desc || ''} onChange={e => setForm({ ...form, desc: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Icon (Emoji)</label>
                  <input style={inputStyle} value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🚀" />
                </div>
                <div>
                  <label style={labelStyle}>Theme Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        style={{ ...inputStyle, marginBottom: 0 }}
                        value={form.color || ''}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        placeholder="#6366F1"
                      />
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        marginBottom: '12px',
                      }}
                      title="Choose Color"
                    >
                      <input
                        type="color"
                        value={form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1'}
                        onChange={e => setForm({ ...form, color: e.target.value.toUpperCase() })}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ImageUpload label="Service Logo / Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />
            </>
          )}

          {/* Achievement fields */}
          {type === 'achievement' && (
            <>
              <label style={labelStyle}>Achievement Title</label>
              <input style={inputStyle} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Value / Metric</label>
                  <input style={inputStyle} value={form.value || ''} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="e.g. 1st Place, 500+" required />
                </div>
                <div>
                  <label style={labelStyle}>Icon (Emoji)</label>
                  <input style={inputStyle} value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🏆" />
                </div>
              </div>

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.desc || ''} onChange={e => setForm({ ...form, desc: e.target.value })} required />

              <ImageUpload label="Achievement Image (shown as logo/icon)" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <ImageUpload label="Certificate Image (shown in big size)" value={form.certificateImage || ''} onChange={(url) => setForm({ ...form, certificateImage: url })} token={token} isDark={isDark} labelStyle={labelStyle} />

              <label style={labelStyle}>Detailed Information</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.details || ''} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Detailed story, scope, and metrics of the achievement..." />

              <label style={labelStyle}>Skills Demonstrated (comma-separated)</label>
              <input style={inputStyle} value={form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Data Structures, Algorithms" />
            </>
          )}

          {/* Stat fields */}
          {type === 'stat' && (
            <>
              <label style={labelStyle}>Stat Label</label>
              <input style={inputStyle} value={form.label || ''} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Projects Completed" required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Value (Number)</label>
                  <input type="number" style={inputStyle} value={form.value === undefined ? '' : form.value} onChange={e => setForm({ ...form, value: e.target.value === '' ? '' : Number(e.target.value) })} placeholder="48" required />
                </div>
                <div>
                  <label style={labelStyle}>Suffix</label>
                  <input style={inputStyle} value={form.suffix || ''} onChange={e => setForm({ ...form, suffix: e.target.value })} placeholder="+" />
                </div>
                <div>
                  <label style={labelStyle}>Icon (Emoji)</label>
                  <input style={inputStyle} value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🚀" />
                </div>
              </div>

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description shown on the card..." required />

              <label style={labelStyle}>Display Order</label>
              <input type="number" style={inputStyle} value={form.order === undefined ? '' : form.order} onChange={e => setForm({ ...form, order: e.target.value === '' ? '' : Number(e.target.value) })} placeholder="0" />

              <ImageUpload label="Stat Logo / Image" value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} token={token} isDark={isDark} labelStyle={labelStyle} />
            </>
          )}

          {type === 'projectCategory' && (
            <>
              <label style={labelStyle}>Category Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
              
              <label style={labelStyle}>Category Color</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input style={{ ...inputStyle, marginBottom: 0 }} value={form.color || '#6366F1'} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#6366F1" required />
                </div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '8px',
                  background: form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                  position: 'relative', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <input type="color" value={form.color || '#6366F1'} onChange={e => setForm({ ...form, color: e.target.value })} style={{ position: 'absolute', inset: -5, width: '150%', height: '150%', cursor: 'pointer', border: 'none', background: 'none' }} />
                </div>
              </div>
            </>
          )}

          {type === 'blogCategory' && (
            <>
              <label style={labelStyle}>Category Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
              
              <label style={labelStyle}>Category Color</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input style={{ ...inputStyle, marginBottom: 0 }} value={form.color || '#6366F1'} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#6366F1" required />
                </div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '8px',
                  background: form.color && form.color.startsWith('#') && form.color.length === 7 ? form.color : '#6366F1',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                  position: 'relative', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <input type="color" value={form.color || '#6366F1'} onChange={e => setForm({ ...form, color: e.target.value })} style={{ position: 'absolute', inset: -5, width: '150%', height: '150%', cursor: 'pointer', border: 'none', background: 'none' }} />
                </div>
              </div>
            </>
          )}

          {type === 'experienceType' && (
            <>
              <label style={labelStyle}>Type Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </>
          )}

          {type === 'tag' && (
            <>
              <label style={labelStyle}>Tag Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </>
          )}

          {type === 'skillCategory' && (
            <>
              <label style={labelStyle}>Category Name</label>
              <input style={inputStyle} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1', background: 'transparent', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>Save</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─────────── ADMIN ACCESS GATE ─────────── */
function AdminAccessGate({ onVerified }) {
  const { isDark } = useTheme();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/verify-access', { accessKey: key });
      setAdminAccessKey(key);
      onVerified();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid security key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '13px 16px', paddingRight: '48px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px', background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.5)' : '0 25px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.6rem' }}>🛡️</div>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '6px' }}>Admin Access</h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#64748B' }}>Enter your security key to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input placeholder="Security Key" type={showKey ? 'text' : 'password'} value={key} onChange={e => setKey(e.target.value)} style={inputStyle} required autoFocus />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '4px',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
              title={showKey ? 'Hide security key' : 'Show security key'}
            >
              {showKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {error && <p style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <a href="/"
            style={{
              fontFamily: 'Inter', fontSize: '0.84rem',
              color: isDark ? '#94A3B8' : '#64748B',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
          >
            ← Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── LOGIN ─────────── */
function Login({ onLogin }) {
  const { isDark } = useTheme();
  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const transitionTo = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await adminApi.post('/api/auth/login', form);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Use seeded email/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await adminApi.post('/api/auth/forgot-password', { email: forgotEmail });
      setSuccessMsg(res.data.message || 'OTP sent to your email.');
      setTimeout(() => {
        transitionTo('reset');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await adminApi.post('/api/auth/reset-password', {
        email: forgotEmail,
        otp,
        newPassword
      });
      setSuccessMsg(res.data.message || 'Password reset successfully!');
      setTimeout(() => {
        transitionTo('login');
        setForm(f => ({ ...f, email: forgotEmail }));
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px',
    paddingRight: field === 'password' || field === 'newPassword' || field === 'confirmPassword' ? '48px' : '16px',
    borderRadius: '10px',
    border: focusField === field
      ? '1.5px solid #6366F1'
      : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
    background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    color: isDark ? '#E2E8F0' : '#1E293B',
    fontFamily: 'Inter',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: focusField === field ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
  });

  const labelStyle = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: isDark ? '#E2E8F0' : '#1E293B',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px', padding: '44px 40px', borderRadius: '24px', background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.5)' : '0 25px 60px rgba(0,0,0,0.08)' }}>

        {mode === 'login' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '110px', objectFit: 'contain', margin: '0 auto -10px', display: 'block' }} />
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '6px' }}>Welcome Back</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#64748B' }}>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  id="admin-login-email"
                  placeholder="your@email.com"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  style={inputStyle('email')}
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(form.email);
                      transitionTo('forgot');
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'Inter', fontWeight: 600, fontSize: '0.8rem',
                      color: '#6366F1',
                      padding: 0,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-login-password"
                    placeholder="Your password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    style={inputStyle('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {successMsg && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#10B981', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {successMsg}
                </motion.p>
              )}

              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </motion.p>
              )}

              <button type="submit" disabled={loading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
              >
                {loading ? 'Signing in...' : <><FiArrowRight size={18} style={{ order: -1 }} /> Sign In</>}
              </button>
            </form>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '110px', objectFit: 'contain', margin: '0 auto -10px', display: 'block' }} />
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '6px' }}>Forgot Password</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#64748B' }}>We'll send a 6-digit verification code to your email</p>
            </div>

            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  id="admin-forgot-email"
                  placeholder="your@email.com"
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onFocus={() => setFocusField('forgotEmail')}
                  onBlur={() => setFocusField(null)}
                  style={inputStyle('forgotEmail')}
                  required
                />
              </div>

              {successMsg && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#10B981', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {successMsg}
                </motion.p>
              )}

              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </motion.p>
              )}

              <button type="submit" disabled={loading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
              >
                {loading ? 'Sending Code...' : <><FiMail size={18} style={{ order: -1 }} /> Send Verification OTP</>}
              </button>

              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <button type="button" onClick={() => transitionTo('reset')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600, fontSize: '0.82rem', color: '#6366F1', padding: 0 }}>
                  Already have an OTP? Reset password
                </button>
              </div>
            </form>
          </>
        )}

        {mode === 'reset' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <img src={isDark ? logo : logoDark} alt="HP.dev Logo" style={{ height: '110px', objectFit: 'contain', margin: '0 auto -10px', display: 'block' }} />
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: isDark ? '#F1F5F9' : '#0F172A', marginBottom: '6px' }}>Reset Password</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#64748B' }}>Enter the code sent to <strong>{forgotEmail || 'your email'}</strong></p>
            </div>

            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>6-Digit OTP</label>
                <input
                  id="admin-reset-otp"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setFocusField('otp')}
                  onBlur={() => setFocusField(null)}
                  style={{ ...inputStyle('otp'), letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-reset-newpassword"
                    placeholder="New password (min 6 characters)"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onFocus={() => setFocusField('newPassword')}
                    onBlur={() => setFocusField(null)}
                    style={inputStyle('newPassword')}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '6px' }}>
                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-reset-confirmpassword"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusField('confirmPassword')}
                    onBlur={() => setFocusField(null)}
                    style={inputStyle('confirmPassword')}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '6px' }}>
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {successMsg && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#10B981', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {successMsg}
                </motion.p>
              )}

              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </motion.p>
              )}

              <button type="submit" disabled={loading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
              >
                {loading ? 'Resetting...' : <><FiCheckCircle size={18} style={{ order: -1 }} /> Reset Password</>}
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          {mode === 'login' ? (
            <a href="/"
              style={{
                fontFamily: 'Inter', fontSize: '0.84rem',
                color: isDark ? '#94A3B8' : '#64748B',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              ← Back to Portfolio
            </a>
          ) : (
            <button onClick={() => transitionTo('login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: '0.84rem',
                color: isDark ? '#94A3B8' : '#64748B',
                transition: 'color 0.2s',
                padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── DASHBOARD STAT CARD ─────────── */
function DashboardStatCard({ icon, label, value, color, isDark, badge, badgeColor, badgeIcon }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        padding: '20px',
        borderRadius: '14px',
        background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8E8E4',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'box-shadow 0.3s',
        position: 'relative',
        minHeight: '120px',
      }}
    >
      {/* Top row: icon + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.15rem', flexShrink: 0,
        }}>
          {icon}
        </div>
        {badge && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontFamily: 'Inter', fontWeight: 600, fontSize: '0.7rem',
            color: badgeColor || '#10B981',
            letterSpacing: '0.02em',
          }}>
            {badgeIcon && <span style={{ fontSize: '0.72rem' }}>{badgeIcon}</span>}
            {badge}
          </span>
        )}
      </div>

      {/* Bottom: value + label */}
      <div>
        <p style={{
          fontFamily: 'Poppins', fontWeight: 800,
          fontSize: '1.65rem', lineHeight: 1.1,
          color: isDark ? '#F1F5F9' : '#1A1A1A',
          marginBottom: '4px',
        }}>{value}</p>
        <p style={{
          fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 500,
          color: isDark ? '#94A3B8' : '#6B7280',
        }}>{label}</p>
      </div>
    </motion.div>
  );
}

/* ─────────── GENERIC CRUD LIST ─────────── */
function CrudList({ items, type, label, onAdd, onEdit, onDelete, renderItem, isDark }) {
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0';
  const textMain = isDark ? '#F1F5F9' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem' }}>{items.length} {label} in database</p>
        <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem' }}>
          <FiPlusCircle size={15} /> Add {type}
        </button>
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: textMuted, fontFamily: 'Inter', background: cardBg, border: cardBorder, borderRadius: '16px' }}>No {label} in database. Click Add to create one.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, idx) => (
            <div key={item._id || item.tag || idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', background: cardBg, border: cardBorder }}>
              <div style={{ flex: 1 }}>
                {renderItem(item, textMain, textMuted)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => onEdit(item)} style={{ padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(99,102,241,0.08)', color: '#6366F1', display: 'flex' }}><FiEdit2 size={14} /></button>
                <button onClick={() => onDelete(item)} style={{ padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex' }}><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}


/* ═══════════ MAIN DASHBOARD ═══════════ */
export default function AdminDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const { setAdminSession, logoutAdmin } = useAdminSession();
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [accessVerified, setAccessVerified] = useState(isAdminAccessVerified());
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState({ projects: [], messages: [], blogs: [], tags: [], comments: [], testimonials: [], certifications: [], skills: [], experience: [], education: [], services: [], achievements: [], profile: null, stats: [], projectCategories: [], blogCategories: [], experienceTypes: [], skillCategories: [] });

  // Sub-tabs state
  const [experienceSubTab, setExperienceSubTab] = useState('experiences');
  const [projectsSubTab, setProjectsSubTab] = useState('projects');
  const [blogsSubTab, setBlogsSubTab] = useState('blogs');
  const [skillsSubTab, setSkillsSubTab] = useState('skills');

  const [bellOpen, setBellOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [seenNotifIds, setSeenNotifIds] = useState(() => {
    const saved = localStorage.getItem('admin_seen_notifs');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [dismissedBellIds, setDismissedBellIds] = useState(() => {
    const saved = localStorage.getItem('admin_dismissed_bells');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const bellRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('admin_seen_notifs', JSON.stringify(Array.from(seenNotifIds)));
  }, [seenNotifIds]);

  useEffect(() => {
    localStorage.setItem('admin_dismissed_bells', JSON.stringify(Array.from(dismissedBellIds)));
  }, [dismissedBellIds]);

  // Close bell dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    if (bellOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bellOpen]);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalForm, setModalForm] = useState({});

  // Profile edit state (inline, no modal)
  const [profileForm, setProfileForm] = useState({});

  // Inbox state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: '', message: '' });

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: 'HP.dev',
    siteLogoText: 'HP.dev',
    maintenanceMode: false,
    googleAnalyticsId: '',
    metaTitle: 'HP.dev | Portfolio',
    metaDescription: 'Personal developer portfolio and project showcase.',
    metaKeywords: 'developer, portfolio, mern, react',
    socialGithub: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialInstagram: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    allowedTags: 'React, Node.js, Express, MongoDB, JavaScript',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    smtpFromName: 'HP.dev',
    smtpEncryption: 'tls',
    otpExpiryMinutes: 10,
    otpMaxAttempts: 5,
    enableVisitorLogging: true,
    corsAllowedOrigin: '*',
    visibleSections: {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      services: true,
      certifications: true,
      blog: true,
      testimonials: true,
      contact: true,
    },
  });
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(false);

  const fetchData = () => {
    if (!token) return;
    Promise.all([
      adminApi.get('/api/projects', token).catch(() => ({ data: { data: [] } })),
      adminApi.get('/api/contact', token).catch(() => ({ data: { data: [] } })),
      adminApi.get('/api/blogs?published=all', token).catch(() => ({ data: { data: [] } })),
      adminApi.get('/api/comments', token).catch(() => ({ data: { data: [] } })),
      adminApi.get('/api/blogs/tags', token).catch(() => ({ data: { data: [] } })),
      adminApi.get('/api/testimonials', token).catch(() => ({ data: [] })),
      adminApi.get('/api/certifications', token).catch(() => ({ data: [] })),
      adminApi.get('/api/skills', token).catch(() => ({ data: [] })),
      adminApi.get('/api/experience', token).catch(() => ({ data: [] })),
      adminApi.get('/api/education', token).catch(() => ({ data: [] })),
      adminApi.get('/api/services', token).catch(() => ({ data: [] })),
      adminApi.get('/api/achievements', token).catch(() => ({ data: [] })),
      adminApi.get('/api/profile', token).catch(() => ({ data: null })),
      adminApi.get('/api/stats', token).catch(() => ({ data: [] })),
      adminApi.get('/api/settings', token).catch(() => ({ data: {} })),
      adminApi.get('/api/projects/categories', token).catch(() => ({ data: [] })),
      adminApi.get('/api/blogs/categories', token).catch(() => ({ data: [] })),
      adminApi.get('/api/experience/types', token).catch(() => ({ data: [] })),
      adminApi.get('/api/skills/categories', token).catch(() => ({ data: [] })),
    ]).then(([p, c, b, cc, tg, t, certs, sk, exp, edu, svc, ach, prof, st, sett, pCats, bCats, expTypes, skCats]) => {
      const newData = {
        projects: p.data.data || [],
        messages: c.data.data || [],
        blogs: b.data.data || [],
        comments: cc.data.data || [],
        tags: tg.data.data || [],
        testimonials: Array.isArray(t.data) ? t.data : (t.data.data || []),
        certifications: Array.isArray(certs.data) ? certs.data : (certs.data.data || []),
        skills: Array.isArray(sk.data) ? sk.data : [],
        experience: Array.isArray(exp.data) ? exp.data : [],
        education: Array.isArray(edu.data) ? edu.data : [],
        services: Array.isArray(svc.data) ? svc.data : [],
        achievements: Array.isArray(ach.data) ? ach.data : [],
        profile: prof.data,
        stats: Array.isArray(st.data) ? st.data : [],
        projectCategories: Array.isArray(pCats.data) ? pCats.data : [],
        blogCategories: Array.isArray(bCats.data) ? bCats.data : [],
        experienceTypes: Array.isArray(expTypes.data) ? expTypes.data : [],
        skillCategories: Array.isArray(skCats.data) ? skCats.data : [],
      };
      setData(newData);
      if (prof.data && prof.data.name) {
        setProfileForm({ ...prof.data, roles: (prof.data.roles || []).join(', '), laptopSkills: (prof.data.laptopSkills || []).join(', ') });
      }
      if (sett && sett.data) {
        setSettingsForm(sett.data);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    if (settingsTab === 'system' && token) {
      setLoadingSystemInfo(true);
      adminApi.get('/api/settings/system-info', token)
        .then(res => {
          setSystemInfo(res.data);
        })
        .catch(err => {
          showToast('Failed to load system info: ' + (err.response?.data?.message || err.message), 'error');
        })
        .finally(() => {
          setLoadingSystemInfo(false);
        });
    }
  }, [settingsTab, token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setAdminSession(newToken);
  };

  const logout = () => {
    logoutAdmin();
    setToken(null);
  };

  if (!accessVerified) return <AdminAccessGate onVerified={() => setAccessVerified(true)} />;
  if (!token) return <Login onLogin={handleLogin} />;

  /* ── Modal helpers ── */
  const defaultForms = {
    project: { title: '', category: '', image: '', technologies: '', features: '', githubUrl: '', liveUrl: '', featured: false, description: '', longDescription: '', caseStudyTitle: '', caseStudyBadge: 'Production-focused build', caseStudyProblem: '', caseStudyArchitecture: '', caseStudyDataModel: '', caseStudyFeatureFocus: '', caseStudyOutcomes: '', caseStudyInsight: '', caseStudyImage: '', caseStudyArchitectureDiagrams: [] },
    blog: { title: '', category: '', image: '', tags: '', readTime: '', excerpt: '', content: '', featured: false, categoryColor: '#6366F1' },
    testimonial: { name: '', role: '', company: '', avatar: '', rating: 5, content: '' },
    certification: { title: '', issuer: '', date: new Date().toISOString().split('T')[0], color: '#6366F1', badge: '🏆', credentialUrl: '', description: '', skills: '', logo: '', image: '' },
    skill: { name: '', category: 'Frontend', level: 100, icon: '⚡', order: 0, image: '' },
    experience: { title: '', company: '', year: '', type: '', description: '', tech: '', icon: '💼', image: '' },
    education: { degree: '', institution: '', year: '', grade: '', icon: '🎓', color: '#6366F1', order: 0, currentlyPursuing: false, image: '' },
    service: { title: '', desc: '', icon: '🚀', color: '#6366F1', image: '' },
    achievement: { title: '', desc: '', icon: '🏆', value: '', details: '', skills: '', image: '', certificateImage: '' },
    stat: { label: '', value: 0, suffix: '', icon: '🚀', description: '', order: 0, image: '' },
    projectCategory: { name: '', color: '#6366F1' },
    blogCategory: { name: '', color: '#6366F1' },
    experienceType: { name: '' },
    tag: { name: '' },
    skillCategory: { name: '' },
  };

  const openCreateModal = (type) => {
    setModalType(type);
    setModalData(null);
    setModalForm(defaultForms[type] || {});
    setModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setModalData(item);
    const formFields = { ...item };
    if (type === 'project') {
      formFields.technologies = item.technologies ? item.technologies.join(', ') : '';
      formFields.features = item.features ? item.features.join(', ') : '';
      formFields.caseStudyTitle = item.caseStudy?.title || '';
      formFields.caseStudyBadge = item.caseStudy?.badge || '';
      formFields.caseStudyProblem = item.caseStudy?.problem || '';
      formFields.caseStudyInsight = item.caseStudy?.insight || '';
      formFields.caseStudyArchitecture = Array.isArray(item.caseStudy?.architecture) ? item.caseStudy.architecture.map(row => `${row.title || ''}: ${row.description || ''}`.trim()).join('\n') : '';
      formFields.caseStudyDataModel = Array.isArray(item.caseStudy?.dataModel) ? item.caseStudy.dataModel.map(row => `${row.title || ''}: ${row.description || ''}`.trim()).join('\n') : '';
      formFields.caseStudyFeatureFocus = Array.isArray(item.caseStudy?.featureFocus) ? item.caseStudy.featureFocus.join('\n') : '';
      formFields.caseStudyOutcomes = Array.isArray(item.caseStudy?.outcomes) ? item.caseStudy.outcomes.join('\n') : '';
      formFields.caseStudyImage = item.caseStudy?.caseStudyImage || '';
      formFields.caseStudyArchitectureDiagrams = item.caseStudy?.architectureDiagrams || [];
    } else if (type === 'blog') {
      formFields.tags = item.tags ? item.tags.join(', ') : '';
      formFields.featured = item.featured !== undefined ? item.featured : false;
      formFields.categoryColor = item.categoryColor || '#6366F1';
    } else if (type === 'certification' && item.date) {
      formFields.date = new Date(item.date).toISOString().split('T')[0];
    } else if (type === 'experience') {
      formFields.tech = item.tech ? item.tech.join(', ') : '';
    } else if (type === 'tag') {
      formFields.name = item.tag;
    }
    setModalForm(formFields);
    setModalOpen(true);
  };

  const apiMap = {
    project: '/api/projects', blog: '/api/blogs', testimonial: '/api/testimonials',
    certification: '/api/certifications', skill: '/api/skills', experience: '/api/experience',
    education: '/api/education', service: '/api/services', achievement: '/api/achievements',
    stat: '/api/stats',
    projectCategory: '/api/projects/categories',
    blogCategory: '/api/blogs/categories',
    experienceType: '/api/experience/types',
    skillCategory: '/api/skills/categories',
  };

  const parseLines = (value) => (typeof value === 'string' ? value : '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const parseTitledLines = (value) => parseLines(value).map(line => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      return { title: line, description: '' };
    }
    return {
      title: line.slice(0, separatorIndex).trim(),
      description: line.slice(separatorIndex + 1).trim(),
    };
  }).filter(item => item.title || item.description);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...modalForm };

    // Parse comma-separated arrays
    if (modalType === 'project') {
      payload.technologies = typeof payload.technologies === 'string' ? payload.technologies.split(',').map(t => t.trim()).filter(Boolean) : payload.technologies;
      payload.features = typeof payload.features === 'string' ? payload.features.split(',').map(f => f.trim()).filter(Boolean) : payload.features;
      payload.caseStudy = {
        title: payload.caseStudyTitle || '',
        badge: payload.caseStudyBadge || '',
        problem: payload.caseStudyProblem || '',
        insight: payload.caseStudyInsight || '',
        architecture: parseTitledLines(payload.caseStudyArchitecture),
        dataModel: parseTitledLines(payload.caseStudyDataModel),
        featureFocus: parseLines(payload.caseStudyFeatureFocus),
        outcomes: parseLines(payload.caseStudyOutcomes),
        caseStudyImage: payload.caseStudyImage || '',
        architectureDiagrams: payload.caseStudyArchitectureDiagrams || [],
      };
      delete payload.caseStudyTitle;
      delete payload.caseStudyBadge;
      delete payload.caseStudyProblem;
      delete payload.caseStudyInsight;
      delete payload.caseStudyArchitecture;
      delete payload.caseStudyDataModel;
      delete payload.caseStudyFeatureFocus;
      delete payload.caseStudyOutcomes;
      delete payload.caseStudyImage;
      delete payload.caseStudyArchitectureDiagrams;
    } else if (modalType === 'blog') {
      payload.tags = typeof payload.tags === 'string' ? payload.tags.split(',').map(t => t.trim()).filter(Boolean) : payload.tags;
    } else if (modalType === 'experience') {
      payload.tech = typeof payload.tech === 'string' ? payload.tech.split(',').map(t => t.trim()).filter(Boolean) : payload.tech;
    } else if (modalType === 'tag') {
      try {
        if (modalData) {
          // Rename tag
          await adminApi.put('/api/blogs/rename-tag', { oldTag: modalData.tag, newTag: payload.name }, token);
          showToast(`Tag renamed successfully!`, 'success');
        } else {
          // Create tag
          await adminApi.post('/api/blogs/create-tag', { tag: payload.name }, token);
          showToast(`Tag created successfully!`, 'success');
        }
        fetchData();
        setModalOpen(false);
        return;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        return;
      }
    }

    try {
      const url = apiMap[modalType];
      if (modalData) {
        await adminApi.put(`${url}/${modalData._id}`, payload, token);
      } else {
        await adminApi.post(url, payload, token);
      }
      setModalOpen(false);
      fetchData();
      showToast(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} saved successfully!`, 'success');
    } catch (err) {
      console.error("Error saving item:", err);
      showToast("Error saving item: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const url = type === 'message' ? `/api/contact/${id}` : `${apiMap[type]}/${id}`;
      await adminApi.delete(url, token);
      fetchData();
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
    } catch (err) {
      console.error("Error deleting item:", err);
      showToast("Error deleting item: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleRemoveTag = async (tag) => {
    if (!window.confirm(`Remove tag '${tag}' from all posts?`)) return;
    try {
      await adminApi.put('/api/blogs/remove-tag', { tag }, token);
      fetchData();
      showToast(`Removed tag '${tag}' from blog posts.`, 'success');
    } catch (err) {
      console.error('Error removing tag:', err);
      showToast('Error removing tag: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleApproveComment = async (id, approved = true) => {
    try {
      await adminApi.put(`/api/comments/${id}`, { approved }, token);
      fetchData();
      showToast('Comment moderation updated.', 'success');
    } catch (err) {
      console.error('Error approving comment:', err);
      showToast('Error updating comment: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await adminApi.delete(`/api/comments/${id}`, token);
      fetchData();
      showToast('Comment deleted successfully.', 'success');
    } catch (err) {
      console.error('Error deleting comment:', err);
      showToast('Error deleting comment: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminApi.put(`/api/contact/${id}/read`, {}, token);
      fetchData();
      showToast('Message marked as read.', 'success');
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // Reply to a contact message
  const handleReply = async (messageId) => {
    try {
      if (!replyForm.subject || !replyForm.message) {
        showToast('Please enter both subject and message.', 'error');
        return;
      }
      await adminApi.post(`/api/contact/${messageId}/reply`, replyForm, token);
      showToast('Reply sent successfully!', 'success');
      setShowReplyForm(false);
      setReplyForm({ subject: '', message: '' });
      fetchData();
    } catch (err) {
      showToast('Error sending reply: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleProfileSave = async () => {
    try {
      await adminApi.put('/api/profile', profileForm, token);
      fetchData();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Error updating profile: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleSettingsSave = async () => {
    try {
      const res = await adminApi.put('/api/settings', settingsForm, token);
      if (res.data) {
        setSettingsForm(res.data);
      }
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Error updating settings: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await axios.post('/api/settings/test-smtp', settingsForm, {
        headers: getAdminHeaders(token)
      });
      showToast(res.data.message || 'SMTP connection verified successfully!', 'success');
    } catch (err) {
      showToast('SMTP Connection failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setTestingSmtp(false);
    }
  };

  /* ── Nav items ── */
  // Build notifications from existing data
  const allNotifications = [
    ...data.messages.map(m => ({ id: m._id, type: 'message', title: m.subject, from: m.name, date: m.createdAt, read: m.read || seenNotifIds.has(m._id), data: m })),
    ...data.comments.filter(c => !c.approved).map(c => ({ id: c._id, type: 'comment', title: c.content?.substring(0, 60) + '...', from: c.name || c.author, date: c.createdAt, read: seenNotifIds.has(c._id), data: c })),
    ...data.testimonials.filter(t => !t.approved).map(t => ({ id: t._id, type: 'testimonial', title: `Testimonial from ${t.name}`, from: t.name, date: t.createdAt, read: seenNotifIds.has(t._id), data: t })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Bell dropdown only shows non-dismissed notifications
  const bellNotifications = allNotifications.filter(n => !dismissedBellIds.has(n.id));
  const unreadNotifCount = allNotifications.filter(n => !n.read).length;

  const markNotifSeen = (notif) => {
    if (notif.type === 'message') {
      if (!notif.read) handleMarkAsRead(notif.id);
    }
    setSeenNotifIds(prev => new Set([...prev, notif.id]));
  };

  const markAllSeen = () => {
    // Mark all messages as read via API
    allNotifications.forEach(n => {
      if (n.type === 'message' && !n.read) handleMarkAsRead(n.id);
    });
    // Mark all as locally seen
    setSeenNotifIds(prev => new Set([...prev, ...allNotifications.map(n => n.id)]));
  };

  // When Activity page is opened or bell dropdown is opened, mark all as seen (removes badges)
  useEffect(() => {
    if ((section === 'activity' || bellOpen) && unreadNotifCount > 0) {
      markAllSeen();
    }
  }, [section, bellOpen, unreadNotifCount]);

  const handleNotifClick = (notif) => {
    setBellOpen(false);
    markNotifSeen(notif);
    // Remove this notification from bell dropdown
    setDismissedBellIds(prev => new Set([...prev, notif.id]));
    if (notif.type === 'message') {
      setSection('messages');
      setSelectedMessage(notif.data);
    } else if (notif.type === 'comment') {
      setSection('comments');
    } else if (notif.type === 'testimonial') {
      setSection('testimonials');
    }
  };

  const handleActivityClick = (notif) => {
    markNotifSeen(notif);
    if (notif.type === 'message') {
      setSection('messages');
      setSelectedMessage(notif.data);
    } else if (notif.type === 'comment') {
      setSection('comments');
    } else if (notif.type === 'testimonial') {
      setSection('testimonials');
    }
  };

  const handleDeleteNotification = async (notif) => {
    if (notif.type === 'comment') {
      await handleDeleteComment(notif.id);
    } else {
      await handleDelete(notif.type, notif.id);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { id: 'activity', label: 'Activity', icon: <FiActivity />, badge: unreadNotifCount },
    { id: 'hero', label: 'Hero Section', icon: <FiHome /> },
    { id: 'profile', label: 'Profile / About', icon: <FiUser /> },
    { id: 'stats', label: 'Stats / Counters', icon: <FiHash /> },
    { id: 'education', label: 'Education', icon: <FiBookOpen /> },
    { id: 'skills', label: 'Skills', icon: <FiCpu /> },
    { id: 'projects', label: 'Projects', icon: <FiFolder /> },
    { id: 'experience', label: 'Experience', icon: <FiBriefcase /> },
    { id: 'services', label: 'Services', icon: <FiLayers /> },
    { id: 'certifications', label: 'Certifications', icon: <FiAward /> },
    { id: 'achievements', label: 'Achievements', icon: <FiTrendingUp /> },
    { id: 'blogs', label: 'Blogs', icon: <FiFileText /> },
    { id: 'comments', label: 'Comments', icon: <FiUsers /> },
    { id: 'testimonials', label: 'Testimonials', icon: <FiUsers /> },
    { id: 'messages', label: 'Messages', icon: <FiMail />, badge: data.messages.filter(m => !m.read).length },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const sidebarBg = isDark ? '#111827' : '#FFFFFF';
  const mainBg = isDark ? '#0B1120' : '#F8FAFC';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0';
  const textMain = isDark ? '#F1F5F9' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const profileInputStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1', background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', color: isDark ? '#E2E8F0' : '#1E293B', fontFamily: 'Inter', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
  const profileSelectStyle = {
    ...profileInputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%2394A3B8' : '%2364748B'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
    paddingRight: '40px',
    cursor: 'pointer',
  };
  const profileLabelStyle = { fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: '260px', background: sidebarBg, borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
            <style>{`
              .admin-nav-item {
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
              }
              .admin-nav-item:hover {
                background: ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'} !important;
                color: #6366F1 !important;
                padding-left: 20px !important;
              }
              .admin-action-item {
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
              }
              .admin-action-item:hover {
                background: ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'} !important;
                color: #6366F1 !important;
                padding-left: 20px !important;
              }
              .admin-logout-item {
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
              }
              .admin-logout-item:hover {
                background: rgba(239, 68, 68, 0.15) !important;
                padding-left: 20px !important;
              }
            `}</style>
            <div style={{ padding: '16px 20px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
                <img src={isDark ? logo : logoDark} alt="Logo" style={{ height: '80px', objectFit: 'contain', marginLeft: '-14px', marginTop: '-10px' }} />
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.80rem', color: textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '-10px' }}>Admin Panel</p>
              </div>
            </div>

            <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => { setSection(item.id); setModalOpen(false); }}
                  className={`admin-nav-item ${section === item.id ? 'admin-nav-item-active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', background: section === item.id ? 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))' : 'transparent', color: section === item.id ? '#6366F1' : textMuted, width: '100%', textAlign: 'left', position: 'relative' }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  {item.label}
                  {item.badge > 0 && <span style={{ marginLeft: 'auto', minWidth: '20px', height: '20px', borderRadius: '10px', background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>}
                </button>
              ))}
            </nav>

            <div style={{ padding: '16px 12px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
              <a href="/" className="admin-action-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', color: textMuted, fontFamily: 'Inter', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}><FiHome size={15} /> View Site</a>
              <button onClick={logout} className="admin-logout-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontFamily: 'Inter', fontSize: '0.85rem', width: '100%', textAlign: 'left', fontWeight: 'bold' }}><FiLogOut size={15} /> Logout</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: '260px', transition: 'margin-left 0.3s' }}>
        {/* Topbar */}
        <div style={{ height: '64px', background: sidebarBg, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', position: 'sticky', top: 0, zIndex: 99 }}>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: textMain, textTransform: 'capitalize', flex: 1 }}>
            {modalOpen ? `${modalData ? 'Edit' : 'Add New'} ${modalType}` : section === 'profile' ? 'Profile / About' : section === 'hero' ? 'Hero Section' : section}
          </h1>

          {/* ── Theme Toggle ── */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              color: isDark ? '#FBBF24' : '#6366F1',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* ── Notification Bell ── */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setBellOpen(prev => !prev)}
              title="Notifications"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: bellOpen ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                color: bellOpen ? '#6366F1' : (isDark ? '#94A3B8' : '#64748B'),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = bellOpen ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'); e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <FiBell size={18} />
              {unreadNotifCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  minWidth: '18px', height: '18px', borderRadius: '9px',
                  background: '#EF4444', color: 'white',
                  fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Inter',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                  animation: 'pulse 2s infinite',
                }}>{unreadNotifCount > 9 ? '9+' : unreadNotifCount}</span>
              )}
            </button>

            {/* Bell Dropdown */}
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    position: 'absolute', top: '52px', right: 0,
                    width: '380px', maxHeight: '480px',
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.12)',
                    overflow: 'hidden', zIndex: 9999,
                  }}
                >
                  <div style={{ padding: '16px 20px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: textMain, margin: 0 }}>Notifications</h3>
                    {unreadNotifCount > 0 && <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#6366F1', fontWeight: 600, background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', padding: '4px 10px', borderRadius: '20px' }}>{unreadNotifCount} new</span>}
                  </div>
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {bellNotifications.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: textMuted, fontFamily: 'Inter', fontSize: '0.85rem' }}>
                        <FiBell size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
                        <p style={{ margin: 0 }}>No notifications yet</p>
                      </div>
                    ) : (
                      bellNotifications.slice(0, 8).map(notif => (
                        <div
                          key={`${notif.type}-${notif.id}`}
                          onClick={() => handleNotifClick(notif)}
                          style={{
                            padding: '14px 20px', cursor: 'pointer',
                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F8FAFC',
                            background: !notif.read ? (isDark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.02)') : 'transparent',
                            transition: 'background 0.15s ease',
                            display: 'flex', gap: '12px', alignItems: 'center',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = !notif.read ? (isDark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.02)') : 'transparent'}
                        >
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: notif.type === 'message' ? 'rgba(6,182,212,0.12)' : notif.type === 'comment' ? 'rgba(139,92,246,0.12)' : 'rgba(236,72,153,0.12)',
                            color: notif.type === 'message' ? '#06B6D4' : notif.type === 'comment' ? '#8B5CF6' : '#EC4899',
                          }}>
                            {notif.type === 'message' ? <FiMail size={16} /> : notif.type === 'comment' ? <FiMessageSquare size={16} /> : <FiStar size={16} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                              <span style={{ fontFamily: 'Poppins', fontWeight: notif.read ? 500 : 700, fontSize: '0.82rem', color: textMain, textTransform: 'capitalize' }}>{notif.type}</span>
                              <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: textMuted, whiteSpace: 'nowrap' }}>{new Date(notif.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {notif.from && <strong style={{ color: textMain }}>{notif.from}: </strong>}{notif.title}
                            </p>
                            {!notif.read && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', marginTop: '4px' }} />}
                          </div>
                          {/* Close / Dismiss Button */}
                          <button
                            title="Dismiss notification"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDismissedBellIds(prev => new Set([...prev, notif.id]));
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: textMuted,
                              opacity: 0.5,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.opacity = 1;
                              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.opacity = 0.5;
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div
                    onClick={() => { setBellOpen(false); markAllSeen(); setDismissedBellIds(prev => new Set([...prev, ...allNotifications.map(n => n.id)])); setSection('activity'); }}
                    style={{
                      padding: '14px 20px', textAlign: 'center', cursor: 'pointer',
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                      fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem',
                      color: '#6366F1', transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    View All Activity →
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ padding: '32px 24px' }}>
          {modalOpen ? (
            <CrudModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              type={modalType}
              data={modalData}
              form={modalForm}
              setForm={setModalForm}
              onSubmit={handleModalSubmit}
              isDark={isDark}
              token={token}
              isPage
              globalData={data}
            />
          ) : (
            <>

          {/* ════ DASHBOARD ════ */}
          {section === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: textMuted, marginBottom: '24px' }}>Welcome back, Hardik! Here's an overview of your portfolio.</p>

              {/* ── Row 1: Primary Stats ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <DashboardStatCard icon={<FiFolder size={18} />} label="Projects" value={data.projects.length} color="#10B981" isDark={isDark} badge="✔ Published" badgeColor="#10B981" badgeIcon={<FiTrendingUp size={12} />} />
                <DashboardStatCard icon={<FiFileText size={18} />} label="Blog Posts" value={data.blogs.length} color="#8B5CF6" isDark={isDark} />
                <DashboardStatCard icon={<FiAward size={18} />} label="Certifications" value={data.certifications.length} color="#F59E0B" isDark={isDark} />
                <DashboardStatCard icon={<FiUsers size={18} />} label="Testimonials" value={data.testimonials.length} color="#EC4899" isDark={isDark} badge="✔ Approved" badgeColor="#10B981" />
                <DashboardStatCard icon={<FiCpu size={18} />} label="Skills" value={data.skills.length} color="#06B6D4" isDark={isDark} />
              </div>

              {/* ── Row 2: Secondary Stats ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <DashboardStatCard icon={<FiBriefcase size={18} />} label="Experience" value={data.experience.length} color="#8B5CF6" isDark={isDark} />
                <DashboardStatCard icon={<FiBookOpen size={18} />} label="Education" value={data.education.length} color="#10B981" isDark={isDark} />
                <DashboardStatCard icon={<FiSettings size={18} />} label="Services" value={data.services.length} color="#3B82F6" isDark={isDark} />
                <DashboardStatCard icon={<FiMail size={18} />} label="Messages" value={data.messages.length} color="#06B6D4" isDark={isDark} />
                <DashboardStatCard icon={<FiMessageSquare size={18} />} label="Unread Messages" value={data.messages.filter(m => !m.read).length} color="#6366F1" isDark={isDark} badge={data.messages.filter(m => !m.read).length > 0 ? '● New' : null} badgeColor="#EF4444" />
              </div>

              {/* ── Row 3: Tertiary Stats ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <DashboardStatCard icon={<FiTrendingUp size={18} />} label="Achievements" value={data.achievements.length} color="#F59E0B" isDark={isDark} />
                <DashboardStatCard icon={<FiStar size={18} />} label="Featured Projects" value={data.projects.filter(p => p.featured).length} color="#EAB308" isDark={isDark} />
                <DashboardStatCard icon={<FiEyeOff size={18} />} label="Draft Posts" value={data.blogs.filter(b => !b.published).length} color="#EF4444" isDark={isDark} />
                <DashboardStatCard icon={<FiHash size={18} />} label="Stat Cards" value={data.stats?.length || 0} color="#6366F1" isDark={isDark} />
              </div>
            </motion.div>
          )}

          {/* ════ ACTIVITY ════ */}
          {section === 'activity' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>Track all recent activities across your portfolio — messages, comments, and testimonials.</p>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['all', 'message', 'comment', 'testimonial'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    style={{
                      padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem',
                      background: activityFilter === f
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))'
                        : (isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9'),
                      color: activityFilter === f ? '#6366F1' : textMuted,
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize',
                    }}
                    onMouseEnter={e => { if (activityFilter !== f) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0'; }}
                    onMouseLeave={e => { if (activityFilter !== f) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9'; }}
                  >
                    {f === 'all' ? 'All Activity' : f === 'message' ? '✉️ Messages' : f === 'comment' ? '💬 Comments' : '⭐ Testimonials'}
                  </button>
                ))}
              </div>

              {/* Activity Timeline */}
              <div style={{ background: cardBg, border: cardBorder, borderRadius: '20px', overflow: 'hidden' }}>
                {allNotifications.filter(n => activityFilter === 'all' || n.type === activityFilter).length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: textMuted, fontFamily: 'Inter' }}>
                    <FiActivity size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p style={{ margin: 0 }}>No activity to show{activityFilter !== 'all' ? ` for ${activityFilter}s` : ''}.</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{ position: 'absolute', left: '32px', top: '24px', bottom: '24px', width: '2px', background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', borderRadius: '1px' }} />

                    {allNotifications.filter(n => activityFilter === 'all' || n.type === activityFilter).map((notif, idx) => {
                      const iconColor = notif.type === 'message' ? '#06B6D4' : notif.type === 'comment' ? '#8B5CF6' : '#EC4899';
                      const iconBg = notif.type === 'message' ? 'rgba(6,182,212,0.12)' : notif.type === 'comment' ? 'rgba(139,92,246,0.12)' : 'rgba(236,72,153,0.12)';
                      const timeAgo = (date) => {
                        const diff = Date.now() - new Date(date).getTime();
                        const mins = Math.floor(diff / 60000);
                        if (mins < 1) return 'Just now';
                        if (mins < 60) return `${mins}m ago`;
                        const hrs = Math.floor(mins / 60);
                        if (hrs < 24) return `${hrs}h ago`;
                        const days = Math.floor(hrs / 24);
                        if (days < 7) return `${days}d ago`;
                        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      };

                      return (
                        <div
                          key={`activity-${notif.type}-${notif.id}`}
                          onClick={() => handleActivityClick(notif)}
                          style={{
                            display: 'flex', gap: '16px', padding: '18px 24px 18px 16px',
                            cursor: 'pointer', position: 'relative',
                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F8FAFC',
                            background: !notif.read ? (isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.015)') : 'transparent',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.03)'; e.currentTarget.style.paddingLeft = '20px'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = !notif.read ? (isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.015)') : 'transparent'; e.currentTarget.style.paddingLeft = '16px'; }}
                        >
                          {/* Timeline dot */}
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: iconBg, color: iconColor, zIndex: 1,
                            boxShadow: !notif.read ? `0 0 12px ${iconColor}30` : 'none',
                          }}>
                            {notif.type === 'message' ? <FiMail size={18} /> : notif.type === 'comment' ? <FiMessageSquare size={18} /> : <FiStar size={18} />}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: textMain, textTransform: 'capitalize' }}>
                                  New {notif.type}
                                </span>
                                {!notif.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1', display: 'inline-block', boxShadow: '0 0 6px rgba(99,102,241,0.5)' }} />}
                              </div>
                              <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: textMuted, whiteSpace: 'nowrap' }}>{timeAgo(notif.date)}</span>
                            </div>
                            <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                              {notif.from && <strong style={{ color: textMain }}>{notif.from}</strong>}
                              {notif.from && ' — '}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline' }}>{notif.title}</span>
                            </p>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 600,
                              color: iconColor,
                              background: iconBg,
                              padding: '3px 10px', borderRadius: '6px',
                              textTransform: 'capitalize',
                            }}>
                              {notif.type === 'message' ? <FiMail size={11} /> : notif.type === 'comment' ? <FiMessageSquare size={11} /> : <FiStar size={11} />}
                              {notif.type}
                            </span>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={e => e.stopPropagation()}>
                            <button
                              title={`Delete ${notif.type}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notif);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444',
                                transition: 'all 0.2s ease',
                                opacity: 0.6,
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.opacity = 1;
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.opacity = 0.6;
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                              }}
                            >
                              <FiTrash2 size={15} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', color: textMuted, opacity: 0.4 }}>
                              <FiArrowRight size={16} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════ HERO SECTION ════ */}
          {section === 'hero' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>Manage the hero content and the interactive laptop mockup text shown on the home page.</p>
              <div style={{ padding: '32px', borderRadius: '20px', background: cardBg, border: cardBorder }}>
                {/* ── Hero Section Fields ── */}
                <div>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: textMain, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🏠</span> Hero Section Config
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={profileLabelStyle}>Sub Hero Title</label>
                      <input style={profileInputStyle} value={profileForm.heroTitle || ''} onChange={e => setProfileForm({ ...profileForm, heroTitle: e.target.value })} placeholder="Full Stack Developer & Software Engineer" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={profileLabelStyle}>Hero Description</label>
                      <textarea style={{ ...profileInputStyle, height: '80px', resize: 'vertical' }} value={profileForm.heroDesc || ''} onChange={e => setProfileForm({ ...profileForm, heroDesc: e.target.value })} placeholder="I build scalable, high-performance web applications..." />
                    </div>
                    <div>
                      <label style={profileLabelStyle}>Resume URL</label>
                      <input style={profileInputStyle} value={profileForm.resumeUrl || ''} onChange={e => setProfileForm({ ...profileForm, resumeUrl: e.target.value })} />
                    </div>
                    <div>
                      <label style={profileLabelStyle}>Roles (comma-separated)</label>
                      <input style={profileInputStyle} value={profileForm.roles || ''} onChange={e => setProfileForm({ ...profileForm, roles: e.target.value })} placeholder="MERN Stack Developer, Full Stack Engineer" />
                    </div>
                  </div>
                </div>

                {/* ── Laptop Screen Fields ── */}
                <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: textMain, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>💻</span> Laptop Screen Content
                  </h4>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: textMuted, marginBottom: '16px' }}>Customize the code editor mockup shown inside the interactive laptop on the homepage.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={profileLabelStyle}>Screen Name</label>
                      <input style={profileInputStyle} value={profileForm.laptopName || ''} onChange={e => setProfileForm({ ...profileForm, laptopName: e.target.value })} placeholder="Hardik Prajapati" />
                    </div>
                    <div>
                      <label style={profileLabelStyle}>Screen Job Title</label>
                      <input style={profileInputStyle} value={profileForm.laptopTitle || ''} onChange={e => setProfileForm({ ...profileForm, laptopTitle: e.target.value })} placeholder="Full Stack Engineer" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={profileLabelStyle}>Screen Skills (comma-separated)</label>
                      <input style={profileInputStyle} value={profileForm.laptopSkills || ''} onChange={e => setProfileForm({ ...profileForm, laptopSkills: e.target.value })} placeholder="React, Node.js, Express, MongoDB, Java, AI/ML, DSA" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={profileLabelStyle}>Screen Passion</label>
                      <input style={profileInputStyle} value={profileForm.laptopPassion || ''} onChange={e => setProfileForm({ ...profileForm, laptopPassion: e.target.value })} placeholder="Turning ideas into impact" />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={profileLabelStyle}>Bio</label>
                  <textarea style={{ ...profileInputStyle, height: '100px', resize: 'vertical' }} value={profileForm.bio || ''} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
                </div>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleProfileSave} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                    Save Hero Config
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ PROFILE / ABOUT ════ */}
          {section === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>Manage your personal info displayed across the portfolio (Hero, About, Footer, Contact).</p>
              <div style={{ padding: '32px', borderRadius: '20px', background: cardBg, border: cardBorder }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={profileLabelStyle}>Full Name</label>
                    <input style={profileInputStyle} value={profileForm.name || ''} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>Job Title</label>
                    <input style={profileInputStyle} value={profileForm.title || ''} onChange={e => setProfileForm({ ...profileForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>Email</label>
                    <input style={profileInputStyle} value={profileForm.email || ''} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>Phone</label>
                    <input style={profileInputStyle} value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>Location</label>
                    <input style={profileInputStyle} value={profileForm.location || ''} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>Years of Experience</label>
                    <input type="number" style={profileInputStyle} value={profileForm.yearsExp || ''} onChange={e => setProfileForm({ ...profileForm, yearsExp: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>GitHub URL</label>
                    <input style={profileInputStyle} value={profileForm.github || ''} onChange={e => setProfileForm({ ...profileForm, github: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>LinkedIn URL</label>
                    <input style={profileInputStyle} value={profileForm.linkedin || ''} onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })} />
                  </div>
                  <div>
                    <label style={profileLabelStyle}>X (Twitter) URL</label>
                    <input style={profileInputStyle} value={profileForm.twitter || ''} onChange={e => setProfileForm({ ...profileForm, twitter: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <ImageUpload label="Profile Photo" value={profileForm.avatar || ''} onChange={(url) => setProfileForm({ ...profileForm, avatar: url })} token={token} isDark={isDark} labelStyle={profileLabelStyle} />
                  </div>
                </div>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleProfileSave} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                    Save Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ PROJECTS ════ */}
          {section === 'projects' && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setProjectsSubTab('projects')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: projectsSubTab === 'projects' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: projectsSubTab === 'projects' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: projectsSubTab === 'projects' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiFolder size={14} /> Projects
                </button>
                <button onClick={() => setProjectsSubTab('categories')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: projectsSubTab === 'categories' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: projectsSubTab === 'categories' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: projectsSubTab === 'categories' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  🏷️ Project Categories
                </button>
              </div>

              {projectsSubTab === 'projects' ? (
                <CrudList items={data.projects} type="project" label="projects" onAdd={() => openCreateModal('project')} onEdit={(item) => openEditModal('project', item)} onDelete={(p) => handleDelete('project', p._id)} isDark={isDark}
                  renderItem={(p, tm, tmut) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {p.image && p.image.trim() !== '' ? (
                        <img src={p.image} alt={p.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📁</div>
                      )}
                      <div>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'block' }}>{p.title}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut, textTransform: 'uppercase' }}>{p.category}</span> {p.featured && '⭐'}
                      </div>
                    </div>
                  )} />
              ) : (
                <CrudList items={data.projectCategories} type="projectCategory" label="project categories" onAdd={() => openCreateModal('projectCategory')} onEdit={(item) => openEditModal('projectCategory', item)} onDelete={(c) => handleDelete('projectCategory', c._id)} isDark={isDark}
                  renderItem={(c, tm, tmut) => (
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: c.color }} />
                      {c.name}
                    </span>
                  )}
                />
              )}
            </div>
          )}

          {/* ════ SKILLS ════ */}
          {section === 'skills' && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setSkillsSubTab('skills')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: skillsSubTab === 'skills' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: skillsSubTab === 'skills' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: skillsSubTab === 'skills' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiCpu size={14} /> Skills
                </button>
                <button onClick={() => setSkillsSubTab('categories')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: skillsSubTab === 'categories' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: skillsSubTab === 'categories' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: skillsSubTab === 'categories' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  🏷️ Skill Categories
                </button>
              </div>

              {skillsSubTab === 'skills' ? (
                <CrudList items={data.skills} type="skill" label="skills" onAdd={() => openCreateModal('skill')} onEdit={(item) => openEditModal('skill', item)} onDelete={(s) => handleDelete('skill', s._id)} isDark={isDark}
                  renderItem={(s, tm, tmut) => {
                    const iconDetails = getSkillIconDetails(s.name, isDark) || {
                      icon: <FiCpu />,
                      color: '#6366F1'
                    };
                    return (
                      <>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {s.image && s.image.trim() !== '' ? (
                            <img src={s.image} alt={s.name} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: '20px', justifyContent: 'center', fontSize: '1.15rem', color: iconDetails.color }}>
                              {iconDetails.icon}
                            </span>
                          )}
                          {s.name}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{s.category}</span>
                      </>
                    );
                  }}
                />
              ) : (
                <CrudList items={data.skillCategories} type="skillCategory" label="skill categories" onAdd={() => openCreateModal('skillCategory')} onEdit={(item) => openEditModal('skillCategory', item)} onDelete={(cat) => handleDelete('skillCategory', cat._id)} isDark={isDark}
                  renderItem={(cat, tm, tmut) => (
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🏷️ {cat.name}
                    </span>
                  )}
                />
              )}
            </div>
          )}

          {/* ════ EXPERIENCE ════ */}
          {section === 'experience' && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setExperienceSubTab('experiences')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: experienceSubTab === 'experiences' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: experienceSubTab === 'experiences' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: experienceSubTab === 'experiences' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiBriefcase size={14} /> Experiences
                </button>
                <button onClick={() => setExperienceSubTab('types')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: experienceSubTab === 'types' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: experienceSubTab === 'types' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: experienceSubTab === 'types' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiLayers size={14} /> Experience Types
                </button>
              </div>

              {experienceSubTab === 'experiences' ? (
                <CrudList items={data.experience} type="experience" label="experience entries" onAdd={() => openCreateModal('experience')} onEdit={(item) => openEditModal('experience', item)} onDelete={(e) => handleDelete('experience', e._id)} isDark={isDark}
                  renderItem={(e, tm, tmut) => (
                    <>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {e.image && e.image.trim() !== '' ? (
                          <img src={e.image} alt={e.company} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                        ) : (
                          <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                            {e.icon || '💼'}
                          </span>
                        )}
                        {e.title}
                      </span>
                      <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{e.company} · {e.year} · {e.type}</span>
                    </>
                  )}
                />
              ) : (
                <CrudList items={data.experienceTypes} type="experienceType" label="experience types" onAdd={() => openCreateModal('experienceType')} onEdit={(item) => openEditModal('experienceType', item)} onDelete={(t) => handleDelete('experienceType', t._id)} isDark={isDark}
                  renderItem={(t, tm, tmut) => (
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiLayers size={14} color="#6366F1" />
                      {t.name}
                    </span>
                  )}
                />
              )}
            </div>
          )}

          {/* ════ EDUCATION ════ */}
          {section === 'education' && (
            <CrudList items={data.education} type="education" label="education entries" onAdd={() => openCreateModal('education')} onEdit={(item) => openEditModal('education', item)} onDelete={(edu) => handleDelete('education', edu._id)} isDark={isDark}
              renderItem={(e, tm, tmut) => (
                <>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {e.image && e.image.trim() !== '' ? (
                      <img src={e.image} alt={e.institution} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                        {e.icon || '🎓'}
                      </span>
                    )}
                    {e.degree}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: tmut, marginLeft: '6px' }}>(Order: {e.order || 0}{e.currentlyPursuing ? ' · Pursuing' : ''})</span>
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{e.institution} · {e.year}</span>
                </>
              )}
            />
          )}

          {/* ════ SERVICES ════ */}
          {section === 'services' && (
            <CrudList items={data.services} type="service" label="services" onAdd={() => openCreateModal('service')} onEdit={(item) => openEditModal('service', item)} onDelete={(s) => handleDelete('service', s._id)} isDark={isDark}
              renderItem={(s, tm, tmut) => (
                <>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {s.image && s.image.trim() !== '' ? (
                      <img src={s.image} alt={s.title} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                        {s.icon || '🚀'}
                      </span>
                    )}
                    {s.title}
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{s.desc?.substring(0, 60)}...</span>
                </>
              )}
            />
          )}

          {/* ════ ACHIEVEMENTS ════ */}
          {section === 'achievements' && (
            <CrudList items={data.achievements} type="achievement" label="achievements" onAdd={() => openCreateModal('achievement')} onEdit={(item) => openEditModal('achievement', item)} onDelete={(a) => handleDelete('achievement', a._id)} isDark={isDark}
              renderItem={(a, tm, tmut) => (
                <>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {a.image && a.image.trim() !== '' ? (
                      <img src={a.image} alt={a.title} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                        {a.icon || '🏆'}
                      </span>
                    )}
                    {a.title}
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{a.value} · {a.desc?.substring(0, 50)}...</span>
                </>
              )}
            />
          )}

          {/* ════ STATS ════ */}
          {section === 'stats' && (
            <CrudList items={data.stats} type="stat" label="stats/counters" onAdd={() => openCreateModal('stat')} onEdit={(item) => openEditModal('stat', item)} onDelete={(s) => handleDelete('stat', s._id)} isDark={isDark}
              renderItem={(s, tm, tmut) => (
                <>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {s.image && s.image.trim() !== '' ? (
                      <img src={s.image} alt={s.label} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                        {s.icon || '🚀'}
                      </span>
                    )}
                    {s.value}{s.suffix} · {s.label}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: tmut, marginLeft: '6px' }}>(Order: {s.order || 0})</span>
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{s.description?.substring(0, 60)}...</span>
                </>
              )}
            />
          )}

          {/* ════ BLOGS ════ */}
          {section === 'blogs' && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setBlogsSubTab('blogs')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: blogsSubTab === 'blogs' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: blogsSubTab === 'blogs' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: blogsSubTab === 'blogs' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiFileText size={14} /> Blogs
                </button>
                <button onClick={() => setBlogsSubTab('tags')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: blogsSubTab === 'tags' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: blogsSubTab === 'tags' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: blogsSubTab === 'tags' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <FiHash size={14} /> Blog Tags
                </button>
                <button onClick={() => setBlogsSubTab('categories')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px',
                    border: blogsSubTab === 'categories' ? '1.5px solid #6366F1' : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #CBD5E1'),
                    background: blogsSubTab === 'categories' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    color: blogsSubTab === 'categories' ? '#6366F1' : textMuted,
                    fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  🏷️ Blog Categories
                </button>
              </div>

              {blogsSubTab === 'blogs' ? (
                <CrudList items={data.blogs} type="blog" label="blog posts" onAdd={() => openCreateModal('blog')} onEdit={(item) => openEditModal('blog', item)} onDelete={(b) => handleDelete('blog', b._id)} isDark={isDark}
                  renderItem={(b, tm, tmut) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {b.image && b.image.trim() !== '' ? (
                        <img src={b.image} alt={b.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FiFileText size={18} /></div>
                      )}
                      <div>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'block' }}>{b.title}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}><span style={{ textTransform: 'uppercase' }}>{b.category}</span> {b.featured && <FiStar size={12} color="#F59E0B" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />} · {b.readTime || '5 min read'}</span>
                      </div>
                    </div>
                  )} />
              ) : blogsSubTab === 'tags' ? (
                <CrudList items={data.tags} type="tag" label="tags" onAdd={() => openCreateModal('tag')} onEdit={(item) => openEditModal('tag', item)} onDelete={(tg) => handleRemoveTag(tg.tag)} isDark={isDark}
                  renderItem={(tg, tm, tmut) => (
                    <>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiHash size={14} color="#6366F1" />
                        {tg.tag}
                      </span>
                      <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>used in {tg.count} posts</span>
                    </>
                  )}
                />
              ) : (
                <CrudList items={data.blogCategories} type="blogCategory" label="blog categories" onAdd={() => openCreateModal('blogCategory')} onEdit={(item) => openEditModal('blogCategory', item)} onDelete={(c) => handleDelete('blogCategory', c._id)} isDark={isDark}
                  renderItem={(c, tm, tmut) => (
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: c.color }} />
                      {c.name}
                    </span>
                  )}
                />
              )}
            </div>
          )}

          {/* ════ TESTIMONIALS ════ */}
          {section === 'testimonials' && (
            <CrudList items={data.testimonials} type="testimonial" label="testimonials" onAdd={() => openCreateModal('testimonial')} onEdit={(item) => openEditModal('testimonial', item)} onDelete={(t) => handleDelete('testimonial', t._id)} isDark={isDark}
              renderItem={(t, tm, tmut) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {t.avatar && t.avatar.trim() !== '' ? (
                    <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }} />
                  ) : (
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
                  )}
                  <div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'block' }}>{t.name}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{t.role} {t.company && `at ${t.company}`} · ⭐ {t.rating}</span>
                  </div>
                </div>
              )} />
          )}

          {/* ════ CERTIFICATIONS ════ */}
          {section === 'certifications' && (
            <CrudList items={data.certifications} type="certification" label="certifications" onAdd={() => openCreateModal('certification')} onEdit={(item) => openEditModal('certification', item)} onDelete={(c) => handleDelete('certification', c._id)} isDark={isDark}
              renderItem={(c, tm, tmut) => (
                <>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: tm, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {c.logo && c.logo.trim() !== '' ? (
                      <img src={c.logo} alt={c.title} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '1.15rem', minWidth: '20px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                        {c.badge || '🏆'}
                      </span>
                    )}
                    {c.title}
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: tmut }}>{c.issuer} · {c.date ? new Date(c.date).toLocaleDateString() : ''}</span>
                </>
              )}
            />
          )}

          {/* ════ MESSAGES (INBOX) ════ */}
          {section === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem', marginBottom: '16px' }}>{data.messages.length} messages received</p>
              {data.messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: textMuted, fontFamily: 'Inter', background: cardBg, border: cardBorder, borderRadius: '16px' }}>No messages yet. Messages sent via the contact form will appear here.</div>
              ) : (
                <div className="inbox-container" style={{ display: 'flex', gap: '0', borderRadius: '20px', background: cardBg, border: cardBorder, overflow: 'hidden', height: 'calc(100vh - 260px)', minHeight: '500px' }}>
                  {/* ── Left: Message List ── */}
                  <div style={{ width: '340px', minWidth: '340px', borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0', overflowY: 'auto', flexShrink: 0 }}>
                    {data.messages.map(m => {
                      const isActive = selectedMessage?._id === m._id;
                      return (
                        <div
                          key={m._id}
                          onClick={() => { setSelectedMessage(m); setShowReplyForm(false); setReplyForm({ subject: `Re: ${m.subject}`, message: '' }); if (!m.read) handleMarkAsRead(m._id); }}
                          style={{
                            padding: '16px 20px',
                            cursor: 'pointer',
                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F1F5F9',
                            background: isActive ? (isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)') : 'transparent',
                            borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : '#FAFBFC'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'Poppins', fontWeight: m.read ? 500 : 700, fontSize: '0.88rem', color: textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{m.name}</span>
                            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: textMuted, whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <p style={{ fontFamily: 'Inter', fontWeight: m.read ? 400 : 600, fontSize: '0.82rem', color: textMain, margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</p>
                          <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                            {!m.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />}
                            {m.replied && <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>✓ Replied</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Right: Message Detail Pane ── */}
                  <div className="inbox-right-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                    {!selectedMessage ? (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted, fontFamily: 'Inter', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <FiMail size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                          <p style={{ margin: 0 }}>Select a message to view details</p>
                        </div>
                      </div>
                    ) : (
                      <div className="inbox-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
                        {/* Header */}
                        <div style={{ padding: '24px 28px 16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9', flexShrink: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: textMain, margin: '0 0 4px 0' }}>{selectedMessage.name}</h3>
                              <span style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#6366F1' }}>{selectedMessage.email}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setShowReplyForm(!showReplyForm); if (!showReplyForm) setReplyForm({ subject: `Re: ${selectedMessage.subject}`, message: '' }); }} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: showReplyForm ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.08)', color: showReplyForm ? '#EF4444' : '#6366F1', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem' }}>
                                {showReplyForm ? <><FiX size={14} /> Cancel</> : <><FiCornerUpLeft size={14} /> Reply</>}
                              </button>
                              <button onClick={() => { handleDelete('message', selectedMessage._id); setSelectedMessage(null); }} style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex' }} title="Delete">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div style={{ marginTop: '8px', marginBottom: showReplyForm ? '8px' : '16px', transition: 'margin 0.3s ease-in-out' }}>
                            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem', color: textMain, margin: 0 }}>{selectedMessage.subject}</p>
                            <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: textMuted }}>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Message Body — dynamic sizing */}
                        <div style={{
                          padding: '20px 28px',
                          ...(showReplyForm
                            ? { flex: '0 0 auto', height: '100px', overflowY: 'auto' }
                            : { flex: 1, minHeight: '140px' }),
                          transition: 'all 0.3s ease-in-out',
                        }}>
                          <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: textMuted, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                        </div>

                        {/* Admin Reply Display Card */}
                        {(selectedMessage.replied || selectedMessage.replyMessage) && (
                          <div style={{
                            margin: '0 28px 16px',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
                            border: isDark ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(16,185,129,0.12)',
                            flexShrink: 0,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <FiCornerUpLeft size={14} color="#10B981" />
                              <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#10B981' }}>Your Reply</span>
                              {selectedMessage.repliedAt && (
                                <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: textMuted, marginLeft: 'auto' }}>
                                  {new Date(selectedMessage.repliedAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {selectedMessage.replySubject && (
                              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: textMain, margin: '0 0 6px 0' }}>{selectedMessage.replySubject}</p>
                            )}
                            <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: textMuted, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{selectedMessage.replyMessage}</p>
                          </div>
                        )}

                        {/* Reply Compose Form */}
                        <AnimatePresence>
                          {showReplyForm && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ padding: '0 28px 24px', flexShrink: 0 }}
                            >
                              <div style={{ padding: '20px', borderRadius: '14px', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.03)', border: isDark ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(99,102,241,0.1)' }}>
                                <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: textMain, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <FiSend size={14} color="#6366F1" /> Compose Reply
                                </h4>
                                <div style={{ marginBottom: '12px' }}>
                                  <label style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: textMuted, marginBottom: '6px', display: 'block' }}>Subject</label>
                                  <input
                                    value={replyForm.subject}
                                    onChange={e => setReplyForm({ ...replyForm, subject: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', color: textMain, fontFamily: 'Inter', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                  <label style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: textMuted, marginBottom: '6px', display: 'block' }}>Message</label>
                                  <textarea
                                    value={replyForm.message}
                                    onChange={e => setReplyForm({ ...replyForm, message: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', color: textMain, fontFamily: 'Inter', fontSize: '0.88rem', outline: 'none', height: '120px', resize: 'vertical', boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                  <button onClick={() => { setShowReplyForm(false); setReplyForm({ subject: '', message: '' }); }} style={{ padding: '10px 20px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', background: 'transparent', color: textMuted, fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    Cancel
                                  </button>
                                  <button onClick={() => handleReply(selectedMessage._id)} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiSend size={14} /> Send Reply
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ════ SETTINGS ════ */}
          {section === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: 'Inter', color: textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>
                Manage website general settings and outbound mail SMTP server configurations.
              </p>

              {/* Settings Sub-Tab Bar */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: cardBorder, paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {[
                  { id: 'general', label: 'General', emoji: '⚙️' },
                  { id: 'visibility', label: 'Section Visibility', emoji: '👁️' },
                  { id: 'smtp', label: 'SMTP Configuration', emoji: '📧' },
                  { id: 'system', label: 'System Info', emoji: '📊' },
                ].map(tab => {
                  const isActive = settingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id)}
                      className="admin-action-item"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))' : 'transparent',
                        color: isActive ? '#6366F1' : textMuted,
                        transition: 'all 0.2s',
                      }}
                    >
                      <EmojiIcon emoji={tab.emoji} size={16} color={isActive ? '#6366F1' : textMuted} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: '32px', borderRadius: '20px', background: cardBg, border: cardBorder }}>
                {/* 1. GENERAL TAB */}
                {settingsTab === 'general' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: textMain, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiSettings size={20} /> General Settings</h3>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: textMuted, marginBottom: '20px' }}>
                      Configure general site behavior, branding text, analytics tracking, and maintenance mode status.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={profileLabelStyle}>Site Title</label>
                        <input style={profileInputStyle} placeholder="HP.dev" value={settingsForm.siteTitle || ''} onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>Logo Text</label>
                        <input style={profileInputStyle} placeholder="HP.dev" value={settingsForm.siteLogoText || ''} onChange={e => setSettingsForm({ ...settingsForm, siteLogoText: e.target.value })} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={profileLabelStyle}>Google Analytics ID</label>
                        <input style={profileInputStyle} placeholder="G-XXXXXXXXXX" value={settingsForm.googleAnalyticsId || ''} onChange={e => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })} />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        <label style={profileLabelStyle}>Maintenance Mode</label>
                        <div style={{ display: 'flex', alignItems: 'center', height: '44px', gap: '8px' }}>
                          <input type="checkbox" id="maintenanceModeCheck" checked={!!settingsForm.maintenanceMode} onChange={e => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })} style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#6366F1' }} />
                          <label htmlFor="maintenanceModeCheck" style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: textMain, cursor: 'pointer', userSelect: 'none' }}>
                            Enable Maintenance Mode (stops public visitors from browsing)
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        <label style={profileLabelStyle}>Visitor Logging</label>
                        <div style={{ display: 'flex', alignItems: 'center', height: '44px', gap: '8px' }}>
                          <input type="checkbox" id="visitorLoggingCheck" checked={!!settingsForm.enableVisitorLogging} onChange={e => setSettingsForm({ ...settingsForm, enableVisitorLogging: e.target.checked })} style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#6366F1' }} />
                          <label htmlFor="visitorLoggingCheck" style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: textMain, cursor: 'pointer', userSelect: 'none' }}>
                            Enable Visitor Analytics Logging
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. SMTP TAB */}
                {settingsTab === 'smtp' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: textMain, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiMail size={20} /> Email / SMTP Settings</h3>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: textMuted, marginBottom: '4px' }}>
                      Configure your outgoing email server so the portfolio site can send contact message receipts.
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#10B981', marginBottom: '20px', fontWeight: 500 }}>
                      Gmail tip: Use <strong>smtp.gmail.com</strong>, port <strong>587</strong>, encryption <strong>TLS</strong>, and an <strong>App Password</strong> (not your regular password).
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={profileLabelStyle}>SMTP Host</label>
                        <input style={profileInputStyle} placeholder="smtp.gmail.com" value={settingsForm.smtpHost || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpHost: e.target.value })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>SMTP Port</label>
                        <input type="number" style={profileInputStyle} placeholder="587" value={settingsForm.smtpPort || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpPort: e.target.value === '' ? '' : Number(e.target.value) })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>SMTP Username (your email)</label>
                        <input style={profileInputStyle} placeholder="user@gmail.com" value={settingsForm.smtpUser || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpUser: e.target.value })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>SMTP Password / App Password</label>
                        <div style={{ position: 'relative' }}>
                          <input type={showSmtpPass ? 'text' : 'password'} style={{ ...profileInputStyle, paddingRight: '48px' }} placeholder="••••••••••••" value={settingsForm.smtpPass || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpPass: e.target.value })} />
                          <button
                            type="button"
                            onClick={() => setShowSmtpPass(v => !v)}
                            style={{
                              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#94A3B8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: '4px',
                              borderRadius: '6px',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
                            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                            title={showSmtpPass ? 'Hide password' : 'Show password'}
                          >
                            {showSmtpPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label style={profileLabelStyle}>From Name</label>
                        <input style={profileInputStyle} placeholder="HP.dev" value={settingsForm.smtpFromName || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpFromName: e.target.value })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>From Email Address</label>
                        <input style={profileInputStyle} placeholder="no-reply@example.com" value={settingsForm.smtpFrom || ''} onChange={e => setSettingsForm({ ...settingsForm, smtpFrom: e.target.value })} />
                      </div>
                      <div>
                        <label style={profileLabelStyle}>Encryption</label>
                        <select style={profileSelectStyle} value={settingsForm.smtpEncryption || 'tls'} onChange={e => setSettingsForm({ ...settingsForm, smtpEncryption: e.target.value })}>
                          <option value="tls" style={optionStyle}>TLS / STARTTLS (port 587) — Recommended</option>
                          <option value="ssl" style={optionStyle}>SSL (port 465)</option>
                          <option value="none" style={optionStyle}>None / No Encryption</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. SYSTEM INFO TAB */}
                {settingsTab === 'system' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{
                      borderRadius: '16px',
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                      overflow: 'hidden',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.02)'
                    }}>
                      {/* Panel Header */}
                      <div style={{
                        padding: '18px 24px',
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <FiBarChart2 size={20} color={textMain} />
                        <h3 style={{
                          fontFamily: 'Poppins',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: textMain,
                          margin: 0
                        }}>
                          System Info
                        </h3>
                      </div>

                      {/* Panel Body */}
                      <div style={{ padding: '8px 24px' }}>
                        {loadingSystemInfo ? (
                          <div style={{ padding: '40px 0', textAlign: 'center', color: textMuted, fontFamily: 'Inter', fontSize: '0.9rem' }}>
                            Loading system statistics...
                          </div>
                        ) : !systemInfo ? (
                          <div style={{ padding: '40px 0', textAlign: 'center', color: '#EF4444', fontFamily: 'Inter', fontSize: '0.9rem' }}>
                            Failed to load system details.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {[
                              { label: 'Node.js Version', value: systemInfo.nodeVersion },
                              { label: 'Server', value: systemInfo.server },
                              { label: 'Database', value: systemInfo.database },
                              { label: 'Uploads Folder', value: systemInfo.uploadsFolder, isBadge: true },
                              { label: 'Sessions', value: systemInfo.sessions, isBadge: true },
                            ].map((row, index, arr) => (
                              <div
                                key={row.label}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '18px 0',
                                  borderBottom: index === arr.length - 1 ? 'none' : (isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F1F5F9')
                                }}
                              >
                                <span style={{
                                  fontFamily: 'Inter',
                                  fontSize: '0.88rem',
                                  color: isDark ? '#94A3B8' : '#475569',
                                  fontWeight: 500
                                }}>
                                  {row.label}
                                </span>
                                
                                {row.isBadge ? (
                                  <span style={{
                                    fontFamily: 'Inter',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    background: row.value.includes('NOT') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: row.value.includes('NOT') ? '#EF4444' : '#10B981',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    {row.value}
                                  </span>
                                ) : (
                                  <span style={{
                                    fontFamily: 'Inter',
                                    fontSize: '0.88rem',
                                    color: textMain,
                                    fontWeight: 600
                                  }}>
                                    {row.value}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. SECTION VISIBILITY TAB */}
                {settingsTab === 'visibility' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <FiEye size={20} color={textMain} />
                      <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: textMain, margin: 0 }}>👁️ Section Visibility</h3>
                    </div>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: textMuted, marginBottom: '24px', lineHeight: 1.6 }}>
                      Control which sections are visible on the public website. Hidden sections will also be removed from the navigation bar. Toggle a section off to hide it, and toggle it back on to make it visible again.
                    </p>

                    <style>{`
                      .visibility-toggle-track {
                        position: relative;
                        width: 52px;
                        height: 28px;
                        border-radius: 14px;
                        cursor: pointer;
                        border: none;
                        padding: 0;
                        transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
                        flex-shrink: 0;
                      }
                      .visibility-toggle-track:hover {
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
                      }
                      .visibility-toggle-track:active {
                        transform: scale(0.96);
                      }
                      .visibility-toggle-thumb {
                        position: absolute;
                        top: 3px;
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        background: #FFFFFF;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s;
                      }
                      .visibility-toggle-track:active .visibility-toggle-thumb {
                        transform: scaleX(1.1);
                      }
                      .visibility-section-card {
                        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                      }
                      .visibility-section-card:hover {
                        transform: translateY(-1px);
                        box-shadow: ${isDark ? '0 8px 25px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.06)'} !important;
                      }
                    `}</style>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { key: 'about', label: 'About', emoji: '👤', desc: 'About Me section with bio, education & profile info' },
                        { key: 'skills', label: 'Skills', emoji: '⚡', desc: 'Technical skills & expertise showcase' },
                        { key: 'projects', label: 'Projects', emoji: '🚀', desc: 'Featured projects portfolio' },
                        { key: 'experience', label: 'Experience', emoji: '💼', desc: 'Work experience timeline' },
                        { key: 'services', label: 'Services', emoji: '🔧', desc: 'Services you offer to clients' },
                        { key: 'certifications', label: 'Certifications', emoji: '🏆', desc: 'Certifications & awards section' },
                        { key: 'blog', label: 'Blog', emoji: '📝', desc: 'Blog posts & articles' },
                        { key: 'testimonials', label: 'Testimonials', emoji: '👥', desc: 'Client testimonials & reviews' },
                        { key: 'contact', label: 'Contact', emoji: '✉️', desc: 'Contact form & information' },
                      ].map(sec => {
                        const isOn = settingsForm.visibleSections?.[sec.key] !== false;
                        return (
                          <div
                            key={sec.key}
                            className="visibility-section-card"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '18px 20px',
                              borderRadius: '14px',
                              background: isDark
                                ? (isOn ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.04)')
                                : (isOn ? '#FAFBFC' : 'rgba(239,68,68,0.03)'),
                              border: isDark
                                ? (isOn ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.15)')
                                : (isOn ? '1px solid #E2E8F0' : '1px solid rgba(239,68,68,0.12)'),
                              gap: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                              <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: isDark
                                  ? (isOn ? 'rgba(99,102,241,0.12)' : 'rgba(239,68,68,0.08)')
                                  : (isOn ? 'rgba(99,102,241,0.08)' : 'rgba(239,68,68,0.06)'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.15rem',
                                flexShrink: 0,
                                transition: 'background 0.3s',
                              }}>
                                {sec.key === 'about' ? <FiUser size={18} color="#6366F1" /> :
                                 sec.key === 'skills' ? <FiCpu size={18} color="#6366F1" /> :
                                 sec.key === 'projects' ? <FiFolder size={18} color="#6366F1" /> :
                                 sec.key === 'experience' ? <FiBriefcase size={18} color="#6366F1" /> :
                                 sec.key === 'services' ? <FiLayers size={18} color="#6366F1" /> :
                                 sec.key === 'certifications' ? <FiAward size={18} color="#6366F1" /> :
                                 sec.key === 'blog' ? <FiFileText size={18} color="#6366F1" /> :
                                 sec.key === 'testimonials' ? <FiUsers size={18} color="#6366F1" /> :
                                 sec.key === 'contact' ? <FiMail size={18} color="#6366F1" /> : sec.emoji}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{
                                  fontFamily: 'Poppins',
                                  fontWeight: 700,
                                  fontSize: '0.92rem',
                                  color: isOn ? textMain : (isDark ? '#94A3B8' : '#94A3B8'),
                                  marginBottom: '2px',
                                  transition: 'color 0.3s',
                                }}>
                                  {sec.label}
                                </div>
                                <div style={{
                                  fontFamily: 'Inter',
                                  fontSize: '0.78rem',
                                  color: textMuted,
                                  lineHeight: 1.4,
                                }}>
                                  {sec.desc}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                              <span style={{
                                fontFamily: 'Inter',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: '8px',
                                letterSpacing: '0.03em',
                                background: isOn ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: isOn ? '#10B981' : '#EF4444',
                                transition: 'all 0.3s',
                              }}>
                                {isOn ? 'Visible' : 'Hidden'}
                              </span>

                              <button
                                type="button"
                                className="visibility-toggle-track"
                                onClick={() => {
                                  setSettingsForm(prev => ({
                                    ...prev,
                                    visibleSections: {
                                      ...prev.visibleSections,
                                      [sec.key]: !isOn,
                                    },
                                  }));
                                }}
                                style={{
                                  background: isOn
                                    ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                    : (isDark ? 'rgba(255,255,255,0.1)' : '#CBD5E1'),
                                }}
                                title={isOn ? `Hide ${sec.label} section` : `Show ${sec.label} section`}
                              >
                                <div
                                  className="visibility-toggle-thumb"
                                  style={{ left: isOn ? '27px' : '3px' }}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{
                      marginTop: '20px',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)',
                      border: isDark ? '1px solid rgba(99,102,241,0.12)' : '1px solid rgba(99,102,241,0.1)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}>
                      <span style={{ fontSize: '1rem', marginTop: '1px' }}>💡</span>
                      <p style={{
                        fontFamily: 'Inter',
                        fontSize: '0.8rem',
                        color: isDark ? '#A5B4FC' : '#6366F1',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        <strong>Tip:</strong> Hidden sections are only removed from the public website. You can still manage their content from this admin panel. Click <strong>Save Settings</strong> below to apply your changes.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Shared Save button at the bottom of the active settings tab */}
                {settingsTab !== 'system' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', borderTop: cardBorder, paddingTop: '24px' }}>
                    {settingsTab === 'smtp' && (
                      <button
                        onClick={handleTestSmtp}
                        disabled={testingSmtp}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '10px',
                          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                          background: 'transparent',
                          color: textMain,
                          fontFamily: 'Poppins',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: testingSmtp ? 'not-allowed' : 'pointer',
                          opacity: testingSmtp ? 0.7 : 1,
                          transition: 'all 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={e => {
                          if (!testingSmtp) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {testingSmtp ? '🔌 Testing...' : '🔌 Test Connection'}
                      </button>
                    )}
                    <button onClick={handleSettingsSave} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                      Save Settings
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: toast.type === 'success'
                ? (isDark ? 'rgba(6, 78, 59, 0.95)' : '#ECFDF5')
                : (isDark ? 'rgba(127, 29, 29, 0.95)' : '#FEF2F2'),
              border: toast.type === 'success'
                ? (isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.2)')
                : (isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(239, 68, 68, 0.2)'),
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(8px)',
              color: toast.type === 'success'
                ? (isDark ? '#A7F3D0' : '#065F46')
                : (isDark ? '#FCA5A5' : '#991B1B'),
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {toast.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
            </span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
