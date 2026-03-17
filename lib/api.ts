
import { Clinic } from "@/types/clinics"

export async function getClinics(): Promise<Clinic[]> {
  const res = await fetch("/api/clinics")

  if (!res.ok) {
    throw new Error("Failed to fetch clinics")
  }

  return res.json()
}