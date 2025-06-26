'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import BookForm from '@/components/books/book-form'
import { useBook } from '@/hooks/use-books'
import { Loader2, AlertCircle } from 'lucide-react'

export default function EditBookPage() {
  const params = useParams()
  const bookId = params.id as string

  const { data, isLoading, error } = useBook(bookId)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            加载图书信息失败: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data?.book) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            图书不存在或已被删除
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">编辑图书</h1>
        <p className="text-muted-foreground">
          修改《{data.book.title}》的信息
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>图书信息</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm 
            mode="edit" 
            initialData={data.book}
            bookId={bookId}
          />
        </CardContent>
      </Card>
    </div>
  )
} 