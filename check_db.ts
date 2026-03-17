import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('Checking bookings table...')
  const { data, error } = await supabase.from('bookings').select('*').limit(1)
  if (error) {
    console.error('Error reading bookings:', error.message)
  } else {
    console.log('Bookings table accessible. Columns found in row:', Object.keys(data[0] || {}))
  }

  console.log('Checking booking_requests table...')
  const { data: reqData, error: reqErr } = await supabase.from('booking_requests').select('*').limit(1)
  if (reqErr) {
    console.error('Error reading booking_requests:', reqErr.message)
  } else {
    console.log('Booking_requests table accessible. Columns found in row:', Object.keys(reqData[0] || {}))
  }
}

checkTables()
