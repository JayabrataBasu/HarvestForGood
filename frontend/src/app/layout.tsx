export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
// Fix import path based on where the context actually exists
import { AuthProvider } from "@/contexts/AuthContext"; // Use relative path to the correct location
import React from "react";

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
  description: "A community platform for sustainable food systems",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <header className="bg-green-700 text-white">
            <div className="container mx-auto py-4 px-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                  Harvest For Good
                </Link>
                <nav>
                  <ul className="flex space-x-6">
                    <li>
                      <Link href="/" className="hover:text-green-200">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-green-200">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/categories" className="hover:text-green-200">
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link href="/search" className="hover:text-green-200">
                        Search
                      </Link>
                    </li>
                    <li>
                      <Link href="/forums" className="hover:text-green-200">
                        Forums
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
        </AuthProvider>
        <footer className="bg-green-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-bold">Harvest For Good</h2>
                <p className="mt-2">Sustainable farming for the global south</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                <ul>
                  <li>
                    <a href="#" className="hover:text-green-300">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-300">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-300">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-green-700 pt-4">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Harvest For Good. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
