# 📦 Vercel 一个项目三环境部署指南

> **推荐方案**：一个 Vercel 项目 + 三个分支自动部署

## 🏗️ 架构概览

```
GitHub Repository (xuhao1611035709/books)
├── main branch    → Production Environment  (Supabase PROD)
├── release branch → Staging Environment    (Supabase RELEASE)
└── dev branch     → Development Environment (Supabase DEV)
```

**部署结果**：
- **生产环境**: `your-app.vercel.app` (main 分支)
- **预发布**: `your-app-git-release.vercel.app` (release 分支)
- **开发环境**: `your-app-git-dev.vercel.app` (dev 分支)

## 🚀 部署步骤

### 第1步：创建 Vercel 项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New" → "Project"
3. 导入您的 GitHub 仓库: `xuhao1611035709/books`
4. 配置项目设置：
   ```bash
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 第2步：配置环境变量

#### **生产环境变量** (Production)
在 Vercel 项目设置中添加：

```bash
# 生产环境 (main 分支专用)
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key
```

#### **预览环境变量** (Preview - 所有分支)
```bash
# 开发环境 (dev 分支)
NEXT_PUBLIC_SUPABASE_URL_DEV=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY_DEV=your_dev_service_role_key

# 预发布环境 (release 分支)
NEXT_PUBLIC_SUPABASE_URL_RELEASE=https://your-release-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_RELEASE=your_release_anon_key
SUPABASE_SERVICE_ROLE_KEY_RELEASE=your_release_service_role_key

# 通用配置
NEXT_PUBLIC_API_URL=/api
```

### 第3步：分支保护设置

在 GitHub 仓库设置中：

1. **main 分支** (生产环境)
   - ✅ Require pull request reviews
   - ✅ Require status checks (CI/CD)
   - ✅ Require branches to be up to date

2. **release 分支** (预发布环境)
   - ✅ Require pull request reviews
   - ✅ Require status checks

3. **dev 分支** (开发环境)
   - ✅ Require status checks (可选)

## 🔄 工作流程

### **日常开发流程**
```bash
# 1. 功能开发 (dev 环境)
git checkout dev
git pull origin dev
# 开发功能...
git add .
git commit -m "feat: 新功能"
git push origin dev
# → 自动部署到 dev 环境

# 2. 预发布测试 (release 环境)
git checkout release
git merge dev
git push origin release
# → 自动部署到 release 环境

# 3. 生产发布 (production 环境)
git checkout main
git merge release
git push origin main
# → 自动部署到 production 环境
```

## 🌐 域名和 SSL

### **自动域名**
- 生产环境: `your-app.vercel.app`
- 预发布: `your-app-git-release.vercel.app`
- 开发环境: `your-app-git-dev.vercel.app`

### **自定义域名** (可选)
```bash
# 生产环境
books.yourdomain.com → main 分支

# 预发布环境
staging.books.yourdomain.com → release 分支

# 开发环境
dev.books.yourdomain.com → dev 分支
```

## 🔍 监控和调试

### **查看部署状态**
```bash
# Vercel CLI (可选)
npm i -g vercel
vercel --help

# 查看部署日志
vercel logs
```

### **环境检查**
访问各环境的健康检查页面：
```bash
https://your-app.vercel.app/api/health          # 生产环境
https://your-app-git-release.vercel.app/api/health  # 预发布
https://your-app-git-dev.vercel.app/api/health      # 开发环境
```

## 📋 环境对比表

| 特性 | Dev | Release | Production |
|------|-----|---------|------------|
| **分支** | `dev` | `release` | `main` |
| **Supabase** | DEV 项目 | RELEASE 项目 | PROD 项目 |
| **域名** | `*-git-dev.vercel.app` | `*-git-release.vercel.app` | `*.vercel.app` |
| **用途** | 功能开发 | 测试验证 | 正式环境 |
| **数据** | 测试数据 | 仿真数据 | 真实数据 |

## ❓ 常见问题

### Q: 为什么不用三个 Vercel 项目？
A: 一个项目的优势：
- 🆓 免费版足够
- 🎯 统一管理
- 🔄 自动分支部署
- 📊 统一分析数据

### Q: 如何切换本地环境？
A: 使用环境切换脚本：
```bash
npm run env:dev      # 连接开发环境
npm run env:release  # 连接预发布环境
npm run env:prod     # 连接生产环境
```

### Q: 环境变量不生效怎么办？
A: 检查步骤：
1. 变量名拼写正确
2. 重新部署项目
3. 清除缓存：`vercel --force`

## 🎯 下一步

1. ✅ 创建 Vercel 项目
2. ⚙️ 配置环境变量
3. 🔧 设置分支保护
4. 🧪 测试部署流程
5. 📱 配置自定义域名 (可选) 