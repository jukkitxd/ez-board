"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase" // No auth import needed for this version
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Heart from "@/components/ui/heart"
import { CommentSection } from "@/components/comment-section"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ref, deleteObject } from "firebase/storage"

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: number
  likes?: number
  imageUrl?: string
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...(docSnap.data() as Omit<Post, "id">) })
        } else {
          setError("ไม่พบสูตรอาหารนี้")
        }
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("ไม่สามารถโหลดสูตรอาหารได้ กรุณาลองใหม่อีกครั้งในภายหลัง")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  // In this version, anyone can delete posts for simplicity, or you can remove this function
  const handleDeletePost = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสูตรอาหารนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return
    }

    try {
      if (post?.imageUrl) {
        const imageRef = ref(storage, post.imageUrl)
        await deleteObject(imageRef).catch((err) => {
          console.warn("Could not delete image from storage (might not exist or permissions issue):", err)
        })
      }

      await deleteDoc(doc(db, "posts", id))

      toast({
        title: "ลบสูตรอาหารสำเร็จ",
        description: "สูตรอาหารถูกลบแล้ว",
      })
      router.push("/") // Redirect to home page
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบสูตรอาหารได้",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <span className="ml-3 text-xl text-gray-600">กำลังโหลดสูตรอาหาร...</span>
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-64px)] text-red-500 text-lg">{error}</div>
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] text-muted-foreground text-lg">
        ไม่พบสูตรอาหาร
      </div>
    )
  }

  const date = new Date(post.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
        >
          &larr; กลับไปหน้าหลัก
        </Button>
        {/* Delete button is always visible in this version, or you can remove it */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeletePost}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Trash2 className="h-4 w-4 mr-2" /> ลบสูตรอาหาร
        </Button>
      </div>
      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-card">
        {post.imageUrl && (
          <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-lg">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        )}
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{post.title}</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            โดย {post.author} เมื่อ {date}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none px-6 pb-6">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{post.content}</p>
          <div className="mt-4 text-right text-gray-600 dark:text-gray-400">
            <Heart className="w-5 h-5 inline-block mr-1 fill-current" /> {post.likes || 0} ถูกใจ
          </div>
        </CardContent>
      </Card>

      <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 rounded-lg">
        <p className="mb-2">พื้นที่โฆษณา Google AdSense</p>
        <p className="text-sm">
          คุณสามารถวางโค้ด Google AdSense ของคุณที่นี่ได้ (เช่น `&lt;script async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"&gt;&lt;/script&gt;` และ `&lt;ins
          class="adsbygoogle" ...&gt;&lt;/ins&gt;`)
        </p>
      </div>

      <CommentSection postId={id} />
    </div>
  )
}
