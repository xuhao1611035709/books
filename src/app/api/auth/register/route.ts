import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const { email, password } = RegisterSchema.parse(body)
    
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    })

    if (error) {
      console.error('Supabase register error:', error)
      
      // 处理特定的错误类型
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: '该邮箱已被注册，请使用其他邮箱或前往登录' },
          { status: 400 }
        )
      } else if (error.message.includes('Invalid email')) {
        return NextResponse.json(
          { error: '邮箱格式不正确，请输入有效的邮箱地址' },
          { status: 400 }
        )
      } else if (error.message.includes('Password should be at least')) {
        return NextResponse.json(
          { error: '密码太短，请设置至少6个字符的密码' },
          { status: 400 }
        )
      } else if (error.message.includes('weak password')) {
        return NextResponse.json(
          { error: '密码强度太弱，请设置更复杂的密码' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || '注册失败，请稍后重试' },
        { status: 400 }
      )
    }

    if (data.user) {
      return NextResponse.json({
        message: '注册成功！请查看邮箱以验证账户',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      })
    }

    return NextResponse.json(
      { error: '注册失败，未知错误' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Register API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 