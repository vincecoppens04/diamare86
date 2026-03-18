<template>
  <div class="admin-layout">
    <aside class="sidebar glass-panel" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/diamare_logo.png" alt="Diamare86 Logo" class="logo-img" />
          <span class="logo-text">Maurice<span class="text-gradient">&Mia</span></span>
        </div>
        <button class="close-sidebar" @click="isSidebarOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <nav class="admin-nav">
        <router-link to="/admin/dashboard" class="nav-item" @click="isSidebarOpen = false">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/></svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </router-link>
        <router-link to="/admin/requests" class="nav-item" @click="isSidebarOpen = false">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="m22 7-7.1 3.78c-.54.29-1.28.29-1.82 0L6 7"/></svg>
          </span>
          <span class="nav-label">Aanvragen</span>
        </router-link>
        <router-link to="/admin/calendar" class="nav-item" @click="isSidebarOpen = false">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </span>
          <span class="nav-label">Kalender - Boekingen</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item" @click="isSidebarOpen = false">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
          <span class="nav-label">Instellingen</span>
        </router-link>
        <router-link to="/admin/emails" class="nav-item" @click="isSidebarOpen = false">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </span>
          <span class="nav-label">E-mails</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn neo-btn neo-btn-outline">
          <span class="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </span>
          Uitloggen
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <button class="menu-btn" @click="isSidebarOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <div class="topbar-brand">
          <span v-if="!isSidebarOpen" class="mobile-logo">
            <img src="@/assets/diamare_logo.png" alt="" class="mobile-logo-img" />
          </span>
          <span class="breadcrumb">Maurice&Mia / Beheer</span>
        </div>
        <div class="topbar-actions">
           <router-link to="/" class="view-site neo-btn neo-btn-outline" target="_blank">
             Website Bekijken
           </router-link>
        </div>
      </header>
      
      <main class="content-area animate-fade-in">
        <router-view></router-view>
      </main>
    </div>
    
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()
const isSidebarOpen = ref(false)

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.sidebar {
  width: 280px;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: -280px;
  z-index: 100;
  transition: var(--transition-bounce);
  border-right: 1px solid var(--surface-border);
}

.sidebar.sidebar-open {
  left: 0;
}

@media (min-width: 1024px) {
  .sidebar {
    left: 0;
    position: sticky;
    height: 100vh;
  }
}

.sidebar-header {
  padding: 2.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-img {
  height: 32px;
  width: auto;
}

.logo-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.admin-nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.875rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(124, 58, 237, 0.05); /* Using var equivalent */
  color: var(--accent-primary);
  transform: translateX(4px);
}

.nav-item.router-link-active {
  background: white;
  color: var(--accent-primary);
  border-color: var(--surface-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  left: -1px;
  width: 4px;
  height: 20px;
  background: var(--accent-primary);
  border-radius: 0 4px 4px 0;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.logout-btn {
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--surface-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

@media (min-width: 1024px) {
  .topbar {
    padding: 1rem 3rem;
  }
}

.breadcrumb {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
}

.content-area {
  padding: 1.5rem;
  flex: 1;
}

@media (min-width: 1024px) {
  .content-area {
    padding: 3rem;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  z-index: 90;
}
.mobile-logo-img {
  height: 24px;
  width: auto;
}
</style>
