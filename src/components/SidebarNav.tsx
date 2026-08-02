'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  Store,
  Landmark,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import type { Translations } from '@/app/lib/translations';

interface SidebarNavProps {
  t: Translations;
}

export default function SidebarNav({ t }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { href: '/profile', label: t.nav_my_projects, icon: User },
    { href: '/farming', label: t.nav_start_farming, icon: Sprout },
    { href: '/crop-analysis', label: t.nav_crop_analysis, icon: ScanLine },
    { href: '/market', label: t.nav_marketplace, icon: Store },
    { href: '/schemes', label: t.nav_govt_schemes, icon: Landmark },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
