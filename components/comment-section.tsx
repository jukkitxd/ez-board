"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase" // No auth import needed for this version
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Trash2 } from "lucide-react"

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: Timestamp // Use Firebase Timestamp type
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentContent, setNewCommentContent] = useState("")
  const [newCommentAuthor, setNewCommentAuthor] = useState("") // Manually entered author
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!postId) return

    const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("createdAt", "asc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments: Comment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }))
        setComments(fetchedComments)
      },
      (error) => {
        console.error("Error fetching comments:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดความคิดเห็นได้",
          variant: "destructive",
        })
      },
    )

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [postId, toast])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentContent.trim() || !newCommentAuthor.trim()) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกทั้งชื่อผู้เขียนและเนื้อหาความคิดเห็น",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        author: newCommentAuthor.trim(),
        content: newCommentContent.trim(),
        createdAt: Timestamp.now(), // Use Firebase server timestamp
      })
      setNewCommentContent("") // Clear the input field
      setNewCommentAuthor("") // Clear author field
      // No toast for success, real-time update will show the comment
    } catch (error) {
      console.error("Error adding comment: ", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งความคิดเห็นได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // In this version, anyone can delete comments for simplicity, or you can remove this function
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบความคิดเห็นนี้?")) {
      return
    }

    try {
      await deleteDoc(doc(db, "comments", commentId))
      toast({
        title: "ลบความคิดเห็นสำเร็จ",
        description: "ความคิดเห็นถูกลบแล้ว",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบความคิดเห็นได้",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mt-8 border border-gray-100 dark:border-gray-800 shadow-md bg-white dark:bg-card">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ความคิดเห็น ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">ยังไม่มีความคิดเห็น ลองเป็นคนแรกสิ!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32&query=${encodeURIComponent(comment.author)}`}
                    alt={comment.author}
                  />
                  <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.author}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt.toDate()).toLocaleString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {/* In this version, anyone can delete comments for simplicity */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="ลบความคิดเห็น"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">เพิ่มความคิดเห็นของคุณ</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment-author" className="text-base font-medium text-gray-800 dark:text-gray-200">
                ชื่อผู้เขียน
              </Label>
              <Input
                id="comment-author"
                placeholder="ชื่อของคุณ"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                required
                className="border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-content" className="text-base font-medium text-gray-800 dark:text-gray-200">
                ความคิดเห็น
              </Label>
              <Textarea
                id="comment-content"
                placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                className="min-h-[100px] border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-500 hover:bg-brand-600 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังส่ง...
                </>
              ) : (
                "ส่งความคิดเห็น"
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
