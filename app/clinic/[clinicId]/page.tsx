"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentForm from "@/components/AppointementForm";
import api from "@/lib/api";
import Specialties from "@/components/Specialities";
import {
  CalendarCheck,
  Phone,
  Activity,
  HeartPulse,
  ShieldCheck,
  Clock,
  Stethoscope,
  User,
} from "lucide-react";
import Features from "@/components/Features";

/* ---------------- ANIMATION ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ---------------- HERO ---------------- */
const Hero = ({ name }: { name: string }) => {
  const slides = ["/slides/nurse1.jpeg", "/slides/nurse2.jpeg", "/slides/nurse3.jpeg"];
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image src={slides[i]} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-3xl px-6"
      >
        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold">
          {name}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-5 text-gray-200 text-lg">
          Modern healthcare experience built on trust, precision, and care.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex gap-4 justify-center flex-wrap">
          <a
            href="#appointment"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-lg"
          >
            <CalendarCheck size={18} /> Book Appointment
          </a>

          <a
            href="tel:+243000000000"
            className="px-6 py-3 rounded-xl border border-white/60 hover:bg-white/10 transition flex items-center gap-2"
          >
            <Phone size={18} /> Call Clinic
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
<div>
/* ---------------- FEATURES ---------------- */
<Features/>
/* ---------------- SPECIALTIES ---------------- */

<Specialties />
</div>
/* ---------------- ABOUT ---------------- */
const About = () => (
  <section className="py-24 bg-white">
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-6">About the Clinic</h2>

        <p className="text-gray-600 leading-relaxed">
          We provide modern healthcare solutions focused on precision, comfort,
          and trust using advanced medical systems and professional care teams.
        </p>

        <ul className="mt-6 space-y-2 text-gray-700">
          <li>✔ Multidisciplinary medical team</li>
          <li>✔ Advanced diagnostic technology</li>
          <li>✔ Personalized patient follow-up</li>
        </ul>
      </div>

      <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
        <Image src="/slides/nurse1.jpeg" alt="" fill className="object-cover" />
      </div>
    </div>
  </section>
);

/* ---------------- CTA ---------------- */
const CTA = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
    <h2 className="text-3xl font-bold">Need fast medical consultation?</h2>
    <p className="mt-3 text-white/80">Book an appointment in just a few clicks</p>

    <a
      href="#appointment"
      className="inline-flex mt-8 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition items-center gap-2 shadow-lg"
    >
      <CalendarCheck size={18} /> Book Now
    </a>
  </section>
);

/* ---------------- PAGE ---------------- */
export default function ClinicPage() {
  const params = useParams();
  const clinicId = params?.clinicId ? String(params.clinicId) : undefined;

  const [clinic, setClinic] = useState<{ name: string }>({ name: "" });
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!clinicId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await api.get(`/clinic/clinic-link/${clinicId}`, {
          signal: controller.signal,
        });

        startTransition(() => {
          setClinic(res.data.data);
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [clinicId]);

  if (!clinicId) {
    return <div className="p-10 text-red-500">Invalid clinic</div>;
  }

  return (
    <div className="bg-gray-50">
      <Hero name={loading ? "Loading..." : clinic.name || "Clinic"} />

      <Features />
      <Specialties />
      <About />
      <CTA />

      <section id="appointment" className="py-24">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-2xl font-bold text-center mb-8">
            Book Appointment
          </h2>
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}