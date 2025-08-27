"use client";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface UserInfo {
  avatar: string;
  banned: boolean;
  color: number;
  discordid: string;
  firstjoin: number;
  lastseen: number;
  name: string;
  playtime: number;
  power: number;
  rank: string;
  scrapcoins: number;
  uid: string;
}

export function HeaderClient({ session }: { session: Session | null }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const decimalToHex = (decimal: number): string => {
    return `#${decimal.toString(16).padStart(6, '0')}`;
  };

  useEffect(() => {
    if (session) {
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/me');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserInfo(data.data);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
    }
  }, [session]);

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user?.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm">Log Out</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will sign you out of your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Link href="/api/auth/signout">Log Out</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {userInfo && !loading && (
            <div
              className="px-3 py-1 rounded-md text-sm font-medium"
              style={{
                backgroundColor: decimalToHex(userInfo.color) + '20',
                border: `1px solid ${decimalToHex(userInfo.color)}40`,
                color: decimalToHex(userInfo.color)
              }}
            >
              {userInfo.name}
            </div>
          )}
          
          {loading && (
            <div className="px-3 py-1 rounded-md text-sm font-medium bg-muted text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
