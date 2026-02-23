import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PRAXIS",
  description: "Visual system maps for repositories and project files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-6 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
