"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Stethoscope,
  Building2,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";

interface Clinic {
  _id: string;
  name: string;
  clinicId: string;
}

export default function RegisterPage() {
  const { register, verifyOtp, resendOtp } = useUser();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(true);

  const [step, setStep] = useState<"form" | "otp">("form");

  const [form, setForm] = useState({
    clinicId: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    tel: "",
    country: "",
    city: "",
  });

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- FETCH CLINICS ---------------- */
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await api.get("/clinic");
        setClinics(res.data?.data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load clinics");
      } finally {
        setLoadingClinics(false);
      }
    };

    fetchClinics();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- REGISTER ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (!form.clinicId) throw new Error("Select a clinic");

      const res = await register(form);

      setSuccess(res?.message || "OTP sent to your email");
      setStep("otp"); // 🔥 switch to OTP screen
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      await verifyOtp(form.email, otp, "register");

      setSuccess("Account verified successfully");

      // 🔥 redirect or reset
      setStep("form");
      setOtp("");
    } catch (err: any) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND ---------------- */
  const handleResend = async () => {
    try {
      setLoading(true);
      await resendOtp(form.email, "register");
      setSuccess("OTP resent");
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
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
            ClinicCare
          </div>

          <h2 className="mt-10 text-3xl font-bold">
            Join your clinic workspace
          </h2>

          <p className="mt-4 text-blue-100 text-sm max-w-sm">
            Create your account and connect to your clinic system.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {step === "form" ? "Register" : "Verify OTP"}
          </h1>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          {/* ================= FORM ================= */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="clinicId"
                  value={form.clinicId}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 py-3 border rounded-xl"
                >
                  <option value="">
                    {loadingClinics ? "Loading..." : "Select clinic"}
                  </option>
                  {clinics.map((c) => (
                    <option key={c._id} value={c.clinicId}>
                      {c.name} ({c.clinicId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full pl-10 py-3 border rounded-xl"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full pl-10 py-3 border rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 border rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-xl">
                {loading ? "Creating..." : "Register"}
              </button>
            </form>
          )}

          {/* ================= OTP ================= */}
          {step === "otp" && (
            <div className="space-y-4">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full py-3 border rounded-xl text-center text-lg tracking-widest"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 bg-green-600 text-white rounded-xl"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={handleResend}
                className="w-full py-2 text-sm text-blue-600"
              >
                Resend OTP
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}