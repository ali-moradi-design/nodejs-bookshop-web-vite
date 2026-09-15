export const formatMoney = (amount: number, currency = 'USD', locale = 'en'): string => {
  try {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

export const formatDate = (value: string | Date, locale = 'en'): string => {
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};

export const resolveImageUrl = (url?: string | null, apiBase?: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = (apiBase || import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(
    /\/$/,
    '',
  );
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};
