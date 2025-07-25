"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/stores/use-auth"
import { Input } from "../ui/input"
import { z } from "zod"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

// Zod schema
const LoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
})

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = LoginSchema.safeParse(formData)

    if (!result.success) {
      const firstError = result.error.issues[0]?.message
      setValidationError(firstError)
      return
    }

    try {
      await login(formData)
      onSuccess?.()
    } catch (error) {
      // Handled by the store
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
    if (validationError) setValidationError(null)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-start">
          <h2 className="font-bold">تسجيل الدخول</h2>
          <p className="text-muted-foreground text-sm mt-2">
            ادخل إلى حسابك للمتابعة
          </p>
        </div>

        {(validationError || error) && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {validationError || error}
            <button
              onClick={() => {
                clearError()
                setValidationError(null)
              }}
              className="ml-2 text-xs underline"
            >
              إخفاء
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-neutral-50 shadow-none"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-neutral-50 shadow-none"
              required
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="mr-3  size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </Button>
        </form>

        {onSwitchToRegister && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">ليس لديك حساب؟ </span>
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              إنشاء حساب جديد
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
