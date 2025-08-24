"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import type { Session } from "next-auth";

export default function ClientSessionProvider({ 
  children,
  session
}: { 
  children: ReactNode;
  session?: Session | null;
}) {
  return <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>{children}</SessionProvider>;
}