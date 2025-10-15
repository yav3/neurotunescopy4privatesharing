import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Generating track health report...');

    // Get summary statistics
    const { data: summary, error: summaryError } = await supabase
      .rpc('get_unplayable_tracks_summary');

    if (summaryError) {
      console.error('Error fetching summary:', summaryError);
      throw summaryError;
    }

    // Get detailed diagnostics
    const { data: diagnostics, error: diagnosticsError } = await supabase
      .rpc('get_unplayable_tracks_diagnostic');

    if (diagnosticsError) {
      console.error('Error fetching diagnostics:', diagnosticsError);
      throw diagnosticsError;
    }

    console.log(`📊 Summary: ${summary?.[0]?.total_unplayable || 0} unplayable tracks found`);

    // Group diagnostics by issue category
    const groupedIssues = diagnostics?.reduce((acc: any, track: any) => {
      const category = track.issue_category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(track);
      return acc;
    }, {});

    // Create a formatted report
    const report = {
      generated_at: new Date().toISOString(),
      summary: summary?.[0] || {},
      issues_by_category: groupedIssues || {},
      total_issues: diagnostics?.length || 0,
      critical_issues: diagnostics?.filter((t: any) => 
        t.issue_category === 'missing_metadata' || 
        t.issue_category === 'missing_bucket'
      ).length || 0,
      recent_failures: diagnostics?.filter((t: any) => t.days_broken <= 7).length || 0,
      chronic_issues: diagnostics?.filter((t: any) => t.days_broken > 30).length || 0,
    };

    // Generate recommendations
    const recommendations = [];
    if (report.summary.missing_metadata > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Missing metadata',
        count: report.summary.missing_metadata,
        action: 'Update track records with correct storage_key values'
      });
    }
    if (report.summary.file_not_found > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Files not found',
        count: report.summary.file_not_found,
        action: 'Verify files exist in storage or re-upload missing files'
      });
    }
    if (report.summary.never_verified > 0) {
      recommendations.push({
        priority: 'medium',
        issue: 'Never verified tracks',
        count: report.summary.never_verified,
        action: 'Run verification process on these tracks'
      });
    }
    if (report.chronic_issues > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Chronic issues (>30 days)',
        count: report.chronic_issues,
        action: 'These tracks have been broken for over a month - consider removing or replacing'
      });
    }

    report.recommendations = recommendations;

    console.log('✅ Report generated successfully');
    console.log(`   - ${report.critical_issues} critical issues`);
    console.log(`   - ${report.recent_failures} recent failures (last 7 days)`);
    console.log(`   - ${report.chronic_issues} chronic issues (>30 days)`);

    return new Response(
      JSON.stringify(report),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
