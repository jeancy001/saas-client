"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  Mail,
  Menu,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";
import { GrDashboard } from "react-icons/gr";
import api from "@/lib/api";
import { useUser } from "@/lib/userContext";

/* ---------------- TYPES ---------------- */

interface ClinicInfo {
  name?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

interface NavbarProps {
  clinicId?: string;
  advertisement?: string;
  clinic?: ClinicInfo; // optional SaaS injection
}

/* ---------------- HELPERS ---------------- */

const resolveLogo = (logo?: string | null) =>
  logo && logo.trim() !== "" ? logo : "/logo.png";

/* ---------------- COMPONENT ---------------- */

export default function Navbar({
  clinicId,
  advertisement,
  clinic: clinicProp,
}: NavbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const controls = useAnimation();
  const { user, logout, loading } = useUser();

  const resolvedClinicId =
    clinicId ||
    (typeof params?.clinicId === "string" ? params.clinicId : "");

  const isAdmin = user?.role === "admin";

  /* ---------------- STATE (SAFE + OPTIONAL) ---------------- */

  const [clinic, setClinic] = useState<ClinicInfo>({
    name: clinicProp?.name || "Clinic",
    logo: clinicProp?.logo || "/logo.png",
    email: clinicProp?.email || "",
    phone: clinicProp?.phone || "",
  });

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = useMemo(() => {
    if (!resolvedClinicId) return [];

    const items = [
      { name: "Accueil", href: `/clinic/${resolvedClinicId}`, icon: Home },
      ...(isAdmin
        ? [
            {
              name: "Dashboard",
              href: `/clinic/${resolvedClinicId}/dashboard`,
              icon: GrDashboard,
            },
          ]
        : []),
      { name: "Patients", href: `/clinic/${resolvedClinicId}/patients`, icon: Users },
      { name: "Rendez-vous", href: `/clinic/${resolvedClinicId}/appointment`, icon: Calendar },
      { name: "Contact", href: `/clinic/${resolvedClinicId}/contact`, icon: Mail },
    ];

    if (!user) {
      items.push({
        name: "Connexion",
        href: `/clinic/${resolvedClinicId}/login`,
        icon: Mail,
      });
    }

    return items;
  }, [resolvedClinicId, isAdmin, user]);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      controls.start({
        height: window.scrollY > 50 ? 64 : 78,
        backgroundColor: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(10px)",
        transition: { duration: 0.2 },
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  /* ---------------- FETCH CLINIC (OPTIONAL OVERRIDE) ---------------- */

  useEffect(() => {
    if (!resolvedClinicId) return;

    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinic/clinic-link/${resolvedClinicId}`);
        if (!res?.data?.success) return;

        const data = res.data.data;

        setClinic({
          name: clinicProp?.name || data.name || "Clinic",
          logo: resolveLogo(clinicProp?.logo || data.logo),
          email: clinicProp?.email || data.email || "",
          phone: clinicProp?.phone || data.phone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchClinic();
  }, [resolvedClinicId, clinicProp]);

  if (!mounted || loading) return null;

  const handleLogout = async () => {
    await logout();
    router.replace(`/clinic/${resolvedClinicId}/login`);
  };

  /* ---------------- UI ---------------- */

  return (
    <header className="fixed top-0 w-full z-50">
      <motion.nav
        animate={controls}
        initial={{ height: 78 }}
        className="border-b border-white/10 bg-slate-900/80"
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          {/* LOGO */}
          <Link href={`/clinic/${resolvedClinicId}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={resolveLogo(clinic.logo)}
                alt="logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-white font-semibold">
              {clinic.name}
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
                      ${active
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

            {/* USER */}
            {user && (
              <div className="relative ml-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-white text-sm">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl overflow-hidden">
                      <Link href={`/clinic/${resolvedClinicId}/profile`}>
                        <div className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 text-sm">
                          <UserCircle size={16} />
                          Profile
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-500"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white"
          >
            <Menu />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div className="fixed right-0 top-0 h-full w-80 bg-slate-900 p-6 flex flex-col">
              <div className="flex justify-between text-white mb-6">
                <span>Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-white/10">
                        <Icon size={18} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-auto py-3 border border-red-500 text-red-400 rounded-lg"
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