export interface UserProfile {
  message: string;
}

export interface WishlistItem {
  wishlistId: number;
  productId: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}
