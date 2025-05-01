<template>
  <article class="article-card">
    <a :href="`/blog/${post.slug}`" class="article-link" @click.prevent="navigateToPost(post.slug)">
      <time class="article-date">{{ formattedDate }}</time>
      <h2 class="article-title">{{ post.title }}</h2>
      <div v-if="post.tags && post.tags.length" class="article-tags">
        <span v-for="(tag, index) in post.tags" :key="index" class="article-tag">{{ tag }}</span>
      </div>
      <p class="article-excerpt">{{ post.excerpt }}</p>
      <span class="read-more">Read →</span>
    </a>
  </article>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.post.date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  methods: {
    navigateToPost(slug) {
      // 使用客户端导航跳转到文章详情页
      window.location.href = `/blog/${slug}`;
    }
  }
}
</script>

<style scoped>
.article-card {
  padding: 1.2em 1.5em;
  margin-bottom: 1.5em;
  background: var(--color-bg);
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

@media (max-width: 600px) {
  .article-card {
    padding: 0.9em 0.7em;
    margin-bottom: 1em;
    border-radius: 7px;
  }
  .article-title {
    font-size: 1.1em;
    word-break: break-all;
  }
  .article-excerpt {
    font-size: 0.95em;
    line-height: 1.5;
    max-height: 2.9em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .article-date {
    font-size: 0.85em;
  }
  .article-tags {
    flex-wrap: wrap;
    gap: 0.2em;
  }
}
.article-link {
  display: block;
  border-bottom: none;
  transition: transform var(--transition);
}

.article-link:hover {
  transform: translateX(4px);
}

.article-date {
  display: block;
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.article-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 4px;
  color: var(--color-text-light);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.article-title {
  margin: 0 0 0.5rem;
}

.article-excerpt {
  color: var(--color-text-light);
  margin: 0.5rem 0;
}

.read-more {
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>