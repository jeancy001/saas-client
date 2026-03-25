"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Stethoscope,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clinicName: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: integrate API
      console.log(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* LEFT - Branding */}
      <div className="hidden md:flex flex-col justify-between bg-blue-600 text-white p-10">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Stethoscope size={22} />
            <span>ClinicCare</span>
          </div>

          <h2 className="mt-10 text-3xl font-bold leading-tight">
            Create your clinic workspace
          </h2>

          <p className="mt-4 text-blue-100 text-sm max-w-sm">
            Register your clinic, manage staff, patients, and appointments in
            one secure platform.
          </p>
        </div>

        <div className="text-sm text-blue-100">
          Trusted by modern clinics & healthcare professionals
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Clinic Registration
            </h1>
            <p className="text-sm text-gray-500">Setup your clinic account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Clinic Name */}
            <div className="relative">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="clinicName"
                required
                placeholder="Clinic name"
                value={form.clinicName}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Full Name */}
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="fullName"
                required
                placeholder="Administrator full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Professional email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Register Clinic"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}