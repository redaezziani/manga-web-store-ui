import MainPageLayout from "./ui/page-layout";
import MangaList from "./ui/manga-list";
import { Manga } from "@/types/manga";
// all text in the pages should be in Arabic
export default async function Home() {
  const res = await fetch("http://localhost:7000/api/v1/manga", {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  const mangas: Manga[] = data.data;

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
