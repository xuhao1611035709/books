'use client'

import { 
  UseMutationOptions,
  QueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  RegisterRequest,
  RegisterResponse,
  registerRequestSchema
} from './type'

// API函数
const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  // 验证请求数据
  const validatedData = registerRequestSchema.parse(data)
  
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }
  
  return response.json()
}

// Mutation 选项
export const registerMutationOptions = (
  queryClient: QueryClient,
  onSuccess?: (data: RegisterResponse) => void
): UseMutationOptions<RegisterResponse, Error, RegisterRequest> => ({
  mutationFn: registerUser,
  onSuccess: (data) => {
    // 清除所有查询缓存
    queryClient.clear()
    
    toast.success('注册成功！', {
      description: '请检查您的邮箱并验证账户'
    })
    
    // 调用自定义成功回调
    if (onSuccess) {
      onSuccess(data)
    }
  },
  onError: (error: Error) => {
    let errorMessage = '注册失败，请稍后重试'
    
    // 处理不同类型的错误
    if (error.message.includes('already registered')) {
      errorMessage = '该邮箱已被注册，请使用其他邮箱'
    } else if (error.message.includes('invalid email')) {
      errorMessage = '请输入有效的邮箱地址'
    } else if (error.message.includes('weak password')) {
      errorMessage = '密码强度不够，请使用更复杂的密码'
    }
    
    toast.error('注册失败', {
      description: errorMessage
    })
  }
}) 