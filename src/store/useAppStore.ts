import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: 'EN' | 'ID';
  theme: 'light' | 'dark';
  profileBorderColor: string;
  isProfileModalOpen: boolean;
  setLanguage: (lang: 'EN' | 'ID') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setProfileBorderColor: (color: string) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'EN',
      theme: 'light',
      profileBorderColor: '#111111',
      isProfileModalOpen: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setProfileBorderColor: (profileBorderColor) => set({ profileBorderColor }),
      openProfileModal: () => set({ isProfileModalOpen: true }),
      closeProfileModal: () => set({ isProfileModalOpen: false }),
    }),
    { 
      name: 'gumclone-app-storage',
      partialize: (state) => ({ 
        language: state.language, 
        theme: state.theme, 
        profileBorderColor: state.profileBorderColor 
      }) 
    }
  )
);
