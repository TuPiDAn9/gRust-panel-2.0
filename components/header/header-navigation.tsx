"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { House, Users, Shield, ShieldCheck, FileText, ClipboardList, Menu, X } from 'lucide-react';
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
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {}
      <nav className="hidden md:flex items-center gap-2">
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
              <Link href={href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {}
      <div className="md:hidden" ref={menuRef}>
        {}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            className="px-4 py-2 min-w-[48px] h-10" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {}
        {mobileMenuOpen && session && (
          <div className="absolute left-0 right-0 top-full bg-background border-b shadow-lg z-40 animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto p-4">
              <nav className="grid grid-cols-2 gap-2">
                {navigationItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Button
                      key={href}
                      variant="ghost"
                      size="sm"
                      asChild
                      className={cn(
                        "justify-start h-12",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={href} className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
