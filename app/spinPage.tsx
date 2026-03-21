"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaClinicMedical } from "react-icons/fa";

interface SpinPageProps {
  onFinish: () => void;
}

/* ✅ SSR-SAFE PARTICLES (NO Math.random IN RENDER) */
const PARTICLES = [
  { top: "10%", left: "20%" },
  { top: "25%", left: "80%" },
  { top: "40%", left: "60%" },
  { top: "70%", left: "30%" },
  { top: "85%", left: "75%" },
  { top: "55%", left: "10%" },
  { top: "15%", left: "50%" },
  { top: "35%", left: "90%" },
  { top: "65%", left: "45%" },
  { top: "80%", left: "20%" },
  { top: "50%", left: "70%" },
  { top: "30%", left: "35%" },
];

export default function SpinPage({ onFinish }: SpinPageProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* BACKGROUND GLOW */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-10">
        {/* SPINNER CORE */}
        <div className="relative flex items-center justify-center">
          {/* OUTER ROTATION */}
          <motion.div
            className="absolute w-44 h-44 border-[3px] border-white/20 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          />

          {/* SECOND RING */}
          <motion.div
            className="absolute w-32 h-32 border-[3px] border-blue-300/20 border-b-blue-200 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />

          {/* PULSE HALO */}
          <motion.div
            className="absolute w-28 h-28 bg-white/10 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ICON CONTAINER */}
          <motion.div
            className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <FaClinicMedical className="text-blue-600 text-4xl" />
            </motion.div>
          </motion.div>
        </div>

        {/* TEXT CONTENT */}
        <div className="text-center">
          <motion.h2
            className="text-white text-3xl font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Clinic Management System
          </motion.h2>

          <motion.p
            className="text-blue-100 text-sm mt-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing medical dashboard...
          </motion.p>

          {/* LOADING DOTS */}
          <div className="flex justify-center mt-4 gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}