import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/components/providers/toaster-provider";

const inter = Inter({subsets:['latin'], variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Notter ToDo",
    template: "%s | ToDo",
  },
  description: "Make task, make plan, make To, make Do. This - is Notter ToDo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className={`antialiased h-full`}>
        <ClerkProvider>
          <ToasterProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
