export interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
  expiryDate: string;
  isActive: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  amount: number;
}

export interface ValidateCouponResponse {
  discount: number;
  finalAmount: number;
}

export interface CreateCouponRequest {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
  expiryDate: string;
  isActive: boolean;
}
