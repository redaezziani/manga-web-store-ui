import { Metadata } from 'next';
import WishlistPage from './wishlist-page';

export const metadata: Metadata = {
  title: 'قائمة الأمنيات - Manga Arabic',
  description: 'عرض وإدارة قائمة الأمنيات الخاصة بك من المانغا المفضلة لديك',
};

export default function Page() {
  return <WishlistPage />;
}
