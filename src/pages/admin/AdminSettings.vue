<template>
  <div class="admin-settings-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>Algemene <span class="text-gradient">Instellingen</span></h1>
        <p>Configureer openbare metadata, prijzen en systeemvariabelen voor Maurice&Mia.</p>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Instellingen laden...</p>
    </div>
    <div v-else-if="errorMsg" class="alert alert-error">
      <span class="alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </span>
      {{ errorMsg }}
    </div>
    
    <div v-else-if="form" class="settings-grid">
      <form @submit.prevent="handleSave" class="settings-form">
        
        <!-- Homepage Content Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </span>
            <h2>Homepage Hero & Intro</h2>
          </div>
          <p class="card-desc">Beheer de tekst in de bovenste sectie van de website.</p>
          
          <div class="form-row">
            <div class="form-group">
              <label for="hero_tag">Hero Label (Small)</label>
              <input class="neo-input" type="text" id="hero_tag" v-model="form.hero_tag" placeholder="bijv. AI-Powered Experience" />
            </div>
            <div class="form-group">
              <label for="hero_title">Hero Titel (Headline)</label>
              <input class="neo-input" type="text" id="hero_title" v-model="form.hero_title" placeholder="bijv. Puur Minimalisme" />
              <span class="help-text">Gebruik HTML voor gradients: &lt;span class='text-gradient'&gt;Tekst&lt;/span&gt;</span>
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label for="apartment_description">Introductie Paragraaf</label>
            <textarea class="neo-input" id="apartment_description" v-model="form.apartment_description" rows="4"></textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label>Hoofdfoto (Bovenaan)</label>
            <ImageUploader v-model="form.hero_image_url" storage-path="hero_main" />
          </div>
        </section>

        <!-- Storytelling Sections -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            </span>
            <h2>Storytelling Secties</h2>
          </div>
          <p class="card-desc">Beheer de drie tekst/afbeelding blokken op de homepage.</p>

          <!-- Section 1 -->
          <div class="content-group">
            <h3>Sectie 1 (Boven)</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Label</label>
                <input class="neo-input" type="text" v-model="form.section1_tag" />
              </div>
              <div class="form-group">
                <label>Titel</label>
                <input class="neo-input" type="text" v-model="form.section1_title" />
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Tekst</label>
              <textarea class="neo-input" v-model="form.section1_text" rows="3"></textarea>
            </div>
            <div class="form-group" style="margin-top: 1.5rem;">
              <label>Foto Sectie 1</label>
              <ImageUploader v-model="form.section1_image_url" storage-path="section_1" />
            </div>
          </div>

          <!-- Section 2 -->
          <div class="content-group" style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--surface-border);">
            <h3>Sectie 2 (Midden)</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Label</label>
                <input class="neo-input" type="text" v-model="form.section2_tag" />
              </div>
              <div class="form-group">
                <label>Titel</label>
                <input class="neo-input" type="text" v-model="form.section2_title" />
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Tekst</label>
              <textarea class="neo-input" v-model="form.section2_text" rows="3"></textarea>
            </div>
            <div class="form-group" style="margin-top: 1.5rem;">
              <label>Foto Sectie 2</label>
              <ImageUploader v-model="form.section2_image_url" storage-path="section_2" />
            </div>
          </div>

          <!-- Section 3 -->
          <div class="content-group" style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--surface-border);">
            <h3>Sectie 3 (Onder)</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Label</label>
                <input class="neo-input" type="text" v-model="form.section3_tag" />
              </div>
              <div class="form-group">
                <label>Titel</label>
                <input class="neo-input" type="text" v-model="form.section3_title" />
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Tekst</label>
              <textarea class="neo-input" v-model="form.section3_text" rows="3"></textarea>
            </div>
            <div class="form-group" style="margin-top: 1.5rem;">
              <label>Foto Sectie 3</label>
              <ImageUploader v-model="form.section3_image_url" storage-path="section_3" />
            </div>
          </div>
        </section>

        <!-- Specifications Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </span>
            <h2>Specificaties kaarten</h2>
          </div>
          <p class="card-desc">Beheer de 4 kaarten met appartement details.</p>

          <div class="specs-admin-grid">
            <div class="spec-form-group">
              <label>Kaart 1 (Grootte)</label>
              <input class="neo-input" type="text" v-model="form.spec1_val" placeholder="85 m²" />
              <input class="neo-input" type="text" v-model="form.spec1_label" placeholder="Beschrijving..." />
            </div>
            <div class="spec-form-group">
              <label>Kaart 2 (Slaapkamers)</label>
              <input class="neo-input" type="text" v-model="form.spec2_val" placeholder="3 Slaapkamers" />
              <input class="neo-input" type="text" v-model="form.spec2_label" placeholder="Beschrijving..." />
            </div>
            <div class="spec-form-group">
              <label>Kaart 3 (Luxe)</label>
              <input class="neo-input" type="text" v-model="form.spec3_val" placeholder="Modern" />
              <input class="neo-input" type="text" v-model="form.spec3_label" placeholder="Beschrijving..." />
            </div>
            <div class="spec-form-group">
              <label>Kaart 4 (Zuidgericht)</label>
              <input class="neo-input" type="text" v-model="form.spec4_val" placeholder="7e Etage" />
              <input class="neo-input" type="text" v-model="form.spec4_label" placeholder="Beschrijving..." />
            </div>
            <div class="spec-form-group">
              <label>Kaart 5 (Locatie)</label>
              <input class="neo-input" type="text" v-model="form.location_val" placeholder="Blankenberge" />
              <input class="neo-input" type="text" v-model="form.location_label" placeholder="Zeedijk 85..." />
            </div>
          </div>
        </section>

        <!-- Contact CTA Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
            <h2>Call-To-Action & Footer</h2>
          </div>
          <p class="card-desc">Beheer de tekst in de contact sectie onderaan.</p>

          <div class="form-row">
            <div class="form-group">
              <label for="contact_title">CTA Titel</label>
              <input class="neo-input" type="text" id="contact_title" v-model="form.contact_title" />
            </div>
            <div class="form-group">
              <label for="contact_subtitle">CTA Subtitel</label>
              <input class="neo-input" type="text" id="contact_subtitle" v-model="form.contact_subtitle" />
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label for="contact_details_title">Titel Contactgegevens</label>
            <input class="neo-input" type="text" id="contact_details_title" v-model="form.contact_details_title" />
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <h2>Veelgestelde Vragen (FAQ)</h2>
          </div>
          <p class="card-desc">Beheer de FAQ sectie op de homepage.</p>

          <div class="form-row">
            <div class="form-group">
              <label for="faq_title">FAQ Sectie Titel</label>
              <input class="neo-input" type="text" id="faq_title" v-model="form.faq_title" placeholder="bijv. Veelgestelde Vragen" />
            </div>
            <div class="form-group">
              <label for="faq_subtitle">FAQ Sectie Subtitel</label>
              <input class="neo-input" type="text" id="faq_subtitle" v-model="form.faq_subtitle" placeholder="bijv. Alles wat u moet weten over uw verblijf." />
            </div>
          </div>

          <div class="faq-admin-list" style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 2rem;">
            <div v-for="i in 3" :key="i" class="faq-item-edit" style="padding: 1.5rem; background: var(--bg-secondary); border: 1px solid var(--surface-border); border-radius: var(--radius-md);">
              <h4 style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--accent-primary);">Vraag #{{ i }}</h4>
              <div class="form-group">
                <label>Vraag</label>
                <input class="neo-input" type="text" v-model="form[`faq${i}_q`]" :placeholder="`Vraag ${i}...`" />
              </div>
              <div class="form-group" style="margin-top: 1rem;">
                <label>Antwoord</label>
                <textarea class="neo-input" v-model="form[`faq${i}_a`]" rows="2" :placeholder="`Antwoord ${i}...`"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Existing Pricing Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            </span>
            <h2>Prijsconfiguratie</h2>
          </div>
          <p class="card-desc">Stel de standaardtarieven in voor boekingstypes.</p>
          
          <div class="form-row">
            <div class="form-group">
              <label for="week_price">Standaard Weektarief (€)</label>
              <input class="neo-input" type="number" id="week_price" v-model.number="form.week_price" min="0" />
            </div>
            <div class="form-group">
              <label for="weekend_price">Weekendtarief (€)</label>
              <input class="neo-input" type="number" id="weekend_price" v-model.number="form.weekend_price" min="0" />
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <h2>Contact & Ondersteuning</h2>
          </div>
          <p class="card-desc">Secundaire contactgegevens voor klanten.</p>

          <div class="form-row">
            <div class="form-group">
              <label for="contact_name">Naam Eigenaar</label>
              <input class="neo-input" type="text" id="contact_name" v-model="form.contact_name" />
            </div>
            <div class="form-group">
              <label for="contact_phone">Telefoonnummer</label>
              <input class="neo-input" type="tel" id="contact_phone" v-model="form.contact_phone" />
            </div>
          </div>
          <div class="form-group email-group">
            <label for="contact_email">Openbaar E-mailadres</label>
            <div class="input-with-help">
              <input class="neo-input" type="email" id="contact_email" v-model="form.contact_email" />
              <span class="help-text">Dit adres is zichtbaar voor alle websitebezoekers.</span>
            </div>
          </div>
        </section>
        
        <!-- System Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2>Intern E-mailadres</h2>
          </div>
          <p class="card-desc">Stel hier het e-mailadres in waarop je meldingen en nieuwe boekingen wilt ontvangen.</p>

          <div class="form-group email-group">
            <label for="system_email">Ontvangst E-mailadres Meldingen</label>
            <div class="input-with-help">
              <input class="neo-input" type="email" id="system_email" v-model="form.system_email" />
              <span class="help-text">E-mailadres waarop u meldingen van nieuwe boekingsaanvragen ontvangt.</span>
            </div>
          </div>
        </section>

        <!-- Data & Backup Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </span>
            <h2>Data & Beveiliging</h2>
          </div>
          <p class="card-desc">Download een volledige kopie van uw database gegevens in CSV-formaat.</p>

          <div class="backup-action">
            <button 
              type="button" 
              class="neo-btn secondary-glow" 
              @click="handleBackup" 
              :disabled="isBackingUp"
              style="width: 100%; justify-content: center; padding: 1.25rem;"
            >
              <div v-if="isBackingUp" class="btn-spinner" style="margin-right: 12px;"></div>
              <span>{{ isBackingUp ? 'Backup voorbereiden...' : 'Download Volledige Backup (.ZIP)' }}</span>
            </button>
            <p class="help-text" style="margin-top: 1rem; text-align: center;">
              Dit downloadt 5 CSV-bestanden (Boekingen, Aanvragen, Geblokkeerde periodes, Instellingen en E-mail templates).
            </p>
          </div>
        </section>

        <!-- Sticky Footer -->
        <div class="form-actions-bar glass-panel animate-fade-in">
          <div class="action-status">
            <span v-if="successMsg" class="success-text">
              <span class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span> {{ successMsg }}
            </span>
            <span v-else class="status-tip">Niet-opgeslagen wijzigingen gaan verloren</span>
          </div>
          <div class="action-buttons">
            <button type="submit" class="neo-btn neo-btn-primary save-btn" :disabled="saving">
              <span v-if="saving" class="btn-spinner"></span>
              {{ saving ? 'Opslaan...' : 'Wijzigingen Publiceren' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSettings, updateSettings, type Settings } from '../../services/settingsService'
import { downloadBackup } from '../../services/backupService'
import ImageUploader from '../../components/admin/ImageUploader.vue'

const form = ref<Settings | null>(null)
const loading = ref(true)
const saving = ref(false)
const isBackingUp = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const data = await getSettings()
    if (data) {
      form.value = { ...data }
    } else {
      errorMsg.value = 'Laden van instellingen mislukt.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Fout bij ophalen van instellingen.'
  } finally {
    loading.value = false
  }
})

const handleBackup = async () => {
  if (isBackingUp.value) return
  
  isBackingUp.value = true
  errorMsg.value = ''
  
  try {
    await downloadBackup()
    successMsg.value = 'Backup succesvol gedownload!'
    setTimeout(() => { successMsg.value = '' }, 4000)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Backup genereren mislukt. Controleer de console voor details.'
  } finally {
    isBackingUp.value = false
  }
}

const handleSave = async () => {
  if (!form.value) return
  
  errorMsg.value = ''
  successMsg.value = ''
  saving.value = true
  
  try {
    await updateSettings(form.value)
    successMsg.value = 'Instellingen succesvol bijgewerkt!'
    
    setTimeout(() => {
      successMsg.value = ''
    }, 4000)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Bijwerken van systeeminstellingen mislukt.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-settings-page {
  padding-bottom: 10rem;
}

.content-group h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.specs-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.spec-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--surface-background);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.spec-form-group label {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-header {
  margin-bottom: 3.5rem;
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 900px;
  width: 100%;
}

.settings-card {
  padding: 3rem;
  border-radius: var(--radius-lg);
  background: white;
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: var(--transition-smooth);
}

.settings-card:hover {
  border-color: var(--surface-border-glow);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-icon {
  font-size: 1.75rem;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 0 2.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.email-group {
  margin-top: 1rem;
}

.help-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Action Bar - Now placed naturally at the bottom of the form */
.form-actions-bar {
  margin-top: 2rem;
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: var(--transition-smooth);
}

.form-actions-bar:hover {
  border-color: var(--surface-border-glow);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.action-status {
  display: flex;
  align-items: center;
}

.success-text {
  color: var(--status-success);
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.success-icon {
  background: var(--status-success);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.status-tip {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.save-btn {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

/* Base states */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
</style>
