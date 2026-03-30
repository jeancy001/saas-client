"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Stethoscope,
  Building2,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";

/* ---------------- TYPES ---------------- */

interface Clinic {
  _id: string;
  name: string;
  clinicId: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  clinicId: string;
  gender: string;
  tel: string;
  country: string;
  city: string;
}

const initialForm: RegisterPayload = {
  username: "",
  email: "",
  password: "",
  clinicId: "",
  gender: "",
  tel: "",
  country: "",
  city: "",
};

export default function RegisterPage() {
  const { register, verifyOtp, resendOtp } = useUser();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"form" | "otp">("form");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- FETCH CLINICS ---------------- */
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setLoadingClinics(true);
        const res = await api.get("/clinic");
        setClinics(res.data?.data ?? []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load clinics");
      } finally {
        setLoadingClinics(false);
      }
    };

    loadClinics();
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ---------------- REGISTER ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await register({
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
      });

      setSuccess("Account created. Check your email for OTP code.");
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      setError(null);
      setSuccess(null);

      if (otp.length !== 4) {
        setError("OTP must be exactly 4 digits");
        return;
      }

      await verifyOtp(form.email, otp, "registration");

      setSuccess("Email verified successfully");

      setTimeout(() => {
        setStep("form");
        setForm(initialForm);
        setOtp("");
        setSuccess(null);
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = async () => {
    try {
      setOtpLoading(true);
      setError(null);

      await resendOtp(form.email, "registration");

      setSuccess("New OTP sent to your email");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-50 to-blue-50">

      {/* LEFT PANEL (UNCHANGED) */}
      <div className="hidden md:flex flex-col justify-between bg-blue-700 text-white p-12">
        <div>
          <div className="flex items-center gap-3 text-xl font-semibold">
            <Stethoscope size={24} />
            ClinicCare Platform
          </div>

          <h2 className="mt-12 text-4xl font-bold">
            Build your medical workspace
          </h2>

          <p className="mt-4 text-blue-100 max-w-md">
            Manage patients, doctors and appointments in one system.
          </p>
        </div>

        <div className="flex items-center gap-2 text-blue-100 text-sm">
          <ShieldCheck size={16} />
          Secure healthcare infrastructure
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border">

          {/* HEADER */}
          <div className="text-center mb-6">
            <BadgeCheck className="text-blue-600 mx-auto" size={28} />

            <h1 className="text-2xl font-bold mt-2">
              {step === "form" ? "Create Account" : "Verify Account"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {step === "form"
                ? "Fill all required information"
                : "Enter 4-digit verification code"}
            </p>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="mb-3 text-red-600 bg-red-50 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 text-green-600 bg-green-50 p-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* FORM */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CLINIC */}
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-gray-400" />

                <select
                  name="clinicId"
                  value={form.clinicId}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border rounded-xl"
                  required
                >
                  <option value="">
                    {loadingClinics ? "Loading..." : "Select clinic"}
                  </option>

                  {clinics.map((c) => (
                    <option key={c._id} value={c.clinicId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full py-3 px-3 border rounded-xl"
                required
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full py-3 px-3 border rounded-xl"
                required
              />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full py-3 px-3 border rounded-xl pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full py-3 px-3 border rounded-xl"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                name="tel"
                value={form.tel}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full py-3 px-3 border rounded-xl"
              />

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full py-3 px-3 border rounded-xl"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full py-3 px-3 border rounded-xl"
              />

              <button
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          )}

          {/* OTP */}
          {step === "otp" && (
            <div className="space-y-4">

              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Enter 4-digit code"
                className="w-full py-3 border rounded-xl text-center tracking-widest"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="w-full py-3 bg-green-600 text-white rounded-xl"
              >
                {otpLoading ? "Verifying..." : "Verify Account"}
              </button>

              <button
                onClick={handleResend}
                disabled={otpLoading}
                className="w-full text-sm text-blue-600"
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}