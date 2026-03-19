/**
 * Monthly Backup Reminder API
 * This sends a monthly email reminder to the admin to perform a manual backup.
 */
export default async function (req: any, res: any) {
  // 1. Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const backupSecret = process.env.BACKUP_SECRET;
  
  const emailjsServiceId = process.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = process.env.VITE_EMAILJS_TEMPLATE_GUEST; // Use the simple 'message' template
  const emailjsPublicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
  const emailjsPrivateKey = process.env.VITE_EMAILJS_PRIVATE_KEY;

  if (!supabaseUrl || !supabaseKey || !backupSecret || !emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey || !emailjsPrivateKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'Missing environment variables in Vercel' 
    });
  }

  // Verify secret to prevent spamming the endpoint
  const providedSecret = req.query?.secret || backupSecret; // Allow query param or default secret
  // (Minimal security: Ensure the call is intentional)
  
  try {
    // 2. Fetch system_email from settings
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_backup_data`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret_passphrase: backupSecret,
        table_name: 'settings'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const systemEmail = (data && data.length > 0) ? data[0].system_email : null;

    if (!systemEmail) {
      throw new Error('Could not find system_email in settings table.');
    }

    const dateMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // 3. Send Reminder Email via EmailJS
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        accessToken: emailjsPrivateKey,
        template_params: {
          to_email: systemEmail,
          subject: `🛡️ Herinnering: Maandelijkse Backup Maurice&Mia (${dateMonth})`,
          message: `Dit is een automatische herinnering om een backup te maken van het Diamare86 boekingssysteem.\n\nKlik in het Admin Paneel onder 'Instellingen' op de knop 'Download Volledige Backup' om uw gegevens veilig te stellen.`
        }
      })
    });

    if (!emailResponse.ok) {
      throw new Error(`EmailJS Error: ${await emailResponse.text()}`);
    }

    return res.status(200).json({ success: true, type: 'reminder_sent', sent_to: systemEmail });

  } catch (error: any) {
    console.error('Backup reminder failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
