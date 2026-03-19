<template>
  <div class="home-modern">
    <div class="mesh-bg"></div>
    <!-- Section 1: Hero -->
    <section class="section-full first-section">
      <img :src="getImageUrl(settings?.hero_image_url, '1.png')" alt="" class="img-immersive" />
      <div class="overlay-vignette"></div>
      <div class="content-floating">
        <div class="scroll-reveal">
          <span class="glass-pill">{{ settings?.hero_tag || 'AI-Powered Experience' }}</span>
          <h1 class="text-ultra text-glow" v-html="settings?.hero_title || 'Puur <span class=\'text-gradient\'>Minimalisme</span>'"></h1>
          <p class="text-lead">
            {{ settings?.apartment_description || 'Ervaar ongeëvenaard comfort in ons exclusieve privé-appartement. Modern design, adembenemende uitzichten, volledige privacy.' }}
          </p>
        </div>
      </div>
      <div class="scroll-prompt">
        <div class="mouse-icon"></div>
      </div>
    </section>

    <!-- [Content Sections Remain Same Body] -->
    <section class="section-split">
      <div class="split-image">
        <img :src="getImageUrl(settings?.section1_image_url, '2.png')" alt="Architecture" />
      </div>
      <div class="split-content">
        <div class="scroll-reveal">
          <span class="card-tag">{{ settings?.section1_tag || 'Exterieur' }}</span>
          <h2 v-html="settings?.section1_title || 'Architectuur die <span class=\'text-gradient\'>Ademt</span>'"></h2>
          <p>{{ settings?.section1_text || 'Hoogwaardige materialen en een doordacht design creëren een omgeving van absolute rust. Elk element is zorgvuldig gekozen voor een tijdloze esthetiek.' }}</p>
        </div>
      </div>
    </section>

    <section class="section-split split-reverse">
      <div class="split-image">
        <img :src="getImageUrl(settings?.section2_image_url, '3.png')" alt="Comfort" />
      </div>
      <div class="split-content">
        <div class="scroll-reveal">
          <span class="card-tag">{{ settings?.section2_tag || 'Interieur' }}</span>
          <h2 v-html="settings?.section2_title || 'Serene <span class=\'text-gradient\'>Ruimtes</span>'"></h2>
          <p>{{ settings?.section2_text || 'Elk detail is ontworpen om uw verblijf tot een naadloze ervaring van comfort te maken. Van premium beddengoed tot sfeervolle verlichting.' }}</p>
        </div>
      </div>
    </section>

    <section class="section-split">
      <div class="split-image">
        <img :src="getImageUrl(settings?.section3_image_url, '4.png')" alt="Lifestyle" />
      </div>
      <div class="split-content">
        <div class="scroll-reveal">
          <span class="card-tag">{{ settings?.section3_tag || 'Lifestyle' }}</span>
          <h2 v-html="settings?.section3_title || 'Gemaakt voor <span class=\'text-gradient\'>Momenten</span>'"></h2>
          <p>{{ settings?.section3_text || 'Van een ochtendkoffie op het balkon tot een glas wijn bij zonsondergang — Maurice&Mia is uw privé-toevluchtsoord voor onvergetelijke herinneringen.' }}</p>
        </div>
      </div>
    </section>

    <!-- Technical Specifications (5 Cards Grid) -->
    <section class="specs-section">
      <div class="specs-grid">
        <div class="spec-item scroll-reveal glass-panel">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M7 20v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/><rect width="18" height="12" x="3" y="5" rx="2"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">{{ settings?.spec1_val || '85 m²' }}</div>
            <div class="spec-label">{{ settings?.spec1_label || 'Ruime leefomgeving met open design.' }}</div>
          </div>
        </div>

        <div class="spec-item scroll-reveal glass-panel" data-delay="100">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">{{ settings?.spec2_val || '3 Slaapkamers' }}</div>
            <div class="spec-label">{{ settings?.spec2_label || '1 Stapelbed, 2 Tweepersoonsbedden.' }}</div>
          </div>
        </div>

        <div class="spec-item scroll-reveal glass-panel" data-delay="200">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8l1-1"/><path d="M22 13v-1a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1"/><path d="M2 13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">{{ settings?.spec3_val || 'Modern' }}</div>
            <div class="spec-label">{{ settings?.spec3_label || 'Premium badkamer & keuken uitrusting.' }}</div>
          </div>
        </div>

        <div class="spec-item scroll-reveal glass-panel" data-delay="300">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h18"/><path d="M3 18h18"/><path d="M3 10h18"/><path d="M8 6l4-4 4 4"/><path d="M12 2v10"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">{{ settings?.spec4_val || '7e Etage' }}</div>
            <div class="spec-label">{{ settings?.spec4_label || 'Zuidgericht met frontaal zeezicht.' }}</div>
          </div>
        </div>

        <div class="spec-item scroll-reveal highlight-card-ai" data-delay="400">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">€{{ settings?.week_price ?? '100' }}</div>
            <div class="spec-label">Vanaf prijs per nacht (week).</div>
          </div>
        </div>
      </div>
    </section>

    <!-- High-Level Contact & Booking Action -->
    <section class="contact-hero-section">
      <div class="container-minimal text-center">
        <div class="scroll-reveal">
          <h2 class="text-ultra-small" v-html="settings?.contact_title || 'Klaar voor <span class=\'text-gradient\'>vertrek?</span>'"></h2>
          <p class="text-lead-premium">{{ settings?.contact_subtitle || 'Plan uw verblijf in Maurice&Mia of neem contact met ons op voor vragen.' }}</p>
        </div>

        <div class="contact-booking-grid scroll-reveal">
          <div class="booking-cta-card glass-panel">
            <div class="pricing-display">
              <div class="price-box">
                <span class="p-amount">€{{ settings?.week_price ?? '—' }}</span>
                <span class="p-label">Week / nacht</span>
              </div>
              <div class="price-separator"></div>
              <div class="price-box">
                <span class="p-amount">€{{ settings?.weekend_price ?? '—' }}</span>
                <span class="p-label">Weekend / nacht</span>
              </div>
            </div>
            <router-link to="/calendar" class="neo-btn neo-btn-primary mega-btn glow-btn">
              Reserveer Nu
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 12px;"><path d="m9 18 6-6-6-6"/></svg>
            </router-link>
          </div>

          <div class="contact-details-banner">
            <h3 class="contact-title">{{ settings?.contact_details_title || 'Contactgegevens' }}</h3>
            <div class="details-list">
              <div class="detail-item">
                <div class="d-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div class="d-text">{{ settings?.contact_name || 'Maurice & Mia' }}</div>
              </div>
              <a v-if="settings?.contact_email" :href="'mailto:' + settings.contact_email" class="detail-item link">
                <div class="d-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
                <div class="d-text">{{ settings.contact_email }}</div>
              </a>
              <a v-if="settings?.contact_phone" :href="'tel:' + settings.contact_phone" class="detail-item link">
                <div class="d-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div class="d-text">{{ settings.contact_phone }}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getSettings, type Settings } from '../services/settingsService'

const settings = ref<Settings | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// Helper to handle dynamic images with local asset fallbacks
const getImageUrl = (customUrl: string | null | undefined, fallbackName: string) => {
  if (customUrl) return customUrl
  // Correctly resolve local asset URL in Vite
  return new URL(`../assets/${fallbackName}`, import.meta.url).href
}

onMounted(async () => {
  try {
    settings.value = await getSettings()
    
    // Initialize reveal observer
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.1 })

    // Observe all reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.value?.observe(el))
  } catch (err) {
    console.error(err)
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.home-modern {
  background: black;
}

.scroll-prompt {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  opacity: 0.6;
}

.mouse-icon {
  width: 24px;
  height: 40px;
  border: 2px solid white;
  border-radius: 12px;
  position: relative;
}

.mouse-icon::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: scrollAnim 1.5s infinite;
}

@keyframes scrollAnim {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 15px); opacity: 0; }
}

.highlight-card-ai {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #7c3aed 100%) !important;
  background-size: 200% 200% !important;
  animation: card-mesh 8s ease infinite alternate !important;
  border: none !important;
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.1);
}

@keyframes card-mesh {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.highlight-card-ai .spec-val,
.highlight-card-ai .spec-label,
.highlight-card-ai .spec-icon {
  color: white !important;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.glow-btn {
  position: relative;
  overflow: hidden;
}

.glow-btn::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--accent-gradient);
  filter: blur(15px);
  z-index: -1;
  opacity: 0;
  transition: var(--transition-smooth);
}

.glow-btn:hover::after {
  opacity: 0.6;
}

/* Contact Hero Section */
.contact-hero-section {
  padding: 2rem 4rem;
  background: white;
  position: relative;
  z-index: 2;
}

.text-ultra-small {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.04em;
  text-align: center;
}

.text-lead-premium {
  font-size: 1.15rem;
  color: var(--text-secondary);
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
  text-align: center;
}

.contact-booking-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: stretch;
}

.booking-cta-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid var(--surface-border-glow);
}

.pricing-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.price-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.p-amount {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.p-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
}

.price-separator {
  width: 1px;
  height: 60px;
  background: var(--surface-border);
  opacity: 0.5;
}

.mega-btn {
  width: 100%;
  padding: 1.25rem;
  font-size: 1.15rem;
  border-radius: 20px;
}

.contact-details-banner {
  text-align: left;
  padding-left: 3rem;
}

.contact-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 3rem;
  letter-spacing: -0.02em;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition-cyber);
}

.detail-item.link:hover {
  color: var(--accent-primary);
  transform: translateX(12px);
  text-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
}

.d-icon {
  width: 64px;
  height: 64px;
  background: white;
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
}

.d-text {
  font-size: 1.25rem;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .contact-booking-grid { grid-template-columns: 1fr; gap: 5rem; }
  .contact-details-banner { padding-left: 0; text-align: center; }
  .details-list { align-items: center; }
  .pricing-display { justify-content: center; }
}

@media (max-width: 768px) {
  .p-amount { font-size: 2.5rem; }
  .pricing-display { gap: 2rem; }
  .contact-hero-section { padding: 8rem 1rem; }
}
</style>
