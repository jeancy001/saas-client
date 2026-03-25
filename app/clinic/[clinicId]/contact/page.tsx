"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  HeartPulse,
  Stethoscope,
  Globe,
  MessageCircle,
  ShieldCheck,
  User,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const phoneNumber = "+243000000000";
  const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      console.log(form);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      alert("Message envoyé avec succès !");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="relative h-[260px] w-full">
        <Image
          src="/images/clinic-contact.jpg"
          alt="Nyota clinic"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col justify-center px-6 lg:px-20">
          <h1 className="text-white text-3xl sm:text-4xl font-bold max-w-xl">
            Clinique Nyota ya Asubuyi
          </h1>

          <p className="text-gray-200 mt-3 max-w-lg text-sm sm:text-base">
            Une médecine humaine, une expertise mondiale au cœur de Kinshasa.
          </p>

          <div className="flex gap-3 mt-5 flex-wrap">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <Phone size={16} />
              Prendre rendez-vous
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12">
        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Contact & Accès
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Centre d'excellence en gastro-entérologie et médecine interne,
              partenaire de la Fondation Aurore et de l’Université d’Oita (Japon).
            </p>
          </div>

          <div className="space-y-4">
            <InfoItem icon={MapPin} label="Adresse" value="n°81 av. Tabu-Ley, Gombe, Kinshasa" />
            <InfoItem icon={Phone} label="Téléphone / WhatsApp" value="+243 XXX XXX XXX" />
            <InfoItem icon={Mail} label="Email" value="contact@nyota-clinic.cd" />
            <InfoItem icon={Clock} label="Horaires" value="Lun - Sam : 08h00 - 18h00" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Feature icon={Stethoscope} text="Gastro-entérologie avancée" />
            <Feature icon={HeartPulse} text="Cardiologie & médecine interne" />
            <Feature icon={Globe} text="Partenariat Japon (Université d’Oita)" />
            <Feature icon={ShieldCheck} text="Protocoles médicaux certifiés" />
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-gray-700">
            🌟 Unique à Kinshasa : Tests respiratoires H. pylori, pH-métrie 24h
            et antibiogramme ciblé.
          </div>
        </motion.div>

        {/* CONTACT FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Envoyer un message
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>

          {/* NAME */}
          <InputField
            icon={User}
            name="name"
            placeholder="Nom complet"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <InputField
            icon={Mail}
            name="email"
            type="email"
            placeholder="Adresse email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PHONE */}
          <InputField
            icon={Phone}
            name="phone"
            placeholder="Numéro de téléphone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* MESSAGE */}
          <div className="relative">
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Votre message..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={16} />
            )}

            {loading ? "Envoi en cours..." : "Envoyer le message"}
          </button>
        </motion.form>
      </div>

      {/* MAP */}
      <div className="max-w-7xl mx-auto px-4 pb-14">
        <div className="rounded-2xl overflow-hidden shadow-lg border">
          <iframe
            title="Nyota Clinic Location"
            src="https://maps.google.com/maps?q=Gombe%20Kinshasa&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-72 border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

/* INPUT FIELD */
function InputField({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: any) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-3 top-3 text-gray-400"
      />

      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

/* INFO ITEM */
function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 mt-10 pt-10 top-10">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* FEATURE */
function Feature({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border rounded-lg px-3 py-2 shadow-sm">
      <Icon size={16} className="text-blue-600" />
      {text}
    </div>
  );
}