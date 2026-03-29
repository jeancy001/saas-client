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
  BadgeCheck,
  ShieldCheck,
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

  /* ---------------- CLINICS ---------------- */
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

      const res = await register(form);

      setSuccess(res?.message || "OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await verifyOtp(form.email, otp, "register");
      setSuccess("Account verified successfully");
      setStep("form");
    } catch (err: any) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-50 to-blue-50">

      {/* LEFT */}
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
            Manage patients, doctors and appointments in a unified system.
          </p>
        </div>

        <div className="flex items-center gap-2 text-blue-100 text-sm">
          <ShieldCheck size={16} />
          Secure healthcare infrastructure
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <BadgeCheck className="text-blue-600" size={28} />
            </div>

            <h1 className="text-2xl font-bold">
              {step === "form" ? "Create Account" : "Verify Account"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {step === "form"
                ? "Fill your clinic information"
                : "Enter OTP sent to your email"}
            </p>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

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
                  required
                  className="w-full pl-10 py-3 border rounded-xl bg-white"
                >
                  <option value="">
                    {loadingClinics ? "Loading clinics..." : "Select clinic"}
                  </option>

                  {clinics.map((c) => (
                    <option key={c._id} value={c.clinicId}>
                      {c.name} — ID: {c.clinicId}
                    </option>
                  ))}
                </select>
              </div>

              {/* USERNAME */}
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full pl-10 py-3 border rounded-xl"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full pl-10 py-3 border rounded-xl"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 border rounded-xl"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* PHONE */}
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="tel"
                  value={form.tel}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full pl-10 py-3 border rounded-xl"
                />
              </div>

              {/* COUNTRY */}
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full pl-10 py-3 border rounded-xl"
                />
              </div>

              {/* CITY */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full pl-10 py-3 border rounded-xl"
                />
              </div>

              {/* SUBMIT */}
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition">
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {/* OTP */}
          {step === "otp" && (
            <div className="space-y-4">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP code"
                className="w-full py-3 border rounded-xl text-center tracking-widest text-lg"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                Verify Account
              </button>

              <button
                onClick={handleResend}
                className="w-full text-sm text-blue-600"
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Sign in
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}