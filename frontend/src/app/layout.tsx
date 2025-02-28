import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harvest For Good",
  description: "Academic Research Repository",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-blue-800">
                Harvest For Good
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                <Link href="/research" className="text-gray-700 hover:text-blue-600">Research</Link>
                <Link href="/forums" className="text-gray-700 hover:text-blue-600">Forums</Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="min-h-screen py-8 px-4 md:px-8">
          {children}
        </main>
        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© 2024 Harvest For Good. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
