import type { Metadata } from "next";
import localFont from "next/font/local";
const uiFont = localFont({ src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2", variable: "--font-ui", display: "swap" });
const codeFont = localFont({ src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2", variable: "--font-code", display: "swap" });
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "EvalForge — Code review practice",
  description:
    "Practice reviewing AI-generated code. Build independent judgment through evidence and reference feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${uiFont.variable} ${codeFont.variable}`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AuthProvider>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
