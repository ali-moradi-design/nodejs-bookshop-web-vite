import { cn } from '@/shared/lib';
import { Button, type ButtonProps } from './button';

/** Minimal Kokonut-style accent button (registry: @kokonutui). */
export function KokonutButton({ className, variant, ...props }: ButtonProps) {
  const isPrimary = variant === undefined || variant === 'default';
  return (
    <Button
      variant={variant}
      className={cn(
        'relative overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        isPrimary && 'text-white',
        className,
      )}
      {...props}
    />
  );
}
