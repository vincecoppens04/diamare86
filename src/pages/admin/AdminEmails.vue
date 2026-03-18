<template>
  <div class="admin-emails-page animate-fade-in">
    <header class="page-header">
      <div class="header-content">
        <h1>E-mail<span class="text-gradient">sjablonen</span></h1>
        <p>Pas geautomatiseerde communicatie aan die naar gasten van Maurice&Mia wordt gestuurd.</p>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Sjablonen laden...</p>
    </div>
    <div v-else-if="errorMsg" class="alert alert-error">
      <span class="alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </span>
      {{ errorMsg }}
    </div>
    
    <div v-else class="templates-container">
      <div v-if="templates.length === 0" class="empty-state glass-panel">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <p>Geen e-mailsjablonen gevonden in de database.</p>
      </div>

      <div class="template-grid">
        <div v-for="template in templates" :key="template.id" class="template-card glass-panel">
          <div class="template-header">
            <div class="template-title">
              <span class="template-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <h3>{{ formatTemplateName(template.key) }}</h3>
            </div>
            <span class="template-key">ID: {{ template.key }}</span>
          </div>

          <form @submit.prevent="handleSave(template)" class="template-form">
            <div class="form-group">
              <label :for="`subject-${template.id}`">Onderwerp</label>
              <input 
                class="neo-input"
                type="text" 
                :id="`subject-${template.id}`" 
                v-model="template.subject" 
                placeholder="Voer onderwerp in..."
                required 
              />
            </div>
            
            <div class="form-group">
              <label :for="`body-${template.id}`">Berichtinhoud</label>
              <textarea 
                class="neo-input body-editor"
                :id="`body-${template.id}`" 
                v-model="template.body" 
                rows="8" 
                placeholder="Schrijf sjabloonbericht..."
                required
              ></textarea>
              <div class="variables-hint">
                <span class="hint-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </span>
                <p>Gebruik variabelen: <code>{GUEST_NAME}</code>, <code>{START_DATE}</code>, <code>{END_DATE}</code></p>
              </div>
            </div>

            <div class="card-footer">
              <div class="status-indicator">
                <span v-if="successMap[template.id]" class="success-pill">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>
                   Opgeslagen
                </span>
              </div>
              <button 
                type="submit" 
                class="neo-btn neo-btn-primary save-btn" 
                :disabled="savingId === template.id"
              >
                <span v-if="savingId === template.id" class="btn-spinner"></span>
                {{ savingId === template.id ? 'Opslaan...' : 'Sjabloon Publiceren' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTemplates, updateTemplate, type EmailTemplate } from '../../services/emailService'

const templates = ref<EmailTemplate[]>([])
const loading = ref(true)
const errorMsg = ref('')

const savingId = ref<string | null>(null)
const successMap = ref<Record<string, boolean>>({})

onMounted(async () => {
  loading.value = true
  try {
    const allTemplates = await getTemplates()
    // Hide 'prearrival' template from the UI but keep it in the backend
    templates.value = allTemplates.filter(t => t.key !== 'prearrival')
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Laden van e-mailsjablonen mislukt.'
  } finally {
    loading.value = false
  }
})

const handleSave = async (template: EmailTemplate) => {
  savingId.value = template.id
  successMap.value[template.id] = false
  
  try {
    await updateTemplate(template.id, {
      subject: template.subject,
      body: template.body
    })
    
    successMap.value[template.id] = true
    setTimeout(() => {
      successMap.value[template.id] = false
    }, 4000)
    
  } catch (err) {
    console.error(err)
    alert('Opslaan van sjabloonwijzigingen mislukt.')
  } finally {
    savingId.value = null
  }
}

const formatTemplateName = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
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

.template-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1280px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.template-card {
  padding: 3rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: var(--transition-bounce);
}

.template-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.template-header {
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.template-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.template-icon {
  font-size: 1.5rem;
}

.template-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
}

.template-key {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--bg-tertiary);
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
}

.template-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
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

.neo-input {
  padding: 0.875rem 1.25rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: #fdfdfd;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.neo-input:focus {
  outline: none;
  background: white;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.08);
}

.body-editor {
  line-height: 1.7;
}

.variables-hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: rgba(139, 92, 246, 0.04);
  border: 1px solid rgba(139, 92, 246, 0.08);
  border-radius: var(--radius-md);
}

.variables-hint p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.variables-hint code {
  color: var(--accent-primary);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--surface-border);
}

.success-pill {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--status-success);
  background: rgba(16, 185, 129, 0.08);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
}

.save-btn {
  padding: 0.875rem 2.5rem;
  font-size: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 6rem;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.alert-error {
  background: rgba(239, 68, 68, 0.05);
  color: var(--status-error);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
