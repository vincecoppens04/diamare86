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

        <div class="spec-item scroll-reveal glass-panel" data-delay="150">
          <div class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="spec-info">
            <div class="spec-val">{{ settings?.location_val || 'Blankenberge' }}</div>
            <div class="spec-label">{{ settings?.location_label || 'Zeedijk 85, 8370' }}</div>
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
                <span class="p-label">Vakantie & Weekend (vr-zo)</span>
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

    <!-- Photo Gallery -->
    <section class="gallery-section">
      <div class="container-minimal text-center">
        <div class="scroll-reveal">
          <h2 class="text-ultra-small" v-html="'Onze <span class=\'text-gradient\'>Galerij</span>'"></h2>
          <p class="text-lead-premium">Een blik op de sfeer en het interieur van Maurice&Mia.</p>
        </div>
      </div>
      
      <div class="gallery-carousel-wrapper" @mouseenter="stopAutoScroll" @mouseleave="startAutoScroll" @touchstart="stopAutoScroll" @touchend="startAutoScroll">
        <button class="carousel-btn prev-btn" @click="scrollGallery('left')" aria-label="Vorige foto's">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <div class="gallery-carousel" ref="galleryContainer">
          <div v-for="(img, idx) in galleryImages" :key="idx" class="carousel-item" @click="activeImage = img">
            <img :src="img" alt="Gallery Image" loading="lazy" />
          </div>
        </div>

        <button class="carousel-btn next-btn" @click="scrollGallery('right')" aria-label="Volgende foto's">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </section>

    <!-- FAQ Section -->
    <section v-if="hasFaqs" class="faq-section">
      <div class="container-minimal">
        <div class="scroll-reveal text-center" style="margin-bottom: 2.5rem;">
          <h2 class="text-ultra-small" v-html="settings?.faq_title || 'Veelgestelde <span class=\'text-gradient\'>Vragen</span>'"></h2>
          <p class="text-lead-premium">{{ settings?.faq_subtitle || 'Alles wat u moet weten over uw verblijf in ons appartement.' }}</p>
        </div>

        <div class="faq-accordion scroll-reveal">
          <div 
            v-for="(faq, idx) in activeFaqs" 
            :key="idx" 
            class="faq-item glass-panel"
            :class="{ 'is-open': openFaq === idx }"
            @click="toggleFaq(idx)"
          >
            <div class="faq-question">
              <span class="q-text">{{ faq.question }}</span>
              <span class="q-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </div>
            <div class="faq-answer">
              <div class="a-content">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activeImage" class="lightbox-overlay" @click="activeImage = null">
          <button class="lightbox-close" @click.stop="activeImage = null" aria-label="Sluiten">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <img :src="activeImage" class="lightbox-img" alt="Enlarged gallery image" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { getSettings, type Settings } from '../services/settingsService'

const settings = ref<Settings | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// Carousel state
const galleryContainer = ref<HTMLElement | null>(null)
const activeImage = ref<string | null>(null)
const openFaq = ref<number | null>(null)
let autoScrollInterval: ReturnType<typeof setInterval> | null = null

const startAutoScroll = () => {
  if (autoScrollInterval) clearInterval(autoScrollInterval)
  autoScrollInterval = setInterval(() => {
    if (!galleryContainer.value) return
    const el = galleryContainer.value
    // Scroll right by full clientWidth to show "a few other images"
    const nextScroll = el.scrollLeft + el.clientWidth
    // Check if we reached the end
    if (Math.ceil(nextScroll) >= el.scrollWidth - 10) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
    }
  }, 5000) // Show for 5 seconds
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

const scrollGallery = (direction: 'left' | 'right') => {
  stopAutoScroll()
  if (!galleryContainer.value) return
  const el = galleryContainer.value
  const offset = direction === 'left' ? -el.clientWidth : el.clientWidth;
  
  if (direction === 'left' && el.scrollLeft <= 5) {
     el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
  } else if (direction === 'right' && Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 10) {
     el.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
     el.scrollBy({ left: offset, behavior: 'smooth' })
  }
}

const toggleFaq = (index: number) => {
  if (openFaq.value === index) {
    openFaq.value = null
  } else {
    openFaq.value = index
  }
}

const activeFaqs = computed(() => {
  if (!settings.value) return []
  const faqs = []
  for (let i = 1; i <= 3; i++) {
    const qKey = `faq${i}_q` as keyof Settings
    const aKey = `faq${i}_a` as keyof Settings
    const q = settings.value[qKey]
    const a = settings.value[aKey]
    if (q && a) {
      faqs.push({ question: q, answer: a })
    }
  }
  return faqs
})

const hasFaqs = computed(() => activeFaqs.value.length > 0)

// Helper to handle dynamic images with local asset fallbacks
const getImageUrl = (customUrl: string | null | undefined, fallbackName: string) => {
  if (customUrl) return customUrl
  // Correctly resolve local asset URL in Vite
  return new URL(`../assets/${fallbackName}`, import.meta.url).href
}

// Statically import all images from the gallery folder
const imageModules = import.meta.glob<{ default: string }>('../assets/galery/*', { eager: true });
const galleryImages = Object.values(imageModules).map(mod => mod.default);

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
    // Wait for next tick so v-if elements (like FAQ) are rendered
    await nextTick()
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.value?.observe(el))

    // Start auto carousel
    startAutoScroll()
  } catch (err) {
    console.error(err)
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
  stopAutoScroll()
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

/* Photo Gallery Marquee Styles */
.gallery-section {
  padding: 4rem 0; /* Reduced bottom padding */
  background: white;
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.gallery-section .container-minimal {
  padding: 0 2rem;
}

.gallery-carousel-wrapper {
  position: relative;
  max-width: 1400px;
  margin: 3.5rem auto 0;
  padding: 0 4rem; /* Space for arrow buttons */
}
.gallery-carousel {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Hide scrollbar Firefox */
  -ms-overflow-style: none; /* Hide scrollbar IE/Edge */
  border-radius: 20px;
}
.gallery-carousel::-webkit-scrollbar {
  display: none; /* Hide scrollbar Chrome/Safari */
}
.carousel-item {
  flex: 0 0 calc(33.333% - 1.33rem); /* Show 3 large images on desktop */
  scroll-snap-align: start;
  aspect-ratio: 4/5; /* Changed from 4/3 for much taller images */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 25px rgba(0,0,0,0.08);
  position: relative;
  cursor: zoom-in;
}
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.carousel-item:hover img {
  transform: scale(1.03);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--surface-border);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  color: var(--text-primary);
}
.carousel-btn:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
}
.prev-btn { left: 0; }
.next-btn { right: 0; }

@media (max-width: 1024px) {
  .carousel-item {
    flex: 0 0 calc(50% - 1rem); /* 2 images per view on tablet */
  }
}
@media (max-width: 768px) {
  .gallery-carousel-wrapper {
    padding: 0 1rem;
  }
  .carousel-item {
    flex: 0 0 calc(100% - 0rem); /* 1 image per view on mobile */
  }
  .carousel-btn {
    display: none; /* Buttons hidden on mobile, user can natively swipe */
  }
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
}
.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
  user-select: none;
}
.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10000;
  padding: 10px;
  transition: transform 0.3s ease;
}
.lightbox-close:hover {
  transform: scale(1.1);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* FAQ Styles */
.faq-section {
  padding: 4rem 0; /* Reduced from 10rem */
  background: #fafafa;
  position: relative;
  z-index: 2;
}

.faq-accordion {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-item {
  background: white;
  border: 1px solid var(--surface-border);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.faq-item:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.faq-item.is-open {
  border-color: var(--accent-primary);
  box-shadow: 0 15px 40px rgba(124, 58, 237, 0.1);
}

.faq-question {
  padding: 2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.q-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.q-icon {
  color: var(--accent-primary);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.is-open .q-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-open .faq-answer {
  max-height: 500px;
}

.a-content {
  padding: 0 2.5rem 2.5rem;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .faq-section { padding: 6rem 1rem; }
  .faq-question { padding: 1.5rem; }
  .a-content { padding: 0 1.5rem 1.5rem; }
  .q-text { font-size: 1.1rem; }
}
</style>
