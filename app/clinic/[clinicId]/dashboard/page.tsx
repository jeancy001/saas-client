
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BriefcaseMedical,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TimerReset,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { useUser } from "@/lib/userContext";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

type Tabs =
  | "dashboard"
  | "doctors"
  | "availability"
  | "analytics"
  | "patients";

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function ClinicDashboard() {
  const { user } = useUser();

  const clinicId = user?.clinicId || "en1rcy4q";

  const [activeTab, setActiveTab] =
    useState<Tabs>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: crypto.randomUUID(),
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      availability: [
        {
          day: "Monday",
          start: "08:00",
          end: "16:00",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Dr. Michael Brown",
      specialty: "Neurology",
      availability: [
        {
          day: "Tuesday",
          start: "09:00",
          end: "17:00",
        },
      ],
    },
  ]);

  const [nurses] = useState<Nurse[]>([
    {
      id: "1",
      name: "Anna",
      department: "Emergency",
      availability: [],
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const confirmedAppointments = useMemo(
    () =>
      appointments.filter(
        (item) => item.status === "confirmed"
      ).length,
    [appointments]
  );

  const pendingAppointments = useMemo(
    () =>
      appointments.filter(
        (item) => item.status === "pending"
      ).length,
    [appointments]
  );

  /* -------------------------------------------------------------------------- */
  /*                                   FETCH                                    */
  /* -------------------------------------------------------------------------- */

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const data = await res.json();

      setAppointments(data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              APPOINTMENTS                                  */
  /* -------------------------------------------------------------------------- */

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinic/appointment/${clinicId}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   DOCTOR                                   */
  /* -------------------------------------------------------------------------- */

  const addDoctor = () => {
    setDoctors((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Dr. New Doctor",
        specialty: "General Medicine",
        availability: [],
      },
    ]);
  };

  const addAvailability = (id: string) => {
    const slot: Availability = {
      day: "Wednesday",
      start: "08:00",
      end: "15:00",
    };

    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === id
          ? {
              ...doctor,
              availability: [
                ...doctor.availability,
                slot,
              ],
            }
          : doctor
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        {/* SIDEBAR */}

<aside
  className={`
    fixed lg:relative inset-y-0 left-0
    w-[290px] bg-white border-r border-slate-200
    transform transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    z-50 lg:z-auto
  `}
>
        
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                  <HeartPulse />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight">
                    ClinicCare
                  </h1>

                  <p className="text-sm text-slate-500">
                    Healthcare SaaS
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="rounded-[30px] border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <ShieldCheck className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Clinic ID
                    </p>

                    <h3 className="font-bold tracking-wide">
                      {user?.clinicId || "N/A"}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activeTab === "dashboard"}
                  onClick={() => {
                    setActiveTab("dashboard");
                    setSidebarOpen(false);
                  }}
                />

                <SidebarItem
                  icon={Stethoscope}
                  label="Doctors"
                  active={activeTab === "doctors"}
                  onClick={() => {
                    setActiveTab("doctors");
                    setSidebarOpen(false);
                  }}
                />

                <SidebarItem
                  icon={Calendar}
                  label="Schedules"
                  active={activeTab === "availability"}
                  onClick={() => {
                    setActiveTab("availability");
                    setSidebarOpen(false);
                  }}
                />

                <SidebarItem
                  icon={Users}
                  label="Patients"
                  active={activeTab === "patients"}
                  onClick={() => {
                    setActiveTab("patients");
                    setSidebarOpen(false);
                  }}
                />

                <SidebarItem
                  icon={TrendingUp}
                  label="Analytics"
                  active={activeTab === "analytics"}
                  onClick={() => {
                    setActiveTab("analytics");
                    setSidebarOpen(false);
                  }}
                />

                <SidebarItem
                  icon={Settings}
                  label="Settings"
                  onClick={() => setSidebarOpen(false)}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/20">
                    <Image
                      src={
                        user?.profileUrl ||
                        "/profiles/user.avif"
                      }
                      alt="user"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {user?.username || "Admin"}
                    </p>

                    <p className="truncate text-sm text-slate-300">
                      {user?.role || "Clinic Manager"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}

        <div className="flex min-h-screen flex-1 flex-col lg:ml-[290px]">
          {/* TOPBAR */}

          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-5 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h2 className="text-2xl font-black capitalize tracking-tight">
                    {activeTab}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage your healthcare system
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden h-12 w-[340px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 md:flex">
                  <Search
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    placeholder="Search appointments, doctors..."
                    className="ml-3 w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <Bell size={18} />

                  <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />
                </button>
              </div>
            </div>
          </header>

          {/* CONTENT */}

          <main className="flex-1 space-y-8 p-5 lg:p-8">
            {/* HERO */}

            <div className="relative overflow-hidden rounded-[36px]">
              <Image
                src="/images/clinic-dashboard.jpg"
                alt="dashboard"
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/80 to-indigo-700/60" />

              <div className="relative z-10 flex min-h-[320px] flex-col justify-center p-8 lg:p-12">
                <div className="max-w-3xl">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
                    <Sparkles size={16} />
                    Smart Medical Administration Platform
                  </div>

                  <h1 className="text-4xl font-black leading-tight text-white lg:text-6xl">
                    Smart Clinic Management Dashboard
                  </h1>

                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">
                    Centralize appointments, doctor schedules,
                    analytics and patient operations in one
                    modern healthcare workspace.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button className="flex h-14 items-center gap-2 rounded-2xl bg-white px-6 font-semibold text-slate-900 transition hover:scale-[1.02]">
                      <Plus size={18} />
                      Create Appointment
                    </button>

                    <button className="h-14 rounded-2xl border border-white/20 bg-white/10 px-6 font-medium text-white backdrop-blur-md transition hover:bg-white/20">
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DASHBOARD */}

            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  <StatsCard
                    title="Doctors"
                    value={doctors.length}
                    icon={Stethoscope}
                    growth="+18%"
                    color="blue"
                  />

                  <StatsCard
                    title="Appointments"
                    value={appointments.length}
                    icon={Calendar}
                    growth="+24%"
                    color="violet"
                  />

                  <StatsCard
                    title="Confirmed"
                    value={confirmedAppointments}
                    icon={CheckCircle2}
                    growth="+9%"
                    color="green"
                  />

                  <StatsCard
                    title="Pending"
                    value={pendingAppointments}
                    icon={TimerReset}
                    growth="+12%"
                    color="orange"
                  />
                </div>

                <div className="grid grid-cols-1 gap-7 2xl:grid-cols-3">
                  <div className="space-y-7 2xl:col-span-2">
                    <DashboardCard>
                      <SectionHeader
                        title="Recent Appointments"
                        subtitle="Latest clinic activities"
                      />

                      <div className="mt-6 space-y-4">
                        {appointments.length > 0 ? (
                          appointments.map((a) => (
                            <AppointmentCard
                              key={a._id}
                              appointment={a}
                              onConfirm={() =>
                                updateStatus(
                                  a._id,
                                  "confirmed"
                                )
                              }
                              onCancel={() =>
                                updateStatus(
                                  a._id,
                                  "cancelled"
                                )
                              }
                              onDelete={() =>
                                deleteAppointment(a._id)
                              }
                            />
                          ))
                        ) : (
                          <EmptyState />
                        )}
                      </div>
                    </DashboardCard>
                  </div>

                  <div className="space-y-7">
                    <DashboardCard>
                      <SectionHeader
                        title="Medical Team"
                        subtitle="Available specialists"
                      />

                      <div className="mt-6 space-y-5">
                        {doctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                <UserPlus className="text-blue-600" />
                              </div>

                              <div>
                                <p className="font-semibold">
                                  {doctor.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                  {doctor.specialty}
                                </p>
                              </div>
                            </div>

                            <BadgeCheck className="text-green-500" />
                          </div>
                        ))}
                      </div>
                    </DashboardCard>

                    <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-7 text-white shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">
                            Performance
                          </p>

                          <h2 className="mt-3 text-5xl font-black">
                            98%
                          </h2>
                        </div>

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                          <TrendingUp />
                        </div>
                      </div>

                      <p className="mt-5 leading-relaxed text-slate-200">
                        Your clinic appointment success rate
                        increased significantly this month.
                      </p>

                      <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[98%] rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DOCTORS */}

            {activeTab === "doctors" && (
              <div className="space-y-7">
                <SectionHeader
                  title="Doctors Management"
                  subtitle="Manage specialists and availability"
                  buttonLabel="Add Doctor"
                  onClick={addDoctor}
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100">
                          <BriefcaseMedical className="text-blue-700" />
                        </div>

                        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200">
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-xl font-bold">
                          {doctor.name}
                        </h3>

                        <p className="mt-1 text-slate-500">
                          {doctor.specialty}
                        </p>
                      </div>

                      <div className="mt-6 space-y-3">
                        {doctor.availability.length > 0 ? (
                          doctor.availability.map(
                            (slot, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                              >
                                <span className="font-medium">
                                  {slot.day}
                                </span>

                                <span className="text-sm text-slate-500">
                                  {slot.start} - {slot.end}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-slate-400">
                            No availability yet
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          addAvailability(doctor.id)
                        }
                        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Plus size={18} />
                        Add Availability
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             REUSABLE COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all ${
        active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />

        <span className="font-medium">
          {label}
        </span>
      </div>

      <ArrowUpRight
        size={16}
        className={`transition ${
          active
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </button>
  );
}

function DashboardCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  growth,
  color,
}: any) {
  const colorStyles: any = {
    blue: "from-blue-500 to-cyan-500",
    violet: "from-violet-500 to-fuchsia-500",
    green: "from-emerald-500 to-green-500",
    orange: "from-orange-500 to-amber-500",
  };

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${colorStyles[color]} text-white shadow-lg`}
        >
          <Icon size={26} />
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
          {growth}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-black tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  buttonLabel,
  onClick,
}: any) {
  return (
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
      <div>
        <h2 className="text-3xl font-black tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-slate-500">
          {subtitle}
        </p>
      </div>

      {buttonLabel && (
        <button
          onClick={onClick}
          className="flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onDelete,
}: any) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
            <Calendar />
          </div>

          <div>
            <h3 className="text-lg font-bold">
              {appointment.motif}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={15} />

              {new Date(
                appointment.date
              ).toLocaleString()}
            </div>

            <div className="mt-3">
              <StatusBadge
                status={appointment.status}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onConfirm}
            className="flex h-11 items-center gap-2 rounded-2xl bg-green-50 px-4 font-medium text-green-700 transition hover:bg-green-100"
          >
            <CheckCircle2 size={16} />
            Confirm
          </button>

          <button
            onClick={onCancel}
            className="flex h-11 items-center gap-2 rounded-2xl bg-red-50 px-4 font-medium text-red-700 transition hover:bg-red-100"
          >
            <XCircle size={16} />
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 px-4 font-medium transition hover:bg-slate-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[30px] border border-dashed border-slate-300 p-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Activity
          className="text-slate-500"
          size={30}
        />
      </div>

      <h3 className="mt-5 text-xl font-bold">
        No appointments yet
      </h3>

      <p className="mt-2 max-w-md text-slate-500">
        Your clinic appointments will appear here
        once patients start booking.
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Appointment["status"];
}) {
  const styles = {
    pending:
      "border-yellow-200 bg-yellow-100 text-yellow-700",
    confirmed:
      "border-green-200 bg-green-100 text-green-700",
    cancelled:
      "border-red-200 bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

