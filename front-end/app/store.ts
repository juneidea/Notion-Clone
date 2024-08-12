import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticatedTrue: () => void;
  authenticatedFalse: () => void;
  loadingTrue: () => void;
  loadingFalse: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  authenticatedTrue: () => {
    set({ isAuthenticated: true });
  },
  authenticatedFalse: () => {
    set({ isAuthenticated: false });
  },
  loadingTrue: () => {
    set({ isLoading: true });
  },
  loadingFalse: () => {
    set({ isLoading: false });
  },
}));
