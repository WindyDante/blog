# -------- 构建阶段 --------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # 安装 pnpm 并复制依赖定义
    RUN npm install -g pnpm@8.15.4
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install
    
    # 复制源代码并设置可执行权限
    COPY --chmod=0755 . .
    
    # 构建静态资源
    RUN pnpm build
    
    # -------- 生产阶段 --------
    FROM node:20-alpine AS production
    WORKDIR /app
    
    # 安装 serve 静态文件服务器
    RUN npm install -g serve
    
    # 拷贝构建产物
    COPY --from=builder /app/dist /app
    
    # 暴露 HTTP 服务端口
    EXPOSE 80
    
    # 启动并启用 SPA 路由 fallback
    CMD ["serve", ".", "-l", "80"]

    