'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  useBooks, 
  useDeleteBook, 
  Book, 
  BooksQueryParams 
} from '@/hooks/use-books'
import {
  Plus,
  Search,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
  RefreshCw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CustomPagination } from '@/components/ui/pagination'

type ViewMode = 'grid' | 'table'

export default function BooksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  
  // 查询参数状态
  const [queryParams, setQueryParams] = useState<BooksQueryParams>({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const { data, isLoading, error, refetch } = useBooks(queryParams)
  const deleteBook = useDeleteBook()

  // 处理搜索
  const handleSearch = (value: string) => {
    setQueryParams(prev => ({
      ...prev,
      search: value,
      page: 1 // 重置到第一页
    }))
  }

  // 处理分类筛选
  const handleCategoryFilter = (category: string) => {
    setQueryParams(prev => ({
      ...prev,
      category: category === 'all' ? '' : category,
      page: 1
    }))
  }

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setQueryParams(prev => ({
      ...prev,
      status: status === 'all' ? '' : status,
      page: 1
    }))
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }))
  }

  // 处理删除
  const handleDelete = (book: Book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (bookToDelete) {
      await deleteBook.mutateAsync(bookToDelete.id)
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    }
  }

  // 状态徽章颜色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">可借阅</Badge>
      case 'borrowed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">已借出</Badge>

      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // 分类列表
  const categories = [
    '文学', '历史', '哲学', '艺术', '科学', '技术', 
    '编程', '前端', '后端', '数据库', '人工智能', '其他'
  ]

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载图书列表失败: {error.message}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">图书管理</h1>
          <p className="text-muted-foreground">
            管理您的图书库存和借阅状态
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/books/new">
            <Plus className="mr-2 h-4 w-4" />
            添加图书
          </Link>
        </Button>
      </div>

      {/* 搜索和筛选工具栏 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索书名、作者或ISBN..."
                  value={queryParams.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* 分类筛选 */}
            <Select 
              value={queryParams.category || 'all'} 
              onValueChange={handleCategoryFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 状态筛选 */}
            <Select 
              value={queryParams.status || 'all'} 
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="available">可借阅</SelectItem>
                <SelectItem value="borrowed">已借出</SelectItem>
              </SelectContent>
            </Select>

            {/* 视图切换 */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图书列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : data?.books.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">暂无图书</h3>
              <p className="text-muted-foreground mt-2">
                {queryParams.search || queryParams.category || queryParams.status
                  ? '没有找到符合条件的图书'
                  : '您还没有添加任何图书'}
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/books/new">
                  <Plus className="mr-2 h-4 w-4" />
                  添加第一本图书
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.books.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">
                      {book.title}
                    </CardTitle>
                    <CardDescription>
                      {book.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">分类</span>
                        <Badge variant="outline">{book.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">状态</span>
                        {getStatusBadge(book.status)}
                      </div>
                      {book.isbn && (
                        <div className="text-xs text-muted-foreground">
                          ISBN: {book.isbn}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/books/${book.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/books/${book.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(book)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* 表格视图 */}
          {viewMode === 'table' && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>书名</TableHead>
                      <TableHead>作者</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(book.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {book.isbn || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/books/${book.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/books/${book.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(book)}
                              className="text-red-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 分页 */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <CustomPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除图书</DialogTitle>
            <DialogDescription>
              您确定要删除《{bookToDelete?.title}》吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteBook.isPending}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteBook.isPending}
            >
              {deleteBook.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 