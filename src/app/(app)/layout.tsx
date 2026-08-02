'use client';
import AgriBotWidget from '@/components/agribot-widget';
import Logo from '@/components/Logo';
import SidebarNav from '@/components/SidebarNav';
import UserNav from '@/components/UserNav';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarProvider,
  SidebarClose,
} from '@/components/ui/sidebar';
import { getTranslations, type Locale } from '@/app/lib/translations';
import { Button } from '@/components/ui/button';
import { PanelLeft, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeaderBackButton from '@/components/header-back-button';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [lang, setLang] = useState<Locale>('en');

  useEffect(() => {
    const userLang = getCookie('userLanguage') as Locale | undefined;
    if (userLang) {
      setLang(userLang);
    }
  }, []);
  
  const t = getTranslations(lang);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-end">
            <SidebarClose>
              <PanelLeft />
            </SidebarClose>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav t={t} />
          </SidebarContent>
          <SidebarFooter>{/* UserNav can be moved here on desktop if desired */}</SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                  <PanelLeft />
              </SidebarTrigger>
              <HeaderBackButton />
              <Logo />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-sm text-foreground">AgriGrow</span>
                <span className="font-bold text-sm text-foreground">India</span>
              </div>
            </div>
             <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/settings">
                  <Settings />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
              <UserNav t={t} />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
          <AgriBotWidget t={t} />
        </div>
      </div>
    </SidebarProvider>
  );
}
