// 图书相关类型定义
import { bookSchema } from '@/type/books'
import { z } from 'zod'

export const listBookResponseSchema = z.array(bookSchema)

export type ListBookResponse = z.infer<typeof listBookResponseSchema>