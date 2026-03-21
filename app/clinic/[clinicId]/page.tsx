"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentForm from "@/components/AppointementForm";
import { Stethoscope, User, Activity } from "lucide-react";

/* ---------------- ANIMATIONS ---------------- */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

/* ---------------- HERO SECTION ---------------- */
const HeroSection = ({ clinicName }: { clinicName: string }) => {
  const images = ["/slides/nurse1.jpeg", "/slides/nurse2.jpeg", "/slides/nurse3.jpeg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Slider */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image src={images[index]} alt="clinic" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl font-bold mb-4 drop-shadow-lg"
        >
          {clinicName}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-gray-200 max-w-xl mx-auto drop-shadow"
        >
          Excellence médicale, innovation et humanité au service de votre santé.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="/clinic/appointments"
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition transform"
          >
            Rendez-vous
          </a>
          <a
            href="tel:+243000000000"
            className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Appeler
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ---------------- WHY US SECTION ---------------- */
const WhyUsSection = () => (
  <motion.section
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="max-w-7xl mx-auto px-6 py-20"
  >
    <motion.h2
      variants={fadeUp}
      className="text-3xl font-semibold text-center mb-14"
    >
      Pourquoi nous choisir
    </motion.h2>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: <Stethoscope size={32} />,
          title: "Expertise",
          desc: "Médecins hautement qualifiés dans plusieurs spécialités.",
        },
        {
          icon: <Activity size={32} />,
          title: "Technologie",
          desc: "Équipements modernes pour un diagnostic précis.",
        },
        {
          icon: <User size={32} />,
          title: "Expérience patient",
          desc: "Zéro attente et prise en charge premium.",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

/* ---------------- SPECIALTIES SECTION ---------------- */
const SpecialtiesSection = () => (
  <motion.section
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="bg-gray-100 py-20 px-6"
  >
    <motion.h2
      variants={fadeUp}
      className="text-3xl font-semibold text-center mb-14"
    >
      Nos Spécialités
    </motion.h2>

    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {["Gastro-entérologie", "Cardiologie", "Diabétologie"].map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{ scale: 1.04 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="font-semibold text-blue-700 mb-3">{item}</h3>
          <p className="text-gray-600 text-sm">
            Soins spécialisés avec un haut niveau de précision et de sécurité.
          </p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

/* ---------------- ABOUT SECTION ---------------- */
const AboutSection = () => (
  <motion.section
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center"
  >
    <motion.div variants={fadeUp}>
      <h2 className="text-3xl font-semibold mb-6">À propos</h2>
      <p className="text-gray-600 mb-6">
        Une clinique moderne centrée sur le patient, combinant expertise médicale et technologie avancée.
      </p>
    </motion.div>

    <motion.div variants={fadeUp} className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
      <Image src="/slides/nurse1.jpeg" alt="about" fill className="object-cover" />
    </motion.div>
  </motion.section>
);

/* ---------------- MAIN PAGE ---------------- */
export default function ClinicHomePage() {
  const [clinic, setClinic] = useState({ name: "Nyota ya Asubuyi" });

  return (
    <div className="bg-gray-50">
      <HeroSection clinicName={clinic.name} />
      <WhyUsSection />
      <SpecialtiesSection />
      <AboutSection />

      <section id="appointment" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-8">Prendre Rendez-vous</h2>
        <AppointmentForm clinicId="default" />
      </section>
    </div>
  );
}