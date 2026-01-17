import { create } from 'zustand';

type ModalType = 'login' | 'address' | 'addAddress' | 'location' | 'offers' | null;

interface UIState {
  isCartOpen: boolean;
  activeModal: ModalType;
  isSearchOpen: boolean;
  isSidebarOpen: boolean;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  activeModal: null,
  isSearchOpen: false,
  isSidebarOpen: true,
  toasts: [],

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
