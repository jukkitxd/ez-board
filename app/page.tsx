"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input for search
import { PostCard } from "@/components/post-card"
import { Loader2, Search } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: number
  likes?: number
  imageUrl?: string
}

export default function HomePage() {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const fetchedPosts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }))
        setAllPosts(fetchedPosts)
        setFilteredPosts(fetchedPosts) // Initialize filtered posts
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("ไม่สามารถโหลดสูตรอาหารได้ กรุณาลองใหม่อีกครั้งในภายหลัง")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    const results = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.content.toLowerCase().includes(lowercasedSearchTerm),
    )
    setFilteredPosts(results)
  }, [searchTerm, allPosts])

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-card p-6 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center sm:text-left">
          กระดานสูตรอาหาร
        </h1>
        <Link href="/create-post" passHref>
          <Button className="bg-brand-500 text-white hover:bg-brand-600 shadow-md w-full sm:w-auto px-6 py-3 text-lg font-semibold rounded-md">
            สร้างสูตรอาหารใหม่
          </Button>
        </Link>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="ค้นหาสูตรอาหาร (ชื่อเรื่อง, เนื้อหา)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus-visible:ring-brand-500 focus-visible:border-brand-500"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground text-lg py-10">ไม่พบสูตรอาหารที่ตรงกับคำค้นหาของคุณ</p>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
