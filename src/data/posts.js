import { loadMarkdownPosts } from '../utils/markdownLoader.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取项目根目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');

// 从markdowns目录加载所有markdown文件
const markdownsDir = path.join(projectRoot, 'markdowns');
export const posts = loadMarkdownPosts(markdownsDir);