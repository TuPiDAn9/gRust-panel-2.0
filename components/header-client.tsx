"use client";
import { Session } from "next-auth";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser } from '@/contexts/user-context';

export function HeaderClient({ session }: { session: Session | null }) {
  const { userInfo, loading } = useUser();

  const decimalToHex = (decimal: number): string => {
    return `#${decimal.toString(16).padStart(6, '0')}`;
  };

  if (!session) {
    return (
      <Button variant="outline" size="sm" asChild className="text-xs md:text-sm">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
              unoptimized
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name || 'User'}
              </p>
              {userInfo && (
                <p className="text-xs leading-none text-muted-foreground">
                  {userInfo.rank}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
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
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
          className="px-2 py-1 rounded-md text-xs font-medium border hidden lg:block"
          style={{
            backgroundColor: decimalToHex(userInfo.color) + '20',
            borderColor: decimalToHex(userInfo.color) + '40',
            color: decimalToHex(userInfo.color)
          }}
        >
          {userInfo.name}
        </div>
      )}
    </div>
  );
}
