<template>
  <nav class="navigation">
    <div class="nav-brand">
      <a @click.prevent="navigateTo('/')" href="/">{{ siteName }}</a>
    </div>
    <div class="nav-links">
      <a @click.prevent="navigateTo('/')" href="/" class="nav-link">Home</a>
      <a @click.prevent="navigateTo('/blog')" href="/blog" class="nav-link">Blog</a>
      <button
        class="theme-toggle"
        @click="toggleTheme"
        aria-label="Toggle dark mode"
      >
        {{ isDark ? "☀️" : "🌙" }}
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    siteName: {
      type: String,
      default: "EastWind",
    },
  },
  data() {
    return {
      isDark: false,
    };
  },
  mounted() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    this.isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle("dark", this.isDark);
      document.documentElement.style.backgroundColor = this.isDark
        ? "#1a1a1a"
        : "#ffffff";
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
    },
    navigateTo(path) {
      // 使用客户端导航而不是普通链接
      if (window.location.pathname !== path) {
        window.location.href = path;
      }
    },
  },
};
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 3rem;
}

.nav-brand a {
  font-size: 1.2rem;
  font-weight: 500;
  border-bottom: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  border-bottom: none;
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--color-text);
}

.nav-link:hover::after {
  width: 100%;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  color: var(--color-text);
}
</style>