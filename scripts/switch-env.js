#!/usr/bin/env node

/**
 * 本地环境切换脚本
 * 使用方法: 
 *   npm run env:dev
 *   npm run env:release  
 *   npm run env:main
 */

const fs = require('fs');
const path = require('path');

const envArg = process.argv[2];

if (!envArg || !['dev', 'release', 'main'].includes(envArg)) {
  console.log('❌ 请指定正确的环境: dev, release, main');
  console.log('使用方法: node scripts/switch-env.js dev');
  process.exit(1);
}

const envFile = path.join(__dirname, '..', '.env.local');

// 环境配置映射
const envConfigs = {
  dev: {
    NEXT_PUBLIC_ENV: 'development',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    suffix: 'DEV'
  },
  release: {
    NEXT_PUBLIC_ENV: 'staging', 
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    suffix: 'RELEASE'
  },
  main: {
    NEXT_PUBLIC_ENV: 'production',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', 
    suffix: 'MAIN'
  }
};

try {
  // 读取当前配置文件
  const currentEnv = fs.readFileSync(envFile, 'utf8');
  
  const config = envConfigs[envArg];
  const suffix = config.suffix;
  
  // 提取对应环境的配置
  const supabaseUrlMatch = currentEnv.match(new RegExp(`NEXT_PUBLIC_SUPABASE_URL_${suffix}=(.+)`));
  const supabaseKeyMatch = currentEnv.match(new RegExp(`NEXT_PUBLIC_SUPABASE_ANON_KEY_${suffix}=(.+)`));
  const serviceKeyMatch = currentEnv.match(new RegExp(`SUPABASE_SERVICE_ROLE_KEY_${suffix}=(.+)`));
  
  if (!supabaseUrlMatch || !supabaseKeyMatch || !serviceKeyMatch) {
    console.log(`❌ 未找到 ${envArg.toUpperCase()} 环境的配置，请检查 .env.local 文件`);
    process.exit(1);
  }
  
  // 生成新的激活配置
  const newActiveConfig = `
# ===================================================================
# 当前激活的环境: ${envArg.toUpperCase()}
# ===================================================================
NEXT_PUBLIC_ENV=${config.NEXT_PUBLIC_ENV}
NEXT_PUBLIC_SITE_URL=${config.NEXT_PUBLIC_SITE_URL}
NEXT_PUBLIC_API_URL=/api

NEXT_PUBLIC_SUPABASE_URL=${supabaseUrlMatch[1]}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKeyMatch[1]}
SUPABASE_SERVICE_ROLE_KEY=${serviceKeyMatch[1]}
`;

  // 更新配置文件 (保留三个环境的配置，只更新激活部分)
  const lines = currentEnv.split('\n');
  const newLines = [];
  let inActiveSection = false;
  
  for (const line of lines) {
    // 如果遇到激活配置部分，跳过旧的
    if (line.includes('# 当前激活的环境') || line.includes('# 当前使用的环境配置')) {
      inActiveSection = true;
      continue;
    }
    
    // 如果遇到新的注释块，结束激活配置部分
    if (inActiveSection && line.startsWith('#') && line.includes('===')) {
      inActiveSection = false;
    }
    
    // 跳过激活配置部分的变量
    if (inActiveSection && (
      line.startsWith('NEXT_PUBLIC_ENV=') ||
      line.startsWith('NEXT_PUBLIC_SITE_URL=') ||
      line.startsWith('NEXT_PUBLIC_API_URL=') ||
      line.startsWith('NEXT_PUBLIC_SUPABASE_URL=') ||
      line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=') ||
      line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')
    )) {
      continue;
    }
    
    if (!inActiveSection) {
      newLines.push(line);
    }
  }
  
  // 添加新的激活配置
  const updatedContent = newLines.join('\n') + newActiveConfig;
  
  fs.writeFileSync(envFile, updatedContent);
  
  console.log(`✅ 已切换到 ${envArg.toUpperCase()} 环境`);
  console.log(`🔄 请重新启动开发服务器: npm run dev`);
  
} catch (error) {
  console.error('❌ 切换环境失败:', error.message);
  process.exit(1);
} 