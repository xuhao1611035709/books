import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { 
  registerRequestSchema,
  registerResponseSchema
} from './type'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 验证请求数据
    const validatedData = registerRequestSchema.parse(body)
    const { email, password, fullName } = validatedData

    // 使用Supabase进行用户注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // 禁用邮箱验证重定向
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      )
    }

    const response = {
      user: data.user,
      message: '注册成功！您现在可以使用这个账户登录系统。'
    }

    // 验证响应数据
    const validatedResponse = registerResponseSchema.parse(response)
    
    return NextResponse.json(validatedResponse, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    
    // 如果是Zod验证错误，返回更详细的错误信息
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 