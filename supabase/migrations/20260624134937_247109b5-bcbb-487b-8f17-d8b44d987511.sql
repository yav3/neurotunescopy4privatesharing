
-- Revoke EXECUTE from PUBLIC and authenticated on internal SECURITY DEFINER helpers
-- that are only used inside RLS policies, triggers, or by edge functions (service_role).
-- App-callable RPCs keep their authenticated grant.

DO $$
DECLARE
  fn_keep text[] := ARRAY[
    'has_role',
    'get_user_role',
    'get_working_edge_tracks',
    'add_to_working_collection',
    'update_session_activity',
    'update_working_edge_play_stats',
    'is_blocked_company_email',
    'validate_user_name',
    'add_favorite','add_favorite_by_file','add_to_favorites','add_user_favorite_unified',
    'remove_favorite','remove_favorite_by_file','remove_from_favorites','remove_user_favorite_unified',
    'is_favorite','is_favorited','is_favorited_by_file','is_track_favorited_unified',
    'get_user_favorites','save_playback_state','resolve_track_info_unified',
    'mark_messages_as_read','update_user_genre_preference','get_user_genre_recommendations',
    'get_genre_appropriate_recommendations','get_user_music_role','has_music_role',
    'get_playlist_tracks_enhanced','get_curated_tracks_safe','get_album_cover_url',
    'get_all_animated_artworks','get_random_animated_artwork','get_all_display_groups',
    'get_genres_by_display_group','get_genres_by_therapeutic_category','get_hit_potential_tracks',
    'get_track_stats','is_valid_uuid','increment_play_count'
  ];
  r record;
  sig text;
BEGIN
  FOR r IN
    SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.prosecdef = true AND n.nspname = 'public'
  LOOP
    sig := format('public.%I(%s)', r.proname, r.args);
    -- Always revoke from PUBLIC (default grant)
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC', sig);
    IF NOT (r.proname = ANY(fn_keep)) THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM authenticated', sig);
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', sig);
    END IF;
  END LOOP;
END $$;
