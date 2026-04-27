"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Edit3,
  Save,
  Calendar,
  Globe,
  BadgeCheck,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Profile
          </h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 md:p-10"
        >
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
              {user?.lastname?.charAt(0) || "A"}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">
                {user?.email || "Admin User"}
              </h2>

              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Shield size={16} /> {user?.role || "Administrator"}
              </p>

              <p className="text-sm text-green-600 flex items-center justify-center md:justify-start gap-2 mt-2">
                <BadgeCheck size={16} /> Verified Admin
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InfoField icon={<User />} label="Username" value={user?.lastname} isEditing={isEditing} />

            <InfoField icon={<Mail />} label="Email" value={user?.email} isEditing={isEditing} />

            <InfoField icon={<Phone />} label="Phone" value={user?.phone} isEditing={isEditing} />

            <InfoField icon={<MapPin />} label="City" value={user?.city} isEditing={isEditing} />

            <InfoField icon={<Globe />} label="Country" value={user?.country} isEditing={isEditing} />

            <InfoField icon={<Shield />} label="Role" value={user?.role} isEditing={false} />

            <InfoField icon={<Calendar />} label="Joined" value={user?.createdAt || "—"} isEditing={false} />

          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Field */
function InfoField({
  icon,
  label,
  value,
  isEditing,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isEditing?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
      <div className="text-blue-600 mt-1">{icon}</div>

      <div className="w-full">
        <p className="text-sm text-gray-500">{label}</p>

        {isEditing ? (
          <input
            defaultValue={value}
            className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800">{value || "-"}</p>
        )}
      </div>
    </div>
  );
}