<template>
  <div class="admin-contracts-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>Huurcontract <span class="text-gradient">sjabloon</span></h1>
        <p>Beheer het sjabloon voor de huurcontracten die automatisch naar gasten worden gestuurd.</p>
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
    
    <div v-else-if="form" class="contracts-container">
      <form @submit.prevent="handleSave" class="contracts-form">
        
        <section class="settings-card glass-panel">
          <div class="card-header">
            <span class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </span>
            <h2>Contract Sjabloon</h2>
          </div>
          <p class="card-desc">Pas de tekst aan die in de PDF verschijnt. Gebruik de variabelen hieronder om gegevens van de boeking automatisch in te vullen.</p>

          <div class="form-group">
            <label for="contract_text">Inhoud van het contract</label>
            <textarea 
              class="neo-input" 
              id="contract_text" 
              v-model="form.contract_text" 
              rows="18" 
              placeholder="Typ hier de inhoud van het contract..."
            ></textarea>
            
            <div class="variable-guide">
              <p><strong>Beschikbare variabelen:</strong></p>
              <div class="variable-list">
                <div class="var-tag"><code>{guest_name}</code> <span>Naam van de gast</span></div>
                <div class="var-tag"><code>{start_date}</code> <span>Aankomstdatum</span></div>
                <div class="var-tag"><code>{end_date}</code> <span>Vertrekdatum</span></div>
                <div class="var-tag"><code>{total_price}</code> <span>Totaalbedrag verblijf</span></div>
              </div>
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
            <span v-else class="status-tip">Niet-opgeslagen wijzigingen gaan verloren</span>
          </div>
          <div class="action-buttons">
            <button type="submit" class="neo-btn neo-btn-primary save-btn" :disabled="saving">
              <span v-if="saving" class="btn-spinner"></span>
              {{ saving ? 'Opslaan...' : 'Sjabloon Opslaan' }}
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
      errorMsg.value = 'Laden van instellingen mislukt.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Fout bij ophalen van instellingen.'
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
    successMsg.value = 'Huurcontract succesvol bijgewerkt!'
    
    setTimeout(() => {
      successMsg.value = ''
    }, 4000)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Bijwerken van contract mislukt.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-contracts-page {
  padding-bottom: 10rem;
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

.contracts-form {
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
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0 0 2.5rem 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.variable-guide {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--surface-border);
}

.variable-guide p {
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
}

.variable-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.var-tag {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.var-tag code {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--surface-border);
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--accent-primary);
  width: fit-content;
}

.var-tag span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.form-actions-bar {
  margin-top: 2rem;
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.success-text {
  color: var(--status-success);
  font-weight: 700;
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
}

.save-btn {
  padding: 0.875rem 2rem;
  font-weight: 800;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
