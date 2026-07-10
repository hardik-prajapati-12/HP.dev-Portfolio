import React from 'react';
import {
  FiSend,
  FiZap,
  FiAward,
  FiSun,
  FiBriefcase,
  FiTarget,
  FiStar,
  FiBookOpen,
  FiBook,
  FiCloud,
  FiGlobe,
  FiCoffee,
  FiMonitor,
  FiEdit3,
  FiLink,
  FiFeather,
  FiDatabase,
  FiPhone,
  FiSettings,
  FiEye,
  FiMail,
  FiBarChart2,
  FiUser,
  FiUsers,
  FiSlash,
  FiHash,
  FiCheckSquare,
  FiCheckCircle,
  FiEyeOff,
  FiMessageSquare,
  FiTrendingUp,
  FiClock,
  FiCalendar,
  FiInbox,
  FiAlertCircle,
  FiCpu
} from 'react-icons/fi';

const EMOJI_MAP = {
  // Stats
  '🚀': FiSend,
  '⚡': FiZap,
  '🏆': FiAward,
  '💡': FiSun,
  
  // Experience / Career
  '💼': FiBriefcase,
  '🎯': FiTarget,
  '🌟': FiStar,
  
  // Education
  '🎓': FiBookOpen,
  '📚': FiBook,
  
  // Certifications
  '☁️': FiCloud,
  '🍃': FiDatabase,
  '⚛️': FiCpu,
  '🟢': FiCheckCircle,
  '🌐': FiGlobe,
  '☕': FiCoffee,
  
  // Achievements
  '🥇': FiAward,
  '⭐': FiStar,
  '💻': FiMonitor,
  '✍️': FiEdit3,
  
  // Services
  '🔗': FiLink,
  '🎨': FiFeather,
  '🗄️': FiDatabase,
  
  // General UI / Tabs
  '📞': FiPhone,
  '⚙️': FiSettings,
  '👁️': FiEye,
  '📧': FiMail,
  '📊': FiBarChart2,
  '👤': FiUser,
  '👥': FiUsers,
  '📝': FiEdit3,
  '🚫': FiSlash,
  '🔢': FiHash,
  '📋': FiCheckSquare,
  '✉️': FiMail,
  '🏅': FiTrendingUp,
  '🔧': FiSettings,
  '🕒': FiClock,
  '📅': FiCalendar,
  '📥': FiInbox,
  'Bell': FiAlertCircle
};

export default function EmojiIcon({ emoji, size = 18, color, style = {}, className = '' }) {
  if (!emoji) return null;
  const cleanEmoji = typeof emoji === 'string' ? emoji.trim() : '';
  const IconComponent = EMOJI_MAP[cleanEmoji];
  if (IconComponent) {
    return <IconComponent size={size} color={color} style={style} className={className} />;
  }
  return <span style={{ fontSize: `${size}px`, ...style }} className={className}>{emoji}</span>;
}
