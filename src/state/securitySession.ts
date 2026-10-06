import { create } from 'zustand';

interface SecuritySessionState {
  pin: string | null;
  setPin: (pin: string | null) => void;
  clear: () => void;
}

export const useSecuritySession = create<SecuritySessionState>((set) => ({
  pin: null,
  setPin: (pin) => set({ pin }),
  clear: () => set({ pin: null }),
}));
