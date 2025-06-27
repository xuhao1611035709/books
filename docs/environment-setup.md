# 🔧 环境配置指南

## 📍 配置位置

### **1. 本地开发配置**
创建 `.env.local` 文件（项目根目录）

### **2. GitHub Actions 配置**  
GitHub 仓库 → Settings → Secrets and variables → Actions

---

## 🛠️ 第一步：本地开发配置

在项目根目录创建 `.env.local` 文件：

```bash
# 本地开发环境配置 (.env.local)
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api

# DEV 环境 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
```

---

## 🚀 第二步：GitHub Secrets 配置

在 GitHub 添加以下 Secrets：

### DEV 环境 (dev 分支)
```
NEXT_PUBLIC_SUPABASE_URL_DEV=https://your-dev-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY_DEV=your_dev_service_role_key
NEXT_PUBLIC_SITE_URL_DEV=https://your-app-dev.vercel.app
```

### RELEASE 环境 (release 分支)
```
NEXT_PUBLIC_SUPABASE_URL_RELEASE=https://your-release-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_RELEASE=your_release_anon_key
SUPABASE_SERVICE_ROLE_KEY_RELEASE=your_release_service_role_key
NEXT_PUBLIC_SITE_URL_RELEASE=https://your-app-release.vercel.app
```

### MAIN 环境 (main 分支)
```
NEXT_PUBLIC_SUPABASE_URL_MAIN=https://your-main-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_MAIN=your_main_anon_key
SUPABASE_SERVICE_ROLE_KEY_MAIN=your_main_service_role_key
NEXT_PUBLIC_SITE_URL_MAIN=https://your-app.vercel.app
```

---

## 📋 获取 Supabase 配置的步骤

### 对于每个 Supabase 项目：

1. **登录 Supabase Dashboard**
2. **选择项目** (dev/release/main)
3. **进入 Settings → API**
4. **复制以下信息：**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL_*`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY_*`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY_*`

---

## ✅ 配置完成后

### 测试本地开发：
```bash
npm run dev
```

### 测试部署：
推送到任意分支，查看 GitHub Actions 执行结果 