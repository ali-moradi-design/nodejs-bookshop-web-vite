import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const alertVariants = cva('relative w-full rounded-lg border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive bg-destructive/5',
      success: 'border-emerald-500/40 text-emerald-800 dark:text-emerald-200 bg-emerald-500/5',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const Alert = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) => (
  <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
);
