import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'

// --- Types ---

export interface EmailTemplate {
  id: string
  key: string
  subject: string
  body: string
  description?: string
}

interface EmailData {
  guest_name: string
  guest_email: string
  start_date: string
  end_date: string
  message?: string
}

export type EmailType = 'request_received' | 'booking_accepted' | 'booking_refused'

// --- Config ---

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_GUEST = import.meta.env.VITE_EMAILJS_TEMPLATE_GUEST
const TEMPLATE_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// --- Template Management (Supabase) ---

export const getTemplates = async (): Promise<EmailTemplate[]> => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('key')

  if (error) {
    console.error('Error fetching email templates:', error)
    return []
  }

  return data as EmailTemplate[]
}

export const updateTemplate = async (templateId: string, updates: { subject: string; body: string }) => {
  const { error } = await supabase
    .from('email_templates')
    .update(updates)
    .eq('id', templateId)

  if (error) {
    console.error(`Error updating template ${templateId}:`, error)
    throw error
  }
}

// --- Email Sending (EmailJS) ---

/**
 * Format date for emails
 */
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('nl-NL', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

/**
 * Replace variables in template string (tolerant of different formats)
 */
const parseTemplate = (text: string, data: EmailData, contractUrl?: string | null) => {
  if (!text) return ''
  return text
    .replace(/\{+guest_name\}+/gi, data.guest_name || '')
    .replace(/\{+(start_date|begin_date)\}+/gi, formatDate(data.start_date))
    .replace(/\{+end_date\}+/gi, formatDate(data.end_date))
    .replace(/\{+contract_url\}+/gi, contractUrl || '')
}

/**
 * Get fallback subject and message based on the email type
 */
const getEmailContent = (type: EmailType) => {
  switch (type) {
    case 'request_received':
      return {
        subject: 'Boekingsaanvraag Ontvangen - Maurice&Mia',
        message: 'We hebben je boekingsaanvraag voor Maurice&Mia ontvangen. Ons team zal deze beoordelen en binnen 24 uur contact met je opnemen.'
      }
    case 'booking_accepted':
      return {
        subject: 'Boeking Bevestigd! - Maurice&Mia',
        message: 'Geweldig nieuws! Je boekingsaanvraag voor Maurice&Mia is geaccepteerd. We kijken ernaar uit je te mogen verwelkomen.'
      }
    case 'booking_refused':
      return {
        subject: 'Update over je boeking - Maurice&Mia',
        message: 'Bedankt voor je interesse in Maurice&Mia. Helaas zijn de door jou aangevraagde data niet langer beschikbaar voor boeking.'
      }
    default:
      return {
        subject: 'Update over je verblijf',
        message: 'Er is een update met betrekking tot je boeking bij Maurice&Mia.'
      }
  }
}

/**
 * Send an email to the guest
 */
export const sendGuestEmail = async (type: EmailType, data: EmailData, contractUrl?: string | null) => {
  if (!SERVICE_ID || !TEMPLATE_GUEST || !PUBLIC_KEY) {
    console.warn('EmailJS guest config missing. Skipping email.')
    return
  }

  let subject = ''
  let message = ''

  try {
    const { data: templateData, error } = await supabase
      .from('email_templates')
      .select('subject, body')
      .eq('key', type)
      .single()

    if (error || !templateData) {
      console.warn(`Template ${type} not found in DB or error. Using fallback.`)
      const fallback = getEmailContent(type)
      subject = fallback.subject
      message = fallback.message
    } else {
      subject = parseTemplate(templateData.subject, data, contractUrl)
      message = parseTemplate(templateData.body, data, contractUrl)
    }
  } catch (err) {
    console.error('Error fetching template:', err)
    const fallback = getEmailContent(type)
    subject = fallback.subject
    message = fallback.message
  }
  if (contractUrl) {
    console.log('PREPARING EMAIL WITH CONTRACT LINK:', contractUrl)
  }

  const templateParams = {
    to_email: data.guest_email, // Main recipient for Guest Email
    subject,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    message,
    start_date: data.start_date,
    end_date: data.end_date,
    contract_url: contractUrl || '', // Public URL for free tier
  }

  console.log(`EmailJS Sending to GUEST [${type}]:`, templateParams)

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_GUEST,
      templateParams,
      PUBLIC_KEY
    )
    console.log(`EmailJS Success: Sent to guest [${type}]`)
  } catch (error) {
    console.error('EmailJS Guest Error:', error)
  }
}

/**
 * Send a notification email to the admin
 */
export const sendAdminNotification = async (data: EmailData) => {
  if (!SERVICE_ID || !TEMPLATE_ADMIN || !PUBLIC_KEY) {
    console.warn('EmailJS admin config missing. Skipping admin notification.')
    return
  }

  const adminParams = {
    to_email: '', // Will be filled from DB settings (admin recipient)
    subject: `Nieuwe aanvraag van ${data.guest_name}`,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    guest_message: data.message || '(No message content)',
    start_date: data.start_date,
    end_date: data.end_date,
  }

  try {
    // Fetch the admin contact/system email from settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('system_email, contact_email')
      .single()

    if (settingsError) {
      console.error('EmailJS Admin Error: Could not fetch emails from settings', settingsError)
    } else {
      // Use system_email if configured, otherwise fallback to contact_email
      adminParams.to_email = settings.system_email || settings.contact_email || ''
    }

    console.log('EmailJS Sending to ADMIN:', adminParams)

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ADMIN,
      adminParams,
      PUBLIC_KEY
    )
    console.log('EmailJS Success: Admin notification sent')
  } catch (error) {
    console.error('EmailJS Admin Error:', error)
  }
}
