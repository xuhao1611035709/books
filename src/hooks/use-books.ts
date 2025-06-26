'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// 类型定义
export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  category: string
  status: string
  created_at: string
}

export interface BookFormData {
  title: string
  author: string
  isbn?: string
  category: string
  status: string
}

export interface BooksResponse {
  books: Book[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface BooksQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// API 函数
const fetchBooks = async (params: BooksQueryParams = {}): Promise<BooksResponse> => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
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

const fetchBook = async (id: string): Promise<{ book: Book }> => {
  const response = await fetch(`/api/books/${id}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch book')
  }
  
  return response.json()
}

const createBook = async (data: BookFormData): Promise<{ book: Book }> => {
  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create book')
  }
  
  return response.json()
}

const updateBook = async ({ id, data }: { id: string; data: BookFormData }): Promise<{ book: Book }> => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update book')
  }
  
  return response.json()
}

const deleteBook = async (id: string): Promise<{ message: string; deletedBook: Book }> => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete book')
  }
  
  return response.json()
}

// React Query Hooks
export const useBooks = (params: BooksQueryParams = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => fetchBooks(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })
}

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBook(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
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
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
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
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
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
} 