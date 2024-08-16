"use client"; // Ensure this is uncommented for client-side rendering

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard/Dashboard";
import Image from "next/image"; // For rendering the logo image
import Link from "next/link";
import Login from "@/components/Login/Login";

export default function Home() {
  const router = useRouter();

  return (
    <main className="">
      <Login />
    </main>
  );
}
