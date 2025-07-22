# Cart System Documentation

This cart system provides a complete shopping cart functionality for the manga web store. It includes state management with Zustand, API integration, and a user-friendly interface.

## Features

### 🛒 Cart Management
- Add items to cart with quantity selection
- Update item quantities
- Remove individual items
- Clear entire cart
- Persistent cart state

### 🎨 UI Components
- **CartMenu**: Dropdown cart interface similar to NotificationMenu
- **Quantity Controls**: Plus/minus buttons for quantity adjustment
- **Cart Summary**: Shows totals, discounts, and item counts
- **Loading States**: Visual feedback during API operations

### 🔄 State Management
- **Zustand Store**: `useCartStore` for global cart state
- **Custom Hook**: `useCart` for easier component integration
- **Auto-refresh**: Cart updates automatically after operations

## API Integration

### Endpoints
- `GET /api/v1/cart` - Fetch user's cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update item quantity
- `DELETE /api/v1/cart/remove/:volumeId` - Remove item
- `DELETE /api/v1/cart/clear` - Clear entire cart

### Request/Response Types
```typescript
interface AddToCartRequest {
  volumeId: string;
  quantity: number;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}
```

## Usage Examples

### Adding to Cart (in MangaDetails)
```typescript
const { addToCart, isLoading } = useCart();

const handleAddToCart = async () => {
  await addToCart({
    volumeId: volume.id,
    quantity: quantity
  });
};
```

### Cart Menu (in Header)
```typescript
import CartMenu from "@/components/navbar-components/cart-menu";

// In header component
<CartMenu />
```

### Using Cart Data
```typescript
const { 
  cart, 
  getTotalItems, 
  getTotalPrice, 
  isInCart,
  isEmpty 
} = useCart();
```

## Files Structure

```
src/
├── stores/
│   ├── cart-store.ts        # Zustand store
│   └── use-cart.ts          # Custom hook
├── components/navbar-components/
│   └── cart-menu.tsx        # Cart dropdown component
├── types/
│   └── manga.ts            # Cart-related types
└── app/manga/ui/
    └── manga-details.tsx   # Add to cart integration
```

## Cart Data Structure

```json
{
  "id": "cart-id",
  "userId": "user-id", 
  "items": [
    {
      "id": "item-id",
      "quantity": 2,
      "subtotal": 17.98,
      "volume": {
        "id": "volume-id",
        "volumeNumber": 1,
        "price": 9.99,
        "finalPrice": 8.99,
        "manga": {
          "title": "One Piece",
          "author": "Eiichiro Oda",
          "coverImage": "https://..."
        }
      }
    }
  ],
  "summary": {
    "totalItems": 3,
    "uniqueItems": 2, 
    "subtotal": 29.97,
    "totalDiscount": 2.99,
    "total": 26.98
  }
}
```

## Design Features

- **Arabic RTL Support**: Text direction and layout
- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Spinners and disabled states
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and semantic HTML
- **Visual Feedback**: Hover states and transitions

## Integration Points

1. **Header**: Cart icon with item count badge
2. **Product Details**: Add to cart with quantity selector
3. **Global State**: Shared across all components
4. **API Layer**: RESTful endpoints for all operations
