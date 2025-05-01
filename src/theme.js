// 全局主题管理模块
export function getTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return savedTheme || (prefersDark ? 'dark' : 'light');
}

export function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  localStorage.setItem('theme', theme);
}

export function initTheme() {
  const theme = getTheme();
  setTheme(theme);
  return theme;
}