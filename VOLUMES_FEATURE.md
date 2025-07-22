# Manga Volumes Listing Feature

## Overview
Added a new section to the manga details page that displays all available volumes for the same manga series.

## New Components

### 1. `useMangaVolumes` Hook
- **Location**: `src/hooks/use-manga-volumes.ts`
- **Purpose**: Fetches all volumes for a specific manga ID
- **API Endpoint**: `GET /api/v1/volumes?page=1&limit=20&mangaId={mangaId}`

### 2. `MangaVolumesList` Component
- **Location**: `src/components/manga/manga-volumes-list.tsx`
- **Purpose**: Displays a grid of volume cards for the same manga series
- **Features**:
  - Shows volume cover, number, price, and availability
  - Highlights the current volume being viewed
  - Add to cart functionality for each volume
  - Discount badges and stock information
  - Loading and error states
  - Responsive grid layout

### 3. Updated Types
- **Location**: `src/types/manga.ts`
- **Added**: 
  - `VolumeListResponse`
  - `VolumeListData`
  - `VolumeListItem`
  - `VolumeListManga`

## Integration
The `MangaVolumesList` component is integrated into the `MangaDetails` page at the bottom, after the preview images section.

## Features
- **Visual Indicators**: Current volume is highlighted with a border and badge
- **Cart Integration**: Users can add any available volume to their cart
- **Price Display**: Shows original price, discount, and final price
- **Stock Status**: Displays availability and stock count
- **Responsive Design**: Adapts to different screen sizes
- **Arabic RTL Support**: All text and layout supports Arabic language

## Usage
The component automatically appears on manga detail pages when there are multiple volumes available for the same manga series.

## API Response Format
```typescript
{
  success: boolean,
  message: string,
  data: {
    data: [
      {
        id: string,
        volumeNumber: number,
        price: number,
        discount: number,
        finalPrice: number,
        stock: number,
        coverImage: string,
        isAvailable: boolean,
        manga: {
          id: string,
          title: string,
          author: string,
          coverImage: string,
          isAvailable: boolean
        }
      }
    ],
    meta: {
      currentPage: number,
      itemsPerPage: number,
      totalItems: number,
      totalPages: number,
      hasNextPage: boolean,
      hasPreviousPage: boolean
    }
  }
}
```
