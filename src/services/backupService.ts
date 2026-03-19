import JSZip from 'jszip'
import { supabase } from '../lib/supabase'

/**
 * Converts an array of objects to a CSV string.
 */
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return 'EMPTY'
  }

  const headers = Object.keys(data[0])
  const rows = data.map(obj => 
    headers.map(header => {
      let val = obj[header]
      if (val === null || val === undefined) return ''
      
      // Escape strings containing commas or quotes
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Fetches all core tables from Supabase and triggers a ZIP download.
 */
export async function downloadBackup(): Promise<void> {
  const zip = new JSZip()
  const tables = ['bookings', 'booking_requests', 'blocked_periods', 'settings', 'email_templates']
  const dateStr = new Date().toISOString().split('T')[0]
  const infoData: string[] = [
    `Diamare86 Booking System Backup`,
    `Generated: ${new Date().toLocaleString()}`,
    `-----------------------------------`
  ]

  console.log('Starting full database backup...')

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*')
      
      if (error) throw error

      if (data) {
        const csv = convertToCSV(data)
        zip.file(`${table}.csv`, csv)
        infoData.push(`${table}: ${data.length} records`)
      }
    } catch (err) {
      console.error(`Failed to export table ${table}:`, err)
      zip.file(`${table}-error.txt`, `Failed to fetch data for table: ${table}. Error: ${JSON.stringify(err)}`)
      infoData.push(`${table}: FAILED`)
    }
  }

  // Add metadata file
  zip.file('backup-info.txt', infoData.join('\n'))

  // Generate and trigger download
  try {
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `backup-maurice-and-mia-${dateStr}.zip`
    
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
    
    console.log('Backup downloaded successfully.')
  } catch (err) {
    console.error('Failed to generate ZIP archive:', err)
    throw new Error('Backup ZIP generation failed.')
  }
}
