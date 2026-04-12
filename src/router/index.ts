import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

import Home from '@/pages/Home.vue'
import CalendarPage from '@/pages/CalendarPage.vue'

// Admin Layout
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminResetPassword from '@/pages/admin/AdminResetPassword.vue'
import AdminRequests from '@/pages/admin/AdminRequests.vue'
import AdminCalendar from '@/pages/admin/AdminCalendar.vue'
import AdminSettings from '@/pages/admin/AdminSettings.vue'
import AdminEmails from '@/pages/admin/AdminEmails.vue'
import AdminContracts from '@/pages/admin/AdminContracts.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarPage
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/reset',
    name: 'AdminResetPassword',
    component: AdminResetPassword
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      { path: 'requests', name: 'AdminRequests', component: AdminRequests },
      { path: 'calendar', name: 'AdminCalendar', component: AdminCalendar },
      { path: 'contracts', name: 'AdminContracts', component: AdminContracts },
      { path: 'settings', name: 'AdminSettings', component: AdminSettings },
      { path: 'emails', name: 'AdminEmails', component: AdminEmails }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach(async (to, _from, next) => {
  const isProtected = to.meta.requiresAuth || 
                     (to.path.startsWith('/admin') && !['/admin/login', '/admin/reset'].includes(to.path))

  if (isProtected) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return next({ name: 'AdminLogin' })
    }
  }
  next()
})

export default router
