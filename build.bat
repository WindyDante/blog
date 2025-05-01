@echo off
echo 正在使用BuildKit构建Docker镜像...
set DOCKER_BUILDKIT=1
docker build -t blog:latest .
docker save -o blog.tar blog:latest
echo.
echo 构建完成。