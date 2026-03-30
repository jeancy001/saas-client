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
  username?: string;
  email: string;
  role?: string;
  gender?: string;
  tel?: string;
  country?: string;
  city?: string;
  clinicId: string;
  profileUrl?: string;
  isVerified?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;
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
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post("auth/login", { email, password });

    const { user, accessToken } = res.data;

    if (!user?.clinicId) {
      throw new Error("User not assigned to any clinic");
    }

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    setUser(user);
    return user;
  };

  /* ---------------- REGISTER ---------------- */
  const register = async (data: any) => {
    const res = await api.post("auth/register", data);
    return res.data;
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
  const fetchMe = async (): Promise<User | null> => {
    try {
      const res = await api.get("auth/me");
      const user = res.data.user;

      if (!user?.clinicId) throw new Error("Invalid user");

      setUser(user);
      return user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP / AUTH ---------------- */

  const verifyOtp = async (email: string, code: string, context?: string) =>
    (await api.post("auth/verify-otp", { email, otpCode: code, context })).data;

  const requestCode = async (email: string, context?: string) =>
    (await api.post("auth/request-code", { email, context })).data;

  const resendOtp = async (email: string, context?: string) =>
    (await api.post("auth/resend-otp", { email, context })).data;

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) =>
    (await api.post("auth/reset-password", { email, code, newPassword })).data;

  /* ---------------- PROFILE ---------------- */

  const updateProfile = async (formData: FormData) => {
    const res = await api.put("auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser(res.data.user);
    return res.data;
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) =>
    (await api.put("auth/update-password", {
      currentPassword,
      newPassword,
    })).data;

  const getProfiles = async () =>
    (await api.get("auth/profiles")).data.users;

  const deleteProfile = async () => {
    const res = await api.delete("auth/delete");
    localStorage.removeItem("accessToken");
    setUser(null);
    return res.data;
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetchMe();
  }, []);

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