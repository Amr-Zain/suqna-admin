"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface UserAvatar {
  id: number | null
  path: string
  type: string
  option: string
}

export interface UserPermission {
  id: number
  icon: string | null
  title: string
  url: string
  back_route_name: string
}

export interface UserAuth {
  id: number
  name: string
  user_type: string
  email: string
  phone: string
  avatar: UserAvatar
  locale: string
  is_notify: boolean
  token: string
  role: any | null
  permissions: UserPermission[] | null
}


interface AuthStore {
  user: UserAuth | null;
  token: string | null;
  setUser: (user: UserAuth) => void;
  updateUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => {
        const token = user.token || get().token;
        if (token) {
          // Keep the token in cookies for API/Middleware usage (always < 4KB)
          Cookies.set("token", token, { expires: 30 });
        }
        set({ user, token });
      },
      updateUser: (values) => {
        set({ user: { ...get()?.user, ...values } });
      },
      clearUser: () => {
        Cookies.remove("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      // CRITICAL: We MUST use localStorage here because the User object 
      // is ~12KB, which exceeds the 4KB browser limit for cookies.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
