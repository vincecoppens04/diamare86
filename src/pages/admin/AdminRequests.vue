<template>
  <div class="requests-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>Boekings<span class="text-gradient">aanvragen</span></h1>
        <p>Beoordeel en verwerk inkomende verblijfsaanvragen voor Maurice&Mia.</p>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Aanvragen laden...</p>
    </div>
    <div v-else-if="error" class="alert alert-error">
      <span class="alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </span>
      {{ error }}
    </div>
    
    <div v-else class="requests-container">
      <!-- Page Level Notifications -->
      <transition name="fade">
        <div v-if="successMsg" class="alert alert-success page-alert animate-slide-down">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {{ successMsg }}
        </div>
      </transition>

      <div v-if="requests.length === 0" class="empty-state glass-panel">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
        </div>
        <div class="status-content">
          <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">Geen Openstaande Aanvragen</h3>
          <p style="color: var(--text-muted); margin: 0;">U bent helemaal bij. Nieuwe boekingsaanvragen verschijnen hier voor beoordeling.</p>
        </div>
      </div>
      
      <div v-else class="requests-list">
        <div v-for="req in requests" :key="req.id" class="request-card glass-panel glass-panel-hover" :class="req.status">
          <div class="card-status-strip" :class="req.status"></div>
          
          <div v-if="req.status === 'pending' && !isRangeAvailable(req.start_date, req.end_date)" class="alert alert-warning animate-fade-in">
            <div class="alert-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div class="alert-content">
              <strong>Data niet meer beschikbaar!</strong>
              <p>Een andere boeking heeft deze data al bezet. U dient deze aanvraag te weigeren.</p>
            </div>
          </div>
          
          <div class="request-main">
            <div class="request-header">
              <div class="guest-primary">
                <h3>{{ req.guest_name }}</h3>
                <span class="status-badge" :class="req.status">{{ req.status }}</span>
              </div>
              <div class="request-date">{{ formatDate(req.created_at) }}</div>
            </div>

            <div class="request-details">
              <div class="detail-item">
                <span class="detail-label">Aankomst / Vertrek</span>
                <span class="detail-value">{{ formatDate(req.start_date) }} — {{ formatDate(req.end_date) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Contact</span>
                <span class="detail-value">
                  <a :href="'mailto:' + req.guest_email">{{ req.guest_email }}</a>
                  <span v-if="req.guest_phone" class="phone-separator">·</span>
                  <span v-if="req.guest_phone">{{ req.guest_phone }}</span>
                </span>
              </div>
            </div>

            <div class="request-message" v-if="req.message">
              <span class="detail-label">Bericht</span>
              <p>{{ req.message }}</p>
            </div>
          </div>

          <div class="request-actions">
            <div v-if="req.status === 'pending'" class="action-group">
              <button class="neo-btn neo-btn-outline refuse-btn" @click="handleRefuse(req)" :disabled="processingId === req.id">
                <span class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </span>
                Weigeren
              </button>
              <button class="neo-btn neo-btn-primary accept-btn" @click="openAcceptModal(req)" :disabled="processingId === req.id">
                <span class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Accepteren
              </button>
            </div>
            <div v-else class="reviewed-info">
              <span class="reviewed-label">Beoordeeld op</span>
              <span class="reviewed-date">{{ formatDate(req.reviewed_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Accept Modal -->
    <div v-if="selectedRequest" class="modal-overlay" @click="closeModal">
      <div class="modal-content glass-panel animate-fade-in" @click.stop>
        <div v-if="successMsg" class="modal-success-overlay animate-fade-in">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Geaccepteerd!</h3>
          <p>De boeking is succesvol bevestigd. Bevestigingsmail verstuurd.</p>
        </div>

        <div v-else>
        <div class="modal-header">
            <h3>Aanvraag Accepteren</h3>
            <button class="close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="error" class="alert alert-error mb-4">
              <span class="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              {{ error }}
            </div>

            <div class="modal-summary">
              <div class="summary-item">
                <label>Gast</label>
                <span>{{ selectedRequest.guest_name }}</span>
              </div>
              <div class="summary-item">
                <label>Periode</label>
                <span>{{ formatDate(selectedRequest.start_date) }} — {{ formatDate(selectedRequest.end_date) }}</span>
              </div>
            </div>
            
            <div class="alert info-alert">
              <span class="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12" y1="8" y2="8"/></svg>
              </span>
              <p>Accepteren bevestigt de boeking direct in de kalender en stuurt een bevestigingsmail naar de gast.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="neo-btn neo-btn-outline" @click="closeModal" :disabled="processingModal">Annuleren</button>
            <button class="neo-btn neo-btn-primary" @click="confirmAccept" :disabled="processingModal">
              <span v-if="processingModal" class="btn-spinner"></span>
              <span v-else class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              {{ processingModal ? 'Bevestigen...' : 'Acceptatie Bevestigen' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookingRequests, acceptBookingRequest, refuseBookingRequest, type BookingRequest } from '../../services/bookingService'
import { isRangeAvailable } from '../../services/calendarService'

const requests = ref<BookingRequest[]>([])
const loading = ref(true)
const error = ref('')

const selectedRequest = ref<BookingRequest | null>(null)
const processingId = ref<string | null>(null)
const processingModal = ref(false)
const successMsg = ref('')

const fetchRequests = async (showLoading = true) => {
  if (showLoading) loading.value = true
  error.value = ''
  try {
    requests.value = await getBookingRequests()
  } catch (err) {
    console.error('Error loading requests', err)
    error.value = 'Failed to load booking requests.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRequests)

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return ''
  return new Intl.DateTimeFormat('nl-NL', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(isoString))
}

const openAcceptModal = (req: BookingRequest) => {
  selectedRequest.value = req
  successMsg.value = ''
  error.value = ''
}

const closeModal = () => {
  if (!processingModal.value) {
    selectedRequest.value = null
  }
}

const confirmAccept = async () => {
  if (!selectedRequest.value) return
  
  processingModal.value = true
  error.value = ''
  
  try {
    // Proactive Check Before Accepting
    const availability = await isRangeAvailable(
      selectedRequest.value.start_date,
      selectedRequest.value.end_date
    )
    
    if (!availability.available) {
      error.value = 'Deze data zijn niet meer beschikbaar.'
      processingModal.value = false
      return
    }

    await acceptBookingRequest(selectedRequest.value)
    
    // Success feedback
    successMsg.value = 'Boeking geaccepteerd. Bevestigingsmail verstuurd.'
    
    // Close modal after a short delay so the user sees the success state if they could
    // But since we want "responsive", we close and show success notification on main page
    setTimeout(() => {
      closeModal()
      fetchRequests(false) // Refresh list in background
      
      // Clear success after more time
      setTimeout(() => {
        successMsg.value = ''
      }, 5000)
    }, 800)
    
  } catch (err: any) {
    console.error('Failed to accept request', err)
    const errorMsg = err.message || ''
    if (errorMsg.toLowerCase().includes('overlap') || errorMsg.toLowerCase().includes('conflict') || errorMsg.toLowerCase().includes('unavailable')) {
      error.value = 'Deze data zijn niet meer beschikbaar'
    } else {
      error.value = `Accepteren mislukt: ${errorMsg || 'Onbekende systeemfout'}`
    }
  } finally {
    processingModal.value = false
  }
}

const handleRefuse = async (req: BookingRequest) => {
  if (!confirm('Weet u zeker dat u deze aanvraag wilt weigeren?')) return
  
  const id = req.id
  processingId.value = id
  try {
    await refuseBookingRequest(req)
    successMsg.value = 'Boeking geweigerd.'
    fetchRequests(false)
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (err) {
    console.error('Failed to refuse request', err)
    alert('Weigeren aanvraag mislukt.')
  } finally {
    processingId.value = null
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.25rem;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 0;
}

@media (min-width: 768px) {
  .request-card {
    flex-direction: row;
    align-items: stretch;
  }
}

.card-status-strip {
  width: 100%;
  height: 4px;
}

@media (min-width: 768px) {
  .card-status-strip {
    width: 4px;
    height: auto;
  }
}

.card-status-strip.pending { background: var(--status-warning); }
.card-status-strip.accepted { background: var(--status-success); }
.card-status-strip.refused { background: var(--status-error); }

.request-main {
  flex: 1;
  padding: 2rem;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.guest-primary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.guest-primary h3 {
  font-size: 1.25rem;
  margin: 0;
}

.request-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
}

.status-badge.pending { background: var(--status-warning-bg); color: var(--status-warning); }
.status-badge.accepted { background: var(--status-success-bg); color: var(--status-success); }
.status-badge.refused { background: var(--status-error-bg); color: var(--status-error); }

.request-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .request-details {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 1rem;
  color: var(--text-primary);
}

.detail-value a {
  color: var(--accent-primary);
  text-decoration: none;
}

.phone-separator {
  margin: 0 0.5rem;
  color: var(--surface-border);
}

.request-message {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.request-message p {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.request-actions {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 240px;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.accept-btn {
  width: 100%;
  padding: 0.75rem;
}

.refuse-btn {
  width: 100%;
  padding: 0.75rem;
  color: var(--status-error);
}

.refuse-btn:hover {
  border-color: var(--status-error);
  background: var(--status-error-bg);
}

.reviewed-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.reviewed-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.reviewed-date {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  padding: 5rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-summary {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.summary-item span {
  font-size: 1.1rem;
  font-weight: 500;
}

.info-alert {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-secondary);
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Generic states */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem;
  color: var(--text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Success Feedback */
.modal-success-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: var(--status-success-bg);
  color: var(--status-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
}

.alert-success {
  background: rgba(16, 185, 129, 0.08);
  color: var(--status-success);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.page-alert {
  margin-bottom: 2rem;
  padding: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mb-4 { margin-bottom: 1.5rem; }

/* Animations */
.animate-slide-down {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
