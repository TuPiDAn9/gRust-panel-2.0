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
import { JwtStatusProvider } from "@/components/jwt-status-provider";
import { JwtGuard } from "@/components/jwt-guard";
import { headers } from "next/headers";
import Script from "next/script";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProviderWrapper session={session}>
          <UserProvider>
            <JwtStatusProvider>
              <ChartProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {pathname.startsWith("/login") ? null : <Header />}
                  <main className="flex-1">
                    <JwtGuard>
                      {children}
                    </JwtGuard>
                  </main>
                  <Toaster />
                </ThemeProvider>
              </ChartProvider>
            </JwtStatusProvider>
          </UserProvider>
        </SessionProviderWrapper>
        <Script src="/script.js" data-website-id="c362f60a-8025-42a8-a758-9c0f7e33c2e1" />
      </body>
    </html>
  );
}
