export default async function (req: any, res: any) {
  // Use VITE_ prefix as these are the variables already set in the project
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY' 
    });
  }

  try {
    // Lightweight check: Query 1 booking ID to verify database connectivity
    const response = await fetch(`${supabaseUrl}/rest/v1/bookings?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        success: false, 
        error: `Supabase REST API error: ${response.status}`,
        details: errorText
      });
    }

    return res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error during fetch',
      message: error.message 
    });
  }
}
