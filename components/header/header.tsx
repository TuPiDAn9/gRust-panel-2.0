import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth";
import { HeaderClient } from "@/components/header/header-client";
import { HeaderNavigation } from "@/components/header/header-navigation";
import { LogoSpinner } from "@/components/logo-spinner";

export async function Header() {
  const session = await getServerSession(authOptions());
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="flex h-14 md:h-16 items-center justify-between px-4 relative">
        <div className="flex items-center gap-2">
          <LogoSpinner />
        </div>
        
        {}
        <div className="hidden md:flex justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {session && <HeaderNavigation />}
        </div>
        
        {}
        <div className="md:hidden">
          <HeaderNavigation />
        </div>
        
        <HeaderClient session={session} />
      </div>
    </header>
  );
}
