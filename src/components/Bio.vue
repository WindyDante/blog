<template>
  <div class="bio">
    <div class="bio-content">
      <h1 class="bio-name">{{ name }}</h1>
      <p class="bio-text">{{ description }}</p>
      <div class="bio-links">
        <a v-for="link in links" :key="link.url" :href="link.url" target="_blank" rel="noopener">
          {{ link.name }}
        </a>
      </div>
    </div>
    <div v-if="avatarUrl" class="bio-avatar">
      <img :src="avatarUrl" :alt="name" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bio',
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    links: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.bio {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0 4rem;
}

.bio-content {
  flex: 1;
}

.bio-name {
  margin: 0;
  font-size: 2rem;
}

.bio-text {
  font-size: 1.125rem;
  margin: 1rem 0;
  color: var(--color-text-light);
}

.bio-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.bio-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  align-self: center;
}

.bio-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 640px) {
  .bio {
    flex-direction: row;
    align-items: center;
  }
  
  .bio-avatar {
    align-self: flex-start;
  }
}
</style>