import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, name, accountType, location, company, teamSize, query } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build notes with all collected metadata
    const notesObj: Record<string, string> = {}
    if (accountType) notesObj.accountType = accountType
    if (location) notesObj.location = location
    if (teamSize) notesObj.teamSize = teamSize
    if (query) notesObj.query = query
    notesObj.source = 'support_chat'
    notesObj.capturedAt = new Date().toISOString()

    // Check if this email already exists
    const { data: existing } = await supabase
      .from('trial_requests')
      .select('id, notes')
      .eq('email', email)
      .single()

    if (existing) {
      // Update existing record with new info
      const existingNotes = existing.notes ? JSON.parse(existing.notes) : {}
      const mergedNotes = { ...existingNotes, ...notesObj }

      await supabase
        .from('trial_requests')
        .update({
          notes: JSON.stringify(mergedNotes),
          updated_at: new Date().toISOString(),
          ...(name ? { full_name: name } : {}),
          ...(company ? { company_name: company } : {}),
          ...(teamSize ? { employee_count: teamSize } : {}),
        })
        .eq('id', existing.id)

      console.log(`Updated existing lead: ${email}`)
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('trial_requests')
        .insert({
          email,
          full_name: name || 'Support Chat Lead',
          company_name: company || null,
          employee_count: teamSize || null,
          status: 'interested',
          notes: JSON.stringify(notesObj),
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Failed to store lead:', insertError)
      } else {
        console.log(`New lead captured: ${email}`)
      }
    }

    // Forward lead details to Chris via email
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)

      const locationLine = location ? `<tr><td style="padding:8px 16px;color:#888;">Location</td><td style="padding:8px 16px;color:#fff;">${location}</td></tr>` : ''
      const companyLine = company ? `<tr><td style="padding:8px 16px;color:#888;">Company</td><td style="padding:8px 16px;color:#fff;">${company}</td></tr>` : ''
      const teamLine = teamSize ? `<tr><td style="padding:8px 16px;color:#888;">Team Size</td><td style="padding:8px 16px;color:#fff;">${teamSize}</td></tr>` : ''
      const queryLine = query ? `<tr><td style="padding:8px 16px;color:#888;">Query</td><td style="padding:8px 16px;color:#fff;">${query}</td></tr>` : ''

      await resend.emails.send({
        from: 'NeuroTunes <updates@updates.neurotunes.app>',
        to: ['Chris@neuralpositive.com'],
        subject: `New Interested Lead: ${name || email} (${accountType || 'unknown type'})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #fff; padding: 40px; border-radius: 16px;">
            <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 8px;">New Lead from Support Chat</h1>
            <p style="font-size: 14px; color: #888; margin-bottom: 32px;">Captured via the NeuroTunes support assistant</p>

            <table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.04); border-radius: 12px; overflow: hidden;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 8px 16px; color: #888;">Email</td>
                <td style="padding: 8px 16px; color: #fff;"><a href="mailto:${email}" style="color: #6cb4ee;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 8px 16px; color: #888;">Name</td>
                <td style="padding: 8px 16px; color: #fff;">${name || 'Not provided'}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 8px 16px; color: #888;">Account Interest</td>
                <td style="padding: 8px 16px; color: #fff; text-transform: capitalize;">${accountType || 'Not specified'}</td>
              </tr>
              ${locationLine}
              ${companyLine}
              ${teamLine}
              ${queryLine}
            </table>

            <p style="font-size: 13px; color: #666; margin-top: 32px;">
              This lead was automatically captured from a support chat conversation on neurotunes.app
            </p>
          </div>
        `,
      })
      console.log(`Lead notification sent to Chris@neuralpositive.com for: ${email}`)
    } else {
      console.warn('RESEND_API_KEY not configured — skipping email notification')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in capture-lead:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
