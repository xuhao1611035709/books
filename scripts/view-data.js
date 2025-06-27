#!/usr/bin/env node

/**
 * 查看数据库数据脚本
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请确保 .env.local 中配置了 Supabase 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function viewData() {
  try {
    console.log('📚 查看图书数据...\n')
    
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    if (!books || books.length === 0) {
      console.log('📄 数据库中暂无图书数据')
      console.log('💡 运行 npm run seed 来创建测试数据')
      return
    }
    
    console.log(`总共 ${books.length} 本图书：\n`)
    
    books.forEach((book, index) => {
      const statusIcon = book.status === 'available' ? '✅' : '🔒'
      console.log(`${index + 1}. ${statusIcon} ${book.title}`)
      console.log(`   作者: ${book.author}`)
      console.log(`   ISBN: ${book.isbn}`)
      console.log(`   分类: ${book.category}`)
      console.log(`   状态: ${book.status === 'available' ? '可借阅' : '已借出'}`)
      console.log(`   创建时间: ${new Date(book.created_at).toLocaleString('zh-CN')}`)
      console.log(`   ID: ${book.id}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ 查看数据失败:', error.message)
  }
}

if (require.main === module) {
  viewData()
} 