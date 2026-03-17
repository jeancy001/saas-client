import { ReactNode } from "react";
import Navbar from "@/components/NavbarClinic";
import Footer from "@/components/FooterPage";

interface ClinicLayoutProps {
  children: ReactNode;
  params: Promise<{ clinicId: string }>;
}

export default async function ClinicLayout({
  children,
  params,
}: ClinicLayoutProps) {
  const { clinicId } = await params;

  const clinic = {
    name: `Clinic ${clinicId}`,
    logo:"/logo.png",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar advertisement="Follow us" clinicEmail="clinic@gmail.com" clinicPhone="+243 4848940000" logo={clinic.logo} clinicName={clinic.name} />
      <main className="flex-1 px-6 py-8 mt-16">{children}</main>
      <Footer />
    </div>
  );
}