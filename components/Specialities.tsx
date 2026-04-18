"use client";

import Image from "next/image";
import {
  HeartPulse,
  Baby,
  ScanFace,
  Stethoscope,
  Droplets,
  UtensilsCrossed,
} from "lucide-react";

const Specialties = () => {
  const data = [
    {
      name: "Cardiology",
      image: "/specialties/cardiology.jpeg",
      description: "Heart & blood vessel care",
      note: "Heart and cardiovascular system care and treatment",
      icon: HeartPulse,
      color: "text-red-500",
    },
    {
      name: "Pediatrics",
      image: "/specialties/pediatrics.jpg",
      description: "Child healthcare services",
      note: "Medical care for infants, children and teens",
      icon: Baby,
      color: "text-pink-500",
    },
    {
      name: "Dermatology",
      image: "/specialties/nurse1.jpeg",
      description: "Skin treatment & diagnosis",
      note: "Skin, hair and nail disease diagnosis and care",
      icon: ScanFace,
      color: "text-yellow-500",
    },
    {
      name: "General Medicine",
      image: "/specialties/general-medicine.jpg",
      description: "Primary medical consultation",
      note: "Primary healthcare and general medical diagnosis",
      icon: Stethoscope,
      color: "text-blue-500",
    },
    {
      name: "Diabetology",
      image: "/specialties/diabetology.jpg",
      description: "Diabetes management care",
      note: "Diabetes monitoring, treatment and prevention",
      icon: Droplets,
      color: "text-cyan-500",
    },
    {
      name: "Gastroenterology",
      image: "/specialties/gastroenterology.webp",
      description: "Digestive system care",
      note: "Digestive system disorders and treatments",
      icon: UtensilsCrossed,
      color: "text-green-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-14">
          Medical Specialties
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />

                  {/* ICON */}
                  <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>

                  {/* TITLE */}
                  <div className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                    {s.name}
                  </div>

                  {/* HOVER NOTE */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 px-6">
                    <div className="bg-white/95 text-gray-800 text-sm px-4 py-3 rounded-xl shadow-md text-center">
                      {s.note}
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="p-4 flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                  <p className="text-gray-600 text-sm">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Specialties;