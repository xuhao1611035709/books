#!/bin/bash

# ESXi 部署脚本
# 使用方法: ./deploy.sh [分支名] [操作]
# 示例: ./deploy.sh release build

set -e

# 默认参数
BRANCH=${1:-release}
ACTION=${2:-deploy}
REPO_URL="https://github.com/xuhao1611035709/books.git"
APP_DIR="/opt/books"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查系统依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    command -v git >/dev/null 2>&1 || { log_error "git 未安装，请先安装 git"; exit 1; }
    command -v docker >/dev/null 2>&1 || { log_error "docker 未安装，请先安装 docker"; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "docker-compose 未安装，请先安装 docker-compose"; exit 1; }
    
    log_success "系统依赖检查完成"
}

# 克隆或更新代码
setup_repo() {
    log_info "设置代码仓库..."
    
    if [ ! -d "$APP_DIR" ]; then
        log_info "克隆仓库到 $APP_DIR..."
        sudo mkdir -p "$APP_DIR"
        sudo git clone "$REPO_URL" "$APP_DIR"
        sudo chown -R $USER:$USER "$APP_DIR"
    else
        log_info "更新现有仓库..."
        cd "$APP_DIR"
        git fetch origin
    fi
    
    cd "$APP_DIR"
    
    # 切换到指定分支
    log_info "切换到分支: $BRANCH"
    git checkout "$BRANCH" || { log_error "分支 $BRANCH 不存在"; exit 1; }
    git pull origin "$BRANCH"
    
    log_success "代码仓库设置完成"
}

# 检查环境变量
check_env() {
    log_info "检查环境变量配置..."
    
    if [ ! -f "$APP_DIR/.env" ]; then
        log_warning ".env 文件不存在，从模板创建..."
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
        log_warning "请编辑 $APP_DIR/.env 文件配置环境变量"
        return 1
    fi
    
    # 检查必要的环境变量
    source "$APP_DIR/.env"
    
    if [ -z "$SUPABASE_URL_RELEASE" ]; then
        log_error "SUPABASE_URL_RELEASE 环境变量未设置"
        return 1
    fi
    
    log_success "环境变量检查完成"
}

# 构建应用
build_app() {
    log_info "构建 Docker 镜像..."
    cd "$APP_DIR"
    
    # 停止现有容器
    docker-compose down || true
    
    # 构建镜像
    docker-compose build --no-cache
    
    log_success "Docker 镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    cd "$APP_DIR"
    
    # 启动所有服务
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    docker-compose ps
    
    log_success "服务启动完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查各个端口
    local services=("3001:dev.books.local" "3002:release.books.local" "3003:books.local")
    
    for service in "${services[@]}"; do
        local port=$(echo "$service" | cut -d: -f1)
        local domain=$(echo "$service" | cut -d: -f2)
        
        log_info "检查端口 $port ($domain)..."
        
        if curl -f -s "http://localhost:$port/api/health" > /dev/null; then
            log_success "✅ $domain 健康检查通过"
        else
            log_warning "⚠️  $domain 健康检查失败"
        fi
    done
}

# 显示部署信息
show_info() {
    log_success "🎉 部署完成!"
    echo ""
    echo "📋 访问地址:"
    echo "  - 开发环境:   http://dev.books.local:3001"
    echo "  - 预发布环境: http://release.books.local:3002"
    echo "  - 生产环境:   http://books.local:3003"
    echo ""
    echo "🔧 管理命令:"
    echo "  - 查看状态: docker-compose ps"
    echo "  - 查看日志: docker-compose logs -f books-$BRANCH"
    echo "  - 重启服务: docker-compose restart books-$BRANCH"
    echo "  - 停止服务: docker-compose down"
    echo ""
    echo "📝 配置文件位置:"
    echo "  - 应用目录: $APP_DIR"
    echo "  - 环境配置: $APP_DIR/.env"
    echo "  - Nginx配置: $APP_DIR/nginx.conf"
}

# 清理函数
cleanup() {
    log_info "停止并清理容器..."
    cd "$APP_DIR"
    docker-compose down
    docker system prune -f
    log_success "清理完成"
}

# 主函数
main() {
    echo "🚀 ESXi Books 应用部署脚本"
    echo "分支: $BRANCH"
    echo "操作: $ACTION"
    echo ""
    
    case $ACTION in
        "deploy")
            check_dependencies
            setup_repo
            if ! check_env; then
                log_error "环境变量配置不完整，请配置后重新运行"
                exit 1
            fi
            build_app
            start_services
            health_check
            show_info
            ;;
        "build")
            setup_repo
            build_app
            ;;
        "start")
            start_services
            health_check
            ;;
        "stop")
            cd "$APP_DIR"
            docker-compose down
            log_success "服务已停止"
            ;;
        "restart")
            cd "$APP_DIR"
            docker-compose restart
            health_check
            log_success "服务已重启"
            ;;
        "logs")
            cd "$APP_DIR"
            docker-compose logs -f "books-$BRANCH"
            ;;
        "status")
            cd "$APP_DIR"
            docker-compose ps
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "使用方法: $0 [分支] [操作]"
            echo ""
            echo "分支选项:"
            echo "  dev      - 开发分支"
            echo "  release  - 预发布分支 (默认)"
            echo "  main     - 生产分支"
            echo ""
            echo "操作选项:"
            echo "  deploy   - 完整部署 (默认)"
            echo "  build    - 仅构建镜像"
            echo "  start    - 启动服务"
            echo "  stop     - 停止服务"
            echo "  restart  - 重启服务"
            echo "  logs     - 查看日志"
            echo "  status   - 查看状态"
            echo "  cleanup  - 清理容器"
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@" 