import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib';

export const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn('h-5 w-5 animate-spin text-muted-foreground', className)} />
);

export const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>
);
