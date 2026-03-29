"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
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

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const redirectQuery = searchParams.get("redirect");

const getLCin = async()=>{
                const res = await api.get(
            `/clinic/clinic-link/`
          );
          console.log("ClinicId: ", res)
}

  useEffect(()=>{
    getLCin()
   })
  /* ---------------- CLINIC ID RESOLUTION ---------------- */
  const resolvedClinicId = useMemo(() => {
    const clinic = params?.clinicId;

    if (typeof clinic === "string") return clinic;
    if (Array.isArray(clinic)) return clinic[0];

    const fromQuery = searchParams.get("clinicId");
    return fromQuery || null;
  }, [params, searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

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
      const user = await login(form.email, form.password);

      /* ---------------- SAFE CLINIC ID ---------------- */
      let clinicId: string | null =
        user?.clinicId ||
        resolvedClinicId ||
        localStorage.getItem("clinicId");

      console.log("Initial clinicId:", clinicId);

      /* ---------------- HARD GUARD ---------------- */
      if (!clinicId) {
        setError("No clinic assigned to this account");
        setLoading(false);
        return;
      }

      /* ---------------- RESOLVE SHORT LINK ---------------- */
      const isShortId = clinicId.length < 20;

      if (isShortId) {
        try {
          const res = await api.get(
            `/clinic/clinic-link/${clinicId}`
          );

          const realId: string | undefined =
            res?.data?.data?._id;

          if (!res?.data?.success || !realId) {
            setError("Clinic not found");
            setLoading(false);
            return;
          }

          clinicId = realId;
        } catch (err) {
          console.warn("Clinic lookup failed:", err);
          setError("Clinic resolution failed");
          setLoading(false);
          return;
        }
      }

      /* ---------------- FINAL SAFETY CHECK ---------------- */
      if (!clinicId) {
        setError("Invalid clinic ID");
        setLoading(false);
        return;
      }

      /* ---------------- SAVE ---------------- */
      localStorage.setItem("clinicId", clinicId);

      /* ---------------- REDIRECT ---------------- */
      const targetRoute =
        redirectQuery || `/clinic/${clinicId}/dashboard`;

      console.log("FINAL clinicId:", clinicId);
      console.log("Redirecting:", targetRoute);

      router.push(targetRoute);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between bg-blue-600 text-white p-10">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Stethoscope size={22} />
            ClinicCare
          </div>

          <h2 className="mt-10 text-3xl font-bold">
            Secure access to your medical dashboard
          </h2>

          <p className="mt-4 text-blue-100 text-sm max-w-sm">
            Manage appointments, patients, and staff efficiently.
          </p>
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Clinic Login
            </h1>
            <p className="text-sm text-gray-500">
              Access your dashboard
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                placeholder="Professional email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href={
                resolvedClinicId
                  ? `/register?clinicId=${resolvedClinicId}`
                  : "/register"
              }
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