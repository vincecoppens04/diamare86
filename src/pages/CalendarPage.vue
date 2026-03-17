<template>
  <div class="calendar-page animate-fade-in">
    <header class="page-hero">
      <span class="hero-tag">Booking</span>
      <h1>Check Availability & <span class="text-gradient">Book Your Stay</span></h1>
      <p>View our current calendar and submit a request for your preferred dates.</p>
    </header>

    <div class="content-grid">
      <div class="calendar-section">
        <Calendar />
      </div>
      <div class="form-section">
        <BookingForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from '../components/Calendar.vue'
import BookingForm from '../components/BookingForm.vue'
</script>

<style scoped>
.calendar-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-hero {
  text-align: center;
  margin-bottom: 3.5rem;
}

.hero-tag {
  display: inline-block;
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--surface-border);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-primary);
  margin-bottom: 1.25rem;
  backdrop-filter: blur(8px);
  background: rgba(139, 92, 246, 0.1);
}

.page-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .page-hero h1 {
    font-size: 1.75rem;
  }
}

.page-hero p {
  color: var(--text-muted);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
