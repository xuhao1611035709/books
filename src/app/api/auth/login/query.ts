'use client'

import { 
  UseMutationOptions,
  QueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  LoginRequest,
  LoginResponse,
  loginRequestSchema
} from './type'

// API函数
const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  // 验证请求数据
  const validatedData = loginRequestSchema.parse(data)
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }
  
  return response.json()
}

// Mutation 选项
export const loginMutationOptions = (
  queryClient: QueryClient,
  onSuccess?: (data: LoginResponse) => void
): UseMutationOptions<LoginResponse, Error, LoginRequest> => ({
  mutationFn: loginUser,
  onSuccess: (data) => {
    // 清除所有查询缓存，因为用户状态已改变
    queryClient.clear()
    
    toast.success('登录成功！', {
      description: '欢迎回到图书管理系统'
    })
    
    // 调用自定义成功回调
    if (onSuccess) {
      onSuccess(data)
    }
  },
  onError: (error: Error) => {
    let errorMessage = '登录失败，请稍后重试'
    
    // 处理不同类型的错误
    if (error.message === 'Invalid login credentials') {
      errorMessage = '邮箱或密码错误，请重试'
    } else if (error.message === 'Email not confirmed') {
      errorMessage = '请先验证您的邮箱地址'
    }
    
    toast.error('登录失败', {
      description: errorMessage
    })
  }
}) 