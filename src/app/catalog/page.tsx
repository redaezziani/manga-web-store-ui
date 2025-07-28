"use client";

import MainPageLayout from "../ui/page-layout";
import { RotateCcw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const genresList = ["أكشن", "دراما", "رعب", "رومانسي"];
const statusList = ["مستمرة", "مكتملة"];
const typesList = ["مانجا", "مانهوا", "ويب تون"];

export default function FilterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const updateFiltersInURL = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (selectedStatuses.length) params.set("statuses", selectedStatuses.join(","));
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));

    router.push(`/catalog?${params.toString()}`);
  };

  const toggleValue = (value: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedStatuses([]);
    setSelectedTypes([]);
    router.push("/catalog");
  };

  return (
    <MainPageLayout>
      <div className="flex w-full container mx-auto mt-10 flex-col min-h-[80vh] gap-6">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sidebar Filters */}
          <section className="col-span-1 flex flex-col gap-6 text-gray-600">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">تصفية المانجا</h2>
              {(selectedGenres.length || selectedStatuses.length || selectedTypes.length || searchQuery) && (
                <Button variant="ghost" size="icon" onClick={resetFilters}>
                  <RotateCcw size={16} />
                </Button>
              )}
            </div>

            {/* Search */}
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

            {/* Genres */}
            <div>
              <h4 className="font-semibold mb-2">النوع</h4>
              <div className="flex flex-wrap gap-2">
                {genresList.map((genre) => (
                  <label key={genre} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => toggleValue(genre, selectedGenres, setSelectedGenres)}
                      id={`genre-${genre}`}
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-semibold mb-2">الحالة</h4>
              <div className="flex flex-wrap gap-2">
                {statusList.map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleValue(status, selectedStatuses, setSelectedStatuses)}
                      id={`status-${status}`}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Types */}
            <div>
              <h4 className="font-semibold mb-2">نوع النشر</h4>
              <div className="flex flex-wrap gap-2">
                {typesList.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleValue(type, selectedTypes, setSelectedTypes)}
                      id={`type-${type}`}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button className="w-full mt-4" onClick={updateFiltersInURL}>
              تطبيق الفلاتر
            </Button>
          </section>

          {/* Manga Results Placeholder */}
          <div className="col-span-3 border rounded-xl p-6 min-h-[40vh] flex items-center justify-center text-muted-foreground">
            النتائج ستظهر هنا...
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
}
