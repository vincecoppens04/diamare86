<template>
  <div class="dashboard-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>Beheer <span class="text-gradient">Hub</span></h1>
        <p>Directe acties en operationeel overzicht.</p>
      </div>
      <div class="header-date">
        {{ new Date().toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' }) }}
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Dashboard laden...</p>
    </div>
    
    <div v-else-if="error" class="error-panel glass-panel">
      <div class="error-icon-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      <h3>Dashboardgegevens niet beschikbaar</h3>
      <p>We kunnen de database niet bereiken. Probeer het over een moment opnieuw.</p>
      <button @click="fetchMetrics" class="neo-btn neo-btn-outline mt-4">Opnieuw proberen</button>
    </div>
    
    <div v-else class="dashboard-content">
      <!-- Main Action Cards -->
      <div class="metrics-grid">
        <!-- Pending Requests (Most Important) -->
        <router-link to="/admin/requests" class="metric-card glass-panel glass-panel-hover highlight-pending">
          <div class="metric-info">
            <span class="metric-label">Acties Vereist</span>
            <h2 class="metric-value">Openstaande Aanvragen: {{ pendingCount }}</h2>
          </div>
          <div class="metric-action-hint">
            Bekijk Aanvragen
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </router-link>

        <!-- Next Booking -->
        <div class="metric-card glass-panel">
          <div class="metric-info">
            <span class="metric-label">Volgende Aankomst</span>
            <div v-if="nextBooking" class="next-booking-details">
              <h2 class="guest-name">{{ nextBooking.guest_name }}</h2>
              <p class="stay-period">
                {{ formatDate(nextBooking.start_date) }} — {{ formatDate(nextBooking.end_date) }}
              </p>
            </div>
            <div v-else class="no-upcoming">
              <p>Geen aankomende boekingen gepland.</p>
            </div>
          </div>
          <div class="metric-sub">
            <span class="badge">totaal {{ upcomingCount }} aankomende verblijven</span>
          </div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <section class="nav-section">
        <h3 class="section-label">Snelle Navigatie</h3>
        <div class="nav-grid">
          <router-link to="/admin/requests" class="nav-card glass-panel glass-panel-hover">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="m22 7-7.1 3.78c-.54.29-1.28.29-1.82 0L6 7"/></svg>
            </span>
            <div class="nav-text">
              <strong>Aanvragen</strong>
              <span>Verblijven goedkeuren</span>
            </div>
          </router-link>
          
          <router-link to="/admin/calendar" class="nav-card glass-panel glass-panel-hover">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </span>
            <div class="nav-text">
              <strong>Kalender</strong>
              <span>Data beheren</span>
            </div>
          </router-link>
          
          <router-link to="/admin/settings" class="nav-card glass-panel glass-panel-hover">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <div class="nav-text">
              <strong>Instellingen</strong>
              <span>Prijzen & Inhoud</span>
            </div>
          </router-link>
          
          <router-link to="/admin/emails" class="nav-card glass-panel glass-panel-hover">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <div class="nav-text">
              <strong>E-mails</strong>
              <span>Sjablonen bewerken</span>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface Booking {
  id: string
  guest_name: string
  start_date: string
  end_date: string
}

const pendingCount = ref(0)
const upcomingCount = ref(0)
const nextBooking = ref<Booking | null>(null)
const loading = ref(true)
const error = ref(false)

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('nl-NL', { month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

const fetchMetrics = async () => {
  loading.value = true
  error.value = false
  
  try {
    const today = new Date().toISOString().split('T')[0]

    // 1. Pending Requests Count
    const { count: pCount, error: pErr } = await supabase
      .from('booking_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    
    if (pErr) throw pErr
    pendingCount.value = pCount || 0

    // 2. Upcoming Bookings Count
    const { count: uCount, error: uErr } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('end_date', today)

    if (uErr) throw uErr
    upcomingCount.value = uCount || 0

    // 3. Next Upcoming Booking Details
    const { data: nData, error: nErr } = await supabase
      .from('bookings')
      .select('id, guest_name, start_date, end_date')
      .gte('start_date', today)
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (nErr && nErr.code !== 'PGRST116') throw nErr // PGRST116 is "no rows returned"
    nextBooking.value = nData as Booking | null

  } catch (err) {
    console.error('Dashboard Load Error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchMetrics)
</script>

<style scoped>
.dashboard-page {
  padding-bottom: 4rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.header-date {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(139, 92, 246, 0.06);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

/* Dashboard Content Layout */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.metric-card {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  text-decoration: none;
  transition: var(--transition-bounce);
}

.highlight-pending {
  background: white;
  border: 2px solid var(--status-warning-bg);
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.08);
}

.highlight-pending:hover {
  border-color: var(--status-warning);
  transform: translateY(-4px);
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  display: block;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.metric-action-hint {
  margin-top: 2rem;
  font-weight: 700;
  color: var(--status-warning);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

/* Next Booking Details */
.next-booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guest-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.stay-period {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.metric-sub {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border-radius: var(--radius-full);
}

/* Nav Grid */
.nav-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .nav-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.nav-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-decoration: none;
  transition: var(--transition-bounce);
}

.nav-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-primary);
  background: white;
}

.nav-icon {
  font-size: 1.75rem;
}

.nav-text {
  display: flex;
  flex-direction: column;
}

.nav-text strong {
  font-size: 1.05rem;
  color: var(--text-primary);
}

.nav-text span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Error Panel */
.error-panel {
  padding: 4rem;
  text-align: center;
  max-width: 600px;
  margin: 2rem auto;
}

.error-icon-lg {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.mt-4 { margin-top: 1.5rem; }

/* States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 6rem;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
