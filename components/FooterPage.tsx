"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Clinic Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-bold text-lg">Clinic SaaS</span>
          </Link>
          <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
            Professional clinic management system, making appointments, patients & staff easy to manage.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <Link href="/" className="hover:text-blue-500 transition">Accueil</Link>
          <Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
          <Link href="/patients" className="hover:text-blue-500 transition">Patients</Link>
          <Link href="/appointments" className="hover:text-blue-500 transition">Rendez-vous</Link>
          <Link href="/contact" className="hover:text-blue-500 transition">Contact</Link>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h4 className="text-white font-semibold">Connect with us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-500 transition">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              <FaLinkedinIn size={18} />
            </a>
          </div>
          <div className="text-gray-400 text-sm">
            <p>Email: <a href="mailto:clinic@example.com" className="hover:text-blue-400">clinic@example.com</a></p>
            <p>Phone: <a href="tel:+243000000000" className="hover:text-blue-400">+243 000000000</a></p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 text-gray-500 text-sm py-3 mt-4">
        &copy; {new Date().getFullYear()} Clinic SaaS. All rights reserved.
      </div>
    </footer>
  );
}