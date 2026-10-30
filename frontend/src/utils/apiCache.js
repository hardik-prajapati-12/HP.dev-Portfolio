// Client-side caching utility to ensure instant load times and eliminate layout shift / dummy data flashes

export const CACHE_KEYS = {
  SETTINGS: 'hp_cache_settings',
  PROFILE: 'hp_cache_profile',
  EDUCATION: 'hp_cache_education',
  EXPERIENCE: 'hp_cache_experience',
  STATS: 'hp_cache_stats',
  SKILLS: 'hp_cache_skills',
  PROJECTS: 'hp_cache_projects',
  PROJECT_CATEGORIES: 'hp_cache_project_categories',
  SERVICES: 'hp_cache_services',
  CERTIFICATIONS: 'hp_cache_certifications',
  ACHIEVEMENTS: 'hp_cache_achievements',
  TESTIMONIALS: 'hp_cache_testimonials',
  BLOGS: 'hp_cache_blogs'
};

export function getCached(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    // For arrays, ensure it is an array and not empty if fallback is non-empty,
    // except when intentionally empty (e.g. testimonials)
    if (Array.isArray(fallback) && fallback.length > 0 && Array.isArray(parsed) && parsed.length === 0) {
      return fallback;
    }
    return parsed;
  } catch (err) {
    return fallback;
  }
}

export function setCached(key, value) {
  try {
    if (value === undefined || value === null) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Gracefully ignore storage quota errors in private browsing
  }
}

export function clearPortfolioCache(key) {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      Object.values(CACHE_KEYS).forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });
    }
  } catch (err) {}
}

