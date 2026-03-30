"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Search, Stethoscope, X } from "lucide-react";
import AppointmentForm from "@/components/AppointementForm";
import api from "@/lib/api";

interface Appointment {
  date: string;
  patientName: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  available: boolean;
  availableMedicines: string[];
  upcomingAppointments: Appointment[];
}

export default function PatientPage({ clinicId }: { clinicId: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* FETCH DOCTORS */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/clinic/doctor/", {
          params: { clinicId },
        });

        const mapped: Doctor[] = (res.data?.data || []).map((d: any) => ({
          id: d._id,
          clinicId: d.clinicId,
          name: d.name,
          specialty: d.specialty,
          email: d.email,
          phone: d.phone,
          available: d.available,
          availableMedicines: d.availableMedicines ?? [],
          upcomingAppointments: (d.upcomingAppointments ?? []).map(
            (a: any) => ({
              date: a.date,
              patientName: a.patientName,
              status: a.status,
            })
          ),
        }));

        setDoctors(mapped);
      } catch (err: any) {
        console.error("Failed to fetch doctors", err);
        setError(
          err?.response?.data?.message || "Failed to load doctors"
        );
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) fetchDoctors();
  }, [clinicId]);

  /* SPECIALTIES */
  const specialties = useMemo(() => {
    const all = doctors.map((d) => d.specialty);
    return ["All", ...Array.from(new Set(all))];
  }, [doctors]);

  /* FILTER */
  const filteredDoctors = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search) ||
        doc.specialty.toLowerCase().includes(search);

      const matchesSpecialty =
        specialtyFilter === "All" || doc.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, specialtyFilter]);

  /* LOADING */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading doctors...
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Find a Doctor</h1>
        <p className="text-gray-500 mt-2">
          Book appointments with specialists
        </p>
      </div>

      {/* EMPTY STATE (NO DOCTORS IN SYSTEM) */}
      {doctors.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg font-medium">
            No doctors available in this clinic
          </p>
          <p className="text-sm mt-2">
            Please check back later or contact the clinic
          </p>
        </div>
      )}

      {doctors.length > 0 && (
        <>
          {/* SEARCH */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctor or specialty..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {specialties.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* EMPTY FILTER RESULT */}
          {filteredDoctors.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No doctors match your search
            </div>
          )}

          {/* GRID */}
          {filteredDoctors.length > 0 && (
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

                  {/* ACTION */}
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
          )}
        </>
      )}

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
                onClick={() => setSelectedDoctor(null)}
                className="absolute right-4 top-4 text-gray-400"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Book Appointment with {selectedDoctor.name}
              </h2>

              <AppointmentForm doctorId={selectedDoctor.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}