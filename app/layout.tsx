import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ---------------- METADATA ----------------
export const metadata: Metadata = {
  metadataBase: new URL("https://nyota-clinic.vercel.app"),

  title: {
    default: "Nyota ya Asubuyi",
    template: "%s | Nyota ya Asubuyi",
  },

  description:
    "Excellence médicale, innovation et humanité au service de votre santé.",

  keywords: [
    "clinique",
    "santé",
    "médecin",
    "hôpital",
    "consultation",
    "Kinshasa",
    "Nyota ya Asubuyi",
  ],

  authors: [{ name: "Nyota ya Asubuyi Team" }],
  creator: "Nyota ya Asubuyi",
  publisher: "Nyota ya Asubuyi",

  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Nyota ya Asubuyi",
    description:
      "Excellence médicale, innovation et humanité au service de votre santé.",
    url: "https://nyota-clinic.vercel.app",
    siteName: "Nyota ya Asubuyi",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Nyota ya Asubuyi Clinic",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nyota ya Asubuyi",
    description:
      "Excellence médicale, innovation et humanité au service de votre santé.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "healthcare",
};

// ---------------- VIEWPORT (includes themeColor) ----------------
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

// ---------------- ROOT LAYOUT ----------------
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      > <UserProvider>

        {children}
      </UserProvider>
      </body>
    </html>
  );
}