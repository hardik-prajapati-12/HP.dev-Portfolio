import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  const applyTheme = (dark) => {
    // Apply directly to document so ALL sections inherit it
    document.documentElement.style.background = dark ? '#030712' : '#FFFFFF';
    document.body.style.background = dark ? '#030712' : '#FFFFFF';
    document.body.style.color = dark ? '#F3F4F6' : '#1E293B';
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
