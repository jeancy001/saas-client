"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Users,
  Activity,
  Clock,
  Plus,
  Search,
  Bell,
} from "lucide-react";
import Image from "next/image";

/* ---------------- TYPES ---------------- */

type Availability = {
  day: string;
  start: string;
  end: string;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availability: Availability[];
};

type Nurse = {
  id: string;
  name: string;
  department: string;
  availability: Availability[];
};

type Appointment = {
  _id: string;
  motif: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
};

type Person = Doctor | Nurse;

/* ---------------- COMPONENT ---------------- */

export default function ClinicDashboard() {
  const clinicId = "en1rcy4q";

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "doctors" | "availability"
  >("dashboard");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  /* ---------------- APPOINTMENTS API ---------------- */

  const fetchAppointments = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/admin`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setAppointments(data?.data || []);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchAppointments();
  };

  /* ---------------- DOCTORS ---------------- */

  const addDoctor = () =>
    setDoctors((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Dr. Name",
        specialty: "General",
        availability: [],
      },
    ]);

  const addAvailability = (id: string) => {
    const slot: Availability = {
      day: "Monday",
      start: "08:00",
      end: "16:00",
    };

    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, availability: [...d.availability, slot] } : d
      )
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex mt-10 pt-10">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r p-6">
        <div className="flex items-center gap-2 mb-10">
          <Stethoscope className="text-blue-600" />
          <h1 className="text-lg font-bold">ClinicCare</h1>
        </div>

        <nav className="space-y-1">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={() => setActiveTab("dashboard")}
            active={activeTab === "dashboard"}
          />
          <NavItem
            icon={Stethoscope}
            label="Doctors"
            onClick={() => setActiveTab("doctors")}
            active={activeTab === "doctors"}
          />
          <NavItem
            icon={Calendar}
            label="Schedules"
            onClick={() => setActiveTab("availability")}
            active={activeTab === "availability"}
          />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <h2 className="font-semibold capitalize">{activeTab}</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                placeholder="Search..."
                className="pl-9 pr-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <button className="p-2 rounded-lg border">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* HERO */}
          <div className="relative h-36 rounded-xl overflow-hidden">
            <Image
              src="/images/clinic-dashboard.jpg"
              alt="clinic"
              fill
              className="object-cover"
            />
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat title="Doctors" value={doctors.length} icon={Stethoscope} />
                <Stat title="Nurses" value={nurses.length} icon={Users} />
                <Stat
                  title="Appointments"
                  value={appointments.length}
                  icon={Calendar}
                />
                <Stat title="Activity" value={5} icon={Activity} />
              </div>

              {/* APPOINTMENTS CRUD */}
              <Section title="Appointments">
                <div className="space-y-3">
                  {appointments.map((a) => (
                    <Card key={a._id}>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{a.motif}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(a.date).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">{a.status}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="btn-secondary"
                            onClick={() => updateStatus(a._id, "confirmed")}
                          >
                            Confirm
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => updateStatus(a._id, "cancelled")}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => deleteAppointment(a._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* DOCTORS */}
          {activeTab === "doctors" && (
            <Section title="Doctors" action={{ label: "Add Doctor", onClick: addDoctor }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((d) => (
                  <Card key={d.id}>
                    <input className="input" value={d.name} readOnly />
                    <input className="input mt-2" value={d.specialty} readOnly />

                    <button
                      className="btn-secondary mt-2"
                      onClick={() => addAvailability(d.id)}
                    >
                      <Plus size={14} /> Add Slot
                    </button>
                  </Card>
                ))}
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function NavItem({ icon: Icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function Section({ title, children, action }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action && (
          <button onClick={action.onClick} className="btn-primary">
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Card({ children }: any) {
  return <div className="bg-white p-4 border rounded-xl shadow-sm">{children}</div>;
}

function Stat({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-4 border rounded-xl flex justify-between">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="text-lg font-bold">{value}</h3>
      </div>
      <Icon className="text-blue-600" />
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = `
.input {
  @apply w-full border rounded-lg px-3 py-2 text-sm;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg;
}
.btn-secondary {
  @apply border px-3 py-2 rounded-lg text-sm;
}
`;