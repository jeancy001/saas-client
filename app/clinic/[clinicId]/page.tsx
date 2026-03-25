"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentForm from "@/components/AppointementForm";
import {
  Stethoscope,
  User,
  Activity,
  HeartPulse,
  ShieldCheck,
  Clock,
  Phone,
  CalendarCheck,
} from "lucide-react";

/* ---------------- ANIMATIONS ---------------- */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ---------------- HERO ---------------- */
const HeroSection = ({ clinicName }: { clinicName: string }) => {
  const images = [
    "/slides/nurse1.jpeg",
    "/slides/nurse2.jpeg",
    "/slides/nurse3.jpeg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden w-full">
      
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
          <Image
            src={images[index]}
            alt="clinic"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-blue-900/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          {clinicName}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-gray-200 mb-8"
        >
          Soins médicaux de haute qualité, technologie moderne et expérience
          patient premium à Kinshasa.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#appointment"
            className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            <CalendarCheck size={18} />
            Rendez-vous
          </a>

          <a
            href="tel:+243000000000"
            className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <Phone size={18} />
            Appeler
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-3 gap-8 mt-12 text-center"
        >
          {[
            { value: "10+", label: "Médecins" },
            { value: "5k+", label: "Patients" },
            { value: "24/7", label: "Disponibilité" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-300">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------------- WHY US ---------------- */
const WhyUsSection = () => (
  <section className="py-24 w-full px-10">
    <h2 className="text-3xl font-semibold text-center mb-16">
      Pourquoi nous choisir
    </h2>

    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          icon: <Stethoscope />,
          title: "Expertise médicale",
          desc: "Professionnels certifiés avec plusieurs années d'expérience.",
        },
        {
          icon: <Activity />,
          title: "Technologie avancée",
          desc: "Équipements modernes pour diagnostics fiables.",
        },
        {
          icon: <User />,
          title: "Expérience premium",
          desc: "Parcours patient fluide sans attente.",
        },
        {
          icon: <HeartPulse />,
          title: "Soins personnalisés",
          desc: "Approche centrée sur chaque patient.",
        },
        {
          icon: <ShieldCheck />,
          title: "Sécurité",
          desc: "Protocoles stricts et hygiène irréprochable.",
        },
        {
          icon: <Clock />,
          title: "Disponibilité",
          desc: "Consultations rapides et urgences prises en charge.",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
        >
          <div className="text-blue-600 mb-4">{item.icon}</div>

          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

          <p className="text-gray-600 text-sm">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ---------------- SPECIALTIES ---------------- */
const SpecialtiesSection = () => (
  <section className="bg-gray-100 py-24 w-full px-10">
    <h2 className="text-3xl font-semibold text-center mb-16">
      Nos Spécialités
    </h2>

    <div className="grid md:grid-cols-3 gap-10">
      {[
        "Cardiologie",
        "Gastro-entérologie",
        "Diabétologie",
        "Pédiatrie",
        "Dermatologie",
        "Médecine générale",
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="relative h-56 rounded-2xl overflow-hidden shadow-lg group"
        >
          <Image
            src="/slides/nurse2.jpeg"
            alt="specialty"
            fill
            className="object-cover group-hover:scale-110 transition"
          />

          <div className="absolute inset-0 bg-black/50 flex items-end p-6">
            <h3 className="text-white text-lg font-semibold">{item}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ---------------- ABOUT ---------------- */
const AboutSection = () => (
  <section className="py-24 grid md:grid-cols-2 gap-16 items-center px-10">
    <div>
      <h2 className="text-3xl font-semibold mb-6">À propos de la clinique</h2>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Nous combinons expertise médicale, innovation technologique et
        excellence du service pour offrir une prise en charge complète et
        moderne.
      </p>

      <ul className="space-y-3 text-gray-600">
        <li>✔ Équipe multidisciplinaire</li>
        <li>✔ Équipements de pointe</li>
        <li>✔ Suivi personnalisé</li>
      </ul>
    </div>

    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
      <Image src="/slides/nurse1.jpeg" alt="about" fill className="object-cover" />
    </div>
  </section>
);

/* ---------------- CTA ---------------- */
const CTASection = () => (
  <section className="bg-blue-600 py-20 text-center text-white w-full">
    <h2 className="text-3xl font-semibold mb-4">
      Besoin d'une consultation rapide ?
    </h2>

    <p className="mb-6 text-blue-100">
      Prenez rendez-vous en ligne en quelques secondes.
    </p>

    <a
      href="#appointment"
      className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition inline-flex items-center gap-2"
    >
      <CalendarCheck size={18} />
      Réserver maintenant
    </a>
  </section>
);

/* ---------------- MAIN ---------------- */
export default function ClinicHomePage() {
  const [clinic] = useState({ name: "Nyota ya Asubuyi" });

  return (
    <div className="bg-gray-50 w-full overflow-x-hidden">

      <HeroSection clinicName={clinic.name} />

      <WhyUsSection />

      <SpecialtiesSection />

      <AboutSection />

      <CTASection />

      {/* Appointment */}
      <section id="appointment" className="py-24 w-full flex justify-center">
        <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Prendre Rendez-vous
          </h2>

          <AppointmentForm clinicId="default" />
        </div>
      </section>
    </div>
  );
}