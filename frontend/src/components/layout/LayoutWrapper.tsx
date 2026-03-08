"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center w-full px-4 md:px-10 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
