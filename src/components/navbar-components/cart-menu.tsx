"use client"

import { ShoppingBasket, Minus, Plus, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCart } from "@/stores/use-cart"

export default function CartMenu() {
  const { 
    cart, 
    isLoading, 
    error, 
    removeFromCartByItemId, 
    updateQuantityByItemId, 
    clearCart,
    clearError,
    getTotalItems,
    isEmpty
  } = useCart()

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCartByItemId(cartItemId)
    } else {
      await updateQuantityByItemId(cartItemId, newQuantity)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    await removeFromCartByItemId(cartItemId)
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  const totalItems = getTotalItems()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="فتح السلة"
        >
          <ShoppingBasket size={16} aria-hidden="true" />
          {totalItems > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs text-white font-medium"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" min-w-80 md:w-96 p-1" align="end">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">سلة التسوق</div>
          {cart && cart.items.length > 0 && (
            <button
              className="text-xs font-medium hover:underline text-destructive"
              onClick={handleClearCart}
              disabled={isLoading}
            >
              إفراغ السلة
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        />
        
        {error && (
          <div className="px-3 py-2 text-sm text-destructive bg-destructive/10 rounded-md mx-2 mb-2">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-xs underline"
            >
              إخفاء
            </button>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : isEmpty ? (
            <div className="px-3 py-8 text-center text-muted-foreground">
              <ShoppingBasket size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">السلة فارغة</p>
            </div>
          ) : (
            <>
              {cart && cart.items.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-accent rounded-md px-3 py-3 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    {/* Volume Cover */}
                    <div className="relative w-12 h-16 rounded-md overflow-hidden border flex-shrink-0">
                      <Image
                        src={item.volume.coverImage}
                        alt={item.volume.manga.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {item.volume.manga.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            المجلد {item.volume.volumeNumber} • {item.volume.manga.author}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1"
                          disabled={isLoading}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      
                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">
                            {item.volume.finalPrice} درهم
                          </span>
                          {item.volume.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through ml-1">
                              {item.volume.price} درهم
                            </span>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent"
                            disabled={isLoading}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent"
                            disabled={isLoading || item.quantity >= item.volume.stock}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="text-right text-sm text-muted-foreground">
                        المجموع: <span className="font-medium text-foreground">{item.subtotal} درهم</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Cart Summary */}
              {cart && cart.summary && (
                <div className="px-3 py-3 bg-muted/30 rounded-md mx-2 mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{cart.summary.subtotal} درهم</span>
                  </div>
                  {cart.summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>إجمالي الخصم:</span>
                      <span>-{cart.summary.totalDiscount} درهم</span>
                    </div>
                  )}
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border h-px"
                  />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>المجموع الكلي:</span>
                    <span>{cart.summary.total} درهم</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button className="w-full mt-3" disabled={isLoading}>
                    إتمام الطلب ({cart.summary.uniqueItems} منتج)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
