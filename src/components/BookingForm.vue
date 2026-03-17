<template>
  <div class="booking-form-container glass-panel">
    <div class="form-header">
      <h2>Request a <span class="text-gradient">Booking</span></h2>
      <p>Fill in your details and we'll get back to you within 24 hours.</p>
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
        <label for="name">Name <span class="required">*</span></label>
        <input class="neo-input" type="text" id="name" v-model="form.guest_name" required placeholder="Your full name" />
      </div>

      <div class="form-group">
        <label for="email">Email <span class="required">*</span></label>
        <input class="neo-input" type="email" id="email" v-model="form.guest_email" required placeholder="you@example.com" />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input class="neo-input" type="tel" id="phone" v-model="form.guest_phone" placeholder="Optional" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Check-in <span class="required">*</span></label>
          <input class="neo-input" type="date" id="startDate" v-model="form.start_date" required />
        </div>
        <div class="form-group">
          <label for="endDate">Check-out <span class="required">*</span></label>
          <input class="neo-input" type="date" id="endDate" v-model="form.end_date" required />
        </div>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea class="neo-input" id="message" v-model="form.message" rows="4" placeholder="Any special requests or questions?"></textarea>
      </div>

      <button type="submit" :disabled="isSubmitting" class="neo-btn neo-btn-primary submit-btn">
        <span v-if="isSubmitting" class="btn-spinner"></span>
        {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createBookingRequest, type BookingRequestData } from '../services/bookingService'
import { isRangeAvailable } from '../services/calendarService'

const initialFormState: BookingRequestData = {
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  start_date: '',
  end_date: '',
  message: ''
}

const form = ref<BookingRequestData>({ ...initialFormState })
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  // 1. Basic Validation
  if (!form.value.start_date || !form.value.end_date) {
    errorMessage.value = 'Please select both check-in and check-out dates.'
    return
  }

  if (form.value.start_date > form.value.end_date) {
    errorMessage.value = 'Check-out date cannot be before check-in date.'
    return
  }

  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // 2. Proactive Availability Check
    const availability = await isRangeAvailable(form.value.start_date, form.value.end_date)
    if (!availability.available) {
      errorMessage.value = `Sorry, these dates are not available. ${availability.conflict}`
      isSubmitting.value = false
      return
    }

    // 3. Submit Request
    await createBookingRequest(form.value)
    successMessage.value = 'Booking request sent. Confirmation email sent.'
    form.value = { ...initialFormState }
  } catch (error: any) {
    errorMessage.value = error.message || 'Something went wrong. Please try again.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.booking-form-container {
  padding: 2.5rem;
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
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
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
</style>
