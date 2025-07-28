"use client";

import MainPageLayout from "../ui/page-layout";
import { RotateCcw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useFilters } from "@/stores/use-filters";
import VolumeCard from "../ui/volume-card";

const statusList = ["مستمرة", "مكتملة"];
const typesList = ["مانجا", "مانهوا", "ويب تون"];

export default function FilterPage() {
  const {
    currentFilters,
    filterData,
    volumes,
    isLoading,
    resetFilters,
    setPriceRange,
    toggleAvailability,
    toggleInStock,
    updateFilters,
  } = useFilters();

  const [searchQuery, setSearchQuery] = useState(currentFilters.search || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentFilters.categories || []);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(currentFilters.isAvailable);
  const [inStock, setInStock] = useState(currentFilters.inStock);
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || 10);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || 3000);
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);
  
  const applyFilters = () => {
    updateFilters({
      search: searchQuery,
      categories: selectedGenres,
      isAvailable,
      inStock,
      minPrice,
      maxPrice,
    });
  };

  const toggleValue = (value: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const resetAll = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setIsAvailable(true);
    setInStock(true);
    setMinPrice(10);
    setMaxPrice(3000);
    resetFilters();
  };

  return (
    <MainPageLayout>
      <div className="flex w-full container mx-auto mt-10 flex-col min-h-[80vh] gap-6">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          <section className="col-span-1 flex flex-col gap-6 text-gray-600">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">تصفية المانجا</h2>
              {(selectedGenres.length || searchQuery) && (
                <Button variant="ghost" size="icon" onClick={resetAll}>
                  <RotateCcw size={16} />
                </Button>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 start-0 ps-3 flex items-center text-muted-foreground/80">
                <Search size={16} />
              </span>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 pe-9 bg-muted"
                placeholder="ابحث عن مانجا..."
                type="search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 end-0 w-9 flex items-center justify-center text-muted-foreground/80 hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">النوع</h4>
              <div className="flex flex-wrap gap-2">
                {filterData?.categories.map((genre) => (
                  <label key={genre.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedGenres.includes(genre.id)}
                      onCheckedChange={() => toggleValue(genre.id, selectedGenres, setSelectedGenres)}
                    />
                    <span className="text-sm">{genre.nameAr}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                المؤلفون
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterData?.authors.map((author) => (
                  <label key={author} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedAuthor.includes(author)}
                      onCheckedChange={() => toggleValue(author, selectedAuthor, setSelectedAuthor)}
                    />
                    <span className="text-sm">{author}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full flex justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-semibold mb-2">متاح</h4>
                <label className="flex items-center gap-2">
                  <Checkbox checked={isAvailable} onCheckedChange={() => setIsAvailable(!isAvailable)} />
                  <span className="text-sm">عرض المانجا المتاحة فقط</span>
                </label>
              </div>
              <div>
                <h4 className="font-semibold mb-2">في المخزون</h4>
                <label className="flex items-center gap-2">
                  <Checkbox checked={inStock} onCheckedChange={() => setInStock(!inStock)} />
                  <span className="text-sm">عرض المتوفر فقط</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">نطاق السعر</h4>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-1/2"
                  placeholder="أدنى سعر"
                />
                <Input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-1/2"
                  placeholder="أقصى سعر"
                />
              </div>
            </div>

            <Button className="w-full mt-4" onClick={applyFilters} disabled={isLoading}>
              {isLoading ? "...جاري التحميل" : "تطبيق الفلاتر"}
            </Button>
          </section>

          <div className="col-span-3  p-6 min-h-[40vh] flex items-center justify-center text-muted-foreground">
            {isLoading ? (
              <div className="text-center">...جاري التحميل</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                {volumes.map((volume) => (
                  <VolumeCard key={volume.id} data={volume} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
}