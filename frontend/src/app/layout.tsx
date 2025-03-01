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
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <nav className="flex justify-center space-x-12 py-4">
              <Link href="/" className="text-green-800 hover:text-green-600 border-b-2 border-green-800">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">About</Link>
              <Link href="/categories" className="text-gray-700 hover:text-green-600">Categories</Link>
              <Link href="/search" className="text-gray-700 hover:text-green-600">Search</Link>
              <Link href="/forum" className="text-gray-700 hover:text-green-600">Forum</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-green-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            © 2025 Harvest For Good. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
