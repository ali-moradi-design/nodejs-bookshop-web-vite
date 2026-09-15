import { useEffect, useState } from 'react';
import { cn, resolveImageUrl } from '@/shared/lib';

const PLACEHOLDER = '/placeholder-book.svg';

type Props = {
  coverImageUrl?: string | null;
  alt: string;
  className?: string;
};

export function BookCoverImage({ coverImageUrl, alt, className }: Props) {
  const resolved = resolveImageUrl(coverImageUrl) || PLACEHOLDER;
  const [src, setSrc] = useState(resolved);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSrc(resolved);
    setLoaded(false);
  }, [resolved]);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setSrc(PLACEHOLDER);
        setLoaded(true);
      }}
      className={cn(
        'transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}
