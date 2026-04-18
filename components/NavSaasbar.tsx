"use client";

import { useState } from "react";
import {
  LucideMenu,
  LucideX,
  User,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MdPayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { GrDashboard } from "react-icons/gr";
import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useUser();
  const router = useRouter();

  /* ---------------- NAV ITEMS (ROLE BASED) ---------------- */
  const navItems = [
    ...(user?.role === "admin"
      ? [
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: (
              <GrDashboard className="w-5 h-5 mr-2 inline" />
            ),
          },
        ]
      : []),

    {
      name: "Payments",
      href: "#",
      icon: <MdPayment className="w-5 h-5 mr-2 inline" />,
    },
    {
      name: "Support",
      href: "#",
      icon: <BiSupport className="w-5 h-5 mr-2 inline" />,
    },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg">
              <Image src="/pills.png" width={30} height={30} alt="logo" />
            </div>
            <span className="text-white font-bold text-xl">
              Clinic SaaS
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center text-white hover:text-blue-300 transition font-medium py-2 px-3 rounded-lg hover:bg-white/10"
              >
                {item.icon} {item.name}
              </a>
            ))}

            {/* AUTH AREA */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
              >
                <LogIn size={18} />
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30"
                >
                  <User size={18} />
                  {user?.username || "Profile"}
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => router.push("/profile")}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                      >
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 flex items-center gap-2"
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

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              <LucideMenu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="md:hidden fixed top-0 right-0 w-64 h-full bg-blue-700 p-6 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <LucideX className="text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-5 mt-6">

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon} {item.name}
                </a>
              ))}

              {!user ? (
                <button
                  onClick={() => router.push("/login")}
                  className="bg-white text-blue-700 py-2 rounded-lg font-semibold"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="bg-red-500 text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}