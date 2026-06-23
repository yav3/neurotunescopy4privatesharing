
-- Revoke EXECUTE from public/anon/authenticated on admin-only SECURITY DEFINER functions.
-- Service role retains access (it bypasses these GRANTs).

DO $$
DECLARE
  fn text;
  admin_fns text[] := ARRAY[
    'public.create_magic_link_for_vip(uuid, integer, jsonb)',
    'public.get_or_create_patient_for_user(uuid)',
    'public.populate_repair_map()',
    'public.populate_bucket_repair_map(text)',
    'public.get_bucket_repair_status(text)',
    'public.admin_overview_stats()',
    'public.get_table_policies(text[])',
    'public.log_track_title_change()',
    'public.fix_invalid_uuids()',
    'public.fix_track_id_inconsistencies()',
    'public.mark_track_as_missing(uuid, text)',
    'public.mark_likely_missing_tracks()',
    'public.analyze_storage_columns()',
    'public.analyze_session_coverage()',
    'public.sync_hiit_storage()',
    'public.seed_sambajazznocturnes_tracks()',
    'public.clear_relaxing_sambas_artwork_conflicts()',
    'public.cleanup_expired_playlists()',
    'public.verify_all_tracks()',
    'public.increment_api_key_requests(uuid)',
    'public.update_track_bucket(uuid, text)',
    'public.prune_chat_rate_limits()',
    'public.record_email_send(text, text, text)',
    'public.check_email_rate_limit(text, text, integer, integer, integer)',
    'public.calculate_genre_success_score(uuid, text, integer, integer, integer, numeric, numeric)',
    'public.calculate_hit_score(integer, numeric, numeric, numeric)',
    'public.generate_magic_link_token()',
    'public.validate_magic_link(text)',
    'public.find_broken_tracks()',
    'public.find_cross_bucket_candidates()',
    'public.suggest_commercial_titles(text, text)'
  ];
BEGIN
  FOREACH fn IN ARRAY admin_fns LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Skipped missing function: %', fn;
    END;
  END LOOP;
END $$;
