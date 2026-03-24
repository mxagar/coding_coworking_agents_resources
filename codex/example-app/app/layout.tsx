import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinyNotes",
  description: "TinyNotes route scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,231,235,0.18),_transparent_38%),linear-gradient(180deg,_rgba(240,253,250,0.96),_rgba(236,254,255,0.92))] text-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
