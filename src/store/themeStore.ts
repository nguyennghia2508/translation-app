import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Initialize theme with simplified logic - default to light theme
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const fromZustand = localStorage.getItem('theme-storage') 
      ? JSON.parse(localStorage.getItem('theme-storage')!).state.theme
      : null;
    return fromZustand || localStorage.getItem('theme') as Theme || 'light';
  } catch {
    return 'light';
  }
};

// Custom storage adapter to remove version field
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      const data = JSON.parse(str);
      return JSON.stringify({ state: data.state }); // Only return state without version
    } catch {
      return str;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      const data = JSON.parse(value);
      // Store only the state without version
      localStorage.setItem(name, JSON.stringify({ state: data.state }));
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name)
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      setTheme: (theme: Theme) => {
        set({ theme });
        // Update document classes for immediate visual effect
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(theme);
          root.setAttribute('data-theme', theme);
        }
      },
      toggleTheme: () => 
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Update document classes for immediate visual effect
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
            root.setAttribute('data-theme', newTheme);
          }
          return { theme: newTheme };
        }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => customStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure theme is applied when storage is rehydrated
        if (state && typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(state.theme);
          root.setAttribute('data-theme', state.theme);
        }
      }
    }
  )
);