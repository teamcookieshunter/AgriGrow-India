import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary rounded-md p-2">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
    </div>
  );
}
