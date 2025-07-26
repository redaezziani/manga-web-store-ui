import MainPageLayout from "./ui/page-layout";
import MangaList from "./ui/volumes-list";




export interface Manga {
  id: string
  title: string
  author: string
  coverImage: string
  isAvailable: boolean
  description: string
}

export interface Volume {
  id: string
  volumeNumber: number
  price: number
  discount: number
  finalPrice: number
  stock: number
  coverImage?: string
  isAvailable: boolean
  manga: Manga
}
// all text in the pages should be in Arabic
export default async function Home() {
  const res = await fetch("http://192.168.100.108:7000/api/v1/volumes?page=1&limit=10", {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  const mangas: Volume[] = data.data.data;

  return (
    <MainPageLayout>

      <MangaList
        title="أحدث المانجا"
        mangas={mangas}
        isLoading={false}
        skeletonCount={7}
      />


    </MainPageLayout>
  );
}
