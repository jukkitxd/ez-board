"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [user, loading, error] = useAuthState(auth)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "คุณได้ออกจากระบบแล้ว",
      })
      router.push("/login")
    } catch (err) {
      console.error("Error signing out:", err)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถออกจากระบบได้",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-brand-500 hover:text-brand-600 transition-colors">
          สูตรอาหาร
        </Link>
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.photoURL || "/placeholder.svg?height=36&width=36&query=user"}
                      alt={user.displayName || user.email || "User"}
                    />
                    <AvatarFallback>
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button className="bg-brand-500 hover:bg-brand-600 text-white">ลงทะเบียน</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
