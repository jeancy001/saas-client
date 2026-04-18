import { ReactNode } from "react";
import Navbar from "@/components/NavbarClinic";
import Footer from "@/components/FooterPage";

interface ClinicLayoutProps {
  children: ReactNode;
  params: Promise<{
    clinicId: string;
  }>;
}

export default async function ClinicLayout({
  children,
  params,
}: ClinicLayoutProps) {

  const { clinicId } = await params;

  let clinic: any = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clinic/clinic-link/${clinicId}`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const json = await res.json();
      clinic = json?.data ?? null;
    } else {
      console.warn("⚠️ API returned:", res.status);
    }
  } catch (error) {
    console.error("❌ Fetch failed:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">

      <Navbar
        advertisement="Follow us"
        clinicId={clinicId}
      />

      {/* FULL WIDTH CONTENT */}
      <main className="flex-1 w-full mt-16">
        {children}
      </main>

      <Footer />

    </div>
  );
}