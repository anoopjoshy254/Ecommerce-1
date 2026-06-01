export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: 'Buyer' | 'Seller';
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'Buyer' | 'Seller';
}
