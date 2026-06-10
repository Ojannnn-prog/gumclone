import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  isVisible: false,
  showToast: (message, type = 'success') => {
    set({ message, type, isVisible: true });
    // Auto hide after 3 seconds
    setTimeout(() => {
      set((state) => {
        // Only hide if the message hasn't changed (prevents hiding new toasts too early)
        if (state.message === message) {
          return { ...state, isVisible: false };
        }
        return state;
      });
    }, 3000);
  },
  hideToast: () => set({ isVisible: false }),
}));
