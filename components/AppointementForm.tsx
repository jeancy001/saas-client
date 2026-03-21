"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  clinicId: string;
}

export default function AppointmentForm({ clinicId }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    motifVisite: "",
    examens: "",
    patient: {
      prenom: "",
      nom: "",
      postNom: "",
      sexe: "M",
      telephone: "",
      dateNaissance: "",
      etatCivil: "Célibataire",
      occupation: "",
      adresse: "",
      email: "",
    },
    contactUrgence: {
      relation: "parent",
      nom: "",
      telephone: "",
    },
    dateRendezVous: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    section?: "patient" | "contactUrgence"
  ) => {
    const { name, value } = e.target;

    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        clinicId,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed");

      alert("Appointment created successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        Patient Appointment
      </h2>

      {/* VISIT INFO */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="motifVisite"
          placeholder="Motif de visite"
          required
          className="input"
          onChange={handleChange}
        />

        <input
          name="examens"
          placeholder="Examens (optional)"
          className="input"
          onChange={handleChange}
        />
      </div>

      {/* PATIENT */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Patient Info</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <input name="prenom" placeholder="Prénom" required className="input" onChange={(e)=>handleChange(e,"patient")} />
          <input name="nom" placeholder="Nom" required className="input" onChange={(e)=>handleChange(e,"patient")} />
          <input name="postNom" placeholder="Post-nom" required className="input" onChange={(e)=>handleChange(e,"patient")} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <select name="sexe" className="input" onChange={(e)=>handleChange(e,"patient")}>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>

          <input name="telephone" placeholder="Téléphone" required className="input" onChange={(e)=>handleChange(e,"patient")} />
          <input type="date" name="dateNaissance" required className="input" onChange={(e)=>handleChange(e,"patient")} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <select name="etatCivil" className="input" onChange={(e)=>handleChange(e,"patient")}>
            <option>Célibataire</option>
            <option>Marié(e)</option>
            <option>Divorcé(e)</option>
            <option>Veuf(ve)</option>
          </select>

          <input name="occupation" placeholder="Occupation" required className="input" onChange={(e)=>handleChange(e,"patient")} />
          <input name="email" type="email" placeholder="Email" required className="input" onChange={(e)=>handleChange(e,"patient")} />
        </div>

        <input
          name="adresse"
          placeholder="Adresse complète"
          required
          className="input mt-4 w-full"
          onChange={(e)=>handleChange(e,"patient")}
        />
      </div>

      {/* EMERGENCY CONTACT */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          Contact d'urgence
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <select name="relation" className="input" onChange={(e)=>handleChange(e,"contactUrgence")}>
            <option value="parent">Parent</option>
            <option value="Epoux(se)">Epoux(se)</option>
            <option value="Other">Other</option>
          </select>

          <input name="nom" placeholder="Nom" required className="input" onChange={(e)=>handleChange(e,"contactUrgence")} />
          <input name="telephone" placeholder="Téléphone" required className="input" onChange={(e)=>handleChange(e,"contactUrgence")} />
        </div>
      </div>

      {/* DATE */}
      <input
        type="datetime-local"
        name="dateRendezVous"
        required
        className="input w-full"
        onChange={handleChange}
      />

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
      >
        {loading ? "Processing..." : "Confirmer & Payer"}
      </button>

      {/* STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
      `}</style>
    </motion.form>
  );
}