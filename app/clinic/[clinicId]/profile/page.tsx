"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Edit3,
  Save,
  Camera,
  Building2,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

export default function ProfilePage() {
  const { user, loading, updateProfile } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    phone: "",
    city: "",
    country: "",
    clinic: "",
    profileUrl: "",
  });

  // ✅ Sync user → local state
  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
        profileUrl: user.profileUrl || "",
        clinic: user.clinicId|| user.clinicId || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSave = async () => {
  try {
    setSaving(true);

    const formData = new FormData();

    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("role", profile.role);
    formData.append("phone", profile.phone);
    formData.append("city", profile.city);
    formData.append("country", profile.country);
    formData.append("clinic", profile.clinic);
    formData.append("profileUrl", profile.profileUrl);

    await updateProfile(formData); // ✅ FIXED

    setIsEditing(false);
  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditing ? "Editing" : "Edit"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                  {profile.username?.charAt(0) || "U"}
                </div>

                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow">
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                {profile.username || "No name"}
              </h2>

              <p className="text-gray-500">{profile.role || "User"}</p>

              <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                <Building2 size={16} />
                {profile.clinic || "No clinic"}
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h2 className="text-lg font-semibold mb-6">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {/* USERNAME */}
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 py-3 border rounded-xl disabled:bg-gray-50"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 py-3 border rounded-xl disabled:bg-gray-50"
                />
              </div>

              {/* PHONE */}
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 py-3 border rounded-xl disabled:bg-gray-50"
                />
              </div>

              {/* ROLE */}
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="role"
                  value={profile.role}
                  disabled
                  className="w-full pl-10 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              {/* CITY */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 py-3 border rounded-xl disabled:bg-gray-50"
                />
              </div>

              {/* COUNTRY */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 py-3 border rounded-xl disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-xl"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}