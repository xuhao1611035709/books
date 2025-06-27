import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { 
  loginRequestSchema,
  loginResponseSchema
} from './type'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 验证请求数据
    const validatedData = loginRequestSchema.parse(body)
    const { email, password } = validatedData

    // 使用Supabase进行身份验证
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 400 }
      )
    }

    const response = {
      user: data.user,
      session: data.session
    }

    // 验证响应数据
    const validatedResponse = loginResponseSchema.parse(response)
    
    return NextResponse.json(validatedResponse)

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