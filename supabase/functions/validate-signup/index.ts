import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { TrialConfirmationEmail } from './_templates/trial-confirmation.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidationRequest {
  email: string
  fullName?: string
  displayName?: string
  clientIp?: string
}

interface ValidationResponse {
  isValid: boolean
  errors: string[]
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, fullName, displayName } = await req.json() as ValidationRequest
    const errors: string[] = []

    // Use either fullName or displayName (displayName is what the frontend sends)
    const nameToValidate = fullName || displayName || ''

    // Read client IP from trusted edge headers — never trust body-supplied IP
    const clientIp = req.headers.get('cf-connecting-ip') ||
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     null

    // Validate full name (First + Last minimum)
    if (!nameToValidate || nameToValidate.trim().length === 0) {
      errors.push('Please provide your full legal name (first and last name required, no fake names)')
    } else {
      const { data: nameValid, error: nameError } = await supabase
        .rpc('validate_user_name', { full_name: nameToValidate })

      if (nameError) {
        errors.push('Error validating name')
      } else {
        if (!nameValid) {
          errors.push('Please provide your full legal name (first and last name required, no fake names)')
        }
      }
    }

    // Check if email domain is from blocked company
    const { data: companyBlocked, error: companyError } = await supabase
      .rpc('is_blocked_company_email', { email })

    if (companyError) {
      console.error('Company check error')
    } else if (companyBlocked) {
      errors.push('Registration from this organization is not permitted')
    }

    // Validate IP format before using in URL (basic IPv4/IPv6 sanity check)
    const isValidIp = (ip: string) =>
      /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || /^[0-9a-fA-F:]+$/.test(ip)

    // Geolocation check using IP
    if (clientIp && clientIp !== '127.0.0.1' && !clientIp.startsWith('192.168.') && isValidIp(clientIp)) {
      try {
        // Use HTTPS to prevent MITM on geolocation lookups
        const geoResponse = await fetch(`https://ip-api.com/json/${encodeURIComponent(clientIp)}?fields=status,country,countryCode,proxy`)
        const geoData = await geoResponse.json()

        if (geoData.status === 'success') {
          // Check if country is blocked
          const { data: countryBlocked } = await supabase
            .from('blocked_countries')
            .select('country_code')
            .eq('country_code', geoData.countryCode)
            .single()

          if (countryBlocked) {
            errors.push(`Registration from ${geoData.country} is not permitted`)
          }

          // Check for proxy/VPN (basic detection)
          if (geoData.proxy === true) {
            errors.push('VPN or proxy connections are not permitted during registration')
          }

          // Block non-US/EU locations (except already in blocked list)
          const allowedRegions = ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'DK', 'NO', 'FI', 'IE', 'PT', 'PL', 'CZ', 'GR', 'RO', 'HU']
          if (!allowedRegions.includes(geoData.countryCode) && !countryBlocked) {
            errors.push('Registration is currently limited to US and EU locations')
          }
        }
      } catch (geoError) {
        console.error('Geolocation check failed:', geoError)
        // Don't block signup if geolocation check fails, just log it
      }
    }

    const response: ValidationResponse = {
      isValid: errors.length === 0,
      errors
    }

    // If validation passed, send confirmation email and create trial record
    if (errors.length === 0) {
      try {
        // Render the email template
        const html = await renderAsync(
          React.createElement(TrialConfirmationEmail, {
            displayName: nameToValidate,
            email: email,
          })
        )

        // Send confirmation email directly using Resend
        const { error: emailError } = await resend.emails.send({
          from: 'NeuroTunes <updates@updates.neurotunes.app>',
          to: [email],
          subject: 'Your NeuroTunes Free Business Trial is Confirmed',
          html,
        })

        if (emailError) {
          console.error('Failed to send confirmation email')
        }

        // Store trial request in database
        const { error: insertError } = await supabase
          .from('trial_requests')
          .insert({
            email,
            full_name: nameToValidate,
            status: 'pending',
            created_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Failed to create trial record')
        }

      } catch (emailError) {
        console.error('Error in post-validation steps:', emailError)
        // Don't fail the validation if email/db operations fail
      }
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        errors: ['An error occurred during validation. Please try again.'] 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
