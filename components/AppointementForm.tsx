"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/userContext";
import api from "@/lib/api";

interface Props {
  clinicId?: string; // ✅ optional (safer)
  doctors?: { _id: string; name: string; specialty?: string }[];
}

interface FormState {
  doctorId: string;
  motif: string;
  date: string;
  name: string;
  email: string;
  phone: string;
}

export default function AppointmentForm({ clinicId, doctors = [] }: Props) {
  const router = useRouter();
  const { user, accessToken } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    doctorId: "",
    motif: "",
    date: "",
    name: "",
    email: "",
    phone: "",
  });

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!clinicId) return "Clinic not found"; // ✅ FIX

    if (!form.motif.trim()) return "Reason for consultation is required";
    if (!form.date) return "Date is required";

    const selectedDate = new Date(form.date);
    const now = new Date();

    if (selectedDate.getTime() < now.getTime()) {
      return "Date cannot be in the past";
    }

    if (!user) {
      if (!form.name.trim()) return "Name is required";
      if (!form.email.trim()) return "Email is required";

      if (!/\S+@\S+\.\S+/.test(form.email)) {
        return "Invalid email format";
      }
    }

    return "";
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        clinicId,
        doctorId: form.doctorId || null,
        motif: form.motif.trim(),
        date: new Date(form.date).toISOString(),
      };

      if (!user) {
        payload.guest = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        };
      }

      await api.post("/clinic/appointment", payload, {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {},
      });

      setSuccess("Appointment booked successfully!");

      setForm({
        doctorId: "",
        motif: "",
        date: "",
        name: "",
        email: "",
        phone: "",
      });

      setTimeout(() => {
        if (clinicId) {
          router.push(`/clinic/${clinicId}/appointments`);
        }
      }, 1200);

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to book appointment";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MIN DATE ---------------- */
  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  /* ---------------- UI ---------------- */
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

      {/* DOCTOR */}
      {doctors.length > 0 && (
        <select
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Doctor (optional)</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} {d.specialty ? `- ${d.specialty}` : ""}
            </option>
          ))}
        </select>
      )}

      {/* MOTIF */}
      <input
        name="motif"
        placeholder="Reason for consultation"
        value={form.motif}
        onChange={handleChange}
        className="input"
      />

      {/* DATE */}
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        min={getMinDate()}
        onChange={handleChange}
        className="input"
      />

      {/* GUEST */}
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

          <div className="text-xs text-blue-700 bg-blue-50 p-3 rounded-lg">
            You are booking as a guest (no login required)
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !clinicId} // ✅ FIX
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
          margin-bottom: 0.5rem;
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
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
}