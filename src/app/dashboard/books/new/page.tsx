'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BookForm from '@/components/books/book-form'

export default function NewBookPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">添加新图书</h1>
        <p className="text-muted-foreground">
          填写图书信息以添加到图书库
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>图书信息</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
} 