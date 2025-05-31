import fs from 'fs';
import path from 'path';

/**
 * 解析markdown文件的frontmatter
 * @param {string} content markdown文件内容
 * @returns {Object} 解析后的frontmatter对象
 */
function parseFrontmatter(content) {
  // frontmatter 分隔符允许后面有空格或回车
  const frontmatterRegex = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;
  const match = content.match(frontmatterRegex);
  if (!match) return {};
  const frontmatterBlock = match[1];
  const metadata = {};
  let currentKey = null;
  let inMultilineValue = false;
  const lines = frontmatterBlock.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (inMultilineValue && currentKey) {
      if (line === '"""' || line === "'''") {
        inMultilineValue = false;
        continue;
      }
      metadata[currentKey] += '\n' + line;
      continue;
    }
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      currentKey = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value === '"""' || value === "'''") {
        inMultilineValue = true;
        metadata[currentKey] = '';
      } else {
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        metadata[currentKey] = value;
      }
    }
  }
  return metadata;
}

/**
 * 获取markdown文件内容（不包含frontmatter）并转换为HTML
 * @param {string} content markdown文件内容
 * @returns {string} 不包含frontmatter的HTML内容
 */
function getMarkdownContent(content) {
  // frontmatter 分隔符允许后面有空格或回车
  const frontmatterRegex = /^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/;
  const markdownContent = content.replace(frontmatterRegex, '');
  
  // 简单的Markdown到HTML转换
  let html = markdownContent;
  
  // 先提取所有代码块，并用占位符替换，避免代码块内容被其他规则处理
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, function(match, code) {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(code.trim());
    return placeholder;
  })
    
    // 转换标题
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    
    // 转换图片（必须在链接之前处理）
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
      // 为图片添加加载动画包装，只保留动画不要文字
      return `<div class="image-loading-wrapper">
        <div class="image-loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="image-container">
          <img src="${src}" alt="${alt}" class="loading" loading="lazy" />
        </div>
      </div>`;
    })
    
    // 转换粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // 转换列表
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    
    // 转换链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    
    // 转换表格
    .replace(/\|(.+)\|/g, function(match) {
      const cells = match.split('|').slice(1, -1);
      const isHeader = cells.some(cell => cell.includes('---'));
      
      if (isHeader) return '';
      
      const cellsHtml = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${cellsHtml}</tr>`;
    })
    .replace(/^\|(.+)\|$/gm, function(match, p1) {
      if (p1.includes('---')) return '';
      return `<table><tr>${p1.split('|').map(cell => `<th>${cell.trim()}</th>`).join('')}</tr>`;
    })
    
    // 转换段落 (必须放在最后，避免影响其他元素)
    .replace(/^(?!<[h|l|u|p|t|c])(.+)$/gm, '<p>$1</p>');
    
  // 包装列表项
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>');
  }
  
  // 包装表格
  if (html.includes('<tr>')) {
    html = html.replace(/(<tr>.+<\/tr>\n)+/g, '<table>$&</table>');
  }
  
  // 还原代码块
  codeBlocks.forEach((code, index) => {
    // 对代码内容进行HTML特殊字符转义，防止被浏览器解析
    const escapeHtml = str => str.replace(/&/g, '&amp;')
                                 .replace(/</g, '&lt;')
                                 .replace(/>/g, '&gt;')
                                 .replace(/"/g, '&quot;')
                                 .replace(/'/g, '&#39;');
    html = html.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${escapeHtml(code)}</code></pre>`);
  })
  
  return html;
}

/**
 * 从目录中读取所有markdown文件并解析
 * @param {string} dirPath markdown文件目录路径
 * @returns {Array} 解析后的文章数组
 */
export function loadMarkdownPosts(dirPath) {
  const posts = [];
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 解析frontmatter
      const metadata = parseFrontmatter(content);
      
      // 获取markdown内容（确保frontmatter已被移除）
      const markdownContent = getMarkdownContent(content);
      
      // 生成slug（用文件名作为slug）
      const slug = path.basename(file, '.md');
      
      // 确保从frontmatter中正确提取标题和日期
      const title = metadata.title ? metadata.title.replace(/["']/g, '') : 'Untitled';
      const date = metadata.date ? metadata.date.replace(/["']/g, '') : new Date().toISOString().split('T')[0];
      
      posts.push({
        title: title,
        slug,
        date: date,
        tags: metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [],
        excerpt: metadata.excerpt || markdownContent.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').slice(0, 60) + '...',
        content: `<div class="markdown-content">${markdownContent}</div>`
      });
    }
  }
  
  return posts;
}