import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: "google" | "local";
  image: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        set({ user: null, isLoading: false });
        return;
      }

      const user = await res.json();
      set({ user, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    set({ user: null, isLoading: false });
  },
}));
