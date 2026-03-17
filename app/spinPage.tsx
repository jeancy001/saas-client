"use client";

import { useEffect } from "react";
import { FaClinicMedical } from "react-icons/fa";

interface SpinPageProps {
  onFinish: () => void;
}

export default function SpinPage({ onFinish }: SpinPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3000); // 3s spinner
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute w-32 h-32 bg-white/10 rounded-full animate-ping"></div>
          <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-2xl">
            <FaClinicMedical className="text-blue-600 text-4xl animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-white text-2xl font-semibold tracking-wide">
            Clinic System
          </h2>
          <p className="text-blue-100 text-sm mt-2 animate-pulse">
            Loading medical dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}