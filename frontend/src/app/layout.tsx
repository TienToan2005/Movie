import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from '@/context/SettingsContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOANMOVIE | Phim hay | Phim HD | Xem phim Online",
  description: "WEB CUA TOAN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}