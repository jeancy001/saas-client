"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  Home,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  ArrowLeft,
  RefreshCw,
  Search,
  Copy
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

interface Clinic {
  _id: string
  name: string
  email?: string
  phone?: string
  logo?: string
  clinicLink: string
}

export default function AdminClinicDashboard() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    logoFile: null as File | null, // local file
    logoUrl: "" // direct URL
  })

  const safeLogo = (logo?: string) => logo && logo.trim() !== "" ? logo : "/logo.png"

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      setLoading(true)
      const res = await api.get("clinic/")
      setClinics(res.data?.data || [])
    } catch (error) {
      console.error("Fetch clinics failed", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchClinics()
    setSearchQuery("")
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return

    try {
      setSubmitting(true)

      let logoData = form.logoUrl
      if (form.logoFile) {
        // convert local file to base64
        logoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = error => reject(error)
          reader.readAsDataURL(form.logoFile!)
        })
      }

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        logo: logoData
      }

      if (editingClinic) {
        const res = await api.put(`clinic/${editingClinic._id}`, payload)
        setClinics(prev =>
          prev.map(c => (c._id === editingClinic._id ? res.data.data : c))
        )
      } else {
        const res = await api.post("clinic/create", payload)
        setClinics(prev => [res.data.data, ...prev])
      }

      resetForm()
    } catch (error) {
      console.error("Save failed", error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", logoFile: null, logoUrl: "" })
    setEditingClinic(null)
    setModalOpen(false)
  }

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic)
    setForm({
      name: clinic.name || "",
      email: clinic.email || "",
      phone: clinic.phone || "",
      logoFile: null,
      logoUrl: clinic.logo || ""
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this clinic?")) return
    try {
      await api.delete(`clinic/${id}`)
      setClinics(prev => prev.filter(c => c._id !== id))
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setForm(prev => ({ ...prev, logoFile: e.target.files![0] }))
  }

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, logoUrl: e.target.value, logoFile: null }))
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  const filteredClinics = useMemo(() => {
    return clinics.filter(c =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [clinics, searchQuery])

  const previewLogo = form.logoFile ? URL.createObjectURL(form.logoFile) : form.logoUrl

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl flex flex-col border-r">
        <div className="p-6 flex items-center gap-3">
          <Users className="text-blue-600" />
          <span className="font-bold text-lg">Clinic Admin</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/">
            <motion.div whileHover={{ x: 4 }} className="nav-item">
              <Home size={18}/> Dashboard
            </motion.div>
          </Link>
          <button onClick={() => setModalOpen(true)}>
            <motion.div whileHover={{ x: 4 }} className="nav-item">
              <PlusCircle size={18}/> Add Clinic
            </motion.div>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clinics Management</h1>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleRefresh} className="btn">
              <RefreshCw size={16}/> Refresh
            </motion.button>
            <Link href="/">
              <motion.div whileTap={{ scale: 0.95 }} className="btn">
                <ArrowLeft size={16}/> Home
              </motion.div>
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg shadow">
          <Search className="text-gray-400"/>
          <input
            placeholder="Search clinic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Logo</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Link</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center p-6">Loading...</td></tr>
              ) : filteredClinics.length === 0 ? (
                <tr><td colSpan={4} className="text-center p-6 text-gray-500">No clinics found</td></tr>
              ) : (
                filteredClinics.map(c => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="relative w-10 h-10">
                        <Image src={safeLogo(c.logo)} alt={c.name} fill className="rounded-full object-cover"/>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link href={c.clinicLink} target="_blank" className="text-blue-600 underline">Visit</Link>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => copyLink(c.clinicLink)}><Copy size={16}/></motion.button>
                      </div>
                    </td>
                    <td className="p-3 flex gap-2">
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(c)} className="btn-yellow">
                        <Edit2 size={16}/> Edit
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(c._id)} className="btn-red">
                        <Trash2 size={16}/> Delete
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="modal">
                <h3 className="text-lg font-bold mb-4">{editingClinic ? "Edit Clinic" : "Add Clinic"}</h3>
                <div className="space-y-3">
                  <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input"/>
                  <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input"/>
                  <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input"/>
                  <input type="file" accept="image/*" onChange={handleLogoFileChange} className="input"/>
                  <input placeholder="Or paste Logo URL" value={form.logoUrl} onChange={handleLogoUrlChange} className="input"/>
                  {previewLogo && (
                    <div className="w-20 h-20 relative mt-2">
                      <Image src={previewLogo} alt="preview" fill className="rounded-full object-cover"/>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={resetForm} className="btn">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary">{submitting ? "Saving..." : "Save"}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .nav-item { display:flex; gap:10px; padding:10px; border-radius:8px; cursor:pointer }
        .btn { display:flex; gap:6px; align-items:center; background:#e5e7eb; padding:8px 12px; border-radius:8px }
        .btn-primary { background:#2563eb; color:white; padding:8px 12px; border-radius:8px }
        .btn-yellow { background:#facc15; padding:6px 10px; border-radius:6px }
        .btn-red { background:#ef4444; color:white; padding:6px 10px; border-radius:6px }
        .input { width:100%; padding:8px; border:1px solid #ddd; border-radius:6px }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center }
        .modal { background:white; padding:20px; border-radius:10px; width:350px }
      `}</style>
    </div>
  )
}