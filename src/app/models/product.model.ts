export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
}

export interface UploadImageResponse {
  imageUrl: string;
}
