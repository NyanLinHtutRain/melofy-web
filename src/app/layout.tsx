// src/app/layout.tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../styles/index.css"; // Ensure this path is correct and imports your global styles
import { Providers } from "./providers"; // Your existing ThemeProvider
import NextAuthSessionProvider from "./NextAuthSessionProvider"; // Your NextAuth session provider

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning><head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <NextAuthSessionProvider>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </NextAuthSessionProvider>
        </Providers>
      </body>
    </html>
  );
}