# GitHub 分支保护规则配置

为了确保代码质量和部署安全，建议为主要分支设置保护规则。

## 🛡️ 推荐的分支保护设置

### Main 分支保护
在 GitHub 仓库 Settings → Branches → Add rule 中配置：

#### 规则设置
- **Branch name pattern**: `main`
- **Restrict pushes that create files**: ✅
- **Require a pull request before merging**: ✅
  - **Require approvals**: 1 (至少一个人审核)
  - **Dismiss stale PR approvals when new commits are pushed**: ✅
  - **Require review from code owners**: ✅ (如果有 CODEOWNERS 文件)
- **Require status checks to pass before merging**: ✅
  - **Require branches to be up to date before merging**: ✅
  - **Status checks**: 
    - `Quality Check` (GitHub Actions 工作流)
- **Require conversation resolution before merging**: ✅
- **Require signed commits**: ❌ (可选)
- **Require linear history**: ✅
- **Include administrators**: ✅

### Release 分支保护
- **Branch name pattern**: `release`
- **Require a pull request before merging**: ✅
  - **Require approvals**: 1
- **Require status checks to pass before merging**: ✅
  - **Status checks**: `Quality Check`
- **Require conversation resolution before merging**: ✅

### Dev 分支保护
- **Branch name pattern**: `dev`  
- **Require status checks to pass before merging**: ✅
  - **Status checks**: `Quality Check`
- **Require conversation resolution before merging**: ✅

## 👥 CODEOWNERS 文件

创建 `.github/CODEOWNERS` 文件指定代码审核者：

```
# Global owners
* @your-username

# API 相关代码
/src/app/api/ @backend-team-lead @your-username

# 组件相关代码  
/src/components/ @frontend-team-lead @your-username

# 配置文件
/.github/ @devops-lead @your-username
/package.json @your-username
```

## 🔄 工作流程建议

### 1. 功能开发流程
```
feature/xxx → dev → release → main
```

### 2. 紧急修复流程
```
hotfix/xxx → main (直接修复)
main → release (同步)
main → dev (同步)
```

### 3. PR 模板

创建 `.github/pull_request_template.md`：

```markdown
## 变更说明
<!-- 描述本次 PR 的主要变更 -->

## 变更类型
- [ ] 🚀 新功能
- [ ] 🐛 Bug 修复
- [ ] 📝 文档更新
- [ ] 🎨 代码格式化
- [ ] ♻️ 代码重构
- [ ] ⚡️ 性能优化
- [ ] 🔧 配置更改

## 测试
- [ ] 本地测试通过
- [ ] 单元测试通过
- [ ] 集成测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 检查了向后兼容性

## 相关问题
Closes #(issue)
```

这样的配置确保了代码质量和部署安全！ 