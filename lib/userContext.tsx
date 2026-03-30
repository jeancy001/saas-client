"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "./api";

interface User {
  _id: string;
  email: string;
  clinicId: string;
  username?: string;
  role?: string;
  profileUrl?: string;
  isVerified?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: any;
  register: any;
  logout: any;
  fetchMe: any;
  verifyOtp: any;
  requestCode: any;
  resendOtp: any;
  resetPassword: any;
  updateProfile: any;
  updatePassword: any;
  getProfiles: any;
  deleteProfile: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string) => {
    const res = await api.post("auth/login", { email, password });

    const { accessToken, user } = res.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    setUser(user);
    return user;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await api.post("auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  /* ---------------- FETCH ME ---------------- */
  const fetchMe = async () => {
    try {
      const res = await api.get("auth/me");
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  /* ---------------- INIT (IMPORTANT) ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🔥 FIRST: try refresh using cookie
        const res = await api.post("auth/refresh");

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }
      } catch {
        // ignore (no session)
      }

      // 🔥 THEN: fetch user
      await fetchMe();

      setLoading(false);
    };

    initAuth();
  }, []);

  /* ---------------- OTHER METHODS ---------------- */

  const register = (data: any) => api.post("auth/register", data);

  const verifyOtp = (email: string, code: string, context?: string) =>
    api.post("auth/verify-otp", { email, otpCode: code, context });

  const requestCode = (email: string, context?: string) =>
    api.post("auth/request-code", { email, context });

  const resendOtp = requestCode;

  const resetPassword = (email: string, code: string, newPassword: string) =>
    api.post("auth/reset-password", { email, code, newPassword });

  const updateProfile = async (formData: FormData) => {
    const res = await api.put("auth/update-profile", formData);
    setUser(res.data.user);
    return res.data;
  };

  const updatePassword = (currentPassword: string, newPassword: string) =>
    api.put("auth/update-password", { currentPassword, newPassword });

  const getProfiles = async () =>
    (await api.get("auth/profiles")).data.users;

  const deleteProfile = async () => {
    await api.delete("auth/delete");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchMe,
        verifyOtp,
        requestCode,
        resendOtp,
        resetPassword,
        updateProfile,
        updatePassword,
        getProfiles,
        deleteProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};