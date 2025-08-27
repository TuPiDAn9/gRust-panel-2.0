import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth";
import { HeaderClient } from "@/components/header-client";
import { HeaderNavigation } from "@/components/header-navigation";
import { LogoSpinner } from "@/components/logo-spinner";

export async function Header() {
  const session = await getServerSession(authOptions());

  return (
    <header className="border-b">
      <div className="grid grid-cols-3 h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <LogoSpinner />
        </div>
        
        <div className="flex justify-center">
          {session && <HeaderNavigation />}
        </div>
        
        <div className="flex justify-end">
          <HeaderClient session={session} />
        </div>
      </div>
    </header>
  );
}
