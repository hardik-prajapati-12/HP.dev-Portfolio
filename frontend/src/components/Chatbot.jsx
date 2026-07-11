import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiMail,
  FiSend,
  FiUser,
  FiX,
} from 'react-icons/fi';
import axios from 'axios';
import chatbotLogo from '../assets/chatbot-logo.png';
import './Chatbot.css';
import { useTheme } from '../context/ThemeContext';
import {
  PERSONAL_INFO,
  PROJECTS,
  SERVICES,
  SKILLS,
  STATS,
  EXPERIENCE,
  CERTIFICATIONS,
} from '../data/portfolioData';

const QUICK_ACTIONS = [
  { label: 'Skills', prompt: 'Tell me about Hardik skills', icon: FiCpu },
  { label: 'Projects', prompt: 'Show featured projects', icon: FiBriefcase },
  { label: 'Message', prompt: 'send message', icon: FiMail },
];

const PORTFOLIO_INTENT_WORDS = [
  'skill',
  'tech',
  'stack',
  'language',
  'framework',
  'tool',
  'project',
  'portfolio',
  'built',
  'work',
  'app',
  'demo',
  'service',
  'consult',
  'experience',
  'job',
  'career',
  'company',
  'education',
  'certification',
  'contact',
  'phone',
  'linkedin',
  'github',
  'social',
];

const createTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const createMessage = (sender, content, meta = {}) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  content,
  time: createTime(),
  ...meta,
});

const containsAny = (text, words) => words.some((word) => text.includes(word));

const isPortfolioIntent = (input) => {
  const clean = input.toLowerCase().trim();
  const hasIntentWord = containsAny(clean, PORTFOLIO_INTENT_WORDS);
  const soundsLikeQuestion = /^(what|show|tell|list|share|explain|how|can|do|does)\b/.test(clean);

  return hasIntentWord && (soundsLikeQuestion || clean.length <= 36);
};

function buildPortfolioContext(profile) {
  const topSkills = Object.entries(SKILLS)
    .map(([group, skills]) => `${group}: ${skills.slice(0, 4).map((skill) => skill.name).join(', ')}`)
    .join('\n');

  const featuredProjects = PROJECTS
    .filter((project) => project.featured)
    .slice(0, 3)
    .map((project) => ({
      title: project.title,
      description: project.description,
      tags: project.technologies.slice(0, 4).join(', '),
    }));

  return {
    profile,
    topSkills,
    featuredProjects: Array.isArray(featuredProjects) ? featuredProjects : [],
    services: SERVICES.slice(0, 4).map((service) => service.title),
    stats: STATS.map((stat) => `${stat.value}${stat.suffix} ${stat.label}`).join(' | '),
    recentExperience: EXPERIENCE.slice(0, 3),
    certifications: CERTIFICATIONS.slice(0, 4).map((cert) => cert.title),
  };
}

function LinkButton({ href, children, isDark }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: isDark ? '#A5B4FC' : '#4F46E5',
        fontWeight: 700,
        textDecoration: 'none',
      }}
    >
      {children}
      <FiArrowRight size={13} />
    </a>
  );
}

function MessageContent({ message, isDark }) {
  if (message.kind === 'cards') {
    const cards = Array.isArray(message.cards) ? message.cards : [];
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <p style={{ margin: 0, lineHeight: 1.55 }}>{message.content}</p>
        {cards.length ? (
          cards.map((card) => (
            <div
              key={card.title || `${card.description || 'card'}-${Math.random().toString(16).slice(2)}`}
              style={{
                padding: 12,
                borderRadius: 12,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                background: isDark ? 'rgba(255,255,255,0.035)' : '#FFFFFF',
              }}
            >
              <strong style={{ display: 'block', fontSize: '0.86rem', marginBottom: 5 }}>{card.title}</strong>
              <span style={{ display: 'block', lineHeight: 1.45, opacity: 0.86 }}>{card.description}</span>
              {card.tags && (
                <small style={{ display: 'block', marginTop: 8, color: isDark ? '#A5B4FC' : '#4F46E5' }}>
                  {card.tags}
                </small>
              )}
            </div>
          ))
        ) : (
          <p style={{ margin: 0, lineHeight: 1.55, opacity: 0.76 }}>No card content is available.</p>
        )}
      </div>
    );
  }

  if (Array.isArray(message.content)) {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {message.content.map((line) => (
          <p key={line} style={{ margin: 0, lineHeight: 1.5 }}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return <p style={{ margin: 0, lineHeight: 1.55 }}>{message.content}</p>;
}

function CroppedChatbotLogo({ size = 46, imageWidth = 146, top = '50%', glow = false }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        display: 'block',
        flexShrink: 0,
        boxShadow: glow ? '0 0 22px rgba(236,72,153,0.22), 0 0 30px rgba(34,211,238,0.28)' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <img
        src={chatbotLogo}
        alt=""
        style={{
          position: 'absolute',
          left: '50%',
          top,
          width: imageWidth,
          height: 'auto',
          maxWidth: 'none',
          transform: 'translate(-50%, -50%)',
          display: 'block',
        }}
      />
    </span>
  );
}

export default function Chatbot() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    createMessage('bot', [
      "Hi, I am Hardik's portfolio assistant.",
      'Ask me about his skills, projects, services, experience, or use Message to send a direct inquiry.',
    ]),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(PERSONAL_INFO);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const [useBackendChat] = useState(true);
  const [leadForm, setLeadForm] = useState({ active: false, step: 'message', message: '', name: '', email: '' });
  const [deliveryState, setDeliveryState] = useState('idle');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const context = useMemo(() => buildPortfolioContext(profile), [profile]);

  useEffect(() => {
    axios.get('/api/profile').then((res) => {
      if (res.data?.name) setProfile((current) => ({ ...current, ...res.data }));
    }).catch(() => {});
  }, []);

  // Load chat history when the widget opens (if backend supports it)
  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      try {
        const res = await axios.get('/api/chat/history', { params: { sessionId } });
        if (!cancelled && Array.isArray(res.data) && res.data.length) {
          setMessages(res.data.map((m) => ({
            // ensure messages have id/time if backend omitted them
            id: m.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            sender: m.sender || (m.from === 'user' ? 'user' : 'bot'),
            content: m.content,
            time: m.time || createTime(),
            ...(m.kind ? { kind: m.kind } : {}),
          })));
        }
      } catch (e) {
        // ignore if endpoint not present
      }
    };

    if (isOpen) loadHistory();
    return () => {
      cancelled = true;
    };
  }, [isOpen, sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [isOpen]);

  const colors = {
    panel: isDark ? 'rgba(8, 13, 26, 0.96)' : 'rgba(255,255,255,0.98)',
    raised: isDark ? 'rgba(255,255,255,0.055)' : '#F8FAFC',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
    strong: isDark ? '#F8FAFC' : '#0F172A',
    soft: isDark ? '#94A3B8' : '#64748B',
    userText: '#FFFFFF',
  };

  const addBotReply = (reply) => {
    setMessages((prev) => [...prev, createMessage('bot', reply.content, reply)]);
  };

  const buildReply = (input) => {
    const clean = input.toLowerCase().trim();

    if (containsAny(clean, ['skill', 'tech', 'stack', 'language', 'framework', 'tool'])) {
      return {
        content: [
          'Hardik works across the full MERN stack with strong frontend, backend, database, and tooling coverage.',
          context.topSkills,
          `Portfolio snapshot: ${context.stats}.`,
        ],
      };
    }

    if (containsAny(clean, ['project', 'portfolio', 'built', 'work', 'app', 'demo'])) {
      return {
        kind: 'cards',
        content: 'Here are a few featured projects from the portfolio:',
        cards: context.featuredProjects,
      };
    }

    if (containsAny(clean, ['service', 'consult', 'build'])) {
      return {
        content: [
          'Hardik can help with full stack web apps, API development, frontend implementation, database design, performance work, and technical consulting.',
          `Best fit: React, Node.js, MongoDB, REST APIs, JavaScript, and scalable portfolio or product builds.`,
          'Type Message and I can collect your project details for him.',
        ],
      };
    }

    if (containsAny(clean, ['experience', 'job', 'career', 'company', 'education', 'certification'])) {
      return {
        content: [
          `Experience: ${context.recentExperience.map((item) => `${item.title} at ${item.company}`).join('; ')}.`,
          `Certifications include: ${context.certifications.join(', ')}.`,
        ],
      };
    }

    if (containsAny(clean, ['contact', 'email', 'phone', 'linkedin', 'github', 'social'])) {
      return {
        content: [
          `Email: ${context.profile.email}`,
          `Phone: ${context.profile.phone}`,
          `Location: ${context.profile.location}`,
          'You can also send a message from this chat and it will go into the portfolio contact system.',
        ],
      };
    }

    if (containsAny(clean, ['send message', 'message', 'inquiry', 'quote', 'proposal'])) {
      setLeadForm({ active: true, step: 'message', message: '', name: '', email: '' });
      return { content: 'Sure. Please type the message you want to send to Hardik.' };
    }

    return {
      content: [
        "I can help visitors quickly understand Hardik's portfolio.",
        'Try asking about skills, featured projects, experience, services, or contact details.',
      ],
    };
  };

  const handleLeadFlow = async (input, options = {}) => {
    if (options.interruptLeadFlow || isPortfolioIntent(input)) {
      setLeadForm({ active: false, step: 'message', message: '', name: '', email: '' });
      setDeliveryState('idle');
      return buildReply(input);
    }

    if (leadForm.step === 'message') {
      setLeadForm((prev) => ({ ...prev, message: input, step: 'name' }));
      return { content: 'Got it. What is your name?' };
    }

    if (leadForm.step === 'name') {
      setLeadForm((prev) => ({ ...prev, name: input, step: 'email' }));
      return { content: 'Thanks. What email address should Hardik reply to?' };
    }

    const email = input.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return { content: 'Please enter a valid email address so Hardik can reply.' };
    }

    setDeliveryState('sending');
    const payload = {
      name: leadForm.name,
      email,
      subject: 'Portfolio chatbot inquiry',
      message: leadForm.message,
    };

    try {
      await axios.post('/api/contact', payload);
      setDeliveryState('sent');
      setLeadForm({ active: false, step: 'message', message: '', name: '', email: '' });
      return {
        content: [
          'Done. Your message has been sent to Hardik.',
          'He can reply directly using the email address you shared.',
        ],
      };
    } catch {
      setDeliveryState('error');
      return {
        content: [
          'I could not send the message through the contact API right now.',
          `You can still reach Hardik directly at ${context.profile.email}.`,
        ],
      };
    }
  };

  const handleSend = async (overrideText, options = {}) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = createMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let reply = null;
      const isLeadIntent = containsAny(text.toLowerCase(), ['send message', 'message', 'inquiry', 'quote', 'proposal']);

      if (leadForm.active) {
        reply = await handleLeadFlow(text, options);
      } else if (isLeadIntent) {
        // Ensure the message quick action starts the lead flow locally instead of sending it to the backend.
        reply = buildReply(text);
      } else if (useBackendChat) {
        try {
          const res = await axios.post('/api/chat', { input: text, context, sessionId });
          // backend can return structured reply or plain text
          reply = res.data?.reply ?? res.data;
        } catch (e) {
          // fallback to local reply builder
          reply = buildReply(text);
        }
      } else {
        reply = buildReply(text);
      }

      // normalize reply into object with content
      if (typeof reply === 'string') reply = { content: reply };

      // simulate typing delay proportional to reply length
      const replyText = Array.isArray(reply.content)
        ? reply.content.join(' ')
        : (typeof reply.content === 'string' ? reply.content : '');
      const typingDelay = Math.min(1000 + (replyText.length * 12), 3200);
      await new Promise((r) => setTimeout(r, typingDelay));

      setIsTyping(false);
      addBotReply(reply);
    } catch (e) {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.10, y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open portfolio assistant"
          style={{
            position: 'fixed',
            right: 'clamp(18px, 4vw, 32px)',
            bottom: 'clamp(18px, 4vw, 32px)',
            width: 92,
            height: 92,
            borderRadius: '50%',
            border: '1px solid transparent',
            background: 'transparent',
            color: '#FFFFFF',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            zIndex: 99990,
            overflow: 'visible',
            boxShadow: 'none',
          }}
        >
          <CroppedChatbotLogo size={70} imageWidth={180} top="60%" glow />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              right: 'clamp(14px, 4vw, 32px)',
              bottom: 'clamp(18px, 4vw, 32px)',
              width: 'min(420px, calc(100vw - 28px))',
              height: 'min(620px, calc(100vh - 124px))',
              minHeight: 460,
              borderRadius: 24,
              background: colors.panel,
              border: colors.border,
              boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.52)' : '0 30px 70px rgba(15,23,42,0.14)',
              backdropFilter: 'blur(18px)',
              zIndex: 99992,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, Poppins, sans-serif',
              color: colors.strong,
            }}
          >
            <header
              style={{
                position: 'relative',
                padding: '18px 18px 16px',
                borderBottom: colors.border,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.08))'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CroppedChatbotLogo size={58} imageWidth={170} top="63%" glow />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: colors.strong }}>
                    Hardik's AI Assistant
                  </h3>
                  <p style={{ margin: '4px 0 0', color: colors.soft, fontSize: '0.78rem' }}>
                    Portfolio guide and inquiry assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="chatbot-close-button"
                style={{
                  '--close-btn-bg': isDark ? 'rgba(255,255,255,0.08)' : '#F8FAFC',
                  '--close-btn-border': isDark ? '1px solid rgba(226,232,240,0.35)' : '1px solid rgba(148,163,184,0.35)',
                  '--close-btn-color': isDark ? '#F8FAFC' : '#0F172A',
                }}
              >
                <FiX size={18} />
              </button>
            </header>

            <div
              style={{
                padding: '14px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 8,
                borderBottom: colors.border,
              }}
            >
              {QUICK_ACTIONS.map(({ label, prompt, icon: Icon }) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  style={{
                    minHeight: 58,
                    borderRadius: 14,
                    border: colors.border,
                    background: colors.raised,
                    color: colors.strong,
                    display: 'grid',
                    placeItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.border = '1px solid rgba(99,102,241,0.7)';
                    event.currentTarget.style.background = isDark
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.08))'
                      : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.08))';
                    event.currentTarget.style.color = isDark ? '#FFFFFF' : '#3730A3';
                    event.currentTarget.style.boxShadow = '0 12px 26px rgba(99,102,241,0.18)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.border = colors.border;
                    event.currentTarget.style.background = colors.raised;
                    event.currentTarget.style.color = colors.strong;
                    event.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={16} />
                  {label}
                </motion.button>
              ))}
            </div>

            <main
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {messages.map((message) => {
                const isBot = message.sender === 'bot';
                return (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: isBot ? 'flex-start' : 'flex-end',
                      gap: 9,
                      alignItems: 'flex-end',
                    }}
                  >
                    {isBot && (
                      <CroppedChatbotLogo size={32} imageWidth={96} top="61%" />
                    )}
                    <div style={{ maxWidth: '82%', display: 'grid', gap: 5 }}>
                      <div
                        style={{
                          padding: '12px 14px',
                          borderRadius: isBot ? '16px 16px 16px 5px' : '16px 16px 5px 16px',
                          background: isBot ? colors.raised : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                          border: isBot ? colors.border : '1px solid transparent',
                          color: isBot ? colors.strong : colors.userText,
                          fontSize: '0.86rem',
                          lineHeight: 1.5,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        <MessageContent message={message} isDark={isDark} />
                      </div>
                      <small
                        style={{
                          color: colors.soft,
                          fontSize: '0.67rem',
                          justifySelf: isBot ? 'start' : 'end',
                          paddingInline: 4,
                        }}
                      >
                        {message.time}
                      </small>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
                  <CroppedChatbotLogo size={32} imageWidth={96} top="61%" />
                  <div
                    style={{
                      padding: '13px 16px',
                      borderRadius: '16px 16px 16px 5px',
                      border: colors.border,
                      background: colors.raised,
                      display: 'flex',
                      gap: 5,
                    }}
                  >
                    {[0, 1, 2].map((item) => (
                      <motion.span
                        key={item}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.75, repeat: Infinity, delay: item * 0.12 }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#6366F1',
                          display: 'block',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </main>

            {deliveryState === 'sent' && (
              <div
                style={{
                  margin: '0 16px 12px',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(16,185,129,0.12)',
                  color: '#10B981',
                  border: '1px solid rgba(16,185,129,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                <FiCheckCircle /> Inquiry delivered
              </div>
            )}

            <footer
              style={{
                padding: 16,
                borderTop: colors.border,
                display: 'grid',
                gap: 10,
                background: isDark ? 'rgba(3,7,18,0.72)' : 'rgba(255,255,255,0.86)',
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSend();
                  }}
                  placeholder={leadForm.active ? 'Continue the message flow...' : 'Ask about Hardik...'}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 46,
                    borderRadius: 14,
                    border: colors.border,
                    background: colors.raised,
                    color: colors.strong,
                    outline: 'none',
                    padding: '0 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping || deliveryState === 'sending'}
                  aria-label="Send message"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    border: 'none',
                    background:
                      !inputValue.trim() || isTyping
                        ? (isDark ? 'rgba(255,255,255,0.1)' : '#CBD5E1')
                        : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer',
                  }}
                >
                  <FiSend size={17} />
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: '0.74rem' }}>
                <LinkButton href="#projects" isDark={isDark}>Projects</LinkButton>
                <LinkButton href="#contact" isDark={isDark}>Contact form</LinkButton>
              </div>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
