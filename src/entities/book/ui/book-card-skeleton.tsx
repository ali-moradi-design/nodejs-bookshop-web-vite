import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@/shared/ui';

export function BookCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <CardHeader className="space-y-2 p-4 pb-2">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 p-4 pt-0">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-20" />
      </CardFooter>
    </Card>
  );
}
