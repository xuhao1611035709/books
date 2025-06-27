import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { 
  booksQuerySchema, 
  createBookSchema, 
  booksResponseSchema,
  bookResponseSchema 
} from './type'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 验证用户认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 解析和验证查询参数
    const { searchParams } = new URL(request.url)
    const queryParams = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    }

    // 过滤掉 null 值
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, value]) => value !== null)
    )

    const validatedParams = booksQuerySchema.parse(filteredParams)
    const { page, limit, search, category, status, sortBy, sortOrder } = validatedParams
    const offset = (page - 1) * limit

    // 构建查询
    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })

    // 搜索条件
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`)
    }

    // 分类筛选
    if (category) {
      query = query.eq('category', category)
    }

    // 状态筛选
    if (status) {
      query = query.eq('status', status)
    }

    // 排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // 分页
    query = query.range(offset, offset + limit - 1)

    const { data: books, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = {
      books: books || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }

    // 验证响应数据
    const validatedResponse = booksResponseSchema.parse(response)
    return NextResponse.json(validatedResponse)

  } catch (error) {
    console.error('API error:', error)
    
    // 如果是Zod验证错误，返回更详细的错误信息
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 验证用户认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // 验证请求数据
    const validatedData = createBookSchema.parse(body)

    // 插入新图书
    const { data: book, error } = await supabase
      .from('books')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = { book }
    
    // 验证响应数据
    const validatedResponse = bookResponseSchema.parse(response)
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