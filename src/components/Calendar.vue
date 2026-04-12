<template>
  <div class="calendar-container glass-panel animate-fade-in">
    <div v-if="showHeader" class="cal-header">
      <div class="cal-title">
        <h2>{{ monthName }} <span class="text-gradient">{{ currentYear }}</span></h2>
        <div class="cal-nav">
          <button @click="goToToday" class="neo-btn neo-btn-outline btn-today" title="Ga naar vandaag">
            Vandaag
          </button>
          <button @click="prevMonth" class="nav-btn" aria-label="Vorige Maand">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button @click="nextMonth" class="nav-btn" aria-label="Volgende Maand">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="cal-legend">
        <div class="legend-item">
          <span class="legend-box is-start"></span>
          <span>Aankomst</span>
        </div>
        <div class="legend-item">
          <span class="legend-box is-end"></span>
          <span>Vertrek</span>
        </div>
        <div class="legend-item">
          <span class="legend-box is-occupied"></span>
          <span>Bezet</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Beschikbaarheid laden...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </div>
      {{ error }}
    </div>

    <div v-else class="calendar-visual">
      <div class="weekdays-grid">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      </div>
      
      <div class="days-grid">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          class="day-cell"
          :class="{
            'padding-day': day.isPadding,
            'is-today': day.isToday,
            'is-start': day.isStart,
            'is-end': day.isEnd,
            'is-middle': day.isMiddle,
            'is-occupied': day.isOccupied,
            'is-clickable': day.isOccupied
          }"
          @click="handleDayClick(day)"
        >
          <span class="day-number">{{ day.dateNumber }}</span>
          <span v-if="day.price" class="day-price">€{{ day.price }}</span>
        </div>
      </div>
    </div>

    <div v-if="showFooter" class="cal-footer">
      <p>Selecteer uw gewenste data in het boekingsformulier hieronder.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getBookings, getBlockedPeriods, type Booking, type BlockedPeriod } from '../services/calendarService'
import { getSettings, type Settings } from '../services/settingsService'
import { getSchoolHolidays, isWeekendPriceDay, type HolidayPeriod } from '../services/holidayService'

const props = defineProps({
  showHeader: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true }
})

const bookings = ref<Booking[]>([])
const blockedPeriods = ref<BlockedPeriod[]>([])
const settings = ref<Settings | null>(null)
const holidays = ref<HolidayPeriod[]>([])
const loading = ref(true)
const error = ref('')

const viewDate = ref(new Date())
const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

onMounted(async () => {
  try {
    const year = viewDate.value.getFullYear()
    const [b, bp, s, h] = await Promise.all([
      getBookings(), 
      getBlockedPeriods(),
      getSettings(),
      getSchoolHolidays(year)
    ])
    bookings.value = b
    blockedPeriods.value = bp
    settings.value = s
    holidays.value = h
  } catch (err) {
    error.value = 'Laden van beschikbaarheid mislukt.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const monthName = computed(() => {
  return new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(viewDate.value)
})

const currentYear = computed(() => viewDate.value.getFullYear())

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  viewDate.value = new Date()
}

const emit = defineEmits(['eventClick'])

const handleDayClick = (day: any) => {
  if (day.isOccupied) {
    emit('eventClick', {
      type: day.eventType,
      id: day.eventId,
      details: day.eventDetails
    })
  }
}

const getIsoDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Padding days from previous month (starting from Monday)
  const padding = (firstDayOfMonth + 6) % 7
  for (let i = 0; i < padding; i++) {
    days.push({ isPadding: true, dateNumber: '' })
  }
  
  const today = new Date()
  const todayStr = getIsoDateString(today)
  
  // Combine for easier iteration
  const allEvents = [
    ...bookings.value.map(b => ({ ...b, type: 'booking' })),
    ...blockedPeriods.value.map(bp => ({ ...bp, type: 'blocked' }))
  ]
  
  // Actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = new Date(year, month, i)
    const currentStr = getIsoDateString(currentDay)
    
    let isStart = false
    let isEnd = false
    let isMiddle = false
    let eventType = null
    let eventId = null
    let eventDetails = null

    for (const e of allEvents) {
      if (currentStr === e.start_date) isStart = true
      if (currentStr === e.end_date) isEnd = true
      if (currentStr > e.start_date && currentStr < e.end_date) isMiddle = true
      
      if (currentStr >= e.start_date && currentStr <= e.end_date) {
        eventType = e.type
        eventId = e.id
        eventDetails = e
      }
    }
    
    // Single day stay (start == end) counts as both start AND end, which we'll render as solid
    // OR if it's both a start of one event and an end of another (changeover)
    
    // Price Calculation
    let price = null
    if (settings.value) {
      const isWeekend = isWeekendPriceDay(currentDay, holidays.value)
      price = isWeekend ? settings.value.weekend_price : settings.value.week_price
    }

    days.push({
      isPadding: false,
      dateNumber: i,
      isToday: currentStr === todayStr,
      isStart,
      isEnd,
      isMiddle,
      isOccupied: isStart || isEnd || isMiddle,
      eventType,
      eventId,
      eventDetails,
      price
    })
  }
  
  return days
})
</script>

<style scoped>
.calendar-container {
  padding: 3rem;
  background: white;
  border-radius: var(--radius-lg);
}

.cal-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 1024px) {
  .cal-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.cal-title {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cal-title h2 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cal-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--surface-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: white;
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
}

.btn-today {
  padding: 0 1rem;
  height: 36px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
}

.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.legend-box {
  width: 16px;
  height: 16px;
  border: 1px solid var(--surface-border);
  border-radius: 2px;
}

.legend-box.is-start {
  background: linear-gradient(135deg, transparent 50%, var(--accent-primary) 50%);
}

.legend-box.is-end {
  background: linear-gradient(135deg, var(--accent-primary) 50%, transparent 50%);
}

.legend-box.is-occupied {
  background: var(--accent-primary);
}

.calendar-visual {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
  border-bottom: 1px solid var(--surface-border);
}

.weekday {
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  aspect-ratio: 1;
  padding: 0.5rem;
  background: white;
  border-right: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
}

.day-cell.is-clickable {
  cursor: pointer;
}

.day-cell.is-clickable:hover {
  background: var(--bg-secondary);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.02);
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-number {
  font-size: 1rem;
  font-weight: 800;
  color: #000;
  z-index: 2;
  margin-bottom: 2px;
}

.day-price {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  z-index: 2;
}

.padding-day {
  background: var(--bg-secondary);
}

.is-today {
  color: var(--accent-primary);
}

.is-today .day-number {
  background: rgba(124, 58, 237, 0.08);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-cell.is-start {
  background: linear-gradient(135deg, transparent 50%, var(--accent-primary) 50%);
}

.day-cell.is-end {
  background: linear-gradient(135deg, var(--accent-primary) 50%, transparent 50%);
}

.day-cell.is-middle,
.day-cell.is-start.is-end {
  background: var(--accent-primary);
}

.day-cell.is-occupied .day-number {
  color: #000;
}

.day-cell.is-start .day-number,
.day-cell.is-end .day-number {
  text-shadow: none;
  /* Shift number slightly if it's a half-day to keep it legible */
}

/* Specific logic for when start and end meet on same day (Changeover) */
.day-cell.is-start.is-end {
  background: var(--accent-primary);
}



.cal-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.cal-footer p {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
  margin: 0;
}

/* Base states */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  min-height: 400px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-icon {
  width: 40px;
  height: 40px;
  background: var(--status-error-bg);
  color: var(--status-error);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
</style>
