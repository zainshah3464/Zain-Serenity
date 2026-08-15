"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomePage = pathname === "/"; // ✅ added missing definition
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      
       <main className={`flex-1 ${isHomePage ? "" : "pt-16 md:pt-20"}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}