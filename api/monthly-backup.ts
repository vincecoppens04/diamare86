import JSZip from 'jszip'

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
      
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

export default async function (req: any, res: any) {
  // 1. Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const backupSecret = process.env.BACKUP_SECRET;
  
  const emailjsServiceId = process.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = process.env.VITE_EMAILJS_TEMPLATE_ADMIN; // Use the admin template
  const emailjsPublicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!supabaseUrl || !supabaseKey || !backupSecret || !emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'Missing environment variables in Vercel' 
    });
  }

  try {
    const zip = new JSZip();
    const tables = ['settings', 'bookings', 'booking_requests', 'blocked_periods', 'email_templates'];
    const infoData: string[] = [`Diamare86 Monthly Backup - ${new Date().toLocaleDateString()}`, '-----------------------------------'];
    let systemEmail = '';

    // 2. Fetch all tables through the secure RPC gate
    for (const table of tables) {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_backup_data`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          secret_passphrase: backupSecret,
          table_name: table
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${table}: ${response.status} ${await response.text()}`);
      }

      const data = await response.json();
      
      // Extract system_email from settings for the mailing step
      if (table === 'settings' && data && data.length > 0) {
        systemEmail = data[0].system_email;
      }

      const csv = convertToCSV(data);
      zip.file(`${table}.csv`, csv);
      infoData.push(`${table}: ${data ? data.length : 0} records`);
    }

    if (!systemEmail) {
      throw new Error('Could not find system_email in settings table.');
    }

    // 3. Generate ZIP base64
    zip.file('backup-info.txt', infoData.join('\n'));
    const zipBase64 = await zip.generateAsync({ type: 'base64' });
    const dateMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // 4. Send Email via EmailJS API
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          to_email: systemEmail,
          subject: `📦 Maandelijkse Backup Maurice&Mia (${dateMonth})`,
          message: 'Bijgesloten vindt u de automatische maandelijkse backup van het Diamare86 boekingssysteem.',
          attachment: `data:application/zip;base64,${zipBase64}`,
          attachment_name: `backup-${dateMonth}.zip`
        }
      })
    });

    if (!emailResponse.ok) {
      throw new Error(`EmailJS Error: ${await emailResponse.text()}`);
    }

    return res.status(200).json({ success: true, sent_to: systemEmail });

  } catch (error: any) {
    console.error('Monthly backup failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
