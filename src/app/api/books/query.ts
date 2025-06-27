'use client'

import { 
  UseQueryOptions, 
  UseMutationOptions,
  QueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  BooksResponse, 
  BookResponse, 
  BooksQuery, 
  CreateBookRequest, 
  UpdateBookRequest,
  DeleteBookResponse,
  booksQuerySchema,
  createBookSchema,
  updateBookSchema
} from './type'

// API函数
const fetchBooks = async (params: Partial<BooksQuery> = {}): Promise<BooksResponse> => {
  // 验证查询参数
  const validatedParams = booksQuerySchema.parse(params)
  
  const searchParams = new URLSearchParams()
  Object.entries(validatedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/books?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch books')
  }
  
  return response.json()
}

const fetchBook = async (id: string): Promise<BookResponse> => {
  const response = await fetch(`/api/books/${id}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch book')
  }
  
  return response.json()
}

const createBook = async (data: CreateBookRequest): Promise<BookResponse> => {
  // 验证请求数据
  const validatedData = createBookSchema.parse(data)
  
  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create book')
  }
  
  return response.json()
}

const updateBook = async ({ id, data }: { id: string; data: UpdateBookRequest }): Promise<BookResponse> => {
  // 验证请求数据
  const validatedData = updateBookSchema.parse(data)
  
  const response = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update book')
  }
  
  return response.json()
}

const deleteBook = async (id: string): Promise<DeleteBookResponse> => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete book')
  }
  
  return response.json()
}

// Query 选项
export const booksQueryOptions = (params: Partial<BooksQuery> = {}): UseQueryOptions<BooksResponse> => ({
  queryKey: ['books', params],
  queryFn: () => fetchBooks(params),
  staleTime: 5 * 60 * 1000, // 5分钟
  gcTime: 10 * 60 * 1000, // 10分钟
})

export const bookQueryOptions = (id: string): UseQueryOptions<BookResponse> => ({
  queryKey: ['book', id],
  queryFn: () => fetchBook(id),
  enabled: !!id,
  staleTime: 5 * 60 * 1000,
})

// Mutation 选项
export const createBookMutationOptions = (
  queryClient: QueryClient
): UseMutationOptions<BookResponse, Error, CreateBookRequest> => ({
  mutationFn: createBook,
  onSuccess: (data) => {
    // 使所有书籍查询无效，触发重新获取
    queryClient.invalidateQueries({ queryKey: ['books'] })
    
    toast.success('图书添加成功！', {
      description: `《${data.book.title}》已添加到图书库`
    })
  },
  onError: (error: Error) => {
    toast.error('添加失败', {
      description: error.message
    })
  }
})

export const updateBookMutationOptions = (
  queryClient: QueryClient
): UseMutationOptions<BookResponse, Error, { id: string; data: UpdateBookRequest }> => ({
  mutationFn: updateBook,
  onSuccess: (data) => {
    // 更新特定书籍的缓存
    queryClient.setQueryData(['book', data.book.id], data)
    
    // 使所有书籍查询无效
    queryClient.invalidateQueries({ queryKey: ['books'] })
    
    toast.success('图书更新成功！', {
      description: `《${data.book.title}》信息已更新`
    })
  },
  onError: (error: Error) => {
    toast.error('更新失败', {
      description: error.message
    })
  }
})

export const deleteBookMutationOptions = (
  queryClient: QueryClient
): UseMutationOptions<DeleteBookResponse, Error, string> => ({
  mutationFn: deleteBook,
  onSuccess: (data) => {
    // 使所有书籍查询无效
    queryClient.invalidateQueries({ queryKey: ['books'] })
    
    // 移除特定书籍的缓存
    queryClient.removeQueries({ queryKey: ['book', data.deletedBook.id] })
    
    toast.success('图书删除成功！', {
      description: `《${data.deletedBook.title}》已从图书库中移除`
    })
  },
  onError: (error: Error) => {
    toast.error('删除失败', {
      description: error.message
    })
  }
}) 