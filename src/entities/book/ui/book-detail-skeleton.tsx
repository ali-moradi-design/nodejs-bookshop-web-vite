import { Skeleton } from '@/shared/ui';

export function BookDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}
