"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Home, Building2, Users, Calendar, Mail, Menu, X, Phone } from "lucide-react";
import api from "@/lib/api";
import { GrDashboard } from "react-icons/gr";

/* ---------------- TYPES ---------------- */

interface NavbarProps {
  clinicId?: string;
  advertisement?: string;
  clinicEmail?:string; 
  clinicPhone?:string,
  logo?:string,
  clinicName?:string
}

interface ClinicData {
  logo: string;
  name: string;
  email: string;
  phone: string;
  clinicId: string;
 
}

/* ---------------- HELPERS ---------------- */

const resolveLogo = (logo?: string | null) => {
  if (!logo || logo.trim() === "") return "/logo.png";
  if (logo.startsWith("data:image")) return logo;
  return logo;
};

/* ---------------- COMPONENT ---------------- */

export default function Navbar({ clinicId, advertisement, clinicEmail, clinicPhone, logo ,clinicName}: NavbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const controls = useAnimation();

  const [isOpen, setIsOpen] = useState(false);
  const [showInfoBar, setShowInfoBar] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [clinic, setClinic] = useState<ClinicData>({
    logo: "/logo.png",
    name: "Clinic",
    email: "clinic@gmail.com",
    phone: "+243 000000000",
    clinicId: "",
  });

  /* ---------------- CLINIC ID RESOLUTION ---------------- */

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
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  /* ---------------- FETCH CLINIC ---------------- */

  useEffect(() => {
    if (!resolvedClinicId) return;

    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinic/clinic-link/${resolvedClinicId}`);

        if (!res?.data?.success) return;

        const data = res.data.data;

        setClinic({
          logo: resolveLogo(data.logo),
          name: data.name || "Clinic",
          email: data.email || "clinic@gmail.com",
          phone: data.phone || "+243 000000000",
          clinicId: data.clinicId || resolvedClinicId,
        });
      } catch (error) {
        console.error("Clinic fetch error:", error);
      }
    };

    fetchClinic();
  }, [resolvedClinicId]);

  /* ---------------- SCROLL ANIMATION ---------------- */

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const y = window.scrollY;

      setShowInfoBar(y < 100);

      controls.start({
        height: y > 50 ? 64 : 80,
        backgroundColor: y > 50 ? "rgba(29,78,216,0.9)" : "rgba(29,78,216,1)",
        transition: { duration: 0.25 },
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  if (!mounted) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <header className="fixed w-full top-0 z-50">
      {/* INFO BAR */}
      <AnimatePresence>
        {showInfoBar && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-blue-950 text-blue-100 text-sm"
          >
<div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-blue-100 bg-blue-900 rounded-b-lg shadow-md overflow-hidden">
  {/* Contact Info */}
  <div className="flex flex-wrap items-center gap-4 animate-fade-in-down">
    {clinic.email && (
      <span className="flex items-center gap-1">
        <Mail size={16} className="text-blue-200" /> {clinic.email}
      </span>
    )}
    {clinic.phone && (
      <span className="flex items-center gap-1">
        <Phone size={16} className="text-blue-200" /> {clinic.phone}
      </span>
    )}
  </div>

  {/* Advertisement */}
  {advertisement && (
    <span className="bg-blue-700 text-white px-3 py-1 rounded-lg font-medium shadow animate-pulse">
      {advertisement}
    </span>
  )}

  {/* Props Overrides */}
  <div className="flex items-center gap-3 flex-wrap animate-fade-in-up">
    {clinicEmail && (
      <span className="flex items-center gap-1 text-blue-200">
        <Mail size={16} /> {clinicEmail}
      </span>
    )}
    {clinicPhone && (
      <span className="flex items-center gap-1 text-blue-200">
        <Phone size={16} /> {clinicPhone}
      </span>
    )}
    {logo && (
      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 shadow animate-bounce">
        <Image src={logo} alt="Clinic Logo" width={24} height={24} className="object-cover" />
      </div>
    )}
    {clinicName && (
      <span className="font-semibold text-white tracking-wide animate-fade-in-right">
        {clinicName}
      </span>
    )}
  </div>
</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav
        animate={controls}
        initial={{ height: 80, backgroundColor: "rgba(29,78,216,1)" }}
        className="backdrop-blur-lg shadow-xl border-b border-white/10 flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-6">
          {/* LOGO */}
          <Link href={`/clinic/${clinic.clinicId}`} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30">
              <Image
                src={clinic.logo}
                alt={`${clinic.name} Logo`}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized={clinic.logo.startsWith("data:image")}
              />
            </div>
            <span className="text-white font-bold text-lg">{clinic.name}</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: isActive ? 360 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-72 bg-blue-900 z-50 shadow-2xl"
          >
            <div className="mt-20 flex flex-col gap-4 p-6">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-white/10"
                    >
                      <Icon size={20} />
                      {item.name}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}