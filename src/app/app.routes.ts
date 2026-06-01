import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { sellerGuard } from './guards/seller.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Buyer Pages
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payment-gateway/:id',
    loadComponent: () => import('./pages/payment-gateway/payment-gateway.component').then(m => m.PaymentGatewayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-success/:id',
    loadComponent: () => import('./pages/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./pages/order-details/order-details.component').then(m => m.OrderDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'track-order/:id',
    loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },

  // Seller Pages
  {
    path: 'seller/dashboard',
    loadComponent: () => import('./pages/seller/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/products',
    loadComponent: () => import('./pages/seller/seller-products/seller-products.component').then(m => m.SellerProductsComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/products/add',
    loadComponent: () => import('./pages/seller/add-product/add-product.component').then(m => m.AddProductComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/products/edit/:id',
    loadComponent: () => import('./pages/seller/edit-product/edit-product.component').then(m => m.EditProductComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/orders',
    loadComponent: () => import('./pages/seller/seller-orders/seller-orders.component').then(m => m.SellerOrdersComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/orders/:id',
    loadComponent: () => import('./pages/seller/seller-order-details/seller-order-details.component').then(m => m.SellerOrderDetailsComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/coupons',
    loadComponent: () => import('./pages/seller/coupons/coupons.component').then(m => m.CouponsComponent),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/analytics',
    loadComponent: () => import('./pages/seller/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [sellerGuard]
  },

  { path: '**', redirectTo: 'home' }
];