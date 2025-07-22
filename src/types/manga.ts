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
  coverImage: string;
  isAvailable: boolean;
  categories: Category[];
}
