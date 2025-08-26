"use client";

import { Session } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function HeaderClient({ session }: { session: Session | null }) {
  return (
    <div className="flex items-center gap-4">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="h-10 w-10 rounded-full"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{session.user?.name || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/api/auth/signout">Sign Out</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
