"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";

type OTPArray = [string, string, string, string];

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") ?? "";
  const clinicId = params.get("clinicId") ?? "";

  const [otp, setOtp] = useState<OTPArray>(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  /* ---------------- INIT FOCUS ---------------- */
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /* ---------------- COOLDOWN ---------------- */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp] as OTPArray;
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (updated.every((d) => d !== "")) {
      handleVerify(updated.join(""));
    }
  };

  /* ---------------- BACKSPACE ---------------- */
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ---------------- PASTE ---------------- */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");

    if (paste.length !== 4) return;

    const newOtp = paste.split("").slice(0, 4) as OTPArray;
    setOtp(newOtp);

    inputs.current[3]?.focus();
    handleVerify(paste);
  };

  /* ---------------- VERIFY ---------------- */
  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otp.join("");

    if (otpCode.length !== 4) {
      setError("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/verify-otp", {
        email,
        otpCode,
        context: "registration",
      });

      router.push(`/clinic/${clinicId}`);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND ---------------- */
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setError("");

      await api.post("/auth/resend-otp", {
        email,
        context: "registration",
      });

      setCooldown(60);
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>

        <p className="text-gray-500 text-sm mb-6">
          Enter the 4-digit code sent to{" "}
          <span className="font-medium">{email}</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* OTP */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value, i)
              }
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              className="w-14 h-14 text-center text-xl border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        {/* VERIFY */}
        <button
          onClick={() => handleVerify()}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-xl disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* RESEND */}
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="mt-4 text-sm text-blue-600 disabled:text-gray-400"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </button>
      </motion.div>
    </div>
  );
}