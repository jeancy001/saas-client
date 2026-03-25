"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  clinicId: string;
  doctors?: { _id: string; name: string; specialty?: string }[];
}

export default function AppointmentForm({ clinicId, doctors = [] }: Props) {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // replace with real auth
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    motif: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.motif) return "Reason is required";
    if (!form.date) return "Date is required";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    if (!isAuthenticated) {
      // 🔥 replace with real redirect
      window.location.href = "/login?redirect=/appointment";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}` // add later
          },
          body: JSON.stringify({
            clinicId,
            doctorId: form.doctorId || null,
            motif: form.motif,
            date: form.date,
          }),
        }
      );

      if (!res.ok) throw new Error();

      window.location.href = "/dashboard/appointments";
    } catch {
      setError("Failed to book appointment");
    } finally {
      setLoading(false);
    }
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

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* DOCTOR */}
      {doctors.length > 0 && (
        <select
          name="doctorId"
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
        className="input"
        onChange={handleChange}
      />

      {/* DATE */}
      <input
        type="datetime-local"
        name="date"
        className="input"
        onChange={handleChange}
      />

      {/* LOGIN NOTICE */}
      {!isAuthenticated && (
        <div className="text-xs text-yellow-700 bg-yellow-50 p-3 rounded-lg">
          You will be asked to login before confirming
        </div>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Processing..." : "Continue"}
      </button>

      {/* STYLES */}
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
      `}</style>
    </motion.div>
  );
}