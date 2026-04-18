"use client";

import {
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-50 to-blue-50">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-between bg-blue-700 text-white p-12">
        <div>
          <div className="flex items-center gap-3 text-xl font-semibold">
            <Stethoscope size={24} />
            ClinicCare Platform
          </div>

          <h2 className="mt-12 text-4xl font-bold">
            Account Access by Support Team
          </h2>

          <p className="mt-4 text-blue-100 max-w-md">
            To ensure security and proper onboarding, accounts are created and managed by our technical support team.
          </p>
        </div>

        <div className="flex items-center gap-2 text-blue-100 text-sm">
          <ShieldCheck size={16} />
          Secure onboarding & identity verification required
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border"
        >

          {/* HEADER */}
          <div className="text-center mb-6">
            <BadgeCheck className="text-blue-600 mx-auto" size={32} />
            <h1 className="text-2xl font-bold mt-2">
              Contact Tech Support
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Account creation is handled manually for security reasons
            </p>
          </div>

          {/* INFO BOX */}
          <div className="space-y-5">

            {/* EMAIL */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border">
              <Mail className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Email Support</p>
                <p className="text-blue-700 font-medium">
                  trainingtech84@gmail.com
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Send your request with full name and organization details
                </p>
              </div>
            </div>

            {/* WHATSAPP */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border">
              <MessageCircle className="text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">WhatsApp Support</p>
                <p className="text-green-700 font-medium">
                  +254 743 302 16
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Fast assistance for account setup and access
                </p>
              </div>
            </div>

          </div>

          {/* INSTRUCTIONS */}
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p>✔ Provide your full name and organization</p>
            <p>✔ Specify your role (Admin / Staff / Doctor)</p>
            <p>✔ You will receive login credentials via email</p>
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-6 text-center text-xs text-gray-400">
            For security reasons, self-registration is disabled.
          </div>

          {/* LOGIN LINK */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-600 font-medium">
              Already have credentials? Login here
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}