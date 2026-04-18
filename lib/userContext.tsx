"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "./api";

/* ---------------- USER MODEL ---------------- */
interface User {
  _id: string;
  email: string;
  username?: string;
  city?:string,
  country?:string,
  phone?: string;
  firstname?: string;
  lastname?: string;
  clinicId?: string;
  role?: string;
  profileUrl?: string;
  isVerified?: boolean;
}

/* ---------------- CONTEXT ---------------- */
interface UserContextType {
  user: User | null;
  loading: boolean;

  accessToken: string | null;
  refreshToken: string | null;
  clinicId: string | null;

  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;

  verifyOtp: (email: string, code: string, context?: string) => Promise<any>;
  requestCode: (email: string, context?: string) => Promise<any>;
  resendOtp: (email: string, context?: string) => Promise<any>;

  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<any>;

  updateProfile: (formData: FormData) => Promise<any>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<any>;

  getProfiles: () => Promise<any>;
  deleteProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

/* ---------------- PROVIDER ---------------- */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);

  /* ---------------- SESSION ---------------- */
  const setSession = (access?: string | null, refresh?: string | null) => {
    if (access !== undefined) {
      setAccessToken(access);
      access
        ? localStorage.setItem("accessToken", access)
        : localStorage.removeItem("accessToken");
    }

    if (refresh !== undefined) {
      setRefreshToken(refresh);
      refresh
        ? localStorage.setItem("refreshToken", refresh)
        : localStorage.removeItem("refreshToken");
    }

    if (access) {
      api.defaults.headers.common.Authorization = `Bearer ${access}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string) => {
    const res = await api.post("auth/login", { email, password });

    const { accessToken, refreshToken, user } = res.data;

    setSession(accessToken, refreshToken);
    setUser(user);

    if (user?.clinicId) {
      setClinicId(user.clinicId);
      localStorage.setItem("clinicId", user.clinicId);
    }

    return res.data;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await api.post("auth/logout");
    } finally {
      setSession(null, null);
      setUser(null);
      setClinicId(null);

      localStorage.removeItem("clinicId");
    }
  };

  /* ---------------- FETCH ME ---------------- */
  const fetchMe = async (): Promise<User | null> => {
    try {
      const res = await api.get("auth/me");

      const userData = res.data.user;

      setUser(userData);

      if (userData?.clinicId) {
        setClinicId(userData.clinicId);
        localStorage.setItem("clinicId", userData.clinicId);
      }

      return userData;
    } catch {
      setUser(null);
      return null;
    }
  };

  /* ---------------- INIT AUTH ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const storedAccess = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");
      const storedClinic = localStorage.getItem("clinicId");

      if (storedAccess) {
        setAccessToken(storedAccess);
        api.defaults.headers.common.Authorization = `Bearer ${storedAccess}`;
      }

      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }

      if (storedClinic) {
        setClinicId(storedClinic);
      }

      try {
        const res = await api.post("auth/refresh");

        const { accessToken, refreshToken } = res.data;

        setSession(accessToken, refreshToken);
      } catch {
        setSession(null, null);
      }

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

  const resetPassword = (
    email: string,
    code: string,
    newPassword: string
  ) => api.post("auth/reset-password", { email, code, newPassword });

  const updateProfile = async (formData: FormData) => {
    const res = await api.put("auth/update-profile", formData);
    setUser(res.data.user);
    return res.data;
  };

  const updatePassword = (
    currentPassword: string,
    newPassword: string
  ) => api.put("auth/update-password", { currentPassword, newPassword });

  const getProfiles = async () =>
    (await api.get("auth/profiles")).data.users;

  const deleteProfile = async () => {
    await api.delete("auth/delete");
    setSession(null, null);
    setUser(null);
    setClinicId(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        accessToken,
        refreshToken,
        clinicId,
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