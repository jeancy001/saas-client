"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Search, Stethoscope, X } from "lucide-react";
import AppointmentForm from "@/components/AppointementForm";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availableMedicines: string[];
  upcomingAppointments: { date: string; patient: string }[];
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  address: string;
  medicalHistory: { date: string; note: string }[];
  upcomingAppointments: { date: string; doctor: string; department: string }[];
}

export default function PatientsDashboard({ clinicId }: { clinicId: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Mock Data (replace with API fetch later)
  const mockDoctors: Doctor[] = [
    {
      id: "d1",
      name: "Dr. John Doe",
      specialty: "Cardiology",
      email: "johndoe@example.com",
      phone: "+243 123456789",
      availableMedicines: ["Aspirin", "Beta-blockers"],
      upcomingAppointments: [],
    },
    {
      id: "d2",
      name: "Dr. Sarah Smith",
      specialty: "Dentist",
      email: "sarah@example.com",
      phone: "+243 987654321",
      availableMedicines: ["Painkillers", "Antibiotics"],
      upcomingAppointments: [],
    },
  ];

  const mockPatients: Patient[] = [
    {
      id: "p1",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+243 111222333",
      gender: "Female",
      age: 29,
      address: "Kinshasa, DR Congo",
      medicalHistory: [{ date: "2026-01-12", note: "Routine check-up" }],
      upcomingAppointments: [],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setDoctors(mockDoctors);
      setPatients(mockPatients);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.availableMedicines.some((med) =>
          med.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [doctors, searchTerm]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Patients & Doctors
      </h1>

      {/* SEARCH */}
      <div className="max-w-4xl mx-auto flex gap-4 mb-12 items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-16">
        <AnimatePresence>
          {filteredDoctors.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer"
              onClick={() => setSelectedDoctor(doc)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Stethoscope size={20} className="text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{doc.name}</h2>
                  <p className="text-gray-500 text-sm">{doc.specialty}</p>
                </div>
              </div>

              <div className="space-y-1 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={16} /> {doc.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} /> {doc.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Medicines:</span>{" "}
                  {doc.availableMedicines.join(", ")}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* PATIENTS GRID */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Your Patients
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <AnimatePresence>
          {patients.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {p.gender}, {p.age} yrs
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={16} /> {p.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} /> {p.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Address:</span> {p.address}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* APPOINTMENT MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col gap-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8 flex flex-col gap-6">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
                  onClick={() => setSelectedDoctor(null)}
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-semibold text-gray-800">
                  Book Appointment with {selectedDoctor.name}
                </h3>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      {selectedDoctor.specialty}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedDoctor.email} | {selectedDoctor.phone}
                    </p>
                  </div>
                </div>

                <AppointmentForm clinicId={clinicId}  />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}