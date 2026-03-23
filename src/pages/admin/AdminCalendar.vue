<template>
  <div class="admin-calendar-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Kalender - <span class="text-gradient">Boekingen</span></h1>
          <p>Volledige controle over verblijven, geblokkeerde data en verblijfshistorie.</p>
        </div>
        <div class="header-actions">
          <button class="neo-btn neo-btn-outline" @click="showManualModal = true" style="margin-right: 12px;">
            <span class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </span>
            Manueel Inboeken
          </button>
          <button class="neo-btn neo-btn-primary" @click="showBlockModal = true">
            <span class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </span> 
            Data Blokkeren
          </button>
        </div>
      </div>
    </header>
    
    <!-- Page level notifications -->
    <div class="notifications-area">
      <transition name="fade">
        <div v-if="successMsg" class="alert alert-success animate-slide-down">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {{ successMsg }}
        </div>
      </transition>
    </div>

    <!-- Main Operational Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Verblijfsgegevens laden...</p>
    </div>

    <div v-else class="main-operational-grid animate-fade-in">
      <!-- Calendar Column -->
      <div class="calendar-column">
        <div class="calendar-wrapper shadow-sm">
          <Calendar 
            ref="calendarRef" 
            :show-footer="false" 
            @eventClick="handleEventClick"
          />
        </div>
      </div>

      <!-- Upcoming Bookings Sidebar -->
      <aside class="bookings-sidebar glass-panel">
        <div class="sidebar-header">
          <h2>Aankomende <span class="text-gradient">Boekingen</span></h2>
          <span class="count-badge">{{ upcomingBookings.length }}</span>
        </div>
        
        <div class="sidebar-scroll-area">
          <div v-if="upcomingBookings.length === 0" class="empty-list-minimal">
            <p>Geen aankomende boekingen gepland.</p>
          </div>
          
          <div v-else class="sidebar-list">
            <div v-for="booking in upcomingBookings" :key="booking.id" class="sidebar-card glass-panel glass-panel-hover">
              <div class="card-info">
                <h3>{{ booking.guest_name }}</h3>
                <p class="dates">{{ formatDate(booking.start_date) }} — {{ formatDate(booking.end_date) }}</p>
              </div>
              <div class="card-actions">
                <button class="icon-btn edit" @click="openManageModal('booking', booking)" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
                <button class="icon-btn delete" @click="handleDeleteStay('booking', booking.id)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Secondary Management Sections -->
    <div v-if="!loading" class="management-hub animate-fade-in">

      <!-- Section: Blocked Periods -->
      <section class="mgmt-section">
        <div class="section-header">
          <h2>Geblokkeerde <span class="text-gradient">Periodes</span></h2>
          <span class="count-badge warning">{{ blockedPeriods.length }}</span>
        </div>
        
        <div v-if="blockedPeriods.length === 0" class="empty-list glass-panel">
          <p>Er zijn momenteel geen data geblokkeerd.</p>
        </div>
        
        <div v-else class="mgmt-grid">
          <div v-for="block in blockedPeriods" :key="block.id" class="mgmt-card glass-panel glass-panel-hover">
            <div class="card-info">
              <h3>{{ block.reason || 'Geblokkeerde Data' }}</h3>
              <p class="dates">{{ formatDate(block.start_date) }} — {{ formatDate(block.end_date) }}</p>
            </div>
            <div class="card-actions">
              <button class="icon-btn edit" @click="openManageModal('blocked', block)" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
              <button class="icon-btn delete" @click="handleDeleteStay('blocked', block.id)" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Past Bookings -->
      <section class="mgmt-section">
        <div class="section-header">
          <h2 class="text-muted">Eerdere <span class="text-muted">Boekingen</span></h2>
          <span class="count-badge muted">{{ pastBookings.length }}</span>
        </div>
        
        <div v-if="pastBookings.length === 0" class="empty-list glass-panel muted">
          <p>Geen verblijfshistorie gevonden.</p>
        </div>
        
        <div v-else class="mgmt-grid history-grid">
          <div v-for="booking in pastBookings" :key="booking.id" class="mgmt-card glass-panel history-card">
            <div class="card-info">
              <h3>{{ booking.guest_name }}</h3>
              <p class="dates">{{ formatDate(booking.start_date) }} — {{ formatDate(booking.end_date) }}</p>
            </div>
            <div class="card-status">Voltooid</div>
          </div>
        </div>
      </section>
    </div>

    <!-- Manual Booking Modal -->
    <div v-if="showManualModal" class="modal-overlay" @click="closeManualModal">
      <div class="modal-content glass-panel animate-fade-in" @click.stop>
        <div class="modal-header">
          <h3>Manuele Boeking Toevoegen</h3>
          <button class="close-btn" @click="closeManualModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <form @submit.prevent="handleManualBooking" class="modal-form">
          <div class="modal-body">
            <div v-if="errorMsg" class="alert alert-error">
              <span class="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              {{ errorMsg }}
            </div>
            
            <div class="form-group">
              <label>Naam Gast</label>
              <input class="neo-input" type="text" v-model="manualForm.guest_name" required placeholder="Bijv: Jan Janssen" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Aankomst</label>
                <input class="neo-input" type="date" v-model="manualForm.start_date" required />
              </div>
              <div class="form-group">
                <label>Vertrek</label>
                <input class="neo-input" type="date" v-model="manualForm.end_date" required />
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="neo-btn neo-btn-outline" @click="closeManualModal" :disabled="isSubmitting">Annuleren</button>
            <button type="submit" class="neo-btn neo-btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="btn-spinner"></span>
              {{ isSubmitting ? 'Opslaan...' : 'Boeking Bevestigen' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Block Dates Modal -->
    <div v-if="showBlockModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content glass-panel animate-fade-in" @click.stop>
        <div class="modal-header">
          <h3>Periode Blokkeren</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <form @submit.prevent="handleBlockDates" class="modal-form">
          <div class="modal-body">
            <div v-if="errorMsg" class="alert alert-error">
              <span class="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              {{ errorMsg }}
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Aankomst</label>
                <input class="neo-input" type="date" v-model="form.start_date" required />
              </div>
              <div class="form-group">
                <label>Vertrek</label>
                <input class="neo-input" type="date" v-model="form.end_date" required />
              </div>
            </div>

            <div class="form-group">
              <label>Reden</label>
              <select class="neo-input" v-model="form.reason" required>
                <option value="" disabled>Selecteer categorie...</option>
                <option value="Familie / Privégebruik">Familie / Privégebruik</option>
                <option value="Onderhoud / Reparaties">Onderhoud / Reparaties</option>
                <option value="Seizoenssluiting">Seizoenssluiting</option>
              </select>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="neo-btn neo-btn-outline" @click="closeModal" :disabled="isSubmitting">Annuleren</button>
            <button type="submit" class="neo-btn neo-btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="btn-spinner"></span>
              {{ isSubmitting ? 'Opslaan...' : 'Blokkering Bevestigen' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage Event Modal (Edit/Delete) -->
    <div v-if="selectedEvent" class="modal-overlay" @click="closeManageModal">
      <div class="modal-content glass-panel animate-fade-in" @click.stop>
        <div class="modal-header">
          <h3>Bewerk {{ selectedEvent.type === 'booking' ? 'Boeking' : 'Geblokkeerde Periode' }}</h3>
          <button class="close-btn" @click="closeManageModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="errorMsg" class="alert alert-error">
            <span class="alert-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            {{ errorMsg }}
          </div>

          <div v-if="selectedEvent.type === 'booking'" class="event-summary">
            <p><strong>Gast:</strong> {{ selectedEvent.details.guest_name }}</p>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Aankomst</label>
              <input class="neo-input" type="date" v-model="manageForm.start_date" />
            </div>
            <div class="form-group">
              <label>Vertrek</label>
              <input class="neo-input" type="date" v-model="manageForm.end_date" />
            </div>
          </div>

          <div v-if="selectedEvent.type === 'blocked'" class="form-group">
            <label>Reden</label>
            <input class="neo-input" type="text" v-model="manageForm.reason" />
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="neo-btn neo-btn-outline" @click="closeManageModal" :disabled="isSubmitting">Annuleren</button>
          <button type="button" class="neo-btn neo-btn-primary" @click="handleUpdateEvent" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="btn-spinner"></span>
            {{ isSubmitting ? 'Verwerken...' : 'Wijzigingen Opslaan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Calendar from '../../components/Calendar.vue'
import { 
  getBookings, 
  getPastBookings,
  getBlockedPeriods, 
  createBlockedPeriod, 
  updateBooking, 
  updateBlockedPeriod,
  deleteBooking, 
  deleteBlockedPeriod,
  isRangeAvailable,
  createBooking,
  type Booking,
  type BlockedPeriod
} from '../../services/calendarService'

const upcomingBookings = ref<Booking[]>([])
const pastBookings = ref<Booking[]>([])
const blockedPeriods = ref<BlockedPeriod[]>([])
const loading = ref(true)
const showBlockModal = ref(false)
const showManualModal = ref(false)
const selectedEvent = ref<any>(null)
const isSubmitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({ start_date: '', end_date: '', reason: '' })
const manualForm = ref({ start_date: '', end_date: '', guest_name: '' })
const manageForm = ref({ start_date: '', end_date: '', reason: '' })

const fetchAll = async () => {
  loading.value = true
  try {
    const [b, pb, bp] = await Promise.all([getBookings(), getPastBookings(), getBlockedPeriods()])
    
    // Sort into upcoming and past
    const todayStr = new Date().toISOString().split('T')[0]
    upcomingBookings.value = b.filter(x => x.start_date >= todayStr)
    pastBookings.value = pb
    blockedPeriods.value = bp.filter(x => x.end_date >= todayStr).sort((a,b) => a.start_date.localeCompare(b.start_date))
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

const formatDate = (iso: string) => {
  return new Intl.DateTimeFormat('nl-NL', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

const handleEventClick = (event: any) => {
  openManageModal(event.type, event.details)
}

const openManageModal = (type: string, details: any) => {
  selectedEvent.value = { type, id: details.id, details }
  manageForm.value = {
    start_date: details.start_date,
    end_date: details.end_date,
    reason: details.reason || ''
  }
}

const closeModal = () => {
  showBlockModal.value = false
  form.value = { start_date: '', end_date: '', reason: '' }
  errorMsg.value = ''
}

const closeManualModal = () => {
  showManualModal.value = false
  manualForm.value = { start_date: '', end_date: '', guest_name: '' }
  errorMsg.value = ''
}

const closeManageModal = () => {
  selectedEvent.value = null
  errorMsg.value = ''
}

const handleBlockDates = async () => {
  if (form.value.start_date > form.value.end_date) {
    errorMsg.value = 'De vertrekdatum mag niet vóór de aankomstdatum liggen.'
    return
  }

  errorMsg.value = ''
  isSubmitting.value = true
  try {
    // Proactive check
    const availability = await isRangeAvailable(form.value.start_date, form.value.end_date)
    if (!availability.available) {
      errorMsg.value = availability.conflict || 'Data zijn al bezet.'
      isSubmitting.value = false
      return
    }

    await createBlockedPeriod(form.value)
    closeModal()
    fetchAll()
  } catch (err) {
    errorMsg.value = 'Blokkeren van data mislukt.'
  } finally {
    isSubmitting.value = false
  }
}

const handleManualBooking = async () => {
  if (manualForm.value.start_date > manualForm.value.end_date) {
    errorMsg.value = 'De vertrekdatum mag niet vóór de aankomstdatum liggen.'
    return
  }

  errorMsg.value = ''
  isSubmitting.value = true
  try {
    const availability = await isRangeAvailable(manualForm.value.start_date, manualForm.value.end_date)
    if (!availability.available) {
      errorMsg.value = availability.conflict || 'Data zijn al bezet.'
      isSubmitting.value = false
      return
    }

    await createBooking(manualForm.value)
    closeManualModal()
    successMsg.value = 'Manuele boeking succesvol toegevoegd!'
    setTimeout(() => { successMsg.value = '' }, 3000)
    fetchAll()
  } catch (err) {
    errorMsg.value = 'Toevoegen van boeking mislukt.'
  } finally {
    isSubmitting.value = false
  }
}

const handleUpdateEvent = async () => {
  if (!selectedEvent.value) return
  
  if (manageForm.value.start_date > manageForm.value.end_date) {
    errorMsg.value = 'De vertrekdatum mag niet vóór de aankomstdatum liggen.'
    return
  }

  isSubmitting.value = true
  errorMsg.value = ''
  try {
    // Proactive check (excluding current record)
    const availability = await isRangeAvailable(
      manageForm.value.start_date, 
      manageForm.value.end_date, 
      selectedEvent.value.id
    )
    
    if (!availability.available) {
      errorMsg.value = availability.conflict || 'Deze data zijn niet meer beschikbaar.'
      isSubmitting.value = false
      return
    }

    if (selectedEvent.value.type === 'booking') {
      await updateBooking(selectedEvent.value.id, {
        start_date: manageForm.value.start_date,
        end_date: manageForm.value.end_date
      })
    } else {
      await updateBlockedPeriod(selectedEvent.value.id, manageForm.value)
    }
    closeManageModal()
    successMsg.value = 'Gegevens succesvol bijgewerkt!'
    setTimeout(() => { successMsg.value = '' }, 3000)
    fetchAll()
  } catch (err: any) {
    console.error('Update failed:', err)
    const msg = err.message || ''
    if (msg.toLowerCase().includes('overlap') || msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('unavailable')) {
      errorMsg.value = 'Deze data zijn niet meer beschikbaar.'
    } else {
      errorMsg.value = 'Bijwerken mislukt. Controleer de geselecteerde data.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteStay = async (type: string, id: string) => {
  if (!confirm('Weet u zeker dat u deze gegevens wilt verwijderen?')) return
  try {
    if (type === 'booking') await deleteBooking(id)
    else await deleteBlockedPeriod(id)
    successMsg.value = 'Gegevens succesvol verwijderd.'
    setTimeout(() => { successMsg.value = '' }, 3000)
    fetchAll()
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Verwijderen van gegevens mislukt.'
  }
}
</script>

<style scoped>
.admin-calendar-page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.page-header h1 {
  font-size: 2.25rem;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: var(--text-secondary);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Main Operational Grid */
.main-operational-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 1280px) {
  .main-operational-grid {
    grid-template-columns: 1.2fr 0.8fr; /* ~60/40 split */
  }
}

.calendar-column {
  min-width: 0;
}

.calendar-wrapper {
  background: white;
  padding: 1.5rem; /* Slightly smaller padding */
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
}

/* Sidebar Bookings */
.bookings-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 700px; /* Constrain height to roughly match calendar */
  background: var(--bg-secondary);
  overflow: hidden;
  padding: 0;
}

.sidebar-header {
  padding: 2rem;
  background: white;
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.sidebar-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-card {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.empty-list-minimal {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Scrollbar refinement for sidebar */
.sidebar-scroll-area::-webkit-scrollbar {
  width: 5px;
}
.sidebar-scroll-area::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}

.management-hub {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.mgmt-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.section-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.count-badge {
  background: var(--accent-gradient);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.count-badge.warning { background: var(--status-warning); }
.count-badge.muted { background: var(--text-muted); }

.mgmt-grid {
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 0.5rem 0.5rem 1.5rem 0.5rem;
  margin: -0.5rem -0.5rem 0 -0.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.mgmt-grid::-webkit-scrollbar {
  height: 6px;
}
.mgmt-grid::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.03);
  border-radius: 10px;
}
.mgmt-grid::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}

.mgmt-card {
  flex: 0 0 320px;
  scroll-snap-align: start;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info h3 {
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.dates {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: 1px solid var(--surface-border);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--accent-primary);
}

.empty-list {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

.history-card { opacity: 0.7; }
.card-status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Modal and shared styles omitted for brevity, keeping relevant neo ones */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.loading-state {
  text-align: center;
  padding: 5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.alert-error {
  background: var(--status-error-bg);
  color: var(--status-error);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
</style>
