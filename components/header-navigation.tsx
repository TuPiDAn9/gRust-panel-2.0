'use client';

import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { House, Users, Shield, ShieldCheck, FileText, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', icon: House, label: 'Dashboard' },
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/bans', icon: Shield, label: 'Bans' },
  { href: '/unbans', icon: ShieldCheck, label: 'Unbans' },
  { href: '/logs', icon: FileText, label: 'Logs' },
  { href: '/applications', icon: ClipboardList, label: 'Applications' },
];

export function HeaderNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {navigationItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        
        return (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            <Link href={href}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
