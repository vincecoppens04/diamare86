<template>
  <div class="image-uploader-container">
    <div class="preview-area" :class="{ 'has-image': modelValue }">
      <img v-if="modelValue" :src="modelValue" alt="Preview" class="image-preview" />
      <div v-else class="upload-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span>Geen afbeelding geselecteerd</span>
      </div>
      
      <div v-if="uploading" class="upload-overlay">
        <div class="btn-spinner"></div>
        <span>Uploaden...</span>
      </div>
    </div>

    <div class="uploader-actions">
      <button 
        type="button" 
        class="neo-btn secondary-glow" 
        @click="triggerFileSelect"
        :disabled="uploading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        {{ modelValue ? 'Wijzig Afbeelding' : 'Upload Afbeelding' }}
      </button>
      
      <button 
        v-if="modelValue" 
        type="button" 
        class="neo-btn danger-btn" 
        @click="removeImage"
        :disabled="uploading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      class="hidden-input" 
      accept="image/*,.heic,.heif" 
      @change="onFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabase'
import heic2any from 'heic2any'

const props = defineProps<{
  modelValue: string | null | undefined
  bucket?: string
  storagePath?: string
}>()

const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  let file = target.files[0]
  const bucketName = props.bucket || 'homepage'
  uploading.value = true

  try {
    // 1. Convert HEIC to JPEG if needed
    const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
    if (isHEIC) {
      console.log('Converting HEIC to JPEG...')
      const blob = await heic2any({ 
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      })
      
      const convertedBlob = Array.isArray(blob) ? blob[0] : blob
      file = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
    }

    // 2. Prepare storage path
    const fileExt = file.name.split('.').pop()
    const fileName = props.storagePath || `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = fileName

    // 3. Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      })

    if (uploadError) throw uploadError

    // 4. Get Public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    if (data?.publicUrl) {
      emit('update:modelValue', data.publicUrl)
    }
  } catch (error: any) {
    console.error('Upload/Conversion Error:', error)
    const msg = error.message || 'Onbekende fout'
    alert(`Fout bij het uploaden: ${msg}\n\nCheck of de bucket 'homepage' bestaat in Supabase Storage.`)
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const removeImage = () => {
  if (confirm('Wilt u deze afbeelding verwijderen? (De afbeelding wordt gewist van de site)')) {
    emit('update:modelValue', null)
  }
}
</script>

<style scoped>
.image-uploader-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  width: 100%;
}

.preview-area {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  background: var(--surface-background);
  border: 2px dashed var(--surface-border);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-area.has-image {
  border-style: solid;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
}

.upload-placeholder svg {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: white;
  z-index: 5;
}

.uploader-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.uploader-actions .neo-btn {
  flex: 1;
  justify-content: center;
}

.danger-btn {
  flex: 0 0 auto !important;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.danger-btn:hover {
  background: #ef4444;
  color: white;
}

.hidden-input {
  display: none;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
