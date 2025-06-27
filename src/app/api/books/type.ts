// 图书相关类型定义
import { z } from 'zod'

// 核心Book模式
export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().optional(),
  category: z.string(),
  status: z.enum(['available', 'borrowed', 'maintenance']),
  created_at: z.string(),
})

// 创建书籍请求模式
export const createBookSchema = z.object({
  title: z.string().min(1, '书名不能为空'),
  author: z.string().min(1, '作者不能为空'),
  isbn: z.string().optional(),
  category: z.string().min(1, '分类不能为空'),
  status: z.enum(['available', 'borrowed', 'maintenance']).default('available'),
})

// 更新书籍请求模式
export const updateBookSchema = createBookSchema.partial()

// 查询参数模式
export const booksQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['available', 'borrowed', 'maintenance']).optional(),
  sortBy: z.enum(['title', 'author', 'category', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 分页信息模式
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

// 响应模式
export const booksResponseSchema = z.object({
  books: z.array(bookSchema),
  pagination: paginationSchema,
})

export const bookResponseSchema = z.object({
  book: bookSchema,
})

export const deleteBookResponseSchema = z.object({
  message: z.string(),
  deletedBook: bookSchema,
})

// TypeScript 类型
export type Book = z.infer<typeof bookSchema>
export type CreateBookRequest = z.infer<typeof createBookSchema>
export type UpdateBookRequest = z.infer<typeof updateBookSchema>
export type BooksQuery = z.infer<typeof booksQuerySchema>
export type Pagination = z.infer<typeof paginationSchema>
export type BooksResponse = z.infer<typeof booksResponseSchema>
export type BookResponse = z.infer<typeof bookResponseSchema>
export type DeleteBookResponse = z.infer<typeof deleteBookResponseSchema>