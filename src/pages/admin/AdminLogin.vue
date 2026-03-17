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
        <h1>Welcome Back</h1>
        <p>Authorize access to the Diamare86 management suite</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="errorMsg" class="alert alert-error">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          {{ errorMsg }}
        </div>

        <div class="form-group">
          <label for="email">Admin Email</label>
          <input 
            class="neo-input"
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="admin@diamare86.com" 
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <div class="label-row">
            <label for="password">Security Key</label>
            <button type="button" class="forgot-link" @click="handleForgotPassword" :disabled="loading || resetSent">
              Forgot password?
            </button>
          </div>
          <input 
            class="neo-input"
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
            :disabled="loading"
          />
        </div>

        <div v-if="resetSent" class="alert alert-success animate-fade-in">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          Password reset email sent. Please check your inbox.
        </div>

        <button type="submit" class="neo-btn neo-btn-primary submit-btn" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>

      <div class="back-link">
        <router-link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-right:4px;"><path d="m15 18-6-6 6-6"/></svg>
          Return to public site
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const resetSent = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMsg.value = error.message
    } else {
      router.push('/admin/dashboard')
    }
  } catch (err) {
    console.error('Login exception:', err)
    errorMsg.value = 'An unexpected error occurred during login.'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!email.value) {
    errorMsg.value = 'Please enter your admin email first.'
    return
  }

  errorMsg.value = ''
  loading.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/admin/reset`
    })

    if (error) {
      errorMsg.value = error.message
    } else {
      resetSent.value = true
    }
  } catch (err) {
    console.error('Reset password request exception:', err)
    errorMsg.value = 'Failed to send reset email.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Previous styles... */
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

.background-blobs { position: absolute; inset: 0; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.1; }
.blob-1 { width: 500px; height: 500px; background: var(--accent-primary); top: -150px; left: -150px; }
.blob-2 { width: 450px; height: 450px; background: var(--accent-secondary); bottom: -100px; right: -100px; }

.login-card {
  width: 100%; max-width: 460px; padding: 4.5rem 3.5rem; z-index: 10;
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

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

.forgot-link {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.forgot-link:hover:not(:disabled) {
  text-decoration: underline;
  opacity: 0.8;
}

.forgot-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.neo-input { padding: 1rem 1.25rem; font-size: 1rem; background: var(--bg-secondary); border: 1px solid var(--surface-border); border-radius: var(--radius-md); color: var(--text-primary); }
.neo-input:focus { border-color: var(--accent-primary); background: white; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.08); }

.submit-btn { width: 100%; margin-top: 1rem; padding: 1.125rem; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.02em; }

.alert {
  padding: 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.05);
  color: var(--status-error);
  border: 1px solid rgba(239, 68, 68, 0.1);
}

.alert-success {
  background: rgba(34, 197, 94, 0.05);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.1);
}

.back-link { margin-top: 3rem; text-align: center; }
.back-link a { color: var(--text-muted); font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.back-link a:hover { color: var(--accent-primary); }
</style>
