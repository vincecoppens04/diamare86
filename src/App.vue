<template>
  <div class="app-shell">
    <nav class="navbar glass-panel">
      <router-link to="/" class="logo">
        <span class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/></svg>
        </span>
        <span class="logo-text">Diamare<span class="text-gradient">86</span></span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/calendar" class="nav-link">Book Now</router-link>
      </div>

      <router-link to="/admin/login" class="admin-btn neo-btn neo-btn-outline">
        Admin
      </router-link>
    </nav>

    <main>
      <router-view></router-view>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-right:4px;"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/></svg>
          Diamare86
        </p>
        <p class="footer-copy">&copy; {{ new Date().getFullYear() }} Diamare86 · All rights reserved</p>
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

.logo-icon {
  font-size: 1.5rem;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.footer-brand {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.1rem;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
