"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage" // Import storage functions
import { db, storage } from "@/lib/firebase" // Import storage
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function CreatePostForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("") // Author is now manually entered
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content || !author) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกทั้งหัวข้อ เนื้อหา และชื่อผู้เขียนสูตรอาหาร",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    let imageUrl = ""

    try {
      if (imageFile) {
        // For simplicity, image path doesn't use user.uid as there's no auth
        const storageRef = ref(storage, `post_images/${Date.now()}_${imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      await addDoc(collection(db, "posts"), {
        title,
        content,
        author,
        createdAt: Date.now(),
        likes: 0,
        imageUrl: imageUrl || null,
      })
      toast({
        title: "สำเร็จ!",
        description: "สูตรอาหารของคุณถูกสร้างแล้ว",
      })
      router.push("/")
    } catch (error) {
      console.error("Error adding document: ", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างสูตรอาหารได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-card">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 px-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">สร้างสูตรอาหารใหม่</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium text-gray-800 dark:text-gray-200">
            ชื่อสูตรอาหาร
          </Label>
          <Input
            id="title"
            placeholder="เช่น แกงเขียวหวานไก่"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content" className="text-base font-medium text-gray-800 dark:text-gray-200">
            เนื้อหาสูตรอาหาร
          </Label>
          <Textarea
            id="content"
            placeholder="เขียนส่วนผสมและวิธีทำที่นี่..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-base font-medium text-gray-800 dark:text-gray-200">
            รูปภาพสูตรอาหาร (ไม่บังคับ)
          </Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author" className="text-base font-medium text-gray-800 dark:text-gray-200">
            ชื่อผู้เขียน
          </Label>
          <Input
            id="author"
            placeholder="ชื่อของคุณ"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end px-6 pb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mr-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          ยกเลิก
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-500 hover:bg-brand-600 text-white">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังสร้าง...
            </>
          ) : (
            "สร้างสูตรอาหาร"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
