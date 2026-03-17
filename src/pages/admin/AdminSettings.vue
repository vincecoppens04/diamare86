<template>
  <div class="admin-settings-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>Global <span class="text-gradient">Settings</span></h1>
        <p>Configure public metadata, pricing, and system variables for Diamare86.</p>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Syncing settings...</p>
    </div>
    <div v-else-if="errorMsg" class="alert alert-error">
      <span class="alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </span>
      {{ errorMsg }}
    </div>
    
    <div v-else-if="form" class="settings-grid">
      <form @submit.prevent="handleSave" class="settings-form">
        
        <!-- Pricing Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            </span>
            <h2>Pricing Configuration</h2>
          </div>
          <p class="card-desc">Set the standard rates for various booking types.</p>
          
          <div class="form-row">
            <div class="form-group">
              <label for="week_price">Standard Week Rate (€)</label>
              <input class="neo-input" type="number" id="week_price" v-model.number="form.week_price" min="0" />
            </div>
            <div class="form-group">
              <label for="weekend_price">Weekend Premium Rate (€)</label>
              <input class="neo-input" type="number" id="weekend_price" v-model.number="form.weekend_price" min="0" />
            </div>
          </div>
        </section>

        <!-- Public Content Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            </span>
            <h2>Public Display Content</h2>
          </div>
          <p class="card-desc">Information visible to guests on the landing page.</p>

          <div class="form-group">
            <label for="apartment_description">Apartment Narrative</label>
            <textarea class="neo-input" id="apartment_description" v-model="form.apartment_description" rows="5"></textarea>
          </div>
          <div class="form-group">
            <label for="booking_text">Booking Flow Call-to-Action</label>
            <textarea class="neo-input" id="booking_text" v-model="form.booking_text" rows="2"></textarea>
          </div>
        </section>

        <!-- Contact Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <h2>Contact & Support</h2>
          </div>
          <p class="card-desc">Secondary contact details provided to customers.</p>

          <div class="form-row">
            <div class="form-group">
              <label for="contact_name">Ownership Name</label>
              <input class="neo-input" type="text" id="contact_name" v-model="form.contact_name" />
            </div>
            <div class="form-group">
              <label for="contact_phone">Direct Phone Line</label>
              <input class="neo-input" type="tel" id="contact_phone" v-model="form.contact_phone" />
            </div>
          </div>
          <div class="form-group email-group">
            <label for="contact_email">Public Email Access</label>
            <div class="input-with-help">
              <input class="neo-input" type="email" id="contact_email" v-model="form.contact_email" />
              <span class="help-text">This address is visible to all site visitors.</span>
            </div>
          </div>
        </section>
        
        <!-- System Section -->
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2>Internal Systems</h2>
          </div>
          <p class="card-desc">Backend configurations and automation variables.</p>

          <div class="form-group email-group">
            <label for="system_email">System Dispatch Address</label>
            <div class="input-with-help">
              <input class="neo-input" type="email" id="system_email" v-model="form.system_email" />
              <span class="help-text">Used for outgoing automated notifications.</span>
            </div>
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
            <span v-else class="status-tip">Unsaved changes will be lost</span>
          </div>
          <div class="action-buttons">
            <button type="submit" class="neo-btn neo-btn-primary save-btn" :disabled="saving">
              <span v-if="saving" class="btn-spinner"></span>
              {{ saving ? 'Syncing...' : 'Publish Changes' }}
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

const form = ref<Settings | null>(null)
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const data = await getSettings()
    if (data) {
      form.value = { ...data }
    } else {
      errorMsg.value = 'Failed to load settings from Supabase.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Error fetching settings.'
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  if (!form.value) return
  
  errorMsg.value = ''
  successMsg.value = ''
  saving.value = true
  
  try {
    await updateSettings(form.value)
    successMsg.value = 'Settings updated successfully!'
    
    setTimeout(() => {
      successMsg.value = ''
    }, 4000)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to update system settings.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-settings-page {
  /* No local overrides for background/text - rely on global :root */
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
