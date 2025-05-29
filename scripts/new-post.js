import fs from 'fs';
import path from 'path';

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('请提供文章标题: blog new 文章名');
    process.exit(1);
}

const title = args.join(' ');
const filename = `${title}.md`;
const markdownsDir = path.join(process.cwd(), 'markdowns');
const filePath = path.join(markdownsDir, filename);

// 确保 markdowns 目录存在
if (!fs.existsSync(markdownsDir)) {
    fs.mkdirSync(markdownsDir, { recursive: true });
}

// 检查文件是否已存在
if (fs.existsSync(filePath)) {
    console.error(`文章 "${filename}" 已存在！`);
    process.exit(1);
}

// 获取当前时间
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

// 创建文档内容
const content = `---
title: ${title}
date: ${dateString}
tags: 
---

`;

// 写入文件
try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 成功创建文章: ${filename}`);
    console.log(`📁 文件路径: ${filePath}`);
} catch (error) {
    console.error('创建文件时出错:', error.message);
    process.exit(1);
}