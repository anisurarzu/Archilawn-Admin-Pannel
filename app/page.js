"use client"; // Ensure this is uncommented for client-side rendering

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard/Dashboard";
import Image from "next/image"; // For rendering the logo image
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Logo Section */}
        <div className="mb-8">
          <Image
            src="/images/logo.png" // Replace with the actual logo path
            alt="Logo"
            width={150}
            height={150}
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold mb-4">Welcome to Our System</h1>

        {/* Heading Text */}
        <p className="text-lg mb-6">
          Want to join this system? Please login first.
        </p>

        {/* Login Button */}
        <Link href="/login"
           className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Login
          
        </Link>
      </div>
    </main>
  );
}
