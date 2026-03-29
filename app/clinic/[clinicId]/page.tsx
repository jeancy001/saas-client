"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentForm from "@/components/AppointementForm";
import api from "@/lib/api";

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
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ---------------- HERO ---------------- */
const HeroSection = ({ clinicName }: { clinicName: string }) => {
  const images = ["/slides/nurse1.jpeg", "/slides/nurse2.jpeg", "/slides/nurse3.jpeg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image src={images[index]} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold leading-tight">
          {clinicName}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 text-gray-200 text-lg">
          Excellence médicale, innovation et expérience patient moderne.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex gap-4 justify-center">
          <a href="#appointment" className="btn-primary">
            <CalendarCheck size={18} /> Rendez-vous
          </a>

          <a href="tel:+243000000000" className="btn-outline">
            <Phone size={18} /> Appeler
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------------- WHY US ---------------- */
const WhyUsSection = () => {
  const items = [
    { icon: Stethoscope, title: "Experts", desc: "Médecins qualifiés" },
    { icon: Activity, title: "Technologie", desc: "Équipements modernes" },
    { icon: User, title: "Patient", desc: "Expérience fluide" },
    { icon: HeartPulse, title: "Soins", desc: "Approche personnalisée" },
    { icon: ShieldCheck, title: "Sécurité", desc: "Hygiène stricte" },
    { icon: Clock, title: "Rapidité", desc: "Consultations rapides" },
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="section-title">Pourquoi nous choisir</h2>

      <div className="grid md:grid-cols-3 gap-8 mt-14">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="card-modern"
            >
              <div className="icon-box">
                <Icon size={22} />
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

/* ---------------- SPECIALTIES ---------------- */
const SpecialtiesSection = () => {
  const specialties = [
    "Cardiologie",
    "Pédiatrie",
    "Dermatologie",
    "Médecine générale",
    "Diabétologie",
    "Gastro",
  ];

  return (
    <section className="py-24 bg-gray-100 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Nos Spécialités</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {specialties.map((s, i) => (
            <div key={i} className="relative h-56 rounded-2xl overflow-hidden group">
              <Image src="/slides/nurse2.jpeg" alt="" fill className="object-cover group-hover:scale-110 transition" />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />

              <div className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- ABOUT ---------------- */
const AboutSection = () => (
  <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
    <div>
      <h2 className="section-title text-left">À propos</h2>

      <p className="text-gray-600 mt-6 leading-relaxed">
        Nous offrons une médecine moderne avec une approche centrée sur le patient,
        combinant expertise médicale et technologies avancées.
      </p>

      <ul className="mt-8 space-y-3 text-gray-700">
        <li>✔ Équipe multidisciplinaire</li>
        <li>✔ Technologie avancée</li>
        <li>✔ Suivi personnalisé</li>
      </ul>
    </div>

    <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
      <Image src="/slides/nurse1.jpeg" alt="" fill className="object-cover" />
    </div>
  </section>
);

/* ---------------- CTA ---------------- */
const CTASection = () => (
  <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 text-center">
    <h2 className="text-3xl font-semibold mb-6">
      Consultation rapide ?
    </h2>

    <a href="#appointment" className="btn-white">
      <CalendarCheck size={18} /> Réserver maintenant
    </a>
  </section>
);

/* ---------------- MAIN ---------------- */
export default function ClinicHomePage() {
  const params = useParams();
  const clinicId = params?.clinicId as string;

  const [clinic, setClinic] = useState({ name: "Chargement..." });

  useEffect(() => {
    if (!clinicId) return;

    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinic/clinic-link/${clinicId}`);
        setClinic(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClinic();
  }, [clinicId]);

  if (!clinicId) return <div className="p-10 text-red-600">Invalid clinic</div>;

  return (
    <div className="bg-gray-50">

      <HeroSection clinicName={clinic.name} />

      <WhyUsSection />

      <SpecialtiesSection />

      <AboutSection />

      <CTASection />

      {/* APPOINTMENT */}
      <section id="appointment" className="py-24 px-6">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="section-title text-center mb-8">
            <CalendarCheck className="inline mr-2" />
            Prendre Rendez-vous
          </h2>

          <AppointmentForm clinicId={clinicId} />
        </div>
      </section>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .section-title {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
        }

        .card-modern {
          background: white;
          padding: 28px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .card-modern:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .icon-box {
          width: 50px;
          height: 50px;
          margin: auto;
          margin-bottom: 12px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-weight: 600;
          margin-top: 10px;
        }

        .card-desc {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 12px 22px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .btn-outline {
          border: 1px solid white;
          padding: 12px 22px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-white {
          background: white;
          color: #2563eb;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}