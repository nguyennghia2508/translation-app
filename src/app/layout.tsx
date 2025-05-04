import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientThemeProvider from "@/components/ClientThemeProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Translation App",
  description: "Vietnamese-English translation app with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
