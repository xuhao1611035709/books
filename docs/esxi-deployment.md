# 🖥️ ESXi 本地部署指南

## 📋 部署架构

```
ESXi 宿主机
├── VM1: Ubuntu Server (Docker Host)
│   ├── books-dev (dev分支)     → :3001
│   ├── books-release (release分支) → :3002  
│   └── books-main (main分支)   → :3003
├── VM2: Nginx (反向代理)
│   ├── dev.books.local → VM1:3001
│   ├── release.books.local → VM1:3002
│   └── books.local → VM1:3003
└── VM3: 数据库服务器 (可选)
    └── PostgreSQL/MySQL
```

## 🚀 第一步：创建 Ubuntu 虚拟机

### **虚拟机规格**
- **CPU**: 2-4 核心
- **内存**: 4-8 GB
- **存储**: 50-100 GB
- **网络**: VM Network (桥接或NAT)
- **系统**: Ubuntu Server 22.04 LTS

### **网络配置**
```bash
# 设置静态IP (修改 /etc/netplan/00-installer-config.yaml)
network:
  version: 2
  ethernets:
    ens33:
      dhcp4: false
      addresses:
        - 192.168.1.100/24  # 根据你的网络调整
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

## 🐳 第二步：安装 Docker 环境

### **安装 Docker**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y
```

### **安装 Git 和 Node.js**
```bash
# 安装 Git
sudo apt install git -y

# 安装 Node.js (使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 验证安装
node --version
npm --version
docker --version
```

## 📦 第三步：创建 Docker 配置

### **Dockerfile**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **docker-compose.yml**
```yaml
version: '3.8'

services:
  # 开发环境 (dev分支)
  books-dev:
    build: .
    container_name: books-dev
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_ENV=development
      - NEXT_PUBLIC_SITE_URL=http://dev.books.local
      - NEXT_PUBLIC_API_URL=/api
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL_DEV}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY_DEV}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY_DEV}
    restart: unless-stopped
    networks:
      - books-network

  # 预发布环境 (release分支)
  books-release:
    build: .
    container_name: books-release
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_ENV=staging
      - NEXT_PUBLIC_SITE_URL=http://release.books.local
      - NEXT_PUBLIC_API_URL=/api
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL_RELEASE}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY_RELEASE}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY_RELEASE}
    restart: unless-stopped
    networks:
      - books-network

  # 生产环境 (main分支)
  books-main:
    build: .
    container_name: books-main
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_ENV=production
      - NEXT_PUBLIC_SITE_URL=http://books.local
      - NEXT_PUBLIC_API_URL=/api
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL_MAIN}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY_MAIN}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY_MAIN}
    restart: unless-stopped
    networks:
      - books-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: books-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - books-dev
      - books-release
      - books-main
    restart: unless-stopped
    networks:
      - books-network

networks:
  books-network:
    driver: bridge
```

### **nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream books-dev {
        server books-dev:3000;
    }
    
    upstream books-release {
        server books-release:3000;
    }
    
    upstream books-main {
        server books-main:3000;
    }

    # 开发环境
    server {
        listen 80;
        server_name dev.books.local;
        
        location / {
            proxy_pass http://books-dev;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # 预发布环境
    server {
        listen 80;
        server_name release.books.local;
        
        location / {
            proxy_pass http://books-release;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # 生产环境
    server {
        listen 80;
        server_name books.local;
        
        location / {
            proxy_pass http://books-main;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## ⚙️ 第四步：环境配置

### **创建环境变量文件**
```bash
# 创建 .env 文件
cp .env.example .env

# 编辑环境变量
nano .env
```

### **.env 文件内容**
```bash
# DEV 环境
SUPABASE_URL_DEV=https://your-dev-project.supabase.co
SUPABASE_KEY_DEV=your_dev_anon_key
SUPABASE_SERVICE_KEY_DEV=your_dev_service_role_key

# RELEASE 环境
SUPABASE_URL_RELEASE=https://srnkygbjnuyqwyqhoctc.supabase.co
SUPABASE_KEY_RELEASE=your_release_anon_key
SUPABASE_SERVICE_KEY_RELEASE=your_release_service_role_key

# MAIN 环境
SUPABASE_URL_MAIN=https://your-main-project.supabase.co
SUPABASE_KEY_MAIN=your_main_anon_key
SUPABASE_SERVICE_KEY_MAIN=your_main_service_role_key
```

## 🚀 第五步：部署脚本

### **deploy.sh**
```bash
#!/bin/bash

# 部署脚本
set -e

BRANCH=${1:-release}
echo "🚀 部署分支: $BRANCH"

# 克隆或更新代码
if [ ! -d "/opt/books" ]; then
    echo "📥 克隆仓库..."
    sudo git clone https://github.com/xuhao1611035709/books.git /opt/books
    sudo chown -R $USER:$USER /opt/books
fi

cd /opt/books

# 切换到指定分支
echo "🔄 切换到分支: $BRANCH"
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# 构建和部署
echo "🔨 构建应用..."
docker-compose down
docker-compose build
docker-compose up -d

echo "✅ 部署完成!"
echo "📋 访问地址:"
echo "  - 开发环境: http://dev.books.local"
echo "  - 预发布环境: http://release.books.local"  
echo "  - 生产环境: http://books.local"
```

## 🌐 第六步：DNS 配置

### **在客户端设备配置 hosts**

#### **Windows**
编辑 `C:\Windows\System32\drivers\etc\hosts`：
```
192.168.1.100 books.local
192.168.1.100 dev.books.local
192.168.1.100 release.books.local
```

#### **macOS/Linux**
编辑 `/etc/hosts`：
```
192.168.1.100 books.local
192.168.1.100 dev.books.local
192.168.1.100 release.books.local
```

## 📋 部署命令

### **初始部署**
```bash
# 克隆部署脚本
git clone https://github.com/xuhao1611035709/books.git /opt/books
cd /opt/books

# 配置环境变量
cp .env.example .env
nano .env

# 给部署脚本执行权限
chmod +x deploy.sh

# 部署 release 分支
./deploy.sh release
```

### **更新部署**
```bash
# 更新 release 分支
./deploy.sh release

# 更新 main 分支
./deploy.sh main

# 更新 dev 分支
./deploy.sh dev
```

### **查看状态**
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f books-release

# 重启服务
docker-compose restart books-release
```

## 🔧 故障排除

### **常见问题**

1. **端口冲突**
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep :3002
   
   # 停止冲突服务
   docker-compose down
   ```

2. **DNS 解析问题**
   ```bash
   # 测试域名解析
   nslookup release.books.local
   ping release.books.local
   ```

3. **容器启动失败**
   ```bash
   # 查看详细日志
   docker-compose logs books-release
   
   # 重新构建
   docker-compose build --no-cache books-release
   ```

## 📊 监控和维护

### **设置定时备份**
```bash
# 添加到 crontab
crontab -e

# 每天凌晨2点备份
0 2 * * * /opt/books/backup.sh
```

### **日志轮转**
```bash
# 配置 Docker 日志限制
echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"5"}}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

## 🎯 下一步

1. **SSL 证书**：配置 Let's Encrypt 或自签名证书
2. **监控告警**：集成 Prometheus + Grafana
3. **自动化 CI/CD**：设置 webhook 自动部署
4. **负载均衡**：多实例部署和负载均衡 