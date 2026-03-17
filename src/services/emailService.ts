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
 * Get subject and message based on the email type
 */
const getEmailContent = (type: EmailType) => {
  switch (type) {
    case 'request_received':
      return {
        subject: 'Booking Request Received - Diamare86',
        message: 'We have received your booking request for Diamare86. Our team will review it and get back to you within 24 hours.'
      }
    case 'booking_accepted':
      return {
        subject: 'Booking Confirmed! - Diamare86',
        message: 'Great news! Your booking request for Diamare86 has been accepted. We look forward to hosting you.'
      }
    case 'booking_refused':
      return {
        subject: 'Booking Update - Diamare86',
        message: 'Thank you for your interest in Diamare86. Unfortunately, the dates you requested are no longer available for booking.'
      }
    default:
      return {
        subject: 'Update regarding your stay',
        message: 'There has been an update regarding your booking at Diamare86.'
      }
  }
}

/**
 * Send an email to the guest
 */
export const sendGuestEmail = async (type: EmailType, data: EmailData) => {
  if (!SERVICE_ID || !TEMPLATE_GUEST || !PUBLIC_KEY) {
    console.warn('EmailJS guest config missing. Skipping email.')
    return
  }

  const { subject, message } = getEmailContent(type)

  const templateParams = {
    to_email: data.guest_email, // Main recipient for Guest Email
    subject,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    message,
    start_date: data.start_date,
    end_date: data.end_date,
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
    subject: `New Request from ${data.guest_name}`,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    guest_message: data.message || '(No message content)',
    start_date: data.start_date,
    end_date: data.end_date,
  }

  try {
    // Fetch the admin contact email from settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('contact_email')
      .single()

    if (settingsError) {
      console.error('EmailJS Admin Error: Could not fetch contact_email from settings', settingsError)
    } else {
      adminParams.to_email = settings.contact_email || ''
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
