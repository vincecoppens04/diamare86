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
  
  // New Homepage Fields
  hero_tag?: string | null
  hero_title?: string | null
  section1_tag?: string | null
  section1_title?: string | null
  section1_text?: string | null
  section2_tag?: string | null
  section2_title?: string | null
  section2_text?: string | null
  section3_tag?: string | null
  section3_title?: string | null
  section3_text?: string | null
  spec1_val?: string | null
  spec1_label?: string | null
  spec2_val?: string | null
  spec2_label?: string | null
  spec3_val?: string | null
  spec3_label?: string | null
  spec4_val?: string | null
  spec4_label?: string | null
  location_val?: string | null
  location_label?: string | null
  contact_title?: string | null
  contact_subtitle?: string | null
  contact_details_title?: string | null
  contract_text?: string | null

  // Image URLs
  hero_image_url?: string | null
  section1_image_url?: string | null
  section2_image_url?: string | null
  section3_image_url?: string | null

  // FAQ Fields
  faq_title?: string | null
  faq_subtitle?: string | null
  faq1_q?: string | null
  faq1_a?: string | null
  faq2_q?: string | null
  faq2_a?: string | null
  faq3_q?: string | null
  faq3_a?: string | null
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
      grandfather_email: settings.grandfather_email,
      hero_tag: settings.hero_tag,
      hero_title: settings.hero_title,
      section1_tag: settings.section1_tag,
      section1_title: settings.section1_title,
      section1_text: settings.section1_text,
      section2_tag: settings.section2_tag,
      section2_title: settings.section2_title,
      section2_text: settings.section2_text,
      section3_tag: settings.section3_tag,
      section3_title: settings.section3_title,
      section3_text: settings.section3_text,
      spec1_val: settings.spec1_val,
      spec1_label: settings.spec1_label,
      spec2_val: settings.spec2_val,
      spec2_label: settings.spec2_label,
      spec3_val: settings.spec3_val,
      spec3_label: settings.spec3_label,
      spec4_val: settings.spec4_val,
      spec4_label: settings.spec4_label,
      location_val: settings.location_val,
      location_label: settings.location_label,
      contact_title: settings.contact_title,
    contact_subtitle: settings.contact_subtitle,
    contact_details_title: settings.contact_details_title,
    hero_image_url: settings.hero_image_url,
    section1_image_url: settings.section1_image_url,
    section2_image_url: settings.section2_image_url,
    section3_image_url: settings.section3_image_url,
    faq_title: settings.faq_title,
    faq_subtitle: settings.faq_subtitle,
    faq1_q: settings.faq1_q,
    faq1_a: settings.faq1_a,
    faq2_q: settings.faq2_q,
    faq2_a: settings.faq2_a,
    faq2_a: settings.faq2_a,
    faq3_q: settings.faq3_q,
    faq3_a: settings.faq3_a,
    contract_text: settings.contract_text
    })
    .eq('id', settings.id)

  if (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}
