# 多分支 CI/CD 部署指南

本项目支持三个分支的自动部署，每个分支对应不同的环境。

## 🌳 分支环境对应

| 分支 | 环境 | 描述 | 访问地址 |
|------|------|------|----------|
| `main` | Production (生产) | 用户正式使用的版本 | https://your-app.vercel.app |
| `release` | Staging (预发布) | 发布前的最终测试版本 | https://your-app-staging.vercel.app |
| `dev` | Development (开发) | 开发和测试使用的版本 | https://your-app-dev.vercel.app |

## 🚀 部署流程

### 自动部署触发条件
- **代码推送**: 当代码推送到 `main`、`release` 或 `dev` 分支时
- **Pull Request**: 当创建或更新针对这些分支的 PR 时

### 部署步骤
1. **代码质量检查**
   - TypeScript 类型检查
   - ESLint 代码检查 
   - 构建测试

2. **环境部署**
   - 根据分支选择对应环境
   - 设置环境变量
   - 构建和部署

3. **部署通知**
   - 成功/失败状态通知
   - 部署地址信息

## ⚙️ 配置要求

### GitHub Secrets 配置

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中配置：

#### Vercel 配置
```
VERCEL_TOKEN=xxx                    # Vercel 访问令牌
VERCEL_ORG_ID=xxx                   # Vercel 组织 ID
VERCEL_PROJECT_ID=xxx               # Vercel 项目 ID
```

#### 环境变量 (按环境分别配置)

**生产环境 (main 分支)**
```
API_URL_production=https://api.yourapp.com
SUPABASE_URL_production=https://xxx.supabase.co
SUPABASE_ANON_KEY_production=xxx
```

**预发布环境 (release 分支)**
```
API_URL_staging=https://staging-api.yourapp.com
SUPABASE_URL_staging=https://xxx-staging.supabase.co
SUPABASE_ANON_KEY_staging=xxx
```

**开发环境 (dev 分支)**
```
API_URL_development=https://dev-api.yourapp.com
SUPABASE_URL_development=https://xxx-dev.supabase.co
SUPABASE_ANON_KEY_development=xxx
```

## 🔄 开发工作流

### 1. 功能开发
```bash
# 从 main 分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 开发完成后提交到 dev 分支
git checkout dev
git merge feature/new-feature
git push origin dev
```

### 2. 测试验证
```bash
# dev 分支自动部署到开发环境
# 验证功能无误后合并到 release 分支
git checkout release
git merge dev
git push origin release
```

### 3. 发布上线
```bash
# release 分支验证无误后合并到 main 分支
git checkout main
git merge release
git push origin main
```

## 🛠️ 本地开发

### 环境变量配置
```bash
# 复制环境变量模板
cp env.example .env.local

# 填写实际的环境变量值
# 编辑 .env.local 文件
```

### 开发命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建测试
npm run build
```

## 🔍 监控和维护

### 部署状态检查
- GitHub Actions 页面查看构建状态
- Vercel 控制台查看部署详情
- 各环境访问地址测试功能

### 常见问题
1. **构建失败**: 检查代码质量检查是否通过
2. **部署失败**: 检查环境变量配置是否正确
3. **功能异常**: 检查对应环境的数据库和 API 配置

### 日志查看
- GitHub Actions: 构建和部署日志
- Vercel: 运行时日志和错误信息
- Supabase: 数据库操作日志

## 🚨 紧急处理

### 回滚操作
```bash
# 快速回滚到上一个版本
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

### 热修复
```bash
# 直接在 main 分支修复
git checkout main
git commit -m "hotfix: 紧急修复"
git push origin main
```

## 📝 注意事项

1. **不要直接推送到 main 分支**: 除非是紧急热修复
2. **确保测试通过**: 在合并到上级分支前充分测试
3. **环境变量安全**: 敏感信息使用 GitHub Secrets
4. **数据库迁移**: 谨慎处理数据库结构变更
5. **版本标记**: 重要发布建议打 Git Tag 