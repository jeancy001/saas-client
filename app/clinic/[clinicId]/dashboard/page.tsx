"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  Calendar,
  FileText,
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

type Person = Doctor | Nurse;

/* ---------------- COMPONENT ---------------- */

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "doctors" | "availability"
  >("dashboard");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);

  /* ---------------- LOGIC ---------------- */

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
        d.id === id
          ? { ...d, availability: [...d.availability, slot] }
          : d
      )
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex mt-10 top-10 pt-10">
      {/* SIDEBAR (STATIC) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r p-6">
        <div className="flex items-center gap-2 mb-10">
          <Stethoscope className="text-blue-600" />
          <h1 className="text-lg font-bold">ClinicCare</h1>
        </div>

        <nav className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => setActiveTab("dashboard")} active={activeTab === "dashboard"} />
          <NavItem icon={Stethoscope} label="Doctors" onClick={() => setActiveTab("doctors")} active={activeTab === "doctors"} />
          <NavItem icon={Calendar} label="Schedules" onClick={() => setActiveTab("availability")} active={activeTab === "availability"} />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR (NO FLOAT) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <h2 className="font-semibold capitalize">{activeTab}</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                placeholder="Search..."
                className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button className="p-2 rounded-lg border hover:bg-gray-100">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* HERO */}
          <div className="relative h-36 lg:h-44 rounded-xl overflow-hidden">
            <Image
              src="/images/clinic-dashboard.jpg"
              alt="clinic"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center px-6">
              <h2 className="text-white text-lg lg:text-2xl font-bold">
                Manage your clinic efficiently
              </h2>
            </div>
          </div>

          {/* STATS */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat title="Doctors" value={doctors.length} icon={Stethoscope} />
              <Stat title="Nurses" value={nurses.length} icon={Users} />
              <Stat title="Appointments" value={12} icon={Calendar} />
              <Stat title="Activity" value={5} icon={Activity} />
            </div>
          )}

          {/* DOCTORS */}
          {activeTab === "doctors" && (
            <Section title="Doctors" action={{ label: "Add Doctor", onClick: addDoctor }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((d) => (
                  <Card key={d.id}>
                    <input className="input" value={d.name} />
                    <input className="input mt-2" value={d.specialty} />

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

          {/* AVAILABILITY */}
          {activeTab === "availability" && (
            <Section title="Schedules">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...doctors, ...nurses].map((p: Person) => (
                  <Card key={p.id}>
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.availability.map((a, i) => (
                      <p key={i} className="text-sm flex gap-2 text-gray-500">
                        <Clock size={14} /> {a.day} {a.start}-{a.end}
                      </p>
                    ))}
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

/* ---------------- UI ---------------- */

function NavItem({ icon: Icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "hover:bg-gray-100 text-gray-600"
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
      <div className="flex justify-between items-center">
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
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
      {children}
    </div>
  );
}

function Stat({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="font-bold text-lg">{value}</h3>
      </div>
      <Icon className="text-blue-600" />
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = `
.input {
  @apply w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700;
}
.btn-secondary {
  @apply border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1;
}
`;