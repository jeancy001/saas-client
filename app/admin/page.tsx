"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Home, PlusCircle, Edit2, Trash2, Users, ArrowLeft, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo: string;
}

export default function AdminClinicDashboard() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", logo: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    // Simulate fetching from API
    const data: Clinic[] = [
      { id: "1", name: "Clinique Nyota", email: "info@nyota.com", phone: "123456789", logo: "/pills.png" },
      { id: "2", name: "Clinique Santé", email: "contact@sante.com", phone: "987654321", logo: "/pills.png" },
    ];
    setClinics(data);
  };

  const handleRefresh = () => {
    fetchClinics();
    setSearchQuery(""); // reset search
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return alert("Please fill all fields");

    if (editingClinic) {
      setClinics(prev =>
        prev.map(c => (c.id === editingClinic.id ? { ...c, ...form } : c))
      );
    } else {
      setClinics(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setForm({ name: "", email: "", phone: "", logo: "" });
    setEditingClinic(null);
    setModalOpen(false);
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setForm({ name: clinic.name, email: clinic.email, phone: clinic.phone, logo: clinic.logo });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this clinic?")) {
      setClinics(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.phone.includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                <Home className="w-5 h-5 text-blue-500" /> Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-3 w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <PlusCircle className="w-5 h-5 text-green-500" /> Add Clinic
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Clinics Management</h2>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" /> Refresh
            </button>
            <Link href="/" className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" /> Back to Home
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 rounded-lg outline-none transition"
          />
        </div>

        {/* Clinics Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Logo</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredClinics.map(clinic => (
                <tr key={clinic.id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 w-16 h-16">
                    <Image src={clinic.logo} alt={clinic.name} width={40} height={40} className="rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-2 font-medium">{clinic.name}</td>
                  <td className="px-4 py-2">{clinic.email}</td>
                  <td className="px-4 py-2">{clinic.phone}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(clinic)}
                      className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                    >
                      <Edit2 className="w-4 h-4 text-white" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(clinic.id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClinics.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No clinics found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600">{editingClinic ? "Edit Clinic" : "Add Clinic"}</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 rounded-lg outline-none transition"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 rounded-lg outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 rounded-lg outline-none transition"
                  />
                  <label className="flex flex-col gap-1 text-gray-600">
                    Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 rounded-lg outline-none transition"
                    />
                  </label>
                  {form.logo && (
                    <div className="mt-2 w-20 h-20">
                      <Image src={form.logo} alt="logo preview" width={80} height={80} className="rounded-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {editingClinic ? "Update" : "Add"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}