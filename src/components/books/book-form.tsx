'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Book, BookFormData, useCreateBook, useUpdateBook } from '@/hooks/use-books'
import { Loader2, Save, X } from 'lucide-react'

const bookSchema = z.object({
  title: z.string().min(1, '书名不能为空'),
  author: z.string().min(1, '作者不能为空'),
  isbn: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const cleanISBN = val.replace(/[^0-9]/g, '')
      return cleanISBN.length === 10 || cleanISBN.length === 13
    }, 'ISBN应为10位或13位数字'),
  category: z.string().min(1, '分类不能为空'),
  status: z.string().min(1, '状态不能为空'),
})

interface BookFormProps {
  mode: 'create' | 'edit'
  initialData?: Book | null
  bookId?: string
}

const categories = [
  '文学',
  '历史', 
  '哲学',
  '艺术',
  '科学',
  '技术',
  '编程',
  '前端',
  '后端',
  '数据库',
  '人工智能',
  '其他'
]

export default function BookForm({ 
  mode, 
  initialData, 
  bookId 
}: BookFormProps) {
  const router = useRouter()
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      category: '',
      status: 'available',
    },
  })

  // 当有初始数据时，重置表单
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        author: initialData.author,
        isbn: initialData.isbn || '',
        category: initialData.category,
        status: initialData.status,
      })
    }
  }, [form, initialData])

  const onSubmit = async (data: BookFormData) => {
    try {
      if (mode === 'create') {
        await createBook.mutateAsync(data)
      } else if (bookId) {
        await updateBook.mutateAsync({ id: bookId, data })
      }
      router.push('/dashboard/books')
    } catch (error) {
      // 错误处理已在hooks中完成
      console.error('Form submission error:', error)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const isLoading = createBook.isPending || updateBook.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                书名 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="请输入书名" 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                作者 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="请输入作者" 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input 
                  placeholder="请输入ISBN（可选）" 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">
                ISBN应为10位或13位数字，可包含连字符
              </p>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  分类 <span className="text-red-500">*</span>
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择图书分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择图书状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                                    <SelectItem value="available">可借阅</SelectItem>
                <SelectItem value="borrowed">已借出</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {mode === 'edit' ? '更新图书' : '添加图书'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            取消
          </Button>
        </div>
      </form>
    </Form>
  )
} 