import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRLS() {
  console.log('Testing anonymous fetch from email_templates...')
  const { data, error } = await supabase
    .from('email_templates')
    .select('subject, body')
    .eq('key', 'request_received')
    .single()

  if (error) {
    console.error('Error (likely RLS):', error)
  } else {
    console.log('Success!', data)
  }
}

testRLS()
