"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Search, Stethoscope, X, Lock } from "lucide-react";
import AppointmentForm from "@/components/AppointementForm";
import api from "@/lib/api";
import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";

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
  upcomingAppointments: Appointment[];
}

interface Clinic {
  _id: string;
  clinicId: string;
  name: string;
}

export default function PatientPage() {
  const { user } = useUser();
  const router = useRouter();

  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicsLoaded, setClinicsLoaded] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- LOAD CLINIC ---------------- */
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setClinicsLoaded(false);

        const res = await api.get("/clinic");
        const clinics: Clinic[] = res.data?.data ?? [];

        const firstClinic = clinics[0];

        if (firstClinic?.clinicId) {
          setClinicId(firstClinic.clinicId);
        } else {
          setError("No clinic available");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load clinics");
      } finally {
        setClinicsLoaded(true);
      }
    };

    loadClinics();
  }, []);

  /* ---------------- LOAD DOCTORS ---------------- */
  useEffect(() => {
    if (!clinicId) return;

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/clinic/doctor/doctors");

        const mapped: Doctor[] = (res.data?.data || []).map((d: any) => ({
          id: d._id,
          clinicId: d.clinicId || clinicId,
          name: d.name,
          specialty: d.specialty,
          email: d.email,
          phone: d.phone,
          available: d.isActive,
          upcomingAppointments: d.upcomingAppointments ?? [],
        }));

        setDoctors(mapped);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [clinicId]);

  /* ---------------- FILTERS ---------------- */
  const specialties = useMemo(() => {
    const all = doctors.map((d) => d.specialty);
    return ["All", ...Array.from(new Set(all))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return doctors.filter((doc) => {
      return (
        (doc.name.toLowerCase().includes(search) ||
          doc.specialty.toLowerCase().includes(search)) &&
        (specialtyFilter === "All" || doc.specialty === specialtyFilter)
      );
    });
  }, [doctors, searchTerm, specialtyFilter]);

  /* ---------------- AUTH BLOCK ---------------- */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center border">
          <Lock className="mx-auto text-blue-600 mb-4" size={40} />

          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Please sign in to view doctors and book appointments.
          </p>

          <button
            disabled={!clinicId}
            onClick={() => {
              if (!clinicId) return;
              router.push(`/clinic/${clinicId}/login`);
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- GLOBAL LOADING ---------------- */
  if (!clinicsLoaded || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading clinic & doctors...
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold">Find a Doctor</h1>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No doctors available
        </div>
      ) : (
        <>
          {/* SEARCH */}
          <div className="max-w-4xl mx-auto flex gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 py-2 border rounded-lg"
                placeholder="Search doctor..."
              />
            </div>

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              {specialties.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* DOCTORS */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.specialty}</p>
                  </div>
                </div>

                <p className="text-sm flex gap-2">
                  <Mail size={14} /> {doc.email}
                </p>

                <p className="text-sm flex gap-2 mb-4">
                  <Phone size={14} /> {doc.phone}
                </p>

                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                  Book Appointment
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-3 right-3"
              >
                <X />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Book with {selectedDoctor.name}
              </h2>

              <AppointmentForm doctorId={selectedDoctor.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}