#!/usr/bin/env node

/**
 * 数据库种子数据脚本
 * 为图书管理系统创建测试数据
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// 获取当前环境的 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请确保 .env.local 中配置了 Supabase 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 测试图书数据
const bookSeedData = [
  {
    title: '活着',
    author: '余华',
    isbn: '9787544717816',
    category: '文学小说',
    status: 'available'
  },
  {
    title: '三体',
    author: '刘慈欣',
    isbn: '9787536692930',
    category: '科幻小说',
    status: 'available'
  },
  {
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    isbn: '9787544291170',
    category: '文学小说',
    status: 'borrowed'
  },
  {
    title: '1984',
    author: '乔治·奥威尔',
    isbn: '9787532751853',
    category: '社会科学',
    status: 'available'
  },
  {
    title: '红楼梦',
    author: '曹雪芹',
    isbn: '9787020002207',
    category: '古典文学',
    status: 'available'
  },
  {
    title: 'JavaScript权威指南',
    author: 'David Flanagan',
    isbn: '9787111524069',
    category: '计算机技术',
    status: 'borrowed'
  },
  {
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    isbn: '9787544278799',
    category: '历史',
    status: 'available'
  },
  {
    title: '平凡的世界',
    author: '路遥',
    isbn: '9787530211618',
    category: '文学小说',
    status: 'available'
  },
  {
    title: '你不知道的JavaScript',
    author: 'Kyle Simpson',
    isbn: '9787115385734',
    category: '计算机技术',
    status: 'available'
  },
  {
    title: '围城',
    author: '钱钟书',
    isbn: '9787020002085',
    category: '文学小说',
    status: 'borrowed'
  },
  {
    title: '黑客与画家',
    author: 'Paul Graham',
    isbn: '9787115249036',
    category: '计算机技术',
    status: 'available'
  },
  {
    title: '小王子',
    author: '圣埃克苏佩里',
    isbn: '9787544766784',
    category: '儿童文学',
    status: 'available'
  },
  {
    title: '解忧杂货店',
    author: '东野圭吾',
    isbn: '9787544267045',
    category: '推理小说',
    status: 'available'
  },
  {
    title: '设计模式',
    author: 'Gang of Four',
    isbn: '9787111075660',
    category: '计算机技术',
    status: 'borrowed'
  },
  {
    title: '追风筝的人',
    author: '卡勒德·胡赛尼',
    isbn: '9787208061644',
    category: '文学小说',
    status: 'available'
  },
  {
    title: '白夜行',
    author: '东野圭吾',
    isbn: '9787544258456',
    category: '推理小说',
    status: 'available'
  },
  {
    title: 'React 深入浅出',
    author: '程墨',
    isbn: '9787115463981',
    category: '计算机技术',
    status: 'available'
  },
  {
    title: '摆渡人',
    author: '克莱儿·麦克福尔',
    isbn: '9787200116823',
    category: '青春文学',
    status: 'borrowed'
  },
  {
    title: '我与地坛',
    author: '史铁生',
    isbn: '9787020002894',
    category: '散文随笔',
    status: 'available'
  },
  {
    title: '苏菲的世界',
    author: '乔斯坦·贾德',
    isbn: '9787500413851',
    category: '哲学',
    status: 'available'
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 开始创建测试数据...')
    
    // 检查当前环境
    console.log(`🔧 当前 Supabase URL: ${supabaseUrl.substring(0, 30)}...`)
    
    // 清空现有数据（可选）
    console.log('🗑️ 清空现有数据...')
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有记录
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 表示没有数据可删除
      console.warn('⚠️ 清空数据时出现警告:', deleteError.message)
    }
    
    // 插入测试数据
    console.log(`📚 插入 ${bookSeedData.length} 条图书记录...`)
    
    const { data, error } = await supabase
      .from('books')
      .insert(bookSeedData)
      .select()
    
    if (error) {
      throw error
    }
    
    console.log(`✅ 成功创建 ${data.length} 条测试数据！`)
    
    // 显示统计信息
    const { data: stats } = await supabase
      .from('books')
      .select('status', { count: 'exact' })
    
    const availableCount = stats?.filter(book => book.status === 'available').length || 0
    const borrowedCount = stats?.filter(book => book.status === 'borrowed').length || 0
    
    console.log('📊 数据统计:')
    console.log(`   可借阅: ${availableCount} 本`)
    console.log(`   已借出: ${borrowedCount} 本`)
    console.log(`   总计: ${availableCount + borrowedCount} 本`)
    
    // 显示分类统计
    const { data: categories } = await supabase
      .from('books')
      .select('category')
    
    const categoryStats = {}
    categories?.forEach(book => {
      categoryStats[book.category] = (categoryStats[book.category] || 0) + 1
    })
    
    console.log('📋 分类统计:')
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 本`)
    })
    
    console.log('🎉 测试数据创建完成！')
    
  } catch (error) {
    console.error('❌ 创建测试数据失败:', error.message)
    process.exit(1)
  }
}

// 运行脚本
if (require.main === module) {
  seedDatabase()
} 