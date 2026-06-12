export interface Product {
  id: string;
  name: string;
  category: "Hoodie" | "Jacket" | "Shirt" | "Pants" | "Sneakers" | "Accessories" | string;
  size: "S" | "M" | "L" | "XL" | string;
  condition: "Like New" | "Very Good" | "Good" | string;
  price: number;
  originalPrice?: number;
  discount?: string; // e.g. "-20%"
  image: string;
  rating?: number;
  isFeatured?: boolean;
  brand?: string;
  // Seller and Approval properties
  sellerId?: string;
  sellerName?: string;
  isApproved?: boolean; // Must be approved by admin to show up on the landing page
  status?: "active" | "inactive" | "draft" | "posting"; 
  // Laundry / Cleanliness photos
  washPhoto?: string;
  perfumePhoto?: string;
  fullPhoto?: string;
  detailPhotos?: string[]; // Extra detail photos supported
  detailPhoto?: string;    // Direct detail photo string supported
  color?: string;
  description?: string;
  stock?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  sellerId: string; // can be "admin" for admin chat
  sellerName: string;
  buyerId: string; // can be seller/buyer id pointing to the user initiating
  buyerName: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface CategoryData {
  name: string;
  count: string;
  image: string;
}

export interface ProductFeedback {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  rating: number; // 1-5
  reviewText: string;
  createdAt: string;
  isApproved: boolean; // moderated by admin before appearing!
}

export type Page = 
  | "beranda" 
  | "produk" 
  | "cara-kerja" 
  | "tentang-kami" 
  | "detail"
  | "login"
  | "dashboard-buyer"
  | "dashboard-seller"
  | "dashboard-admin"
  | "cart"
  | "checkout"
  | "order-confirmation"
  | "toko";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "seller" | "admin";
  phoneNumber?: string;
  password?: string; // Admin can view user password
  // Seller specific info
  isApproved?: boolean; // seller needs admin approval to log in
  shopName?: string;
  shopDesc?: string;
  shopSlogan?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  bankBranch?: string;
  bankPhone?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  address: string;
  postalCode: string;
  courier: "JNE" | "JNT";
  items: {
    product: Product;
    quantity: number;
  }[];
  totalPrice: number;
  shippingCost: number;
  paymentMethod: "Direct Bank Transfer";
  sellerBankDetails: {
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    shopName: string;
  };
  status: "pending_payment" | "paid" | "shipped" | "completed" | "cancelled" | "packing" | "with_courier" | "in_transit";
  createdAt: string;
  paymentProof?: string;
}

export interface FilterState {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  categories: string[];
  sizes: string[];
  conditions: string[];
  sortBy: "newest" | "price-low" | "price-high";
}
