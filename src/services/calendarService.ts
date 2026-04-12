import { supabase } from '../lib/supabase'

export interface Booking {
  id: string
  start_date: string
  end_date: string
  guest_name?: string
  guest_email?: string
  total_price?: number
}

export interface BlockedPeriod {
  id: string
  start_date: string
  end_date: string
  reason: string | null
}

export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, guest_name, guest_email, total_price')
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  return data as Booking[]
}

export const getPastBookings = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, guest_name, guest_email, total_price')
    .lt('start_date', today)
    .order('end_date', { ascending: false })

  if (error) {
    console.error('Error fetching past bookings:', error)
    return []
  }
  return data as Booking[]
}

export const getBlockedPeriods = async (): Promise<BlockedPeriod[]> => {
  const { data, error } = await supabase
    .from('blocked_periods')
    .select('id, start_date, end_date, reason')

  if (error) {
    console.error('Error fetching blocked periods:', error)
    return []
  }
  return data as BlockedPeriod[]
}

export const createBlockedPeriod = async (data: Omit<BlockedPeriod, 'id'>) => {
  const { error } = await supabase
    .from('blocked_periods')
    .insert([
      {
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason
      }
    ])

  if (error) {
    console.error('Error creating blocked period:', error)
    throw error
  }
}
export const updateBlockedPeriod = async (id: string, updates: Partial<BlockedPeriod>) => {
  const { error } = await supabase
    .from('blocked_periods')
    .update({
      start_date: updates.start_date,
      end_date: updates.end_date,
      reason: updates.reason
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating blocked period:', error)
    throw error
  }
}

export const createBooking = async (data: Omit<Booking, 'id'>) => {
  // 1. Create a request first (using a placeholder email since it's required in the schema)
  const { data: requestData, error: insertError } = await supabase
    .from('booking_requests')
    .insert([
      {
        guest_name: data.guest_name,
        guest_email: 'manueel@maurice-mia.com',
        start_date: data.start_date,
        end_date: data.end_date,
        total_price: data.total_price || 0,
        status: 'pending',
        message: 'Manuele boeking via beheerpaneel'
      }
    ])
    .select()

  if (insertError) {
    console.error('Error creating initial request for manual booking:', insertError)
    throw insertError
  }

  const requestId = requestData?.[0]?.id
  if (!requestId) throw new Error('Failed to retrieve new request ID')

  // 2. Immediately accept it to trigger the move to 'bookings' table
  const { error: updateError } = await supabase
    .from('booking_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId)

  if (updateError) {
    console.error('Error accepting manual booking request:', updateError)
    throw updateError
  }

  // 3. Delete the request from the pending list (matches acceptBookingRequest logic)
  await supabase.from('booking_requests').delete().eq('id', requestId)
}

export const updateBooking = async (id: string, updates: { start_date: string, end_date: string }) => {
  const { error } = await supabase
    .from('bookings')
    .update({
      start_date: updates.start_date,
      end_date: updates.end_date
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating booking:', error)
    throw error
  }
}

export const deleteBooking = async (id: string) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting booking:', error)
    throw error
  }
}

export const deleteBlockedPeriod = async (id: string) => {
  const { error } = await supabase
    .from('blocked_periods')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blocked period:', error)
    throw error
  }
}

export const isRangeAvailable = async (start: string, end: string, ignoreId?: string): Promise<{ available: boolean, conflict?: string }> => {
  const [bookings, blocked] = await Promise.all([getBookings(), getBlockedPeriods()])
  
  const proposedStart = new Date(start)
  const proposedEnd = new Date(end)

  // Check bookings
  for (const b of bookings) {
    if (ignoreId && b.id === ignoreId) continue
    const bStart = new Date(b.start_date)
    const bEnd = new Date(b.end_date)
    
    // Exclusive overlap check to allow adjacent bookings (Changeover)
    if (proposedStart < bEnd && proposedEnd > bStart) {
      return { available: false, conflict: 'Deze data zijn al bezet.' }
    }
  }

  // Check blocked periods
  for (const bp of blocked) {
    if (ignoreId && bp.id === ignoreId) continue
    const bpStart = new Date(bp.start_date)
    const bpEnd = new Date(bp.end_date)
    
    if (proposedStart < bpEnd && proposedEnd > bpStart) {
      return { available: false, conflict: 'Deze data zijn niet beschikbaar.' }
    }
  }

  return { available: true }
}
