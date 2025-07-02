# 🚀 Zeabur 部署指南

## 📋 部署步骤

### **1. 创建 Zeabur 项目**

1. 访问 [https://zeabur.com](https://zeabur.com)
2. 使用 GitHub 账号登录
3. 点击 "Create Project"
4. 选择仓库：`xuhao1611035709/books`
5. 选择分支：`release`

### **2. 配置环境变量**

在 Zeabur 项目设置中添加以下环境变量：

#### **基础配置**
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_API_URL=/api
```

#### **Release 环境 Supabase 配置**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://srnkygbjnuyqwyqhoctc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_release_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_release_service_role_key
```

#### **站点配置**
```bash
NEXT_PUBLIC_SITE_URL=https://你的项目名.zeabur.app
```

### **3. 部署设置**

#### **构建配置**
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Install Command**: `npm ci`
- **Node Version**: 18.x 或更高

#### **分支设置**
- **Production Branch**: `release`
- **Auto Deploy**: 启用

### **4. 自定义域名（可选）**

1. 在 Zeabur 项目设置中点击 "Domains"
2. 添加自定义域名
3. 配置 DNS 解析

## 🔧 配置文件

项目根目录已包含 `zeabur.json` 配置文件：

```json
{
  "name": "books-release",
  "service": {
    "type": "nodejs",
    "buildCommand": "npm run build",
    "startCommand": "npm start",
    "installCommand": "npm ci",
    "rootDirectory": ".",
    "outputDirectory": ".next"
  },
  "environment": {
    "NODE_ENV": "production",
    "NEXT_TELEMETRY_DISABLED": "1"
  },
  "regions": ["hkg"],
  "plan": "hobby"
}
```

## 📝 Supabase 配置获取

### **Release 环境配置**

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的 **Release** 项目
3. 进入 Settings → API
4. 复制以下配置：

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co

# Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 部署流程

### **自动部署**
- 推送代码到 `release` 分支会自动触发部署
- 查看部署日志确认状态

### **手动部署**
1. 在 Zeabur 控制台点击 "Deploy"
2. 选择最新的 commit
3. 等待部署完成

## 🔍 验证部署

部署完成后访问：
- **应用首页**: `https://你的项目名.zeabur.app`
- **健康检查**: `https://你的项目名.zeabur.app/api/health`

检查点：
- ✅ 应用正常加载
- ✅ 没有客户端错误
- ✅ Supabase 连接正常
- ✅ 环境显示为 "Staging"

## 🛠️ 故障排除

### **常见问题**

1. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认依赖项正确安装

2. **环境变量错误**
   - 确认所有必需的环境变量已配置
   - 检查 Supabase 密钥有效性

3. **数据库连接失败**
   - 验证 Supabase URL 和密钥
   - 检查数据库表是否存在

### **调试工具**
- Zeabur 部署日志
- 浏览器开发者工具
- `/api/health` 健康检查端点

## 📚 相关链接

- [Zeabur 官方文档](https://zeabur.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Supabase 文档](https://supabase.com/docs) 