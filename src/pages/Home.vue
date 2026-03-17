<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <img src="../assets/hero-bg.png" alt="Luxury apartment" class="hero-img" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content animate-fade-in">
        <span class="hero-tag">Private Luxury Stay</span>
        <h1 class="hero-title">Welcome to <span class="text-gradient">Diamare86</span></h1>
        <p class="hero-subtitle">
          {{ settings?.apartment_description || 'Experience unmatched comfort in our exclusive private apartment. Modern design, breathtaking views, total privacy.' }}
        </p>
        <router-link to="/calendar" class="neo-btn neo-btn-primary hero-cta">
          Check Availability
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 8px;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </router-link>
      </div>
    </section>

    <!-- Loading state -->
    <div v-if="loading" class="loading-section">
      <div class="spinner"></div>
      <p>Loading apartment details...</p>
    </div>

    <!-- Bento Grid -->
    <section v-else-if="settings" class="bento-section animate-fade-in" style="animation-delay: 0.2s;">
      <div class="bento-grid">

        <!-- Pricing Card (wide) -->
        <div class="bento-card bento-wide glass-panel glass-panel-hover">
          <div class="card-label">Pricing</div>
          <div class="pricing-row">
            <div class="price-block">
              <span class="price-value">€{{ settings.week_price ?? '—' }}</span>
              <span class="price-label">per weeknight</span>
            </div>
            <div class="price-divider"></div>
            <div class="price-block">
              <span class="price-value">€{{ settings.weekend_price ?? '—' }}</span>
              <span class="price-label">per weekend night</span>
            </div>
          </div>
          <p class="booking-note" v-if="settings.booking_text">{{ settings.booking_text }}</p>
        </div>

        <!-- Contact Card -->
        <div class="bento-card glass-panel glass-panel-hover">
          <div class="card-label">Contact</div>
          <ul class="contact-list">
            <li v-if="settings.contact_name">
              <span class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span>{{ settings.contact_name }}</span>
            </li>
            <li v-if="settings.contact_email">
              <span class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <a :href="'mailto:' + settings.contact_email">{{ settings.contact_email }}</a>
            </li>
            <li v-if="settings.contact_phone">
              <span class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <a :href="'tel:' + settings.contact_phone">{{ settings.contact_phone }}</a>
            </li>
          </ul>
        </div>

        <!-- Feature Card 1 -->
        <div class="bento-card glass-panel glass-panel-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3>Fully Private</h3>
          <p>Entire apartment exclusively for you. No shared spaces, no surprises.</p>
        </div>

        <!-- Feature Card 2 -->
        <div class="bento-card glass-panel glass-panel-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </div>
          <h3>Flexible Stays</h3>
          <p>From quick getaways to extended stays — we adapt to your schedule.</p>
        </div>

        <!-- Feature Card 3 -->
        <div class="bento-card glass-panel glass-panel-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <h3>Easy Booking</h3>
          <p>Submit a request in seconds. We'll confirm your dates within 24 hours.</p>
        </div>

      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner animate-fade-in" style="animation-delay: 0.4s;">
      <div class="cta-inner glass-panel animate-pulse-glow">
        <h2>Ready to experience <span class="text-gradient">Diamare86</span>?</h2>
        <p>Check available dates and submit your booking request in just a few clicks.</p>
        <router-link to="/calendar" class="neo-btn neo-btn-primary">Book Your Stay</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSettings, type Settings } from '../services/settingsService'

const settings = ref<Settings | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    settings.value = await getSettings()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* HERO */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.4) 60%,
    var(--bg-primary) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  padding: 2rem;
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
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
  background: rgba(139, 92, 246, 0.1);
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.25rem;
  }
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  font-size: 1.05rem;
  padding: 1rem 2rem;
}

/* LOADING */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* BENTO GRID */
.bento-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.bento-card {
  padding: 2rem;
}

.bento-wide {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-wide {
    grid-column: span 1;
  }
}

.card-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

/* Pricing */
.pricing-row {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.price-block {
  display: flex;
  flex-direction: column;
}

.price-value {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.price-divider {
  width: 1px;
  height: 50px;
  background: var(--surface-border);
}

.booking-note {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

/* Contact */
.contact-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.contact-list a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.contact-list a:hover {
  color: var(--accent-secondary);
}

.contact-icon {
  font-size: 1.1rem;
}

/* Feature Cards */
.feature-emoji {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.bento-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.bento-card p {
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

/* CTA BANNER */
.cta-banner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.cta-inner {
  text-align: center;
  padding: 3.5rem 2rem;
}

.cta-inner h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.cta-inner p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
}
</style>
