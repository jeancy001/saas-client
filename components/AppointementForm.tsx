"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";
import {
  Phone,
  Mail,
  User,
  CalendarDays,
  FileText,
  CreditCard,
} from "lucide-react";
import toast, {Toaster} from "react-hot-toast";
interface FormState {
  motif: string;
  date: string;
  name: string;
  email: string;
  phone: string;
}


export default function AppointmentForm({ doctorId }: { doctorId?: string }) {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const clinicId = useMemo(() => {
    const raw =
      params?.clinicId ||
      params?.id ||
      (Array.isArray(params?.slug) ? params.slug[0] : params?.slug);

    return typeof raw === "string" ? raw.trim() : null;
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<"now" | "later">("later");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    motif: "",
    date: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!clinicId) return "Clinic ID missing";

    const phone = user?.phone || form.phone;
    if (!phone?.trim()) return "Phone number is required";

    if (form.date && new Date(form.date).getTime() < Date.now()) {
      return "Date must be in the future";
    }

    return "";
  };

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = async () => {
    const err = validate();
    if (err) return setError(err);

    setPaying(true);
    setError(null);

    try {
      const { data } = await api.post("/clinic/payments/initiate", {
        clinicId,
        userId: user?._id,
        amount: 100,
        phone: user?.phone || form.phone,
        email: user?.email || form.email || null,
      });

      setPaymentRef(data.payment?.reference);
      setSuccess("Payment completed successfully");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  /* ---------------- BOOKING ---------------- */
  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    if (paymentMode === "now" && !paymentRef) {
      return setError("Please complete payment first");
    }

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        clinicId,
        motif: form.motif || "",
        date: form.date ? new Date(form.date).toISOString() : null,
        userId: user?._id,
        paymentMode,
        paymentReference: paymentMode === "now" ? paymentRef : null,
      };

      if (doctorId) payload.doctorId = doctorId;

      if (!user) {
        payload.guest = {
          name: form.name || "",
          email: form.email || "",
          phone: form.phone,
        };
      }

      await api.post(`/clinic/appointment/${clinicId}`, payload);

      setTimeout(() => {
        router.push(`/clinic/${clinicId}/appointment`);
      toast.success(
      paymentMode === "later"
        ? "Appointment booked. Pay after visit."
        : "Appointment booked successfully!"
    );
    
      }, 900);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-8 space-y-5 border"
    >
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Book Appointment</h2>
        <p className="text-gray-500 text-sm mt-1">
          Choose payment option and schedule your visit
        </p>
      </div>

      {/* ERRORS */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* PAYMENT MODE */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPaymentMode("later")}
          className={`py-3 rounded-xl border text-sm font-medium transition ${
            paymentMode === "later"
              ? "bg-green-50 border-green-400"
              : "bg-white"
          }`}
        >
          🏥 Pay Later
        </button>

        <button
          onClick={() => setPaymentMode("now")}
          className={`py-3 rounded-xl border text-sm font-medium transition ${
            paymentMode === "now"
              ? "bg-blue-50 border-blue-400"
              : "bg-white"
          }`}
        >
          💳 Pay Now
        </button>
      </div>

      {/* MOTIF */}
      <div className="relative">
        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          name="motif"
          placeholder="Reason (optional)"
          value={form.motif}
          onChange={handleChange}
          className={`${inputClass} pl-10`}
        />
      </div>

      {/* DATE */}
      <div className="relative">
        <CalendarDays className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={`${inputClass} pl-10`}
        />
      </div>

      {/* GUEST FIELDS */}
      {!user && (
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="name"
              placeholder="Full name (optional)"
              value={form.name}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
      )}

      {/* PHONE (REQUIRED) */}
      <div className="relative">
        <Phone className="absolute left-3 top-3 text-blue-500" size={18} />
        <input
          name="phone"
          placeholder="Phone number (required)"
          value={form.phone}
          onChange={handleChange}
          className={`${inputClass} pl-10 border-blue-200`}
        />
      </div>
<Toaster position="top-right" />
      {/* ACTIONS */}
      {paymentMode === "now" && (
        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition"
        >
          {paying ? "Processing payment..." : "Pay Now"}
        </button>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        {loading ? "Booking..." : "Confirm Appointment"}
      </button>
    </motion.div>
  );
}