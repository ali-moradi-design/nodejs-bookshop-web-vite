import type { ReactNode } from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/shared/i18n';
import { LoveRating } from '../love-rating';

afterEach(() => cleanup());

function wrap(ui: ReactNode) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('LoveRating', () => {
  it('renders five hearts and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<LoveRating value={3} onChange={onChange} />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(radios[2].getAttribute('aria-checked')).toBe('true');

    await user.click(radios[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('is read-only without radio buttons', () => {
    const { container } = wrap(<LoveRating value={4} readOnly />);
    expect(within(container).queryAllByRole('radio')).toHaveLength(0);
    expect(within(container).getByRole('img')).toBeTruthy();
  });
});
