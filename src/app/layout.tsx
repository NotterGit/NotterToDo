import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { APP_DESCRIPTION, APP_NAME } from "@/config/const/app.const";
import { images } from "@/config/const/image.const";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkThemeProvider } from "@/components/providers/clerk-theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: "%s | ToDo",
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: images.ICON,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className={`antialiased h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <QueryProvider>
              <ToasterProvider />
              <ModalProvider/>
              {children}
            </QueryProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
