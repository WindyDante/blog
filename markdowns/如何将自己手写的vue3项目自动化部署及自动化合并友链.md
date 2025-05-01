---
title: 如何将自己手写的vue3项目自动化部署及自动化合并友链
date: 2024-10-11 14:22:27
tags: 自动化
---

# 手动部署项目

有时候我们写了一个作品，但是没有服务器，穷啊，也不是经常用的到服务器，如果不考虑网络速度的情况下，当然，你可以选择使用Github来作为你的前端服务器，这里只说明Vue3，因为本人使用的就是Vue3来操作的，其他的语言也是差不多的道理，可以参考搜索引擎中的其他大佬所编写的教程查看

好，到这里，我们说明怎么部署，部署是相当简单的

我是通过vite构建的，所以我的下面是有一个`vite.config.js`

```js
export default defineConfig({
  base:"/headwriteblog/",	// 这里改为你的仓库的名称
  plugins: [			  // https://github.com/WindyDante/headwriteblog 以这个为例就可以清晰的看出来了
    vue(),
  ],
  build:{
    outDir:"docs"	// 这里是为后续的npm run build做准备,build后内容会存在于docs目录下
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

创建 gh-pages 分支，并将打包的 dist 文件夹下的所有东西上传到**gh-pages**分支

这几个操作都比较简单，具体自己去操作就行，命令我放在下面了

- 打包：npm run build
- 添加所有修改过的文件到暂存区:git add .
- 提交(-m是加一些你想写的内容)：git commit -m 'commit dist'
- 推送到远程分支(branch是你的分支，自己更改)：git push origin `<branch>`

在Github Pages中做页面选择的配置

![image-20241011173102351](https://s2.loli.net/2024/10/11/gWUcDL1leKuToGm.png)

等actions运行完成后，访问`https://你的用户名.github.io/你的仓库名/`

手动部署项目就完成了

# 自动部署项目

手动部署项目，每次都需要机器化的工作，我们可以利用Github Action的方式，来将机器化流程修改为工作流的方式

Github Action如何操作这里不说明了，gpt或者官方文档就可以看的到

分享一下我的工作流代码

```yaml
name: CI Workflow
# 当推送到 master 分支 到 master 分支时触发 CI  workflow
# 也可以设定触发其他情况，这个可以让gpt给你写或者在官方文档搜一下对应的情况
on:
  push:
    branches:
      - master

# 设置权限，允许读取内容、写入页面和 ID 令牌
# 这个是权限，只有本人仓库才能进行操作
permissions:
  contents: read
  pages: write
  id-token: write
# 定义一个名为 build 的 job，在 ubuntu-latest 环境下运行
jobs:
  build:
    runs-on: ubuntu-latest
# 执行步骤
    steps:
      # 检出代码
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 确保拉取完整的提交历史

      # 设置 Node.js 环境
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'  # 修改为 Node.js 20

      # 清理旧的依赖和锁定文件
      - name: Clean up node_modules and package-lock.json
        run: |
          rm -rf node_modules
          rm -f package-lock.json

      # 安装依赖
      - name: Install dependencies
        run: npm install  # 重新安装依赖

      # 构建项目
      - name: Build project
        run: npm run build

      # 列出构建输出
      - name: List build output
        run: ls -R docs  # 检查 docs 目录是否存在并列出内容

      # 验证 docs 目录是否存在
      - name: Verify docs directory exists
        run: |
          if [ ! -d "docs" ]; then
            echo "docs directory not found."
            exit 1
          fi

      # 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages  # 部署到 gh-pages 分支
          folder: docs      # 确保你要部署的文件夹
          clean: true       # 清理旧的部署文件
          token: ${{ secrets.ACCESS_TOKEN }}  # 使用 Access Token 进行身份验证
```

写一下token怎么来的
