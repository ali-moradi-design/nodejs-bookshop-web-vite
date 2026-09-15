import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18n } from '@/shared/i18n';
import { BookCard } from './book-card';
import type { Book } from '../model/types';
import type { ThemeName, ColorMode } from '@/shared/config';

const sample: Book = {
  id: 'story-1',
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
  description: 'A craftsman’s guide to software structure and design.',
  price: 42,
  currency: 'USD',
  stock: 5,
  coverImageUrl: undefined,
  categories: ['software', 'architecture'],
  featured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const qc = new QueryClient();

function ThemeDecorator({
  theme,
  mode,
  children,
}: {
  theme: ThemeName;
  mode: ColorMode;
  children: React.ReactNode;
}) {
  return (
    <div data-theme={theme} className={mode === 'dark' ? 'dark' : undefined}>
      <div className="bg-background p-6 text-foreground">
        <div className="max-w-[220px]">{children}</div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Entities/BookCard',
  component: BookCard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={qc}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    ),
  ],
  args: { book: sample },
} satisfies Meta<typeof BookCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const make = (theme: ThemeName, mode: ColorMode): Story => ({
  render: (args) => (
    <ThemeDecorator theme={theme} mode={mode}>
      <BookCard {...args} />
    </ThemeDecorator>
  ),
});

export const DefaultLight = make('default', 'light');
export const DefaultDark = make('default', 'dark');
export const DesertLight = make('desert', 'light');
export const DesertDark = make('desert', 'dark');
export const RosyLight = make('rosy', 'light');
export const RosyDark = make('rosy', 'dark');
