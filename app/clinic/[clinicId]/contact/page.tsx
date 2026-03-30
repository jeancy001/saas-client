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
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type ToastState = {
  type: "success" | "error" | null;
  message: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ type: null, message: "" });

  const phoneNumber = "+243999700212";
  const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: "" }), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/clinic/contact/", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      showToast("success", "Message envoyé avec succès !");
    } catch (error: any) {
      showToast(
        "error",
        error?.response?.data?.message || "Erreur lors de l'envoi du message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-10">
      {/* TOAST */}
      <AnimatePresence>
        {toast.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <div className="relative h-[260px] w-full">
        <Image
          src="/images/clinic-contact.jpg"
          alt="clinic"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col justify-center px-6 lg:px-20">
          <h1 className="text-white text-3xl sm:text-4xl font-bold">
            Clinique Nyota ya Asubuyi
          </h1>

          <p className="text-gray-200 mt-3 text-sm sm:text-base">
            Une médecine humaine, une expertise mondiale.
          </p>

          <div className="flex gap-3 mt-5 flex-wrap">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <Phone size={16} />
              Appeler
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
        {/* LEFT */}
        <motion.div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold">Contact & Accès</h2>
            <p className="text-gray-600 text-sm mt-2">
              Centre médical spécialisé en gastro-entérologie et médecine interne.
            </p>
          </div>

          <div className="space-y-4">
            <InfoItem icon={MapPin} label="Adresse" value="Gombe, Kinshasa" />
            <InfoItem icon={Phone} label="Téléphone" value="+243999700212" />
            <InfoItem icon={Mail} label="Email" value="contact@clinic.cd" />
            <InfoItem icon={Clock} label="Horaires" value="Lun - Sam : 08h - 18h" />
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-5"
        >
          <h3 className="text-xl font-semibold">Envoyer un message</h3>

          <Input icon={User} name="name" placeholder="Nom" value={form.name} onChange={handleChange} />
          <Input icon={Mail} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input icon={Phone} name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} />

          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Message..."
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
          />

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
      <input
        {...props}
        className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* INFO */
function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex gap-3">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}