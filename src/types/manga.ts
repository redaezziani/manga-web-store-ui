export interface Root {
  success: boolean;
  message: string;
  data: Manga[];
  meta: Meta;
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  volumes: any[];
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VolumeRoot {
  success: boolean;
  message: string;
  data: VolumeData;
}

export interface VolumeData {
  id: string;
  volumeNumber: number;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  coverImage: any;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  manga: VolumeManga;
  previewImages: any[];
}

export interface VolumeManga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isAvailable: boolean;
  categories: Category[];
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  summary: CartSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  subtotal: number;
  volume: CartVolume;
  createdAt: string;
  updatedAt: string;
}

export interface CartVolume {
  id: string;
  volumeNumber: number;
  price: number;
  discount: number;
  stock: number;
  isAvailable: boolean;
  finalPrice: number;
  manga: CartManga;
  coverImage: string;
}

export interface CartManga {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

export interface CartSummary {
  totalItems: number;
  uniqueItems: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
}

export interface AddToCartRequest {
  volumeId: string;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

// Volume listing types
export interface VolumeListResponse {
  success: boolean;
  message: string;
  data: VolumeListData;
}

export interface VolumeListData {
  data: VolumeListItem[];
  meta: Meta;
}

export interface VolumeListItem {
  id: string;
  volumeNumber: number;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  coverImage: any;
  isAvailable: boolean;
  manga: VolumeListManga;
}

export interface VolumeListManga {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isAvailable: boolean;
}

// Wishlist types
export interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistData;
}

export interface WishlistData {
  items: WishlistItem[];
  totalCount: number;
}

export interface WishlistItem {
  id: string;
  createdAt: string;
  manga: WishlistManga;
  
}

export interface WishlistManga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isAvailable: boolean;
  volumeCount: number;
  minPrice: number;
  categories: WishlistCategory[];
}

export interface WishlistCategory {
  id: string;
  name: string;
  slug: string;
}

export interface WishlistCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface WishlistCheckResponse {
  success: boolean;
  message: string;
  data: {
    inWishlist: boolean;
  };
}

export interface AddToWishlistRequest {
  mangaId: string;
}

export interface RemoveFromWishlistRequest {
  mangaId: string;
}
