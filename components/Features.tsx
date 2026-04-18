"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Clock,
  User,
} from "lucide-react";

const Features = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  const items = [
    {
      icon: Stethoscope,
      title: "Specialists",
      desc: "Certified medical experts across multiple specialties",
      extra: "Doctors with verified clinical experience and hospital training standards.",
    },
    {
      icon: Activity,
      title: "Diagnostics",
      desc: "Advanced medical equipment for accurate results",
      extra: "Modern imaging systems, lab testing, and precision diagnostics tools.",
    },
    {
      icon: HeartPulse,
      title: "Care",
      desc: "Patient-centered treatment approach",
      extra: "Focused on comfort, emotional support, and complete recovery journey.",
    },
    {
      icon: ShieldCheck,
      title: "Safety",
      desc: "Strict hygiene and medical safety standards",
      extra: "International protocols for infection control and patient protection.",
    },
    {
      icon: Clock,
      title: "Fast Service",
      desc: "Reduced waiting time and quick booking",
      extra: "Optimized scheduling system with real-time doctor availability.",
    },
    {
      icon: User,
      title: "Experience",
      desc: "Smooth and guided patient journey",
      extra: "From appointment booking to consultation with full support system.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose Us
        </h2>
        <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
          Click each card to explore detailed information about our healthcare services.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isFlipped = flipped === idx;

            return (
              <div
                key={idx}
                className="perspective cursor-pointer"
                onClick={() =>
                  setFlipped(flipped === idx ? null : idx)
                }
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-64 [transform-style:preserve-3d]"
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl border bg-white shadow-sm p-6 flex flex-col justify-center hover:shadow-xl transition">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                      <Icon size={20} />
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      {item.desc}
                    </p>

                    <p className="text-xs text-blue-500 mt-4">
                      Click to view details →
                    </p>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 flex flex-col justify-center shadow-2xl">
                    <h3 className="text-lg font-bold mb-3">
                      {item.title} Details
                    </h3>

                    <p className="text-sm leading-relaxed opacity-90">
                      {item.extra}
                    </p>

                    <div className="mt-4 text-xs opacity-80 border-t border-white/30 pt-3">
                      Advanced healthcare feature designed to improve patient experience and outcomes.
                    </div>

                    <p className="text-xs mt-4 opacity-70">
                      Click again to close
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REQUIRED CSS (add in global or tailwind config) */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default Features;