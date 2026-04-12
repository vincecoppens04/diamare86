import { supabase } from '../lib/supabase'
import { sendGuestEmail, sendAdminNotification } from './emailService'
import { getSettings } from './settingsService'
import { generateContractPDF, uploadContractPDF } from './contractService'

export interface BookingRequestData {
  guest_name: string
  guest_email: string
  guest_phone?: string
  message?: string
  start_date: string // ISO date string YYYY-MM-DD
  end_date: string   // ISO date string YYYY-MM-DD
  total_price: number
}

export interface BookingRequest extends BookingRequestData {
  id: string
  status: 'pending' | 'accepted' | 'refused'
  created_at: string
  reviewed_at: string | null
}

export const createBookingRequest = async (data: BookingRequestData) => {
  const { error } = await supabase
    .from('booking_requests')
    .insert([
      {
        ...data,
        status: 'pending'
      }
    ])

  if (error) {
    console.error('Error creating booking request:', error)
    throw error
  }

  // Invoke EmailJS (Non-blocking)
  const emailPayload = {
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    start_date: data.start_date,
    end_date: data.end_date,
    message: data.message
  }

  sendGuestEmail('request_received', emailPayload)
  sendAdminNotification(emailPayload)
}

export const getBookingRequests = async (): Promise<BookingRequest[]> => {
  const { data, error } = await supabase
    .from('booking_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching booking requests:', error)
    return []
  }

  return data as BookingRequest[]
}

export const acceptBookingRequest = async (request: BookingRequest) => {
  // Database trigger automatically handles: 
  // 1. Inserting into 'bookings'
  // 2. Setting 'reviewed_at'
  // 3. Preventing overlaps/conflicts
  const { error } = await supabase
    .from('booking_requests')
    .update({ status: 'accepted' })
    .eq('id', request.id)

  if (error) {
    console.error('Acceptance Error:', error.message)
    throw new Error(error.message)
  }

  // Fetch settings for the contract template
  const settings = await getSettings()
  const contractTemplate = settings?.contract_text || ''
  
  // Generate & Upload Contract PDF
  let contractUrl = null
  if (contractTemplate) {
    try {
      const pdfBlob = generateContractPDF(request, contractTemplate)
      contractUrl = await uploadContractPDF(request.id, pdfBlob)
    } catch (err) {
      console.error('Contract Automation Error:', err)
    }
  }

  // Invoke EmailJS (Non-blocking)
  sendGuestEmail('booking_accepted', {
    guest_name: request.guest_name,
    guest_email: request.guest_email,
    start_date: request.start_date,
    end_date: request.end_date
  }, contractUrl)

  // Once accepted, delete the request from the pending list
  await supabase.from('booking_requests').delete().eq('id', request.id)
}

export const refuseBookingRequest = async (request: BookingRequest) => {
  // Database trigger automatically sets 'reviewed_at'
  const { error } = await supabase
    .from('booking_requests')
    .update({ status: 'refused' })
    .eq('id', request.id)

  if (error) {
    console.error('Refusal Error:', error.message)
    throw new Error(error.message)
  }

  // Invoke EmailJS (Non-blocking)
  sendGuestEmail('booking_refused', {
    guest_name: request.guest_name,
    guest_email: request.guest_email,
    start_date: request.start_date,
    end_date: request.end_date
  })

  // Once refused, delete the request from the pending list
  await supabase.from('booking_requests').delete().eq('id', request.id)
}
