export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productDescription: string;
  quantity: number;
  price: number;
  imageUrl: string;
  subTotal: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  cartItemId: number;
  quantity: number;
}
