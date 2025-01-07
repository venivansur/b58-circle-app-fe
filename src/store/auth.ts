import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: User | null; 
  setUser: (user: User) => void; 
  clearUser: () => void; 
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null, // Nilai awal adalah null
      setUser: (user) => set(() => ({ user })), 
      clearUser: () => set(() => ({ user: null })), 
    }),
    {
      name: "auth-storage", 
    }
  )
);
