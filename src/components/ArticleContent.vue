<template>
  <article class="article">
    <header class="article-header">
      <h1 class="article-title">{{ title }}</h1>
      <time class="article-date">{{ formattedDate }}</time>
      <div v-if="tags && tags.length" class="article-tags">
        <span v-for="(tag, index) in tags" :key="index" class="article-tag">{{ tag }}</span>
      </div>
    </header>
    
    <!-- AI摘要显示区域 -->
    <div id="summary-box"></div>
    
    <!-- 文章内容区域，添加id供AI脚本识别 -->
    <div id="my-article" class="article-content" ref="articleContent">
      <slot></slot>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ArticleContent',
  props: {
    title: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.setupImageLoading();
    this.setupCodeBlockCollapse();
    this.loadAISummaryScript();
  },
  methods: {
    setupImageLoading() {
      // 使用nextTick确保DOM已经更新
      this.$nextTick(() => {
        const images = this.$refs.articleContent.querySelectorAll('img');

        images.forEach(img => {
          const wrapper = img.closest('.image-loading-wrapper');
          const spinner = wrapper?.querySelector('.image-loading-spinner');

          if (!wrapper || !spinner) return;

          // 图片加载完成事件
          img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
            spinner.style.display = 'none';
          });

          // 图片加载失败事件
          img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');
            spinner.innerHTML = `
              <div class="error-icon">❌</div>
            `;
          });

          // 如果图片已经加载完成（缓存情况）
          if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('loading');
            img.classList.add('loaded');
            spinner.style.display = 'none';
          }
        });
      });
    },
    setupCodeBlockCollapse() {
      this.$nextTick(() => {
        // 查找所有带收起功能的代码块容器
        const codeBlockContainers = this.$refs.articleContent.querySelectorAll('.code-block-container.collapsible');

        codeBlockContainers.forEach(container => {
          const toggleButton = container.querySelector('.code-block-toggle');
          const codeContent = container.querySelector('.code-content');
          const toggleIcon = container.querySelector('.toggle-icon');
          const toggleText = container.querySelector('.toggle-text');

          if (!toggleButton || !codeContent || !toggleIcon || !toggleText) return;

          // 默认收起状态（超过15行的代码块默认收起）
          const lineCount = parseInt(container.dataset.lines);
          if (lineCount > 15) {
            container.classList.add('collapsed');
            toggleText.textContent = '展开';
          }

          // 点击事件处理
          toggleButton.addEventListener('click', () => {
            const isCollapsed = container.classList.contains('collapsed');

            if (isCollapsed) {
              // 展开
              container.classList.remove('collapsed');
              toggleText.textContent = '收起';
            } else {
              // 收起
              container.classList.add('collapsed');
              toggleText.textContent = '展开';
            }
          });
        });
      });
    },
    loadAISummaryScript() {
      // 检查脚本是否已经加载，避免重复加载
      if (document.querySelector('script[src*="widget.js"]')) {
        console.log('AI摘要脚本已存在');
        return;
      }

      // 等待DOM完全渲染
      this.$nextTick(() => {
        // 确认目标元素存在
        const targetElement = document.getElementById('my-article');
        const summaryElement = document.getElementById('summary-box');
        
        if (!targetElement || !summaryElement) {
          console.error('目标元素未找到');
          return;
        }

        console.log('开始加载AI摘要脚本...');

        // 设置全局配置
        window.AI_WIDGET_CONFIG = {
          backendPrefix: 'https://summary.1wind.cn',
          baseUrl: 'https://summary.1wind.cn',
          staticPath: 'https://summary.1wind.cn/static/'
        };

        // 先加载CSS样式
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://summary.1wind.cn/static/widget.css';
        cssLink.onload = () => {
          console.log('AI摘要CSS加载成功');
        };
        cssLink.onerror = (error) => {
          console.error('AI摘要CSS加载失败:', error);
        };
        document.head.appendChild(cssLink);

        // 创建script元素
        const script = document.createElement('script');
        script.src = 'https://summary.1wind.cn/static/widget.js';
        script.setAttribute('data-selector', '#my-article');
        script.setAttribute('data-target', 'summary-box');
        script.setAttribute('data-backend-prefix', 'https://summary.1wind.cn');
        script.setAttribute('data-theme', 'light');
        script.setAttribute('data-show-stats', 'true');
        script.setAttribute('data-show-theme-toggle', 'true');
        script.setAttribute('data-show-header', 'true');
        script.setAttribute('data-show-footer', 'true');
        script.setAttribute('data-badge-text', '东风学习摘要');
        
        // 添加加载回调
        script.onload = () => {
          console.log('AI摘要脚本加载成功');
        };
        
        script.onerror = (error) => {
          console.error('AI摘要脚本加载失败:', error);
        };
        
        // 将脚本添加到页面
        document.head.appendChild(script);
      });
    },

    triggerAISummary() {
      // 尝试手动触发AI摘要生成
      try {
        // 检查是否有全局的初始化函数
        if (window.initAISummary) {
          window.initAISummary();
        } else if (window.AISummaryWidget) {
          new window.AISummaryWidget({
            selector: '#my-article',
            target: 'summary-box',
            backendPrefix: 'https://summary.1wind.cn'
          });
        } else {
          // 触发DOMContentLoaded事件，可能会重新初始化脚本
          const event = new Event('DOMContentLoaded');
          document.dispatchEvent(event);
        }
      } catch (error) {
        console.error('手动触发AI摘要失败:', error);
      }
    },
  }
}
</script>

<style scoped>
.article {
  margin-bottom: 2rem;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .article {
    padding: 0 0.5em;
    margin-bottom: 1.2rem;
    max-width: 100vw;
    border-radius: 7px;
  }

  .article-title {
    font-size: 1.25rem;
    word-break: break-all;
  }

  .article-content {
    font-size: 1rem;
    line-height: 1.7;
    word-break: break-word;
    overflow-wrap: break-word;
    padding: 0;
  }
}

.article-header {
  margin-bottom: 2rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.article-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 4px;
  color: var(--color-text-light);
  font-weight: 500;
}

.article-title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.article-date {
  display: block;
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.article-content {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.8;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content :deep(p) {
  margin: 1.5rem 0;
}

.article-content :deep(img) {
  margin: 2rem 0;
  border-radius: 4px;
}

.article-content :deep(blockquote) {
  margin: 2rem 0;
  padding-left: 1.5rem;
  border-left: 3px solid var(--color-text-light);
  font-style: italic;
  color: var(--color-text-light);
}

.article-content :deep(code) {
  background-color: var(--color-border);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.article-content :deep(pre) {
  background-color: var(--color-border);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.code-collapse-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding: 0;
  display: inline-block;
  transition: color 0.3s;
}

.code-collapse-button:hover {
  color: var(--color-primary-dark);
}

/* 新增样式 */
.code-block-container {
  margin: 1.5rem 0;
}

.code-block-toggle {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.code-block-toggle .toggle-icon {
  display: inline-block;
  transition: transform 0.3s;
}

.code-block-container.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.code-content {
  padding: 1rem;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow-x: auto;
  margin-top: 0.5rem;
}

.code-content.collapsed {
  max-height: 15em;
  overflow: hidden;
}

.code-content.expanded {
  max-height: none;
}
</style>