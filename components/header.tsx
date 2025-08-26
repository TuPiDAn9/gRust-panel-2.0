import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth";
import { HeaderClient } from "@/components/header-client";
import Link from 'next/link';

export async function Header() {
    const session = await getServerSession(authOptions());
  
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/logo.png" alt="gRust Panel" width={50} height={50} className="cursor-pointer" />
          </Link>
        </div>
        <HeaderClient session={session} />
      </div>
    </header>
  );
}