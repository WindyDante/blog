// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  // 确保在生产环境中路由正确工作
  build: {
    format: 'file'
  },
  // 启用客户端路由
  prefetch: {
    defaultStrategy: 'hover'
  }
});