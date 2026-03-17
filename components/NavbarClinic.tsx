"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";

interface NavbarProps {
  logo: string;
  clinicName: string;
  clinicEmail: string;
  clinicPhone: string;
  advertisement?: string;
}

export default function Navbar({
  logo,
  clinicName,
  clinicEmail,
  clinicPhone,
  advertisement,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfoBar, setShowInfoBar] = useState(true);
  const navbarControls = useAnimation();

  const navItems = [
    { name: "Accueil", href: "#" },
    { name: "Cliniques", href: "#" },
    { name: "Patients", href: "#" },
    { name: "Rendez-vous", href: "#" },
    { name: "Contact", href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Hide info bar after 100px scroll
      setShowInfoBar(scrollY < 100);

      // Animate navbar shrink
      if (scrollY > 50) {
        navbarControls.start({
          height: 60,
          backgroundColor: "rgba(29,78,216,0.95)",
          transition: { duration: 0.3 },
        });
      } else {
        navbarControls.start({
          height: 80,
          backgroundColor: "rgba(29,78,216,1)",
          transition: { duration: 0.3 },
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navbarControls]);

  return (
    <header className="w-full fixed top-0 z-50">

      {/* INFO BAR */}
      <AnimatePresence>
        {showInfoBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-blue-950 text-blue-100 text-sm"
          >
            <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex gap-6 flex-wrap items-center">
                <span>Email: {clinicEmail}</span>
                <span>Téléphone: {clinicPhone}</span>
              </div>
              {advertisement && (
                <div className="text-blue-200 font-medium">{advertisement}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN NAVBAR */}
      <motion.nav
        animate={navbarControls}
        initial={{ height: 80, backgroundColor: "rgba(29,78,216,1)" }}
        className="backdrop-blur-md shadow-lg w-full flex items-center justify-between px-6 border-b border-white/10 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">

          {/* Logo + Clinic Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/30">
              <Image src={logo} alt="Clinic Logo" fill style={{ objectFit: "cover" }} />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">{clinicName}</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-900">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition whitespace-nowrap"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition text-white font-medium"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed top-0 right-0 h-full w-72 bg-blue-900 shadow-2xl backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-6 mt-20">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="text-white font-medium text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}