"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 mt-auto text-center">
      &copy; {new Date().getFullYear()} Clinic SaaS. All rights reserved.
    </footer>
  );
}