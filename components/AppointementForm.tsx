"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";

interface FormState {
  motif: string;
  date: string;
  name: string;
  email: string;
  phone: string;
}

export default function AppointmentForm({
  doctorId,
}: {
  doctorId?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const clinicId = params?.clinicId
    ? String(params.clinicId)
    : undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    motif: "",
    date: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!clinicId) return "Clinic not found";
    if (!form.motif.trim()) return "Reason required";
    if (!form.date) return "Date required";

    const date = new Date(form.date);
    if (isNaN(date.getTime())) return "Invalid date";

    if (date.getTime() < Date.now()) {
      return "Date cannot be in the past";
    }

    if (!user) {
      if (!form.name.trim()) return "Name required";
      if (!form.email.trim()) return "Email required";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";
    }

    return "";
  };

  const handleSubmit = async () => {
    if (loading) return;

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        motif: form.motif.trim(),
        date: new Date(form.date).toISOString(),
      };

      // ✅ optional doctorId
      if (doctorId) {
        payload.doctorId = doctorId;
      }

      if (!user) {
        payload.guest = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        };
      }

      await api.post(`/clinic/appointment/${clinicId}`, payload);

      setSuccess("Appointment booked successfully");

      setForm({
        motif: "",
        date: "",
        name: "",
        email: "",
        phone: "",
      });

      setTimeout(() => {
        router.push(`/clinic/${clinicId}/appointment`);
      }, 800);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-5 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Book Appointment
      </h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          {success}
        </div>
      )}

      <input
        name="motif"
        placeholder="Reason for consultation"
        value={form.motif}
        onChange={handleChange}
        className="input"
      />

      <input
        type="datetime-local"
        name="date"
        value={form.date}
        min={getMinDate()}
        onChange={handleChange}
        className="input"
      />

      {!user && (
        <>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <input
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="input"
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !clinicId}
        className="btn-primary w-full"
      >
        {loading ? "Processing..." : "Book Appointment"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .input:focus {
          outline: none;
          border-color: #2563eb;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-weight: 500;
        }
        .btn-primary:disabled {
          opacity: 0.7;
        }
      `}</style>
    </motion.div>
  );
}