"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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

export default function LoginClient() {
  const { login } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const redirectQuery = searchParams.get("redirect") ?? undefined;

  const resolvedClinicId = useMemo((): string | null => {
    const clinicParam = params?.clinicId;

    if (typeof clinicParam === "string") return clinicParam;
    if (Array.isArray(clinicParam)) return clinicParam[0];

    return searchParams.get("clinicId");
  }, [params, searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/clinic/clinic-link");
        console.log("Clinic list:", res?.data);
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(form.email, form.password);

      let clinicId: string =
        user?.clinicId ||
        resolvedClinicId ||
        localStorage.getItem("clinicId") ||
        "";

      if (!clinicId) {
        setError("No clinic assigned");
        return;
      }

      if (clinicId.length < 20) {
        const res = await api.get(
          `/clinic/clinic-link/${encodeURIComponent(clinicId)}`
        );

        const realId = res?.data?.data?._id;

        if (!res?.data?.success || !realId) {
          setError("Clinic not found");
          return;
        }

        clinicId = realId;
      }

      localStorage.setItem("clinicId", clinicId);

      const target =
        redirectQuery ?? `/clinic/${clinicId}/dashboard`;

      router.push(target);
    } catch (err: any) {
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
            Secure access to dashboard
          </h2>

          <p className="mt-4 text-blue-100 text-sm max-w-sm">
            Manage patients and appointments efficiently.
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
              className="w-full py-3 bg-blue-600 text-white rounded-xl"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
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