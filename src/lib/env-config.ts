/**
 * 三环境配置管理 (dev/release/prod)
 * 一个 Vercel 项目 + 三个 Supabase 项目
 */

// 获取当前分支名（Vercel 环境变量）
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'dev'
const isVercel = !!process.env.VERCEL
const isDevelopment = process.env.NODE_ENV === 'development'

// 环境判断
export const getEnvironment = () => {
  if (!isVercel && isDevelopment) {
    // 本地开发环境，根据 .env.local 中的配置判断
    return process.env.NEXT_PUBLIC_ENV || 'development'
  }
  
  // Vercel 部署环境，根据分支判断
  switch (branch) {
    case 'main':
      return 'production'
    case 'release':
      return 'staging'
    case 'dev':
    default:
      return 'development'
  }
}

// 获取环境配置
export const getEnvConfig = () => {
  const env = getEnvironment()
  
  const configs = {
    // 开发环境 (dev 分支)
    development: {
      name: 'Development',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_DEV || process.env.SUPABASE_SERVICE_ROLE_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      siteUrl: isVercel 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    },
    
    // 预发布环境 (release 分支)
    staging: {
      name: 'Staging',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL_RELEASE || process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_RELEASE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_RELEASE || process.env.SUPABASE_SERVICE_ROLE_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      siteUrl: isVercel 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    },
    
    // 生产环境 (main 分支)
    production: {
      name: 'Production',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      siteUrl: isVercel 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    }
  }
  
  return configs[env as keyof typeof configs] || configs.development
}

// 导出当前环境信息
export const currentEnv = getEnvironment()
export const currentConfig = getEnvConfig()

// 环境验证
export const validateEnvironment = () => {
  const config = currentConfig
  const missing = []
  
  if (!config.supabaseUrl) missing.push('SUPABASE_URL')
  if (!config.supabaseKey) missing.push('SUPABASE_ANON_KEY')
  
  if (missing.length > 0) {
    console.error(`❌ Missing environment variables for ${currentEnv}:`, missing)
    return false
  }
  
  return true
}

// 调试信息
if (isDevelopment || process.env.VERCEL_ENV !== 'production') {
  console.log('🔧 Environment Info:', {
    branch,
    environment: currentEnv,
    isVercel,
    hasValidConfig: validateEnvironment(),
    supabaseUrl: currentConfig.supabaseUrl?.substring(0, 30) + '...',
  })
} 