import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SessionProviderWrapper from "@/components/session-provider";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ChartProvider } from "@/components/charts/chart-provider";
import { Header } from "@/components/header/header";
import { UserProvider } from '@/contexts/user-context'
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "gRust Panel", template: "%s | Panel"},
  description: "An admin panel for gRust",
  authors: [{ name: "TuPiDAn", url: "https://tupidan.ru" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions());
  const pathname = (await headers()).get("x-current-path") ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          <UserProvider>
            <ChartProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {pathname.startsWith("/login") ? null : <Header />}
                {children}
                <Toaster />
              </ThemeProvider>
            </ChartProvider>
          </UserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
