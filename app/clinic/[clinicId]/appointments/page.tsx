"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import AppointmentForm from "@/components/AppointementForm";

export default function AppointmentsPage() {
  const params = useParams();
  const clinicIdParam = params?.clinicId;

  // Ensure clinicId is a single string
  const clinicId =
    Array.isArray(clinicIdParam) ? clinicIdParam[0] : clinicIdParam;

  if (!clinicId) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">Book Your Appointment</h1>
      <div className="w-full max-w-md">
        <AppointmentForm clinicId={clinicId} />
      </div>
    </div>
  );
}