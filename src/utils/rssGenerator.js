import { posts } from '../data/posts.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取项目根目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');

/**
 * 生成RSS XML内容
 * @param {string} siteUrl 网站URL
 * @param {string} siteName 网站名称
 * @returns {string} RSS XML内容
 */
export function generateRSS(siteUrl = 'https://1wind.cn', siteName = '东风') {
  // 确保URL末尾没有斜杠
  siteUrl = siteUrl.replace(/\/$/, '');
  
  // RSS头部
  let rss = `<?xml-stylesheet type="text/xsl" href="rss-style.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${siteName}</title>
  <link>${siteUrl}</link>
  <description>${siteName}的个人博客</description>
  <language>zh-cn</language>
  <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
`;
  
  // 按日期排序，最新的文章排在前面
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // 添加文章条目
  for (const post of sortedPosts) {
    const postDate = new Date(post.date);
    const pubDate = postDate.toUTCString();
    
    // 移除HTML标签获取纯文本摘要
    const plainTextExcerpt = post.excerpt.replace(/<[^>]+>/g, '');
    
    rss += `  <item>
    <title>${post.title}</title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid>${siteUrl}/blog/${post.slug}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${plainTextExcerpt}]]></description>
  </item>
`;
  }
  
  // RSS尾部
  rss += '</channel>\n</rss>';
  
  return rss;
}

/**
 * 将RSS内容写入文件
 * @param {string} rssContent RSS XML内容
 */
export function writeRSSFile(rssContent) {
  const publicDir = path.join(projectRoot, 'public');
  const rssFilePath = path.join(publicDir, 'rss.xml');
  
  // 确保public目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // 写入RSS文件
  fs.writeFileSync(rssFilePath, rssContent, 'utf-8');
  
  console.log(`RSS文件已生成: ${rssFilePath}`);
}