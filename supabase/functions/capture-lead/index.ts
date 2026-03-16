import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate a human-readable ticket number: NT-YYMMDD-XXXX
function generateTicketNumber(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `NT-${yy}${mm}${dd}-${rand}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const {
      email, name, accountType, location, company,
      teamSize, query, nextSteps, conversationLog
    } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // --- 1. Store/update lead in trial_requests ---
    const notesObj: Record<string, string> = {}
    if (accountType) notesObj.accountType = accountType
    if (location) notesObj.location = location
    if (teamSize) notesObj.teamSize = teamSize
    if (query) notesObj.query = query
    if (nextSteps) notesObj.nextSteps = nextSteps
    notesObj.source = 'support_chat'
    notesObj.capturedAt = new Date().toISOString()

    const { data: existing } = await supabase
      .from('trial_requests')
      .select('id, notes')
      .eq('email', email)
      .single()

    if (existing) {
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
    } else {
      await supabase
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
    }

    // --- 2. Create support ticket ---
    const ticketNumber = generateTicketNumber()
    const { error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        email,
        name: name || null,
        company: company || null,
        account_type: accountType || null,
        location: location || null,
        team_size: teamSize || null,
        query_summary: query || null,
        next_steps: nextSteps || null,
        conversation_log: conversationLog || [],
        source: 'support_chat',
        status: 'open',
      })

    if (ticketError) {
      console.error('Failed to create ticket:', ticketError)
    } else {
      console.log(`Ticket created: ${ticketNumber} for ${email}`)
    }

    // --- 3. Send emails via Resend ---
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)

      // 3a. Send ticket confirmation to the user
      const nextStepsHtml = nextSteps
        ? `<div style="background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.20);border-radius:12px;padding:20px;margin:24px 0;">
            <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:rgba(6,182,212,0.9);margin:0 0 12px 0;">Next Steps</h3>
            <p style="font-size:15px;line-height:1.6;color:#ccc;margin:0;white-space:pre-wrap;">${nextSteps}</p>
          </div>`
        : ''

      await resend.emails.send({
        from: 'NeuroTunes Support <updates@updates.neurotunes.app>',
        to: [email],
        subject: `Your Support Ticket: ${ticketNumber}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0c;color:#fff;padding:40px;border-radius:16px;">
            <h1 style="font-size:24px;font-weight:300;margin-bottom:8px;">Support Ticket Received</h1>
            <p style="font-size:14px;color:#888;margin-bottom:24px;">We've logged your request and our team will follow up.</p>

            <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#888;font-size:14px;">Ticket Number</td>
                  <td style="padding:8px 0;color:#fff;font-size:16px;font-weight:500;font-family:monospace;">${ticketNumber}</td>
                </tr>
                ${query ? `<tr><td style="padding:8px 0;color:#888;font-size:14px;">Regarding</td><td style="padding:8px 0;color:#ccc;font-size:14px;">${query}</td></tr>` : ''}
                <tr>
                  <td style="padding:8px 0;color:#888;font-size:14px;">Status</td>
                  <td style="padding:8px 0;color:rgba(6,182,212,0.9);font-size:14px;">Open</td>
                </tr>
              </table>
            </div>

            ${nextStepsHtml}

            <p style="font-size:14px;color:#a0a0a0;line-height:1.6;margin-bottom:24px;">
              A member of our team will review your request and reach out shortly. You can reference your ticket number <strong style="color:#fff;font-family:monospace;">${ticketNumber}</strong> in any follow-up communications.
            </p>

            <a href="https://neurotunes.app/support"
               style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#2563eb);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:500;font-size:15px;">
              Visit Support Center
            </a>

            <p style="font-size:13px;color:#666;margin-top:32px;">
              Reply to this email or visit our support center if you need immediate assistance.
            </p>
          </div>
        `,
      })
      console.log(`Ticket confirmation sent to ${email}: ${ticketNumber}`)

      // 3b. Send lead notification to Chris
      const detailRows = [
        `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Ticket</td><td style="padding:8px 16px;color:#fff;font-family:monospace;">${ticketNumber}</td></tr>`,
        `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Email</td><td style="padding:8px 16px;color:#fff;"><a href="mailto:${email}" style="color:#6cb4ee;">${email}</a></td></tr>`,
        `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Name</td><td style="padding:8px 16px;color:#fff;">${name || 'Not provided'}</td></tr>`,
        `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Account Interest</td><td style="padding:8px 16px;color:#fff;text-transform:capitalize;">${accountType || 'Not specified'}</td></tr>`,
        location ? `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Location</td><td style="padding:8px 16px;color:#fff;">${location}</td></tr>` : '',
        company ? `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Company</td><td style="padding:8px 16px;color:#fff;">${company}</td></tr>` : '',
        teamSize ? `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Team Size</td><td style="padding:8px 16px;color:#fff;">${teamSize}</td></tr>` : '',
        query ? `<tr style="border-bottom:1px solid rgba(255,255,255,0.08);"><td style="padding:8px 16px;color:#888;">Query</td><td style="padding:8px 16px;color:#fff;">${query}</td></tr>` : '',
        nextSteps ? `<tr><td style="padding:8px 16px;color:#888;">Next Steps</td><td style="padding:8px 16px;color:#fff;">${nextSteps}</td></tr>` : '',
      ].filter(Boolean).join('\n')

      await resend.emails.send({
        from: 'NeuroTunes <updates@updates.neurotunes.app>',
        to: ['Chris@neuralpositive.com'],
        subject: `[${ticketNumber}] New Lead: ${name || email} (${accountType || 'unknown'})`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0c;color:#fff;padding:40px;border-radius:16px;">
            <h1 style="font-size:24px;font-weight:300;margin-bottom:8px;">New Support Chat Lead</h1>
            <p style="font-size:14px;color:#888;margin-bottom:32px;">Ticket ${ticketNumber} — captured via the NeuroTunes support assistant</p>

            <table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.04);border-radius:12px;overflow:hidden;">
              ${detailRows}
            </table>

            <p style="font-size:13px;color:#666;margin-top:32px;">
              This lead was automatically captured from a support chat conversation on neurotunes.app
            </p>
          </div>
        `,
      })
      console.log(`Lead notification sent to Chris for ticket ${ticketNumber}`)
    } else {
      console.warn('RESEND_API_KEY not configured — skipping emails')
    }

    return new Response(
      JSON.stringify({ success: true, ticketNumber }),
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
