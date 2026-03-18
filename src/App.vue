<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const isTransparentPage = computed(() => route.path === '/')

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app-shell">
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled, 'navbar-transparent': isTransparentPage }">
      <router-link to="/" class="logo">
        <img src="@/assets/diamare_logo.png" alt="Maurice&Mia Logo" class="logo-img" />
        <span class="logo-text">Maurice<span class="text-gradient">&Mia</span></span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/calendar" class="nav-link">Boek Nu</router-link>
      </div>

      <router-link to="/admin/login" class="admin-btn neo-btn neo-btn-outline">
        Beheer
      </router-link>
    </nav>

    <main>
      <router-view></router-view>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">
          <img src="@/assets/diamare_logo.png" alt="" class="footer-logo" />
          Maurice&Mia
        </p>
        <p class="footer-copy">&copy; {{ new Date().getFullYear() }} Maurice&Mia · All rights reserved</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  border-radius: 0;
  border-bottom: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-img {
  height: 32px;
  width: auto;
}

.logo-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  transition: var(--transition-smooth);
}

.nav-link:hover {
  color: var(--accent-primary);
  background: rgba(124, 58, 237, 0.05);
}

.nav-link.router-link-exact-active {
  color: var(--accent-primary);
  background: rgba(124, 58, 237, 0.1);
}

.admin-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
}

main {
  flex: 1;
}

.site-footer {
  border-top: 1px solid var(--surface-border);
  padding: 3rem 2rem;
  margin-top: 5rem;
  background: var(--bg-secondary);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-logo {
  height: 20px;
  width: auto;
  vertical-align: middle;
  margin-right: 8px;
}

.footer-copy {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .navbar {
    padding: 0.75rem 1rem;
  }
  .nav-links {
    display: none;
  }
  .footer-inner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
