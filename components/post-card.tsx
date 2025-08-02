"use client" // This component needs to be client-side for interactivity

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react" // Import Heart icon
import Link from "next/link"
import { useState } from "react"
import { doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: number
  likes?: number // Make likes optional, default to 0 if not present
  imageUrl?: string // Add imageUrl
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [currentLikes, setCurrentLikes] = useState(post.likes || 0)
  const { toast } = useToast()

  const date = new Date(post.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigating to post detail page
    e.stopPropagation() // Stop event propagation to parent Link

    setCurrentLikes((prev) => prev + 1) // Optimistic update

    try {
      const postRef = doc(db, "posts", post.id)
      await updateDoc(postRef, {
        likes: increment(1),
      })
      // ไม่ต้องแสดง toast สำหรับการกดไลก์สำเร็จ เพื่อประสบการณ์ที่ราบรื่น
    } catch (error) {
      console.error("Error liking post:", error)
      setCurrentLikes((prev) => prev - 1) // Revert optimistic update
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถกดถูกใจได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="flex flex-col h-full border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 ease-in-out bg-white dark:bg-card overflow-hidden">
      {post.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <Link href={`/posts/${post.id}`} className="block flex-grow">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            โดย {post.author} เมื่อ {date}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-4 text-base text-gray-700 dark:text-gray-300">{post.content}</p>
        </CardContent>
      </Link>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className="text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400"
        >
          <Heart className="w-5 h-5 mr-1 fill-current" /> {/* Added fill-current */}
          {currentLikes}
        </Button>
      </div>
    </Card>
  )
}
