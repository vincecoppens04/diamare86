import { supabase } from '../lib/supabase'

export interface Settings {
  id?: string
  week_price: number | null
  weekend_price: number | null
  apartment_description: string | null
  booking_text: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  system_email?: string | null
  grandfather_email?: string | null
}

export const getSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }

  return data as Settings
}

export const updateSettings = async (settings: Settings): Promise<void> => {
  if (!settings.id) {
    throw new Error('Settings ID is required for update')
  }

  const { error } = await supabase
    .from('settings')
    .update({
      week_price: settings.week_price,
      weekend_price: settings.weekend_price,
      apartment_description: settings.apartment_description,
      booking_text: settings.booking_text,
      contact_name: settings.contact_name,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      system_email: settings.system_email,
      grandfather_email: settings.grandfather_email
    })
    .eq('id', settings.id)

  if (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}
