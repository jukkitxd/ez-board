import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { inter } from "@/lib/fonts"
// import { Navbar } from "@/components/navbar" // Navbar ถูกลบออกในเวอร์ชันนี้

export const metadata: Metadata = {
  title: "กระดานสูตรอาหาร",
  description: "ระบบกระดานข่าวสำหรับแบ่งปันสูตรอาหาร",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* <Navbar /> */} {/* Navbar ถูกลบออกในเวอร์ชันนี้ */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
