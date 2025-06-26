'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBook } from '@/hooks/use-books'
import {
  ArrowLeft,
  Edit,
  Calendar,
  BookOpen,
  User,
  Hash,
  Tag,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const { data, isLoading, error } = useBook(bookId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">可借阅</Badge>
      case 'borrowed':
        return <Badge className="bg-red-100 text-red-800">已借出</Badge>

      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            加载图书详情失败: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data?.book) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            图书不存在或已被删除
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const book = data.book

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
            <p className="text-muted-foreground">图书详细信息</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/books/${book.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            编辑图书
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>书名</span>
                  </div>
                  <p className="font-medium">{book.title}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>作者</span>
                  </div>
                  <p className="font-medium">{book.author}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>分类</span>
                  </div>
                  <Badge variant="outline">{book.category}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">状态</div>
                  {getStatusBadge(book.status)}
                </div>

                {book.isbn && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span>ISBN</span>
                    </div>
                    <p className="font-mono text-sm">{book.isbn}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>状态信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {getStatusBadge(book.status)}
              </div>
              
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前状态</span>
                  <span className="font-medium">
                    {book.status === 'available' && '可借阅'}
                    {book.status === 'borrowed' && '已借出'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                时间信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">创建时间</p>
                <p className="font-medium">{formatDate(book.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/dashboard/books/${book.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑图书
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/books">
                  返回图书列表
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 