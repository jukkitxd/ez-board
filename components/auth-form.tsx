"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

interface AuthFormProps {
  type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (type === "login") {
        await signInWithEmailAndPassword(auth, email, password)
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับ!",
        })
        router.push("/")
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({
          title: "ลงทะเบียนสำเร็จ",
          description: "บัญชีของคุณถูกสร้างแล้ว",
        })
        router.push("/")
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      if (error.code === "auth/invalid-email") {
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง"
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "อีเมลนี้ถูกใช้แล้ว"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
      }
      toast({
        title: "เกิดข้อผิดพลาดในการยืนยันตัวตน",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-card w-full max-w-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 px-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {type === "login" ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium text-gray-800 dark:text-gray-200">
              อีเมล
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium text-gray-800 dark:text-gray-200">
              รหัสผ่าน
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-500 hover:bg-brand-600 text-white">
            {isSubmitting
              ? type === "login"
                ? "กำลังเข้าสู่ระบบ..."
                : "กำลังลงทะเบียน..."
              : type === "login"
                ? "เข้าสู่ระบบ"
                : "ลงทะเบียน"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center px-6 pb-6 text-sm text-gray-600 dark:text-gray-400">
        {type === "login" ? (
          <p>
            ยังไม่มีบัญชี?{" "}
            <Link href="/signup" className="text-brand-500 hover:underline">
              ลงทะเบียนที่นี่
            </Link>
          </p>
        ) : (
          <p>
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-brand-500 hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
