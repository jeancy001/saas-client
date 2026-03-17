"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/NavSaasbar"
import { Clinic } from "@/types/clinics"
import { getClinics } from "@/lib/api"

export default function HomePage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getClinics()
        setClinics(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = clinics.filter((clinic) =>
    `${clinic.name} ${clinic.clinicId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <main className="px-6 py-20 max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-700 mb-4">
            Gestion Moderne de votre Clinique
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto">
            Une plateforme SaaS moderne pour gérer les patients,
            les rendez-vous et les dossiers médicaux de votre clinique.
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-14">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une clinique..."
            className="w-full max-w-xl px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm transition"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Chargement...</p>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((clinic) => (
            <div
              key={clinic._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <img
                src={clinic.logo}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                {clinic.name}
              </h3>

              <p className="text-sm text-blue-600 mt-1">
                {clinic.clinicId}
              </p>

              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                Ouvrir
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}