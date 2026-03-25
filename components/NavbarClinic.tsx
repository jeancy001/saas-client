"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Home, Users, Calendar, Mail, Menu, X, Phone } from "lucide-react";
import { GrDashboard } from "react-icons/gr";
import api from "@/lib/api";

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
  clinicName,
  logo,
  clinicEmail,
  clinicPhone,
  advertisement,
}: NavbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const controls = useAnimation();

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

  const resolvedClinicId =
    clinicId ||
    (typeof params?.clinicId === "string" ? params.clinicId : "") ||
    "";

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = [
    { name: "Accueil", href: `/clinic/${clinic.clinicId}`, icon: Home },
    { name: "Dashboard", href: `/clinic/${clinic.clinicId}/dashboard`, icon: GrDashboard },
    { name: "Patients", href: `/clinic/${clinic.clinicId}/patients`, icon: Users },
    { name: "Rendez-vous", href: `/clinic/${clinic.clinicId}/appointments`, icon: Calendar },
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
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-4">
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
          {/* LOGO + NAME */}
          <Link
            href={`/clinic/${clinic.clinicId}`}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={clinic.logo}
                alt="clinic logo"
                fill
                className="object-cover"
                unoptimized={clinic.logo.startsWith("data:image")}
              />
            </div>

            {/* FIXED: always show clinic name beside logo */}
            <div className="flex flex-col leading-tight">
              <span className="text-white font-semibold text-sm sm:text-base">
                {clinic.name}
              </span>
              <span className="text-gray-400 text-xs hidden sm:block">
                Healthcare Center
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-72 bg-slate-900 z-50 p-6 flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-semibold">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="text-white" />
                </button>
              </div>

              {/* CLINIC HEADER */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={clinic.logo} alt="logo" fill className="object-cover" />
                </div>
                <span className="text-white font-medium">{clinic.name}</span>
              </div>

              {/* NAV ITEMS */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="flex items-center gap-3 text-gray-200 px-4 py-3 rounded-lg hover:bg-white/10">
                        <Icon size={18} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href={`/clinic/${clinic.clinicId}/appointments`}
                onClick={() => setMobileOpen(false)}
                className="mt-auto"
              >
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                  Prendre Rendez-vous
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}