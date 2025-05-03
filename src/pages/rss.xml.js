import { generateRSS } from '../utils/rssGenerator.js';

export async function get() {
  // 生成RSS内容
  const rssContent = generateRSS();
  
  // 返回RSS XML
  return {
    body: rssContent,
    headers: {
      'Content-Type': 'application/xml'
    }
  };
}