import MainPageLayout from "./ui/page-layout";
import VolumeList from "./ui/volumes-list";

export interface Manga {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isAvailable: boolean;
  description: string;
}

export interface Volume {
  id: string;
  volumeNumber: number;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  coverImage?: string;
  isAvailable: boolean;
  manga: Manga;
}

// ✅ Helper function to fetch latest volumes
async function getLatestVolumes(): Promise<Volume[]> {
  const res = await fetch("http://localhost:7000/api/v1/volumes?page=1&limit=10", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("فشل تحميل أحدث المانجا");
  const data = await res.json();
  return data.data.data;
}

// ✅ Helper function to fetch most ordered volumes
async function getMostOrderedVolumes(): Promise<Volume[]> {
  const res = await fetch("http://localhost:7000/api/v1/volumes/most-ordered?limit=10", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("فشل تحميل المانجا الأكثر طلباً");
  const data = await res.json();
  return data.data;
}

async function getLowStockVolumes(): Promise<Volume[]> {
  const res = await fetch("http://localhost:7000/api/v1/volumes/low-stock?limit=10", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("فشل تحميل المجلدات منخفضة المخزون");
  const data = await res.json();
  return data.data;
}


// ✅ Main page
export default async function Home() {
  const [latestVolumes, mostOrderedVolumes, lowStockVolumes] = await Promise.all([
    getLatestVolumes(),
    getMostOrderedVolumes(),
    getLowStockVolumes(),
  ]);

 

  return (
    <MainPageLayout>
      <VolumeList
        title="أحدث المانجا"
        mangas={latestVolumes}
        isLoading={false}
        skeletonCount={7}
      />
      <VolumeList
        title="المانجا الأكثر طلباً"
        mangas={mostOrderedVolumes}
        isLoading={false}
        skeletonCount={7}
      />

      <VolumeList
        title="المانجا منخفضة المخزون"
        mangas={lowStockVolumes}
        isLoading={false}
        skeletonCount={7}
      />
    </MainPageLayout>
  );
}
