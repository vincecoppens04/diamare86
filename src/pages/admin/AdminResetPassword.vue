<template>
  <div class="login-page">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    
    <div class="login-card glass-panel animate-fade-in">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/></svg>
          </span>
          <span class="logo-text">Admin<span class="text-gradient">Core</span></span>
        </div>
        <h1>Reset Password</h1>
        <p>Enter your new security key for the management suite</p>
      </div>

      <form v-if="!success" @submit.prevent="handleResetPassword" class="login-form">
        <div v-if="errorMsg" class="alert alert-error">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          {{ errorMsg }}
        </div>

        <div class="form-group">
          <label for="password">New Password</label>
          <input 
            class="neo-input"
            type="password" 
            id="password" 
            v-model="newPassword" 
            required 
            placeholder="••••••••"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="confirm">Confirm Password</label>
          <input 
            class="neo-input"
            type="password" 
            id="confirm" 
            v-model="confirmPassword" 
            required 
            placeholder="••••••••"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="neo-btn neo-btn-primary submit-btn" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          {{ loading ? 'Updating...' : 'Set New Password' }}
        </button>
      </form>

      <div v-else class="success-state animate-fade-in">
        <div class="success-icon">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2>Password Updated</h2>
        <p>Your security key has been changed successfully. You can now use it to sign in.</p>
        <router-link to="/admin/login" class="neo-btn neo-btn-primary return-btn">
          Back to Login
        </router-link>
      </div>

      <div v-if="!success" class="back-link">
        <router-link to="/admin/login">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-right:4px;"><path d="m15 18-6-6 6-6"/></svg>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabase'

const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const loading = ref(false)
const success = ref(false)

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  errorMsg.value = ''
  loading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) {
      errorMsg.value = error.message
    } else {
      success.value = true
    }
  } catch (err) {
    console.error('Reset password exception:', err)
    errorMsg.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Reuse AdminLogin.vue styles */
.login-page {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.background-blobs {
  position: absolute; inset: 0; z-index: 0;
}

.blob {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.1;
}

.blob-1 { width: 500px; height: 500px; background: var(--accent-primary); top: -150px; left: -150px; }
.blob-2 { width: 450px; height: 450px; background: var(--accent-secondary); bottom: -100px; right: -100px; }

.login-card {
  width: 100%; max-width: 460px; padding: 4rem 3rem; z-index: 10;
  background: white; border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); border-radius: var(--radius-lg);
}

.header { text-align: center; margin-bottom: 3rem; }
.logo { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 2.5rem; }
.logo-icon { font-size: 2rem; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo-text { font-family: var(--font-heading); font-weight: 800; font-size: 1.6rem; color: var(--text-primary); letter-spacing: -0.02em; }

.header h1 { margin: 0 0 0.75rem 0; font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
.header p { margin: 0; color: var(--text-secondary); font-size: 1rem; font-weight: 500; line-height: 1.5; }

.login-form { display: flex; flex-direction: column; gap: 1.75rem; }
.form-group { display: flex; flex-direction: column; gap: 0.75rem; }
label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

.neo-input { padding: 1rem 1.25rem; font-size: 1rem; background: var(--bg-secondary); border: 1px solid var(--surface-border); border-radius: var(--radius-md); color: var(--text-primary); }
.neo-input:focus { border-color: var(--accent-primary); background: white; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.08); }

.submit-btn { width: 100%; margin-top: 1rem; padding: 1.125rem; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.02em; }

.alert-error { background: rgba(239, 68, 68, 0.05); color: var(--status-error); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(239, 68, 68, 0.1); font-size: 0.9rem; font-weight: 500; }

.success-state { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.success-icon { width: 64px; height: 64px; background: rgba(34, 197, 94, 0.1); color: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; }
.success-state h2 { font-size: 1.75rem; font-weight: 800; margin: 0; }
.success-state p { color: var(--text-secondary); margin: 0 0 1.5rem 0; line-height: 1.6; }
.return-btn { width: 100%; text-decoration: none; display: flex; align-items: center; justify-content: center; }

.back-link { margin-top: 3rem; text-align: center; }
.back-link a { color: var(--text-muted); font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.back-link a:hover { color: var(--accent-primary); }
</style>
