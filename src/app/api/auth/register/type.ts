import { z } from 'zod'

// 注册请求模式
export const registerRequestSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string().min(6, '确认密码至少需要6个字符'),
  fullName: z.string().min(1, '请输入姓名').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

// 注册响应模式
export const registerResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    user_metadata: z.object({
      full_name: z.string().optional(),
    }).optional(),
  }),
  message: z.string(),
})

// 错误响应模式
export const authErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

// TypeScript 类型
export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema> 