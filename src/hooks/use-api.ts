'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// Books API
import { 
  booksQueryOptions,
  bookQueryOptions,
  createBookMutationOptions,
  updateBookMutationOptions,
  deleteBookMutationOptions
} from '@/app/api/books/query'
import { BooksQuery, CreateBookRequest, UpdateBookRequest } from '@/app/api/books/type'

// Books Detail API
import {
  bookQueryOptions as detailBookQueryOptions,
  updateBookMutationOptions as detailUpdateBookMutationOptions,
  deleteBookMutationOptions as detailDeleteBookMutationOptions
} from '@/app/api/books/[id]/query'

// Auth API
import { loginMutationOptions } from '@/app/api/auth/login/query'
import { registerMutationOptions } from '@/app/api/auth/register/query'
import { LoginRequest } from '@/app/api/auth/login/type'
import { RegisterRequest } from '@/app/api/auth/register/type'

// Books Hooks
export const useBooks = (params: Partial<BooksQuery> = {}) => {
  return useQuery(booksQueryOptions(params))
}

export const useBook = (id: string) => {
  return useQuery(bookQueryOptions(id))
}

export const useBookDetail = (id: string) => {
  return useQuery(detailBookQueryOptions(id))
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  return useMutation(createBookMutationOptions(queryClient))
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  return useMutation(updateBookMutationOptions(queryClient))
}

export const useUpdateBookDetail = () => {
  const queryClient = useQueryClient()
  return useMutation(detailUpdateBookMutationOptions(queryClient))
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation(deleteBookMutationOptions(queryClient))
}

export const useDeleteBookDetail = () => {
  const queryClient = useQueryClient()
  return useMutation(detailDeleteBookMutationOptions(queryClient))
}

// Auth Hooks
export const useLogin = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  return useMutation(
    loginMutationOptions(queryClient, (data) => {
      router.push('/dashboard')
      router.refresh()
      if (onSuccess) onSuccess()
    })
  )
}

export const useRegister = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  return useMutation(
    registerMutationOptions(queryClient, (data) => {
      router.push('/login')
      if (onSuccess) onSuccess()
    })
  )
}

// Types Export (for convenience)
export type {
  BooksQuery,
  CreateBookRequest,
  UpdateBookRequest,
  LoginRequest,
  RegisterRequest
}

// 为了向后兼容，重新导出一些类型
export type { Book } from '@/app/api/books/type' 