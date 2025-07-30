"use client"

import { ShoppingBasket, Minus, Plus, X, ArrowLeft, Package } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCart } from "@/stores/use-cart"
import { useAuth } from "@/stores/use-auth"

interface CreateOrderDto {
  shippingAddress: string;
  city: string;
  phoneNumber: string;
}

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
  
  const { isAuthenticated, getAuthHeader } = useAuth()
  
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderData, setOrderData] = useState<CreateOrderDto>({
    shippingAddress: '',
    city: '',
    phoneNumber: ''
  })
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

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

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      setOrderError('يجب تسجيل الدخول أولاً لإنشاء طلب')
      return
    }

    if (!orderData.shippingAddress || !orderData.city || !orderData.phoneNumber) {
      setOrderError('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (isEmpty) {
      setOrderError('السلة فارغة')
      return
    }

    setOrderLoading(true)
    setOrderError(null)

    try {
      const authHeader = getAuthHeader()
      const response = await fetch('http://localhost:7000/api/v1/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          ...(authHeader && { 'Authorization': authHeader })
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'فشل في إنشاء الطلب')
      }

      const result = await response.json()
      setOrderSuccess(true)
      setOrderData({ shippingAddress: '', city: '', phoneNumber: '' })
      
      // Clear cart after successful order
      await clearCart()
      
      // Reset to cart view after a short delay
      setTimeout(() => {
        setShowOrderForm(false)
        setOrderSuccess(false)
      }, 2000)
      
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setOrderLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateOrderDto, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
    if (orderError) setOrderError(null)
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
        {showOrderForm ? (
          /* Order Form */
          <div className="p-3">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowOrderForm(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-sm font-semibold">إتمام الطلب</h3>
            </div>

            {orderSuccess ? (
              <div className="text-center py-8">
                <Package size={32} className="mx-auto mb-3 text-green-600" />
                <p className="text-sm font-medium text-green-600 mb-1">تم إنشاء الطلب بنجاح!</p>
                <p className="text-xs text-muted-foreground">سيتم التواصل معك قريباً</p>
              </div>
            ) : (
              <>
                {orderError && (
                  <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {orderError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      عنوان الشحن *
                    </label>
                    <Input
                      value={orderData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      placeholder="أدخل عنوان الشحن الكامل"
                      disabled={orderLoading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      المدينة *
                    </label>
                    <Input
                      value={orderData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="أدخل المدينة"
                      disabled={orderLoading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      رقم الهاتف *
                    </label>
                    <Input
                      value={orderData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="أدخل رقم الهاتف"
                      type="tel"
                      disabled={orderLoading}
                    />
                  </div>

                  {cart && cart.summary && (
                    <div className="bg-muted/30 rounded-md p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>عدد المنتجات:</span>
                        <span>{cart.summary.uniqueItems} منتج</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>المجموع الكلي:</span>
                        <span>{cart.summary.total} درهم</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleCreateOrder}
                    disabled={orderLoading || !isAuthenticated}
                    className="w-full"
                  >
                    {orderLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري إنشاء الطلب...
                      </>
                    ) : (
                      'تأكيد الطلب'
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      يجب تسجيل الدخول أولاً لإنشاء طلب
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Cart View */
          <>
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
                  
                  {/* Cart Summary and Order Button */}
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
                      
                      {/* Order Button */}
                      <Button 
                        className="w-full mt-3" 
                        disabled={isLoading || !isAuthenticated}
                        onClick={() => setShowOrderForm(true)}
                      >
                        إتمام الطلب ({cart.summary.uniqueItems} منتج)
                      </Button>
                      
                      {!isAuthenticated && (
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          يجب تسجيل الدخول أولاً
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
