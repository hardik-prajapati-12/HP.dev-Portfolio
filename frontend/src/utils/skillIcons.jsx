import { 
  FaJava, FaReact, FaNodeJs, FaBrain, FaJs, FaPython, FaLink, FaGithub, FaDocker, FaAws, FaLinux, FaHtml5, FaCss3Alt, FaRust, FaEthereum 
} from 'react-icons/fa';
import { 
  SiMongodb, SiTypescript, SiTailwindcss, SiExpress, SiGraphql, SiMysql, SiPostman, SiNextdotjs, SiKubernetes 
} from 'react-icons/si';
import { BiLogoPostgresql } from 'react-icons/bi';
import { DiRedis } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc';
import { FiCpu } from 'react-icons/fi';

export const getSkillIconDetails = (name, isDark) => {
  const norm = name.toLowerCase().trim();
  if (norm.includes('react') && !norm.includes('native')) {
    return {
      icon: <FaReact className="animate-spin-slow" style={{ animationDuration: '10s' }} />,
      color: '#61DAFB',
      glow: 'rgba(97,218,251,0.35)'
    };
  }
  if (norm === 'java') {
    return {
      icon: <FaJava />,
      color: '#F89820',
      glow: 'rgba(248,152,32,0.35)'
    };
  }
  if (norm.includes('node')) {
    return {
      icon: <FaNodeJs />,
      color: '#339933',
      glow: 'rgba(51,153,51,0.35)'
    };
  }
  if (norm.includes('mongo')) {
    return {
      icon: <SiMongodb />,
      color: '#47A248',
      glow: 'rgba(71,162,72,0.35)'
    };
  }
  if (norm === 'ai' || norm === 'ml' || norm.includes('ai/ml') || norm.includes('ai & ml') || norm.includes('machine learning') || norm.includes('artificial intelligence') || norm.includes('brain')) {
    return {
      icon: <FaBrain />,
      color: '#A855F7',
      glow: 'rgba(168,85,247,0.35)'
    };
  }
  if (norm === 'dsa') {
    return {
      icon: <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>{"{}"}</span>,
      color: '#06B6D4',
      glow: 'rgba(6,182,212,0.35)'
    };
  }
  if (norm.includes('javascript') || norm === 'js') {
    return {
      icon: <FaJs />,
      color: '#F7DF1E',
      glow: 'rgba(247,223,30,0.35)'
    };
  }
  if (norm.includes('typescript') || norm === 'ts') {
    return {
      icon: <SiTypescript />,
      color: '#3178C6',
      glow: 'rgba(49,120,198,0.35)'
    };
  }
  if (norm.includes('tailwind')) {
    return {
      icon: <SiTailwindcss />,
      color: '#06B6D4',
      glow: 'rgba(6,182,212,0.35)'
    };
  }
  if (norm.includes('express')) {
    return {
      icon: <SiExpress />,
      color: isDark ? '#E2E8F0' : '#1E293B',
      glow: isDark ? 'rgba(226,232,240,0.2)' : 'rgba(30,41,59,0.2)'
    };
  }
  if (norm === 'python') {
    return {
      icon: <FaPython />,
      color: '#3776AB',
      glow: 'rgba(55,118,171,0.35)'
    };
  }
  if (norm.includes('api') || norm.includes('link')) {
    return {
      icon: <FaLink />,
      color: '#10B981',
      glow: 'rgba(16,185,129,0.35)'
    };
  }
  if (norm.includes('graphql')) {
    return {
      icon: <SiGraphql />,
      color: '#E10098',
      glow: 'rgba(225,0,152,0.35)'
    };
  }
  if (norm.includes('mysql')) {
    return {
      icon: <SiMysql />,
      color: '#4479A1',
      glow: 'rgba(68,121,161,0.35)'
    };
  }
  if (norm.includes('postgres') || norm.includes('pg')) {
    return {
      icon: <BiLogoPostgresql />,
      color: '#4169E1',
      glow: 'rgba(65,105,225,0.35)'
    };
  }
  if (norm === 'redis') {
    return {
      icon: <DiRedis />,
      color: '#DC382D',
      glow: 'rgba(220,56,45,0.35)'
    };
  }
  if (norm.includes('git') || norm.includes('github')) {
    return {
      icon: <FaGithub />,
      color: isDark ? '#F1F5F9' : '#0F172A',
      glow: isDark ? 'rgba(241,245,249,0.2)' : 'rgba(15,23,42,0.2)'
    };
  }
  if (norm.includes('docker')) {
    return {
      icon: <FaDocker />,
      color: '#2496ED',
      glow: 'rgba(36,150,237,0.35)'
    };
  }
  if (norm.includes('vscode') || norm.includes('vs code')) {
    return {
      icon: <VscCode />,
      color: '#007ACC',
      glow: 'rgba(0,122,204,0.35)'
    };
  }
  if (norm.includes('postman')) {
    return {
      icon: <SiPostman />,
      color: '#FF6C37',
      glow: 'rgba(255,108,55,0.35)'
    };
  }
  if (norm.includes('aws')) {
    return {
      icon: <FaAws />,
      color: '#FF9900',
      glow: 'rgba(255,153,0,0.35)'
    };
  }
  if (norm.includes('linux')) {
    return {
      icon: <FaLinux />,
      color: isDark ? '#F1F5F9' : '#0F172A',
      glow: isDark ? 'rgba(241,245,249,0.2)' : 'rgba(15,23,42,0.2)'
    };
  }
  if (norm === 'html') {
    return {
      icon: <FaHtml5 />,
      color: '#E34F26',
      glow: 'rgba(227,79,38,0.35)'
    };
  }
  if (norm === 'css') {
    return {
      icon: <FaCss3Alt />,
      color: '#1572B6',
      glow: 'rgba(21,114,182,0.35)'
    };
  }
  if (norm.includes('next')) {
    return {
      icon: <SiNextdotjs />,
      color: isDark ? '#F1F5F9' : '#0F172A',
      glow: isDark ? 'rgba(241,245,249,0.2)' : 'rgba(15,23,42,0.2)'
    };
  }
  if (norm === 'rust') {
    return {
      icon: <FaRust />,
      color: '#E05D44',
      glow: 'rgba(224,93,68,0.35)'
    };
  }
  if (norm.includes('kubernetes') || norm === 'k8s') {
    return {
      icon: <SiKubernetes />,
      color: '#326CE5',
      glow: 'rgba(50,108,229,0.35)'
    };
  }
  if (norm.includes('react native')) {
    return {
      icon: <FaReact className="animate-spin-slow" style={{ animationDuration: '12s' }} />,
      color: '#61DAFB',
      glow: 'rgba(97,218,251,0.35)'
    };
  }
  if (norm.includes('web3') || norm.includes('blockchain') || norm.includes('ethereum')) {
    return {
      icon: <FaEthereum />,
      color: isDark ? '#C4C4C4' : '#3C3C3D',
      glow: isDark ? 'rgba(196,196,196,0.25)' : 'rgba(60,60,61,0.35)'
    };
  }
  return {
    icon: <FiCpu />,
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.35)'
  };
};
