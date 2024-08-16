// app/home/page.tsx (or page.js)
"use client"; // Ensure this is uncommented for client-side rendering

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
  const router = useRouter();

  /*  useEffect(() => {
    // Redirect to login page
    router.push("/login");
  }, [router]); */

  return (
    <main>
      {/* Optionally render components or placeholders */} <Dashboard />{" "}
    </main>
  );
}
