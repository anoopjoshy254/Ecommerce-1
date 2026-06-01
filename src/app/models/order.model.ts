export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface Order {
  id: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderDate: string;
  firstItemName?: string;
  firstItemImageUrl?: string;
  totalItems?: number;
  shippingAddress?: string;
  buyerId?: number;
  customerName?: string;
  items?: OrderItem[];
}

export interface SellerOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  orderDate: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  imageUrl?: string;
}

export interface OrderDetails {
  order: Order;
  items: OrderItem[];
}

export interface CheckoutRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  message: string;
  orderId: number;
  totalAmount: number;
}

export interface VerifyPaymentRequest {
  orderId: number;
  transactionId: string;
}

export interface VerifyPaymentResponse {
  message: string;
  paymentId: string;
}

export interface TrackOrderResponse {
  id: number;
  orderStatus: OrderStatus;
  orderDate: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}
