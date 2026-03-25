"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Search,
  Stethoscope,
  X,
  Calendar,
  MapPin,
  HeartPulse,
} from "lucide-react";
import AppointmentForm from "@/components/AppointementForm";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  available: boolean;
  availableMedicines: string[];
  upcomingAppointments: { date: string; patient: string }[];
}

export default function PatientPage({ clinicId }: { clinicId: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  /* MOCK DATA */
  const mockDoctors: Doctor[] = [
    {
      id: "d1",
      name: "Dr. John Doe",
      specialty: "Cardiology",
      email: "john@example.com",
      phone: "+243123456789",
      available: true,
      availableMedicines: ["Aspirin", "Beta-blockers"],
      upcomingAppointments: [],
    },
    {
      id: "d2",
      name: "Dr. Sarah Smith",
      specialty: "Dentistry",
      email: "sarah@example.com",
      phone: "+243987654321",
      available: false,
      availableMedicines: ["Painkillers", "Antibiotics"],
      upcomingAppointments: [],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 600);
  }, []);

  /* SPECIALTIES */
  const specialties = useMemo(() => {
    const all = doctors.map((d) => d.specialty);
    return ["All", ...Array.from(new Set(all))];
  }, [doctors]);

  /* FILTER DOCTORS */
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        specialtyFilter === "All" || doc.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, specialtyFilter]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Find a Doctor
        </h1>

        <p className="text-gray-500 mt-2">
          Book appointments with our medical specialists
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            placeholder="Search doctor or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {specialties.map((sp) => (
            <option key={sp}>{sp}</option>
          ))}
        </select>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredDoctors.map((doc) => (
          <motion.div
            key={doc.id}
            whileHover={{ y: -5 }}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope size={20} className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {doc.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {doc.specialty}
                </p>
              </div>

              <span
                className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  doc.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.available ? "Available" : "Busy"}
              </span>
            </div>

            {/* CONTACT */}
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p className="flex items-center gap-2">
                <Mail size={15} /> {doc.email}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={15} /> {doc.phone}
              </p>
            </div>

            {/* MEDICINES */}
            <div className="text-xs text-gray-500 mb-4">
              Medicines: {doc.availableMedicines.join(", ")}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDoctor(doc)}
                className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700"
              >
                Book Appointment
              </button>

              <a
                href={`tel:${doc.phone}`}
                className="border px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Phone size={16} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <button
                className="absolute right-4 top-4 text-gray-400"
                onClick={() => setSelectedDoctor(null)}
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Book Appointment with {selectedDoctor.name}
              </h2>

              <AppointmentForm clinicId={clinicId} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}