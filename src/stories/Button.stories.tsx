import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/shared/ui';

const meta = {
  title: 'Shared/Button',
  component: Button,
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
