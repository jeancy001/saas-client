"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  Mail,
  Menu,
  X,
  Phone,
  LogOut,
  UserCircle,
} from "lucide-react";
import { GrDashboard } from "react-icons/gr";
import api from "@/lib/api";
import { useUser } from "@/lib/userContext";

/* ---------------- TYPES ---------------- */

interface NavbarProps {
  clinicId?: string;
  clinicName?: string;
  logo?: string;
  clinicEmail?: string;
  clinicPhone?: string;
  advertisement?: string;
}

interface ClinicData {
  clinicId: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
}

/* ---------------- HELPERS ---------------- */

const resolveLogo = (logo?: string | null) => {
  if (!logo || logo.trim() === "") return "/logo.png";
  if (logo.startsWith("data:image")) return logo;
  return logo;
};

/* ---------------- COMPONENT ---------------- */

export default function Navbar({
  clinicId,
  advertisement,
}: NavbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const controls = useAnimation();

  const { user, logout } = useUser();

  const [clinic, setClinic] = useState<ClinicData>({
    clinicId: "",
    name: "Clinic",
    logo: "/logo.png",
    email: "",
    phone: "",
  });

  const [mounted, setMounted] = useState(false);
  const [showInfoBar, setShowInfoBar] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const resolvedClinicId =
    clinicId ||
    (typeof params?.clinicId === "string" ? params.clinicId : "") ||
    "";

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = [
    { name: "Accueil", href: `/clinic/${clinic.clinicId}`, icon: Home },
    { name: "Dashboard", href: `/clinic/${clinic.clinicId}/dashboard`, icon: GrDashboard },
    { name: "Patients", href: `/clinic/${clinic.clinicId}/patients`, icon: Users },
    { name: "Rendez-vous", href: `/clinic/${clinic.clinicId}/appointment`, icon: Calendar },
    { name: "Contact", href: `/clinic/${clinic.clinicId}/contact`, icon: Mail },
  ];

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const y = window.scrollY;
      setShowInfoBar(y < 80);

      controls.start({
        height: y > 50 ? 64 : 80,
        backgroundColor: "rgba(15,23,42,0.9)",
        transition: { duration: 0.25 },
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  useEffect(() => {
    if (!resolvedClinicId) return;

    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinic/clinic-link/${resolvedClinicId}`);
        if (!res?.data?.success) return;

        const data = res.data.data;

        setClinic({
          clinicId: data.clinicId || resolvedClinicId,
          name: data.name || "Clinic",
          logo: resolveLogo(data.logo),
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchClinic();
  }, [resolvedClinicId]);

  if (!mounted) return null;

  /* ---------------- UI ---------------- */

  return (
    <header className="fixed top-0 w-full z-50">
      {/* INFO BAR */}
      <AnimatePresence>
        {showInfoBar && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="bg-slate-900 text-gray-200 text-xs border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
              <div className="flex gap-4">
                {clinic.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {clinic.email}
                  </span>
                )}
                {clinic.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {clinic.phone}
                  </span>
                )}
              </div>

              {advertisement && (
                <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-[11px]">
                  {advertisement}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav
        animate={controls}
        initial={{ height: 80 }}
        className="bg-slate-900 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          {/* LOGO */}
          <Link href={`/clinic/${clinic.clinicId}`} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={clinic.logo}
                alt=""
                fill
                className="object-cover"
                unoptimized={clinic.logo.startsWith("data:image")}
              />
            </div>
            <span className="text-white font-semibold">{clinic.name}</span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </div>
                </Link>
              );
            })}

            {/* AUTH */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-white text-sm">{user.username}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <Link href={`/clinic/${clinic.clinicId}/profile`}>
                        <div className="px-4 py-3 hover:bg-gray-100 flex gap-2">
                          <UserCircle size={16} /> Profile
                        </div>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 flex gap-2 text-red-500"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* MOBILE BTN */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-white">
            <Menu />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-72 bg-slate-900 p-6 flex flex-col"
            >
              <div className="flex justify-between mb-6">
                <span className="text-white">Menu</span>
                <X onClick={() => setMobileOpen(false)} className="text-white" />
              </div>

              {/* USER */}
              {user && (
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm">{user.username}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
              )}

              {/* NAV */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className="flex items-center gap-3 text-gray-200 py-3">
                      <Icon size={18} /> {item.name}
                    </div>
                  </Link>
                );
              })}

              {/* LOGOUT */}
              {user && (
                <button
                  onClick={logout}
                  className="mt-auto border border-red-500 text-red-500 py-3 rounded-lg"
                >
                  Logout
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}