// 登录请求和响应的类型定义
import { z } from "zod";

// 登录请求模式
export const loginRequestSchema = z.object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少需要6个字符'),
})

// 登录响应模式
export const loginResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        user_metadata: z.object({
            full_name: z.string().optional(),
            avatar_url: z.string().optional(),
        }).optional(),
    }),
    session: z.object({
        access_token: z.string(),
        refresh_token: z.string(),
        expires_in: z.number(),
        token_type: z.string(),
        user: z.any(),
    }),
})

// 错误响应模式
export const authErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string().optional(),
})

// TypeScript 类型
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema>
