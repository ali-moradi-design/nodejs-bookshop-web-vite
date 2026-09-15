export const ORDER_STATUSES = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'failed',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  book: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Payment {
  method: 'fake';
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
  transactionId?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  subtotalAmount: number;
  discountCode?: string;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  payment: Payment;
  shippingAddress: ShippingAddress;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}
