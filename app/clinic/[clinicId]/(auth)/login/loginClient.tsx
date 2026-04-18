"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";

interface LoginForm {
  email: string;
  password: string;
}

interface ClinicData {
  clinicId: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
}

export default function LoginClient() {
  const { login } = useUser();
  const router = useRouter();

  // ✅ GET clinicId FROM URL
  const params = useParams();
  const routeClinicId = params?.clinicId as string;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [clinic, setClinic] = useState<ClinicData>({
    clinicId: "",
    name: "Clinic",
    logo: "/logo.png",
    email: "",
    phone: "",
  });

  const basePath = routeClinicId || clinic.clinicId || "";

  /* ---------------- FETCH CLINIC ---------------- */
  useEffect(() => {
    if (!routeClinicId) return;

    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinic/clinic-link/${routeClinicId}`);

        if (!res?.data?.success) return;

        const data = res.data.data;

        setClinic({
          clinicId: data.clinicId || routeClinicId,
          name: data.name || "Clinic",
          logo: data.logo || "/logo.png",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error(error);
        setError("Invalid clinic link");
      }
    };

    fetchClinic();
  }, [routeClinicId]);

  /* ---------------- FORM ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(form.email, form.password);

      const user = res?.user;
      const accessToken = res?.accessToken;
      const refreshToken = res?.refreshToken;

      const clinicId = user?.clinicId || routeClinicId;

      if (!clinicId) {
        setError("Clinic not assigned to this account");
        return;
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("clinicId", clinicId);

      const clinicBasePath = `/clinic/${clinicId}`;

      const redirect =
        user?.role === "admin"
          ? `${clinicBasePath}/dashboard`
          : clinicBasePath;

      router.replace(redirect);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between bg-blue-600 text-white p-10">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Stethoscope size={22} />
            {clinic.name}
          </div>

          <h2 className="mt-10 text-3xl font-bold">
            Secure access to dashboard
          </h2>
        </div>

        <div className="relative w-full h-64 mt-10">
          <Image
            src="/slides/nurse1.jpeg"
            alt="Clinic"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-center mb-6">
            Clinic Login
          </h1>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 py-3 border rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border rounded-xl"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* ✅ NAVIGATION FIXED */}
          <div className="mt-6 text-center text-sm">
            <Link
              href={basePath ? `/clinic/${basePath}/register` : "#"}
              className="text-blue-600"
            >
              Create account
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}