import type { Metadata } from "next";
<<<<<<< HEAD
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRAXIS",
  description: "Premium system intelligence maps for modern codebases.",
=======
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PRAXIS",
  description: "Visual system maps for repositories and project files.",
>>>>>>> codex/generate-next.js-project-structure-for-praxis
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-aurora min-h-screen`}>
        <div className="pointer-events-none fixed inset-0 opacity-70">
          <div className="absolute left-20 top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl animate-float" />
          <div className="absolute bottom-10 right-16 h-56 w-56 rounded-full bg-accentViolet/20 blur-3xl animate-float" />
        </div>
        <Navbar />
        <main className="relative z-10 mx-auto min-h-[calc(100vh-4rem)] max-w-[1500px] px-4 py-6 md:px-6">
=======
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-6 md:px-6">
>>>>>>> codex/generate-next.js-project-structure-for-praxis
          {children}
        </main>
      </body>
    </html>
  );
}
