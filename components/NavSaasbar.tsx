"use client";

import { useState } from "react";
import {LucideMenu, LucideX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MdPayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { GrDashboard } from "react-icons/gr";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <GrDashboard className="w-5 h-5 mr-2 inline" /> },
    { name: "Payments", href: "#", icon: <MdPayment className="w-5 h-5 mr-2 inline" /> },
    { name: "Support", href: "#", icon: <BiSupport className="w-5 h-5 mr-2 inline" /> },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg">
              <Image src="/pills.png" width={30} height={30} alt="logo" />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">Clinic SaaS</span>
          </div>

          {/* Desktop Menu */}
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
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <LucideMenu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Slide-in */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-blue-700 via-blue-600 to-blue-700 shadow-lg z-40 p-6 flex flex-col"
          >
            {/* Close button at top-right inside menu */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                aria-label="Close menu"
              >
                <LucideX className="w-6 h-6" />
              </button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-6 mt-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-white hover:text-blue-200 font-medium transition px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon} {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}