'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function HeaderBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
      <ArrowLeft />
      <span className="sr-only">Back</span>
    </Button>
  );
}
