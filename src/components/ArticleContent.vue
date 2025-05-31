<template>
  <article class="article">
    <header class="article-header">
      <h1 class="article-title">{{ title }}</h1>
      <time class="article-date">{{ formattedDate }}</time>
      <div v-if="tags && tags.length" class="article-tags">
        <span v-for="(tag, index) in tags" :key="index" class="article-tag">{{ tag }}</span>
      </div>
    </header>
    <div class="article-content" ref="articleContent">
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
              <div class="error-text">图片加载失败</div>
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
    }
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
</style>