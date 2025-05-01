<template>
  <footer class="footer">
    <p>© {{ currentYear }} {{ siteName }}. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    siteName: {
      type: String,
      default: "EastWind",
    },
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.footer {
  margin-top: 4rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 0.875rem;
}
</style>