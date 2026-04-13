<template>
  <div class="booking-form-container glass-panel">
    <div class="form-header">
      <h2>Vraag een <span class="text-gradient">Boeking</span> aan</h2>
      <p>Vul uw gegevens in en wij nemen binnen 24 uur contact met u op.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div v-if="successMessage" class="alert alert-success">
        <span class="alert-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-error">
        <span class="alert-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label for="name">Naam <span class="required">*</span></label>
        <input class="neo-input" type="text" id="name" v-model="form.guest_name" required placeholder="Uw volledige naam" />
      </div>

      <div class="form-group">
        <label for="email">E-mailadres <span class="required">*</span></label>
        <input class="neo-input" type="email" id="email" v-model="form.guest_email" required placeholder="u@voorbeeld.nl" />
      </div>

      <div class="form-group">
        <label for="phone">Telefoonnummer</label>
        <input class="neo-input" type="tel" id="phone" v-model="form.guest_phone" placeholder="Optioneel" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Aankomst <span class="required">*</span></label>
          <input class="neo-input" type="date" id="startDate" v-model="form.start_date" required />
        </div>
        <div class="form-group">
          <label for="endDate">Vertrek <span class="required">*</span></label>
          <input class="neo-input" type="date" id="endDate" v-model="form.end_date" required />
        </div>
      </div>

      <div class="form-group">
        <label for="message">Bericht</label>
        <textarea class="neo-input" id="message" v-model="form.message" rows="4" placeholder="Heeft u speciale verzoeken of vragen?"></textarea>
      </div>

      <div v-if="totalPrice > 0" class="price-summary animate-fade-in">
        <div class="price-row">
          <span class="price-label">Totaalbedrag verblijf:</span>
          <span class="price-value text-gradient">€{{ totalPrice }}</span>
        </div>
        <p class="price-note">* Inclusief weekend- en vakantietoeslagen waar van toepassing.</p>
      </div>

      <div class="form-group terms-group">
        <label class="terms-label">
          <input type="checkbox" v-model="termsAccepted" required />
          <span class="terms-text">
            Ik ga akkoord met de 
            <button type="button" class="terms-link" @click="showTermsModal = true">
              algemene voorwaarden
            </button>
          </span>
        </label>
      </div>
      
      <button type="submit" :disabled="isSubmitting || !termsAccepted" class="neo-btn neo-btn-primary submit-btn">
        <span v-if="isSubmitting" class="btn-spinner"></span>
        {{ isSubmitting ? 'Versturen...' : 'Aanvraag Versturen' }}
      </button>

      <!-- Terms and Conditions Modal -->
      <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
        <div class="modal-content glass-panel animate-fade-in" @click.stop>
          <div class="modal-header">
            <h3>Algemene Voorwaarden</h3>
            <button type="button" class="close-btn" @click="showTermsModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="terms-content">
              {{ settings?.contract_text || 'Voorwaarden worden geladen...' }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="neo-btn neo-btn-primary" @click="showTermsModal = false">Sluiten</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createBookingRequest, type BookingRequestData } from '../services/bookingService'
import { isRangeAvailable } from '../services/calendarService'
import { getSettings, type Settings } from '../services/settingsService'
import { getSchoolHolidays, isWeekendPriceDay, type HolidayPeriod } from '../services/holidayService'

const initialFormState: BookingRequestData = {
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  start_date: '',
  end_date: '',
  message: '',
  total_price: 0
}

const form = ref<BookingRequestData>({ ...initialFormState })
const settings = ref<Settings | null>(null)
const holidays = ref<HolidayPeriod[]>([])
const isSubmitting = ref(false)
const termsAccepted = ref(false)
const showTermsModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const s = await getSettings()
    settings.value = s
    const h = await getSchoolHolidays(new Date().getFullYear())
    holidays.value = h
  } catch (err) {
    console.error('Error loading pricing data:', err)
  }
})

const totalPrice = computed(() => {
  if (!form.value.start_date || !form.value.end_date || !settings.value) return 0
  
  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  
  if (start >= end) return 0
  
  let total = 0
  let current = new Date(start)
  
  // Calculate price per night (not including the check-out day)
  while (current < end) {
    const isWeekend = isWeekendPriceDay(current, holidays.value)
    const nightPrice = isWeekend ? (settings.value.weekend_price || 0) : (settings.value.week_price || 0)
    total += nightPrice
    current.setDate(current.getDate() + 1)
  }
  
  return total
})

const handleSubmit = async () => {
  // 1. Basic Validation
  if (!form.value.start_date || !form.value.end_date) {
    errorMessage.value = 'Selecteer zowel een aankomst- als vertrekdatum.'
    return
  }

  if (form.value.start_date > form.value.end_date) {
    errorMessage.value = 'De vertrekdatum mag niet vóór de aankomstdatum liggen.'
    return
  }

  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // 2. Proactive Availability Check
    const availability = await isRangeAvailable(form.value.start_date, form.value.end_date)
    if (!availability.available) {
      errorMessage.value = 'Sorry, deze data zijn niet beschikbaar.'
      isSubmitting.value = false
      return
    }

    // 3. Submit Request
    await createBookingRequest({
      ...form.value,
      total_price: totalPrice.value
    })
    successMessage.value = 'Boekingsaanvraag verzonden. Bevestigingsmail verstuurd.'
    form.value = { ...initialFormState }
    termsAccepted.value = false
  } catch (error: any) {
    errorMessage.value = error.message || 'Er is iets misgegaan. Probeer het opnieuw.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.booking-form-container {
  padding: 2.5rem;
  overflow: hidden; /* Prevent horizontal scroll triggers */
}

@media (max-width: 768px) {
  .booking-form-container {
    padding: 1.25rem;
  }
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
}

.neo-input {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    display: flex;
    flex-direction: column;
  }
  
  .neo-input {
    font-size: 0.85rem !important;
    padding: 0.8rem 0.75rem !important;
  }
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.required {
  color: var(--accent-primary);
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
  padding: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Price Summary */
.price-summary {
  margin: 1rem 0;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.price-label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}

.price-value {
  font-size: 1.75rem;
  font-weight: 800;
}

.price-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.alert-success {
  background: var(--status-success-bg);
  color: var(--status-success);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.alert-success .alert-icon {
  background: var(--status-success);
  color: white;
}

.alert-error {
  background: var(--status-error-bg);
  color: var(--status-error);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-error .alert-icon {
  background: var(--status-error);
  color: white;
}

/* Terms & Conditions Stylos */
.terms-group {
  margin-top: 0.5rem;
}

.terms-label {
  display: flex !important;
  align-items: flex-start !important;
  gap: 0.75rem;
  cursor: pointer;
  text-transform: none !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  letter-spacing: normal !important;
  flex-wrap: wrap; /* Ensure wrapping on mobile */
}

.terms-label input[type="checkbox"] {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--accent-primary);
  margin-top: 0.125rem;
}

.terms-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.terms-link {
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  font-weight: 700;
  color: var(--accent-primary);
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.2s;
}

.terms-link:hover {
  opacity: 0.8;
}

/* Modal Stylos */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 0 !important; /* Reset padding to use internal sections */
}

.modal-header {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--surface-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.terms-content {
  white-space: pre-wrap;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.modal-footer {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--surface-border);
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: 50%;
  display: flex;
  transition: background 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
</style>
