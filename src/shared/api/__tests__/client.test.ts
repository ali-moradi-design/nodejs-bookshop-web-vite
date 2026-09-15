import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { apiGet, ApiError } from '../index';

describe('apiGet', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).includes('/books')) {
          return new Response(
            JSON.stringify({ data: [], meta: { page: 1, limit: 12, total: 0, pages: 0 } }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }
        return new Response(JSON.stringify({ message: 'Nope' }), { status: 500 });
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches books list smoke', async () => {
    const res = await apiGet<{ data: unknown[]; meta: unknown }>('/books', { q: 'x', limit: 8 });
    expect(Array.isArray(res.data)).toBe(true);
    expect(fetch).toHaveBeenCalled();
    const calledUrl = String((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(calledUrl).toContain('/api/v1/books');
    expect(calledUrl).toContain('q=x');
  });

  it('throws ApiError on failure', async () => {
    await expect(apiGet('/fail')).rejects.toBeInstanceOf(ApiError);
  });
});
