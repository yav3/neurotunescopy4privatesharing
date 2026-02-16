export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      albumart_rename_map: {
        Row: {
          genre: string | null
          new_name: string | null
          old_name: string
          processed: boolean | null
          therapeutic_modality: string | null
        }
        Insert: {
          genre?: string | null
          new_name?: string | null
          old_name: string
          processed?: boolean | null
          therapeutic_modality?: string | null
        }
        Update: {
          genre?: string | null
          new_name?: string | null
          old_name?: string
          processed?: boolean | null
          therapeutic_modality?: string | null
        }
        Relationships: []
      }
      animated_artworks: {
        Row: {
          artwork_semantic_label: string
          artwork_type: string
          artwork_url: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          artwork_semantic_label: string
          artwork_type: string
          artwork_url: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          artwork_semantic_label?: string
          artwork_type?: string
          artwork_url?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      biomarker_discoveries: {
        Row: {
          authors: string[] | null
          biomarker_name: string
          condition: string
          created_at: string | null
          data_source: string | null
          doi: string | null
          effect_size: number | null
          id: string
          ingestion_job_id: string | null
          journal: string | null
          p_value: number | null
          publication_date: string | null
          pubmed_id: string | null
          raw_data: Json | null
          sample_size: number | null
          sensitivity: number | null
          specificity: number | null
          statistical_methods: string[] | null
          title: string
          validation_status: string | null
        }
        Insert: {
          authors?: string[] | null
          biomarker_name: string
          condition: string
          created_at?: string | null
          data_source?: string | null
          doi?: string | null
          effect_size?: number | null
          id?: string
          ingestion_job_id?: string | null
          journal?: string | null
          p_value?: number | null
          publication_date?: string | null
          pubmed_id?: string | null
          raw_data?: Json | null
          sample_size?: number | null
          sensitivity?: number | null
          specificity?: number | null
          statistical_methods?: string[] | null
          title: string
          validation_status?: string | null
        }
        Update: {
          authors?: string[] | null
          biomarker_name?: string
          condition?: string
          created_at?: string | null
          data_source?: string | null
          doi?: string | null
          effect_size?: number | null
          id?: string
          ingestion_job_id?: string | null
          journal?: string | null
          p_value?: number | null
          publication_date?: string | null
          pubmed_id?: string | null
          raw_data?: Json | null
          sample_size?: number | null
          sensitivity?: number | null
          specificity?: number | null
          statistical_methods?: string[] | null
          title?: string
          validation_status?: string | null
        }
        Relationships: []
      }
      biomarker_values: {
        Row: {
          biomarker_name: string
          biomarker_type: string
          brain_region: string | null
          confidence_interval: number | null
          created_at: string | null
          frequency_band: string | null
          id: string
          processing_algorithm: string | null
          recording_id: string | null
          statistical_significance: number | null
          value: number | null
        }
        Insert: {
          biomarker_name: string
          biomarker_type: string
          brain_region?: string | null
          confidence_interval?: number | null
          created_at?: string | null
          frequency_band?: string | null
          id?: string
          processing_algorithm?: string | null
          recording_id?: string | null
          statistical_significance?: number | null
          value?: number | null
        }
        Update: {
          biomarker_name?: string
          biomarker_type?: string
          brain_region?: string | null
          confidence_interval?: number | null
          created_at?: string | null
          frequency_band?: string | null
          id?: string
          processing_algorithm?: string | null
          recording_id?: string | null
          statistical_significance?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "biomarker_values_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "eeg_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_companies: {
        Row: {
          company_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      blocked_countries: {
        Row: {
          country_code: string
          country_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      blocked_names: {
        Row: {
          created_at: string | null
          id: string
          last_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_name?: string
        }
        Relationships: []
      }
      blocked_tracks: {
        Row: {
          blocked_at: string
          id: string
          track_id: number
          user_id: string
        }
        Insert: {
          blocked_at?: string
          id?: string
          track_id: number
          user_id: string
        }
        Update: {
          blocked_at?: string
          id?: string
          track_id?: number
          user_id?: string
        }
        Relationships: []
      }
      cognitive_biomarkers: {
        Row: {
          baseline_value: number | null
          biomarker_type: string
          change_percentage: number | null
          created_at: string
          id: string
          measurement_date: string
          measurement_value: number
          patient_id: string | null
          raw_data: Json | null
          significance_level: number | null
          trend_direction: string | null
        }
        Insert: {
          baseline_value?: number | null
          biomarker_type: string
          change_percentage?: number | null
          created_at?: string
          id?: string
          measurement_date?: string
          measurement_value: number
          patient_id?: string | null
          raw_data?: Json | null
          significance_level?: number | null
          trend_direction?: string | null
        }
        Update: {
          baseline_value?: number | null
          biomarker_type?: string
          change_percentage?: number | null
          created_at?: string
          id?: string
          measurement_date?: string
          measurement_value?: number
          patient_id?: string | null
          raw_data?: Json | null
          significance_level?: number | null
          trend_direction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cognitive_biomarkers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      curated_tracks: {
        Row: {
          added_at: string
          curated_storage_key: string
          id: string
          metadata: Json | null
          original_filename: string | null
          original_track_id: string
          quality_score: number | null
          verification_status: string
        }
        Insert: {
          added_at?: string
          curated_storage_key: string
          id?: string
          metadata?: Json | null
          original_filename?: string | null
          original_track_id: string
          quality_score?: number | null
          verification_status?: string
        }
        Update: {
          added_at?: string
          curated_storage_key?: string
          id?: string
          metadata?: Json | null
          original_filename?: string | null
          original_track_id?: string
          quality_score?: number | null
          verification_status?: string
        }
        Relationships: []
      }
      data_sync_jobs: {
        Row: {
          created_at: string | null
          data_source: string
          end_time: string | null
          error_log: Json | null
          id: string
          job_type: string
          next_sync_time: string | null
          records_failed: number | null
          records_processed: number | null
          start_time: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          data_source: string
          end_time?: string | null
          error_log?: Json | null
          id?: string
          job_type: string
          next_sync_time?: string | null
          records_failed?: number | null
          records_processed?: number | null
          start_time?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          data_source?: string
          end_time?: string | null
          error_log?: Json | null
          id?: string
          job_type?: string
          next_sync_time?: string | null
          records_failed?: number | null
          records_processed?: number | null
          start_time?: string | null
          status?: string
        }
        Relationships: []
      }
      dataset_worker_jobs: {
        Row: {
          args: Json | null
          completed_at: string | null
          created_at: string | null
          dataset_id: string
          error_message: string | null
          id: string
          job_type: string
          priority: number | null
          results: Json | null
          started_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          args?: Json | null
          completed_at?: string | null
          created_at?: string | null
          dataset_id: string
          error_message?: string | null
          id?: string
          job_type?: string
          priority?: number | null
          results?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          args?: Json | null
          completed_at?: string | null
          created_at?: string | null
          dataset_id?: string
          error_message?: string | null
          id?: string
          job_type?: string
          priority?: number | null
          results?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dementia_risk_assessments: {
        Row: {
          assessment_date: string
          confidence_score: number | null
          created_at: string
          id: string
          key_indicators: string[] | null
          next_assessment_date: string | null
          overall_risk_score: number
          patient_id: string | null
          recommendation: string | null
          risk_category: string
          subtype_probabilities: Json | null
        }
        Insert: {
          assessment_date?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          key_indicators?: string[] | null
          next_assessment_date?: string | null
          overall_risk_score: number
          patient_id?: string | null
          recommendation?: string | null
          risk_category: string
          subtype_probabilities?: Json | null
        }
        Update: {
          assessment_date?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          key_indicators?: string[] | null
          next_assessment_date?: string | null
          overall_risk_score?: number
          patient_id?: string | null
          recommendation?: string | null
          risk_category?: string
          subtype_probabilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "dementia_risk_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      eeg_recordings: {
        Row: {
          artifacts_detected: string[] | null
          created_at: string | null
          duration_minutes: number | null
          electrode_count: number | null
          electrode_positions: string[] | null
          id: string
          patient_id: string | null
          processed_data_path: string | null
          quality_metrics: Json | null
          raw_data_path: string | null
          recording_conditions: Json | null
          sampling_rate: number | null
          session_date: string | null
        }
        Insert: {
          artifacts_detected?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          electrode_count?: number | null
          electrode_positions?: string[] | null
          id?: string
          patient_id?: string | null
          processed_data_path?: string | null
          quality_metrics?: Json | null
          raw_data_path?: string | null
          recording_conditions?: Json | null
          sampling_rate?: number | null
          session_date?: string | null
        }
        Update: {
          artifacts_detected?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          electrode_count?: number | null
          electrode_positions?: string[] | null
          id?: string
          patient_id?: string | null
          processed_data_path?: string | null
          quality_metrics?: Json | null
          raw_data_path?: string | null
          recording_conditions?: Json | null
          sampling_rate?: number | null
          session_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eeg_recordings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      eeg_studies: {
        Row: {
          created_at: string | null
          data_source: string
          description: string | null
          end_date: string | null
          id: string
          institution: string | null
          participant_count: number | null
          principal_investigator: string | null
          start_date: string | null
          study_id: string
          study_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_source: string
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          participant_count?: number | null
          principal_investigator?: string | null
          start_date?: string | null
          study_id: string
          study_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_source?: string
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          participant_count?: number | null
          principal_investigator?: string | null
          start_date?: string | null
          study_id?: string
          study_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          id: string
          order_index: number | null
          question: string
          status: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          question: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          question?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          track_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: number
          user_id?: string
        }
        Relationships: []
      }
      financial_metrics: {
        Row: {
          commodity_index: number | null
          construction_spending: number | null
          created_at: string
          currency_exchange_rate: number | null
          gdp_growth: number | null
          housing_starts: number | null
          id: string
          inflation_rate: number | null
          interest_rate: number | null
          metric_date: string
          stock_market_index: number | null
          unemployment_rate: number | null
        }
        Insert: {
          commodity_index?: number | null
          construction_spending?: number | null
          created_at?: string
          currency_exchange_rate?: number | null
          gdp_growth?: number | null
          housing_starts?: number | null
          id?: string
          inflation_rate?: number | null
          interest_rate?: number | null
          metric_date: string
          stock_market_index?: number | null
          unemployment_rate?: number | null
        }
        Update: {
          commodity_index?: number | null
          construction_spending?: number | null
          created_at?: string
          currency_exchange_rate?: number | null
          gdp_growth?: number | null
          housing_starts?: number | null
          id?: string
          inflation_rate?: number | null
          interest_rate?: number | null
          metric_date?: string
          stock_market_index?: number | null
          unemployment_rate?: number | null
        }
        Relationships: []
      }
      generation_outcomes: {
        Row: {
          audio_features: Json | null
          created_at: string | null
          enhanced_prompt: string
          generated_track_url: string | null
          id: string
          original_prompt: string
          prompt_pattern_id: string | null
          user_rating: number | null
        }
        Insert: {
          audio_features?: Json | null
          created_at?: string | null
          enhanced_prompt: string
          generated_track_url?: string | null
          id?: string
          original_prompt: string
          prompt_pattern_id?: string | null
          user_rating?: number | null
        }
        Update: {
          audio_features?: Json | null
          created_at?: string | null
          enhanced_prompt?: string
          generated_track_url?: string | null
          id?: string
          original_prompt?: string
          prompt_pattern_id?: string | null
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_outcomes_prompt_pattern_id_fkey"
            columns: ["prompt_pattern_id"]
            isOneToOne: false
            referencedRelation: "prompt_patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      genre_classifications: {
        Row: {
          benefits: string[]
          bucket_name: string
          color_hex: string | null
          created_at: string | null
          description: string
          display_name: string
          id: string
          intensity: Database["public"]["Enums"]["music_intensity"]
          recommended_duration_minutes: number | null
          therapeutic_category: Database["public"]["Enums"]["therapeutic_category"]
        }
        Insert: {
          benefits?: string[]
          bucket_name: string
          color_hex?: string | null
          created_at?: string | null
          description: string
          display_name: string
          id?: string
          intensity: Database["public"]["Enums"]["music_intensity"]
          recommended_duration_minutes?: number | null
          therapeutic_category: Database["public"]["Enums"]["therapeutic_category"]
        }
        Update: {
          benefits?: string[]
          bucket_name?: string
          color_hex?: string | null
          created_at?: string | null
          description?: string
          display_name?: string
          id?: string
          intensity?: Database["public"]["Enums"]["music_intensity"]
          recommended_duration_minutes?: number | null
          therapeutic_category?: Database["public"]["Enums"]["therapeutic_category"]
        }
        Relationships: []
      }
      genre_market_trends: {
        Row: {
          audio_feature_trends: Json | null
          award_season_factor: number | null
          created_at: string
          critical_reception_trends: Json | null
          crossover_potential: Json | null
          emerging_subgenres: Json | null
          genre: string
          id: string
          instrumentation_trends: Json | null
          production_trends: Json | null
          successful_track_characteristics: Json | null
          trend_date: string
          trend_window_days: number
        }
        Insert: {
          audio_feature_trends?: Json | null
          award_season_factor?: number | null
          created_at?: string
          critical_reception_trends?: Json | null
          crossover_potential?: Json | null
          emerging_subgenres?: Json | null
          genre: string
          id?: string
          instrumentation_trends?: Json | null
          production_trends?: Json | null
          successful_track_characteristics?: Json | null
          trend_date: string
          trend_window_days?: number
        }
        Update: {
          audio_feature_trends?: Json | null
          award_season_factor?: number | null
          created_at?: string
          critical_reception_trends?: Json | null
          crossover_potential?: Json | null
          emerging_subgenres?: Json | null
          genre?: string
          id?: string
          instrumentation_trends?: Json | null
          production_trends?: Json | null
          successful_track_characteristics?: Json | null
          trend_date?: string
          trend_window_days?: number
        }
        Relationships: []
      }
      genre_metadata: {
        Row: {
          art_file: string | null
          benefit: string | null
          bucket: string
          category: string
          color_hex: string | null
          created_at: string | null
          description: string | null
          display_group: string | null
          id: string
          intensity: string | null
          recommended_duration: number | null
          therapeutic_category: string | null
          updated_at: string | null
        }
        Insert: {
          art_file?: string | null
          benefit?: string | null
          bucket: string
          category: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          display_group?: string | null
          id?: string
          intensity?: string | null
          recommended_duration?: number | null
          therapeutic_category?: string | null
          updated_at?: string | null
        }
        Update: {
          art_file?: string | null
          benefit?: string | null
          bucket?: string
          category?: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          display_group?: string | null
          id?: string
          intensity?: string | null
          recommended_duration?: number | null
          therapeutic_category?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      genre_prediction_models: {
        Row: {
          created_at: string
          genre: string
          genre_specific_features: Json | null
          id: string
          is_active: boolean
          model_name: string
          model_params: Json | null
          model_type: string
          model_version: string
          performance_metrics: Json | null
          success_criteria: Json
          training_data_sources: Json
        }
        Insert: {
          created_at?: string
          genre: string
          genre_specific_features?: Json | null
          id?: string
          is_active?: boolean
          model_name: string
          model_params?: Json | null
          model_type: string
          model_version: string
          performance_metrics?: Json | null
          success_criteria: Json
          training_data_sources: Json
        }
        Update: {
          created_at?: string
          genre?: string
          genre_specific_features?: Json | null
          id?: string
          is_active?: boolean
          model_name?: string
          model_params?: Json | null
          model_type?: string
          model_version?: string
          performance_metrics?: Json | null
          success_criteria?: Json
          training_data_sources?: Json
        }
        Relationships: []
      }
      genre_success_metrics: {
        Row: {
          created_at: string
          genre: string
          id: string
          metric_name: string
          success_metric_type: string
          threshold_value: number | null
          weight_factor: number
        }
        Insert: {
          created_at?: string
          genre: string
          id?: string
          metric_name: string
          success_metric_type: string
          threshold_value?: number | null
          weight_factor?: number
        }
        Update: {
          created_at?: string
          genre?: string
          id?: string
          metric_name?: string
          success_metric_type?: string
          threshold_value?: number | null
          weight_factor?: number
        }
        Relationships: []
      }
      hit_prediction_models: {
        Row: {
          created_at: string
          features_used: Json
          id: string
          is_active: boolean
          model_binary: string | null
          model_name: string
          model_params: Json | null
          model_type: string
          model_version: string
          performance_metrics: Json | null
          training_data_end: string
          training_data_start: string
        }
        Insert: {
          created_at?: string
          features_used: Json
          id?: string
          is_active?: boolean
          model_binary?: string | null
          model_name: string
          model_params?: Json | null
          model_type: string
          model_version: string
          performance_metrics?: Json | null
          training_data_end: string
          training_data_start: string
        }
        Update: {
          created_at?: string
          features_used?: Json
          id?: string
          is_active?: boolean
          model_binary?: string | null
          model_name?: string
          model_params?: Json | null
          model_type?: string
          model_version?: string
          performance_metrics?: Json | null
          training_data_end?: string
          training_data_start?: string
        }
        Relationships: []
      }
      ip_whitelist: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
        }
        Relationships: []
      }
      listening_sessions: {
        Row: {
          average_complexity_score: number | null
          created_at: string
          dominant_genres: string[] | null
          id: string
          mood_progression: Json | null
          patient_id: string | null
          session_date: string
          session_duration_minutes: number | null
          skip_rate: number | null
          tracks_played: number | null
          user_id: string | null
        }
        Insert: {
          average_complexity_score?: number | null
          created_at?: string
          dominant_genres?: string[] | null
          id?: string
          mood_progression?: Json | null
          patient_id?: string | null
          session_date?: string
          session_duration_minutes?: number | null
          skip_rate?: number | null
          tracks_played?: number | null
          user_id?: string | null
        }
        Update: {
          average_complexity_score?: number | null
          created_at?: string
          dominant_genres?: string[] | null
          id?: string
          mood_progression?: Json | null
          patient_id?: string | null
          session_date?: string
          session_duration_minutes?: number | null
          skip_rate?: number | null
          tracks_played?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listening_sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_links: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          metadata: Json | null
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          metadata?: Json | null
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          metadata?: Json | null
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medical_ingestion_jobs: {
        Row: {
          created_at: string
          end_time: string | null
          error_message: string | null
          id: string
          records_processed: number
          sources: string[]
          sources_completed: number
          start_time: string
          status: string
          total_sources: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number
          sources?: string[]
          sources_completed?: number
          start_time?: string
          status?: string
          total_sources?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number
          sources?: string[]
          sources_completed?: number
          start_time?: string
          status?: string
          total_sources?: number
          updated_at?: string
        }
        Relationships: []
      }
      music_therapy_sessions: {
        Row: {
          created_at: string | null
          id: string
          music_tracks: Json | null
          outcomes: Json | null
          patient_id: string | null
          physiological_measures: Json | null
          post_session_mood: Json | null
          pre_session_mood: Json | null
          session_date: string | null
          session_duration_minutes: number | null
          therapist_id: string | null
          therapy_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          music_tracks?: Json | null
          outcomes?: Json | null
          patient_id?: string | null
          physiological_measures?: Json | null
          post_session_mood?: Json | null
          pre_session_mood?: Json | null
          session_date?: string | null
          session_duration_minutes?: number | null
          therapist_id?: string | null
          therapy_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          music_tracks?: Json | null
          outcomes?: Json | null
          patient_id?: string | null
          physiological_measures?: Json | null
          post_session_mood?: Json | null
          pre_session_mood?: Json | null
          session_date?: string | null
          session_duration_minutes?: number | null
          therapist_id?: string | null
          therapy_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_therapy_sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      music_tracks: {
        Row: {
          album: string | null
          artist: string | null
          artwork_semantic_label: string | null
          artwork_url: string | null
          bucket_name: string
          created_at: string | null
          duration: number | null
          duration_display: string | null
          duration_seconds: number | null
          file_path: string
          genre: Database["public"]["Enums"]["music_genre"] | null
          has_spatial_audio: boolean | null
          id: string
          is_new: boolean | null
          playlist_id: string | null
          spatial_audio_profiles:
            | Database["public"]["Enums"]["spatial_audio_profile"][]
            | null
          storage_bucket: string | null
          storage_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          album?: string | null
          artist?: string | null
          artwork_semantic_label?: string | null
          artwork_url?: string | null
          bucket_name: string
          created_at?: string | null
          duration?: number | null
          duration_display?: string | null
          duration_seconds?: number | null
          file_path: string
          genre?: Database["public"]["Enums"]["music_genre"] | null
          has_spatial_audio?: boolean | null
          id?: string
          is_new?: boolean | null
          playlist_id?: string | null
          spatial_audio_profiles?:
            | Database["public"]["Enums"]["spatial_audio_profile"][]
            | null
          storage_bucket?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          album?: string | null
          artist?: string | null
          artwork_semantic_label?: string | null
          artwork_url?: string | null
          bucket_name?: string
          created_at?: string | null
          duration?: number | null
          duration_display?: string | null
          duration_seconds?: number | null
          file_path?: string
          genre?: Database["public"]["Enums"]["music_genre"] | null
          has_spatial_audio?: boolean | null
          id?: string
          is_new?: boolean | null
          playlist_id?: string | null
          spatial_audio_profiles?:
            | Database["public"]["Enums"]["spatial_audio_profile"][]
            | null
          storage_bucket?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      optimization_scenarios: {
        Row: {
          build_acquire_schedule: Json | null
          capex_schedule: Json | null
          confidence_level: number | null
          constraint_set: Json | null
          created_at: string
          ebitda_per_mbf: number | null
          hedge_strategy: Json | null
          id: string
          objective_function: string
          optimal_site_selection: Json | null
          payback_period_years: number | null
          product_slate: Json | null
          risk_score: number | null
          scenario_date: string
          scenario_name: string
          target_capacity_bbft: number | null
          target_market_rank: number | null
          time_horizon_years: number | null
          total_ebitda_millions: number | null
          total_npv_millions: number | null
        }
        Insert: {
          build_acquire_schedule?: Json | null
          capex_schedule?: Json | null
          confidence_level?: number | null
          constraint_set?: Json | null
          created_at?: string
          ebitda_per_mbf?: number | null
          hedge_strategy?: Json | null
          id?: string
          objective_function: string
          optimal_site_selection?: Json | null
          payback_period_years?: number | null
          product_slate?: Json | null
          risk_score?: number | null
          scenario_date: string
          scenario_name: string
          target_capacity_bbft?: number | null
          target_market_rank?: number | null
          time_horizon_years?: number | null
          total_ebitda_millions?: number | null
          total_npv_millions?: number | null
        }
        Update: {
          build_acquire_schedule?: Json | null
          capex_schedule?: Json | null
          confidence_level?: number | null
          constraint_set?: Json | null
          created_at?: string
          ebitda_per_mbf?: number | null
          hedge_strategy?: Json | null
          id?: string
          objective_function?: string
          optimal_site_selection?: Json | null
          payback_period_years?: number | null
          product_slate?: Json | null
          risk_score?: number | null
          scenario_date?: string
          scenario_name?: string
          target_capacity_bbft?: number | null
          target_market_rank?: number | null
          time_horizon_years?: number | null
          total_ebitda_millions?: number | null
          total_npv_millions?: number | null
        }
        Relationships: []
      }
      patient_access_audit_log: {
        Row: {
          access_granted: boolean
          access_type: string
          accessed_at: string | null
          accessed_by: string
          id: string
          ip_address: string | null
          patient_id: string
          table_accessed: string
          user_agent: string | null
        }
        Insert: {
          access_granted?: boolean
          access_type: string
          accessed_at?: string | null
          accessed_by: string
          id?: string
          ip_address?: string | null
          patient_id: string
          table_accessed: string
          user_agent?: string | null
        }
        Update: {
          access_granted?: boolean
          access_type?: string
          accessed_at?: string | null
          accessed_by?: string
          id?: string
          ip_address?: string | null
          patient_id?: string
          table_accessed?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      patient_assignments: {
        Row: {
          assigned_at: string | null
          assigned_user_id: string
          assignment_type: string
          id: string
          patient_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_user_id: string
          assignment_type?: string
          id?: string
          patient_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_user_id?: string
          assignment_type?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          biomarkers: Json | null
          cognitive_scores: Json | null
          comorbidities: string[] | null
          consent_status: string | null
          created_at: string | null
          data_quality_score: number | null
          diagnosis: string[] | null
          external_patient_id: string
          gender: string | null
          genetic_data: Json | null
          id: string
          medications: string[] | null
          study_id: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          biomarkers?: Json | null
          cognitive_scores?: Json | null
          comorbidities?: string[] | null
          consent_status?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          diagnosis?: string[] | null
          external_patient_id: string
          gender?: string | null
          genetic_data?: Json | null
          id?: string
          medications?: string[] | null
          study_id?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          biomarkers?: Json | null
          cognitive_scores?: Json | null
          comorbidities?: string[] | null
          consent_status?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          diagnosis?: string[] | null
          external_patient_id?: string
          gender?: string | null
          genetic_data?: Json | null
          id?: string
          medications?: string[] | null
          study_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "eeg_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_changes: {
        Row: {
          alert_threshold_crossed: boolean | null
          change_magnitude: number | null
          change_velocity: number | null
          created_at: string
          current_value: number | null
          id: string
          measurement_date: string
          patient_id: string | null
          pattern_type: string
          previous_value: number | null
          statistical_significance: number | null
        }
        Insert: {
          alert_threshold_crossed?: boolean | null
          change_magnitude?: number | null
          change_velocity?: number | null
          created_at?: string
          current_value?: number | null
          id?: string
          measurement_date?: string
          patient_id?: string | null
          pattern_type: string
          previous_value?: number | null
          statistical_significance?: number | null
        }
        Update: {
          alert_threshold_crossed?: boolean | null
          change_magnitude?: number | null
          change_velocity?: number | null
          created_at?: string
          current_value?: number | null
          id?: string
          measurement_date?: string
          patient_id?: string | null
          pattern_type?: string
          previous_value?: number | null
          statistical_significance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_changes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      pinned_goals: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_tracks: {
        Row: {
          created_at: string | null
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          playlist_id: string
          position: number
          track_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          artwork_semantic_label: string | null
          artwork_url: string | null
          bucket_name: string
          category: Database["public"]["Enums"]["playlist_category"]
          created_at: string | null
          description: string | null
          id: string
          is_pre_configured: boolean | null
          research_info: Json | null
          therapeutic_benefits: string[] | null
          therapeutic_tags: string[] | null
          title: string
          total_duration_minutes: number | null
          track_count: number | null
          updated_at: string | null
          usage_recommendations: string[] | null
        }
        Insert: {
          artwork_semantic_label?: string | null
          artwork_url?: string | null
          bucket_name: string
          category: Database["public"]["Enums"]["playlist_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_pre_configured?: boolean | null
          research_info?: Json | null
          therapeutic_benefits?: string[] | null
          therapeutic_tags?: string[] | null
          title: string
          total_duration_minutes?: number | null
          track_count?: number | null
          updated_at?: string | null
          usage_recommendations?: string[] | null
        }
        Update: {
          artwork_semantic_label?: string | null
          artwork_url?: string | null
          bucket_name?: string
          category?: Database["public"]["Enums"]["playlist_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_pre_configured?: boolean | null
          research_info?: Json | null
          therapeutic_benefits?: string[] | null
          therapeutic_tags?: string[] | null
          title?: string
          total_duration_minutes?: number | null
          track_count?: number | null
          updated_at?: string | null
          usage_recommendations?: string[] | null
        }
        Relationships: []
      }
      precomputed_playlists: {
        Row: {
          avg_compatibility_score: number | null
          camelot_data: Json | null
          created_at: string
          direction: string
          duration: number
          expires_at: string
          generated_at: string
          goal: string
          id: string
          intensity: number
          playlist_id: string
          track_count: number
          tracks: Json
          vad_profile: Json
        }
        Insert: {
          avg_compatibility_score?: number | null
          camelot_data?: Json | null
          created_at?: string
          direction: string
          duration: number
          expires_at?: string
          generated_at?: string
          goal: string
          id?: string
          intensity: number
          playlist_id: string
          track_count?: number
          tracks: Json
          vad_profile: Json
        }
        Update: {
          avg_compatibility_score?: number | null
          camelot_data?: Json | null
          created_at?: string
          direction?: string
          duration?: number
          expires_at?: string
          generated_at?: string
          goal?: string
          id?: string
          intensity?: number
          playlist_id?: string
          track_count?: number
          tracks?: Json
          vad_profile?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          default_session_duration: number | null
          display_name: string | null
          favorite_goals: string[] | null
          id: string
          notification_preferences: Json | null
          therapeutic_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          default_session_duration?: number | null
          display_name?: string | null
          favorite_goals?: string[] | null
          id?: string
          notification_preferences?: Json | null
          therapeutic_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          default_session_duration?: number | null
          display_name?: string | null
          favorite_goals?: string[] | null
          id?: string
          notification_preferences?: Json | null
          therapeutic_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_patterns: {
        Row: {
          avg_quality_score: number | null
          base_prompt: string
          created_at: string | null
          enhanced_prompt: string
          genre: string | null
          id: string
          mood: string | null
          pattern_references: string[] | null
          success_rate: number | null
          updated_at: string | null
          usage_count: number | null
          vad_references: string[] | null
        }
        Insert: {
          avg_quality_score?: number | null
          base_prompt: string
          created_at?: string | null
          enhanced_prompt: string
          genre?: string | null
          id?: string
          mood?: string | null
          pattern_references?: string[] | null
          success_rate?: number | null
          updated_at?: string | null
          usage_count?: number | null
          vad_references?: string[] | null
        }
        Update: {
          avg_quality_score?: number | null
          base_prompt?: string
          created_at?: string | null
          enhanced_prompt?: string
          genre?: string | null
          id?: string
          mood?: string | null
          pattern_references?: string[] | null
          success_rate?: number | null
          updated_at?: string | null
          usage_count?: number | null
          vad_references?: string[] | null
        }
        Relationships: []
      }
      quick_actions: {
        Row: {
          category: Database["public"]["Enums"]["support_ticket_category"]
          created_at: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean | null
          label: string
        }
        Insert: {
          category: Database["public"]["Enums"]["support_ticket_category"]
          created_at?: string | null
          display_order: number
          icon: string
          id?: string
          is_active?: boolean | null
          label: string
        }
        Update: {
          category?: Database["public"]["Enums"]["support_ticket_category"]
          created_at?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
        }
        Relationships: []
      }
      repair_map: {
        Row: {
          created_at: string | null
          id: string
          new_key: string
          old_key: string
          status: string | null
          storage_bucket: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          new_key: string
          old_key: string
          status?: string | null
          storage_bucket: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_key?: string
          old_key?: string
          status?: string | null
          storage_bucket?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sambajazznocturnes_tracks: {
        Row: {
          album: string | null
          artist: string | null
          bpm: number | null
          created_at: string | null
          display_order: number | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          mood_tags: string[] | null
          play_count: number | null
          storage_path: string
          therapeutic_category: string[] | null
          title: string
          track_number: number | null
          updated_at: string | null
        }
        Insert: {
          album?: string | null
          artist?: string | null
          bpm?: number | null
          created_at?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          mood_tags?: string[] | null
          play_count?: number | null
          storage_path: string
          therapeutic_category?: string[] | null
          title: string
          track_number?: number | null
          updated_at?: string | null
        }
        Update: {
          album?: string | null
          artist?: string | null
          bpm?: number | null
          created_at?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          mood_tags?: string[] | null
          play_count?: number | null
          storage_path?: string
          therapeutic_category?: string[] | null
          title?: string
          track_number?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          asn: string | null
          attack_pattern: string | null
          attempted_route: string
          blocked: boolean
          browser_language: string | null
          browser_name: string | null
          browser_version: string | null
          city: string | null
          connection_type: string | null
          country: string | null
          country_code: string | null
          created_at: string
          datacenter_detected: boolean | null
          device_fingerprint: string | null
          follow_up_required: boolean | null
          headers: Json | null
          id: string
          incident_type: string
          investigated_at: string | null
          investigated_by: string | null
          ip_address: unknown
          isp: string | null
          latitude: number | null
          longitude: number | null
          mitigation_action: string | null
          notes: string | null
          organization: string | null
          payload_size: number | null
          platform: string | null
          proxy_detected: boolean | null
          referer: string | null
          region: string | null
          request_body: string | null
          response_code: number | null
          risk_score: number | null
          screen_resolution: string | null
          session_id: string | null
          severity: string
          threat_level: string | null
          timestamp: string
          timezone: string | null
          tor_detected: boolean | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
          vpn_detected: boolean | null
        }
        Insert: {
          asn?: string | null
          attack_pattern?: string | null
          attempted_route: string
          blocked?: boolean
          browser_language?: string | null
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          connection_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          datacenter_detected?: boolean | null
          device_fingerprint?: string | null
          follow_up_required?: boolean | null
          headers?: Json | null
          id?: string
          incident_type?: string
          investigated_at?: string | null
          investigated_by?: string | null
          ip_address?: unknown
          isp?: string | null
          latitude?: number | null
          longitude?: number | null
          mitigation_action?: string | null
          notes?: string | null
          organization?: string | null
          payload_size?: number | null
          platform?: string | null
          proxy_detected?: boolean | null
          referer?: string | null
          region?: string | null
          request_body?: string | null
          response_code?: number | null
          risk_score?: number | null
          screen_resolution?: string | null
          session_id?: string | null
          severity: string
          threat_level?: string | null
          timestamp?: string
          timezone?: string | null
          tor_detected?: boolean | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          vpn_detected?: boolean | null
        }
        Update: {
          asn?: string | null
          attack_pattern?: string | null
          attempted_route?: string
          blocked?: boolean
          browser_language?: string | null
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          connection_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          datacenter_detected?: boolean | null
          device_fingerprint?: string | null
          follow_up_required?: boolean | null
          headers?: Json | null
          id?: string
          incident_type?: string
          investigated_at?: string | null
          investigated_by?: string | null
          ip_address?: unknown
          isp?: string | null
          latitude?: number | null
          longitude?: number | null
          mitigation_action?: string | null
          notes?: string | null
          organization?: string | null
          payload_size?: number | null
          platform?: string | null
          proxy_detected?: boolean | null
          referer?: string | null
          region?: string | null
          request_body?: string | null
          response_code?: number | null
          risk_score?: number | null
          screen_resolution?: string | null
          session_id?: string | null
          severity?: string
          threat_level?: string | null
          timestamp?: string
          timezone?: string | null
          tor_detected?: boolean | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          vpn_detected?: boolean | null
        }
        Relationships: []
      }
      spectral_analysis: {
        Row: {
          alpha_band_power: number | null
          beta_band_power: number | null
          chroma_vector: number[] | null
          created_at: string | null
          delta_band_power: number | null
          fundamental_frequency: number | null
          gamma_band_power: number | null
          harmonic_ratio: number | null
          id: string
          mel_spectrogram_stats: Json | null
          mfcc_coefficients: number[] | null
          spectral_bandwidth: number | null
          spectral_centroid: number | null
          spectral_flatness: number | null
          spectral_rolloff: number | null
          therapeutic_alpha_score: number | null
          therapeutic_beta_score: number | null
          therapeutic_delta_score: number | null
          therapeutic_gamma_score: number | null
          therapeutic_theta_score: number | null
          theta_band_power: number | null
          track_id: string
          updated_at: string | null
          zero_crossing_rate: number | null
        }
        Insert: {
          alpha_band_power?: number | null
          beta_band_power?: number | null
          chroma_vector?: number[] | null
          created_at?: string | null
          delta_band_power?: number | null
          fundamental_frequency?: number | null
          gamma_band_power?: number | null
          harmonic_ratio?: number | null
          id?: string
          mel_spectrogram_stats?: Json | null
          mfcc_coefficients?: number[] | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_flatness?: number | null
          spectral_rolloff?: number | null
          therapeutic_alpha_score?: number | null
          therapeutic_beta_score?: number | null
          therapeutic_delta_score?: number | null
          therapeutic_gamma_score?: number | null
          therapeutic_theta_score?: number | null
          theta_band_power?: number | null
          track_id: string
          updated_at?: string | null
          zero_crossing_rate?: number | null
        }
        Update: {
          alpha_band_power?: number | null
          beta_band_power?: number | null
          chroma_vector?: number[] | null
          created_at?: string | null
          delta_band_power?: number | null
          fundamental_frequency?: number | null
          gamma_band_power?: number | null
          harmonic_ratio?: number | null
          id?: string
          mel_spectrogram_stats?: Json | null
          mfcc_coefficients?: number[] | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_flatness?: number | null
          spectral_rolloff?: number | null
          therapeutic_alpha_score?: number | null
          therapeutic_beta_score?: number | null
          therapeutic_delta_score?: number | null
          therapeutic_gamma_score?: number | null
          therapeutic_theta_score?: number | null
          theta_band_power?: number | null
          track_id?: string
          updated_at?: string | null
          zero_crossing_rate?: number | null
        }
        Relationships: []
      }
      spotify_playlists: {
        Row: {
          country_code: string | null
          created_at: string
          description: string | null
          follower_count: number | null
          id: string
          is_chart: boolean
          last_synced_at: string | null
          playlist_name: string
          spotify_playlist_id: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          description?: string | null
          follower_count?: number | null
          id?: string
          is_chart?: boolean
          last_synced_at?: string | null
          playlist_name: string
          spotify_playlist_id: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          description?: string | null
          follower_count?: number | null
          id?: string
          is_chart?: boolean
          last_synced_at?: string | null
          playlist_name?: string
          spotify_playlist_id?: string
        }
        Relationships: []
      }
      staging_files: {
        Row: {
          bucket: string
          category: string | null
          id: string
          new_key: string | null
          original_key: string
        }
        Insert: {
          bucket: string
          category?: string | null
          id?: string
          new_key?: string | null
          original_key: string
        }
        Update: {
          bucket?: string
          category?: string | null
          id?: string
          new_key?: string | null
          original_key?: string
        }
        Relationships: []
      }
      staging_repair: {
        Row: {
          category: string | null
          file_id: string | null
          key_status: string
          original_key: string
          repair_id: string
          safe_new_key: string | null
          storage_bucket: string
        }
        Insert: {
          category?: string | null
          file_id?: string | null
          key_status: string
          original_key: string
          repair_id?: string
          safe_new_key?: string | null
          storage_bucket: string
        }
        Update: {
          category?: string | null
          file_id?: string | null
          key_status?: string
          original_key?: string
          repair_id?: string
          safe_new_key?: string | null
          storage_bucket?: string
        }
        Relationships: []
      }
      storage_name_backup: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string | null
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string | null
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string | null
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: []
      }
      streaming_analytics: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          quality_requested: string
          start_time: number | null
          streamed_at: string | null
          track_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quality_requested: string
          start_time?: number | null
          streamed_at?: string | null
          track_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quality_requested?: string
          start_time?: number | null
          streamed_at?: string | null
          track_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["support_ticket_category"]
          created_at: string | null
          description: string | null
          id: string
          priority:
            | Database["public"]["Enums"]["support_ticket_priority"]
            | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["support_ticket_status"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["support_ticket_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          priority?:
            | Database["public"]["Enums"]["support_ticket_priority"]
            | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["support_ticket_status"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["support_ticket_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          priority?:
            | Database["public"]["Enums"]["support_ticket_priority"]
            | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["support_ticket_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapeutic_applications: {
        Row: {
          anxiety_evidence_score: number | null
          condition_targets: string[] | null
          confidence_interval: string | null
          cortisol_reduction_potential: number | null
          created_at: string | null
          depression_evidence_score: number | null
          eeg_alignment_score: number | null
          effect_size: number | null
          focus_evidence_score: number | null
          frequency_band_primary: string | null
          frequency_band_secondary: string[] | null
          hrv_alignment_score: number | null
          id: string
          pain_evidence_score: number | null
          participant_count: number | null
          ptsd_evidence_score: number | null
          sleep_evidence_score: number | null
          supporting_studies: string[] | null
          track_id: string
          updated_at: string | null
        }
        Insert: {
          anxiety_evidence_score?: number | null
          condition_targets?: string[] | null
          confidence_interval?: string | null
          cortisol_reduction_potential?: number | null
          created_at?: string | null
          depression_evidence_score?: number | null
          eeg_alignment_score?: number | null
          effect_size?: number | null
          focus_evidence_score?: number | null
          frequency_band_primary?: string | null
          frequency_band_secondary?: string[] | null
          hrv_alignment_score?: number | null
          id?: string
          pain_evidence_score?: number | null
          participant_count?: number | null
          ptsd_evidence_score?: number | null
          sleep_evidence_score?: number | null
          supporting_studies?: string[] | null
          track_id: string
          updated_at?: string | null
        }
        Update: {
          anxiety_evidence_score?: number | null
          condition_targets?: string[] | null
          confidence_interval?: string | null
          cortisol_reduction_potential?: number | null
          created_at?: string | null
          depression_evidence_score?: number | null
          eeg_alignment_score?: number | null
          effect_size?: number | null
          focus_evidence_score?: number | null
          frequency_band_primary?: string | null
          frequency_band_secondary?: string[] | null
          hrv_alignment_score?: number | null
          id?: string
          pain_evidence_score?: number | null
          participant_count?: number | null
          ptsd_evidence_score?: number | null
          sleep_evidence_score?: number | null
          supporting_studies?: string[] | null
          track_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      therapeutic_sessions: {
        Row: {
          created_at: string | null
          duration_seconds: number
          frequency_band: string | null
          id: string
          session_timestamp: string | null
          track_id: string
        }
        Insert: {
          created_at?: string | null
          duration_seconds: number
          frequency_band?: string | null
          id?: string
          session_timestamp?: string | null
          track_id: string
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number
          frequency_band?: string | null
          id?: string
          session_timestamp?: string | null
          track_id?: string
        }
        Relationships: []
      }
      therapeutic_stratifications: {
        Row: {
          created_at: string
          description: string | null
          genre: string
          id: string
          recommended_intensity: number[] | null
          stratification_name: string
          target_bpm_range: string | null
          therapeutic_goal: string
          typical_tags: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          genre: string
          id?: string
          recommended_intensity?: number[] | null
          stratification_name: string
          target_bpm_range?: string | null
          therapeutic_goal: string
          typical_tags?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          genre?: string
          id?: string
          recommended_intensity?: number[] | null
          stratification_name?: string
          target_bpm_range?: string | null
          therapeutic_goal?: string
          typical_tags?: string[] | null
        }
        Relationships: []
      }
      therapeutic_track_categories: {
        Row: {
          bpm_range: string | null
          complexity_score: number | null
          confidence_score: number | null
          created_at: string
          energy_level: number | null
          id: string
          intensity_level: number | null
          mood_tags: string[] | null
          primary_genre: string | null
          primary_therapeutic_goal: string
          secondary_genre: string | null
          secondary_therapeutic_goal: string | null
          therapeutic_tags: string[] | null
          track_id: string
          updated_at: string
        }
        Insert: {
          bpm_range?: string | null
          complexity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          energy_level?: number | null
          id?: string
          intensity_level?: number | null
          mood_tags?: string[] | null
          primary_genre?: string | null
          primary_therapeutic_goal: string
          secondary_genre?: string | null
          secondary_therapeutic_goal?: string | null
          therapeutic_tags?: string[] | null
          track_id: string
          updated_at?: string
        }
        Update: {
          bpm_range?: string | null
          complexity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          energy_level?: number | null
          id?: string
          intensity_level?: number | null
          mood_tags?: string[] | null
          primary_genre?: string | null
          primary_therapeutic_goal?: string
          secondary_genre?: string | null
          secondary_therapeutic_goal?: string | null
          therapeutic_tags?: string[] | null
          track_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      track_analytics: {
        Row: {
          condition_target: string | null
          created_at: string | null
          duration_seconds: number | null
          event_type: string
          frequency_band: string | null
          id: string
          ip_address: string | null
          track_id: string
          user_agent: string | null
        }
        Insert: {
          condition_target?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          event_type: string
          frequency_band?: string | null
          id?: string
          ip_address?: string | null
          track_id: string
          user_agent?: string | null
        }
        Update: {
          condition_target?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          event_type?: string
          frequency_band?: string | null
          id?: string
          ip_address?: string | null
          track_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      track_genre_success_scores: {
        Row: {
          award_potential_score: number | null
          composite_success_score: number | null
          critical_acclaim_score: number | null
          genre: string
          genre_hit_score: number | null
          id: string
          mainstream_hit_score: number | null
          model_id: string | null
          recommendations: Json | null
          scored_at: string
          success_factors: Json | null
          track_id: string | null
        }
        Insert: {
          award_potential_score?: number | null
          composite_success_score?: number | null
          critical_acclaim_score?: number | null
          genre: string
          genre_hit_score?: number | null
          id?: string
          mainstream_hit_score?: number | null
          model_id?: string | null
          recommendations?: Json | null
          scored_at?: string
          success_factors?: Json | null
          track_id?: string | null
        }
        Update: {
          award_potential_score?: number | null
          composite_success_score?: number | null
          critical_acclaim_score?: number | null
          genre?: string
          genre_hit_score?: number | null
          id?: string
          mainstream_hit_score?: number | null
          model_id?: string | null
          recommendations?: Json | null
          scored_at?: string
          success_factors?: Json | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_genre_success_scores_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "genre_prediction_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_genre_success_scores_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_hit_predictions: {
        Row: {
          actionable_deltas: Json | null
          confidence_interval: Json | null
          distance_to_hit_profile: number | null
          feature_importance: Json | null
          genre_adjusted_score: number | null
          hit_probability: number | null
          hit_score: number | null
          id: string
          model_id: string | null
          predicted_at: string
          predicted_popularity: number | null
          track_id: string | null
          trend_alignment_score: number | null
        }
        Insert: {
          actionable_deltas?: Json | null
          confidence_interval?: Json | null
          distance_to_hit_profile?: number | null
          feature_importance?: Json | null
          genre_adjusted_score?: number | null
          hit_probability?: number | null
          hit_score?: number | null
          id?: string
          model_id?: string | null
          predicted_at?: string
          predicted_popularity?: number | null
          track_id?: string | null
          trend_alignment_score?: number | null
        }
        Update: {
          actionable_deltas?: Json | null
          confidence_interval?: Json | null
          distance_to_hit_profile?: number | null
          feature_importance?: Json | null
          genre_adjusted_score?: number | null
          hit_probability?: number | null
          hit_score?: number | null
          id?: string
          model_id?: string | null
          predicted_at?: string
          predicted_popularity?: number | null
          track_id?: string | null
          trend_alignment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "track_hit_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "hit_prediction_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_hit_predictions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_metadata: {
        Row: {
          bpm: number | null
          bucket_name: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          key_signature: string | null
          therapeutic_tags: string[] | null
          track_name: string
        }
        Insert: {
          bpm?: number | null
          bucket_name: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          key_signature?: string | null
          therapeutic_tags?: string[] | null
          track_name: string
        }
        Update: {
          bpm?: number | null
          bucket_name?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          key_signature?: string | null
          therapeutic_tags?: string[] | null
          track_name?: string
        }
        Relationships: []
      }
      track_patterns: {
        Row: {
          created_at: string | null
          frequency_score: number | null
          id: string
          pattern_data: Json
          pattern_type: string
          success_metrics: Json | null
          track_id: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_score?: number | null
          id?: string
          pattern_data: Json
          pattern_type: string
          success_metrics?: Json | null
          track_id?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_score?: number | null
          id?: string
          pattern_data?: Json
          pattern_type?: string
          success_metrics?: Json | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_patterns_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_title_changes: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_file_path: string | null
          new_title: string
          old_file_path: string | null
          old_title: string
          reason: string | null
          track_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_file_path?: string | null
          new_title: string
          old_file_path?: string | null
          old_title: string
          reason?: string | null
          track_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_file_path?: string | null
          new_title?: string
          old_file_path?: string | null
          old_title?: string
          reason?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_title_changes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_title_changes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          ai_score: number | null
          album: string | null
          album_id: string | null
          analysis_status: string | null
          analysis_timestamp: string | null
          analysis_version: string | null
          arousal: number | null
          artist: string | null
          audio_status: string | null
          bpm: number | null
          camelot: string | null
          canonical_title: string | null
          cognitive_load: number | null
          comprehensive_analysis: Json | null
          created_at: string | null
          created_date: string | null
          crest_factor: number | null
          danceability_score: number | null
          display_title: string | null
          dominance: number | null
          duration: number | null
          duration_seconds: number | null
          dynamic_complexity: number | null
          dynamic_features: Json | null
          dynamic_range: number | null
          emotion_tags: string[] | null
          emotional_stability: number | null
          extracted_year: number | null
          file_path: string | null
          genre: string | null
          harmonic_complexity: number | null
          harmonic_features: Json | null
          has_lyrics: boolean | null
          id: string
          inharmonicity: number | null
          investigation_notes: string | null
          key_confidence: number | null
          key_strength: number | null
          last_analyzed_at: string | null
          last_error: string | null
          last_title_normalized_at: string | null
          last_verified_at: string | null
          loudness_lufs: number | null
          lyrics: string | null
          lyrics_language: string | null
          mode: string | null
          mood_scores: Json | null
          musicxml_url: string | null
          neural_entrainment_potential: number | null
          normalization_notes: Json | null
          notation_data: Json | null
          onset_rate: number | null
          original_filename: string | null
          pitch_mean: number | null
          play_count: number | null
          playlist_id: string | null
          psychoacoustic_features: Json | null
          rhythmic_complexity: number | null
          rhythmic_features: Json | null
          rms_energy: number | null
          roughness: number | null
          scale: string | null
          skip_count: number | null
          spectral_bandwidth: number | null
          spectral_centroid: number | null
          spectral_complexity: number | null
          spectral_features: Json | null
          spectral_rolloff: number | null
          storage_bucket: string | null
          storage_key: string | null
          storage_path: string | null
          structural_features: Json | null
          subtitle: string | null
          tempo_stability: number | null
          therapeutic_category: string | null
          therapeutic_effectiveness: number | null
          therapeutic_use: string[] | null
          title: string
          title_health_score: number | null
          tonal_features: Json | null
          track_number: number | null
          track_uuid: string
          tuning_frequency: number | null
          valence: number | null
          version_label: string | null
          zero_crossing_rate: number | null
        }
        Insert: {
          ai_score?: number | null
          album?: string | null
          album_id?: string | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          artist?: string | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          canonical_title?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_at?: string | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          display_title?: string | null
          dominance?: number | null
          duration?: number | null
          duration_seconds?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          extracted_year?: number | null
          file_path?: string | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          has_lyrics?: boolean | null
          id?: string
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_title_normalized_at?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          lyrics?: string | null
          lyrics_language?: string | null
          mode?: string | null
          mood_scores?: Json | null
          musicxml_url?: string | null
          neural_entrainment_potential?: number | null
          normalization_notes?: Json | null
          notation_data?: Json | null
          onset_rate?: number | null
          original_filename?: string | null
          pitch_mean?: number | null
          play_count?: number | null
          playlist_id?: string | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          storage_path?: string | null
          structural_features?: Json | null
          subtitle?: string | null
          tempo_stability?: number | null
          therapeutic_category?: string | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title: string
          title_health_score?: number | null
          tonal_features?: Json | null
          track_number?: number | null
          track_uuid: string
          tuning_frequency?: number | null
          valence?: number | null
          version_label?: string | null
          zero_crossing_rate?: number | null
        }
        Update: {
          ai_score?: number | null
          album?: string | null
          album_id?: string | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          artist?: string | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          canonical_title?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_at?: string | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          display_title?: string | null
          dominance?: number | null
          duration?: number | null
          duration_seconds?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          extracted_year?: number | null
          file_path?: string | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          has_lyrics?: boolean | null
          id?: string
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_title_normalized_at?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          lyrics?: string | null
          lyrics_language?: string | null
          mode?: string | null
          mood_scores?: Json | null
          musicxml_url?: string | null
          neural_entrainment_potential?: number | null
          normalization_notes?: Json | null
          notation_data?: Json | null
          onset_rate?: number | null
          original_filename?: string | null
          pitch_mean?: number | null
          play_count?: number | null
          playlist_id?: string | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          storage_path?: string | null
          structural_features?: Json | null
          subtitle?: string | null
          tempo_stability?: number | null
          therapeutic_category?: string | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title?: string
          title_health_score?: number | null
          tonal_features?: Json | null
          track_number?: number | null
          track_uuid?: string
          tuning_frequency?: number | null
          valence?: number | null
          version_label?: string | null
          zero_crossing_rate?: number | null
        }
        Relationships: []
      }
      tracks_backup: {
        Row: {
          ai_score: number | null
          analysis_status: string | null
          analysis_timestamp: string | null
          analysis_version: string | null
          arousal: number | null
          audio_status: string | null
          bpm: number | null
          camelot: string | null
          cognitive_load: number | null
          comprehensive_analysis: Json | null
          created_date: string | null
          crest_factor: number | null
          danceability_score: number | null
          dominance: number | null
          dynamic_complexity: number | null
          dynamic_features: Json | null
          dynamic_range: number | null
          emotion_tags: string[] | null
          emotional_stability: number | null
          genre: string | null
          harmonic_complexity: number | null
          harmonic_features: Json | null
          id: string | null
          inharmonicity: number | null
          investigation_notes: string | null
          key_confidence: number | null
          key_strength: number | null
          last_analyzed_at: string | null
          last_error: string | null
          last_verified_at: string | null
          loudness_lufs: number | null
          mode: string | null
          mood_scores: Json | null
          neural_entrainment_potential: number | null
          onset_rate: number | null
          pitch_mean: number | null
          play_count: number | null
          psychoacoustic_features: Json | null
          rhythmic_complexity: number | null
          rhythmic_features: Json | null
          rms_energy: number | null
          roughness: number | null
          scale: string | null
          skip_count: number | null
          spectral_bandwidth: number | null
          spectral_centroid: number | null
          spectral_complexity: number | null
          spectral_features: Json | null
          spectral_rolloff: number | null
          storage_bucket: string | null
          storage_key: string | null
          structural_features: Json | null
          tempo_stability: number | null
          therapeutic_effectiveness: number | null
          therapeutic_use: string[] | null
          title: string | null
          tonal_features: Json | null
          tuning_frequency: number | null
          valence: number | null
          zero_crossing_rate: number | null
        }
        Insert: {
          ai_score?: number | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          dominance?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          id?: string | null
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          mode?: string | null
          mood_scores?: Json | null
          neural_entrainment_potential?: number | null
          onset_rate?: number | null
          pitch_mean?: number | null
          play_count?: number | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          structural_features?: Json | null
          tempo_stability?: number | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title?: string | null
          tonal_features?: Json | null
          tuning_frequency?: number | null
          valence?: number | null
          zero_crossing_rate?: number | null
        }
        Update: {
          ai_score?: number | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          dominance?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          id?: string | null
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          mode?: string | null
          mood_scores?: Json | null
          neural_entrainment_potential?: number | null
          onset_rate?: number | null
          pitch_mean?: number | null
          play_count?: number | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          structural_features?: Json | null
          tempo_stability?: number | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title?: string | null
          tonal_features?: Json | null
          tuning_frequency?: number | null
          valence?: number | null
          zero_crossing_rate?: number | null
        }
        Relationships: []
      }
      tracks_backup_2: {
        Row: {
          ai_score: number | null
          analysis_status: string | null
          analysis_timestamp: string | null
          analysis_version: string | null
          arousal: number | null
          audio_status: string | null
          bpm: number | null
          camelot: string | null
          cognitive_load: number | null
          comprehensive_analysis: Json | null
          created_date: string | null
          crest_factor: number | null
          danceability_score: number | null
          dominance: number | null
          dynamic_complexity: number | null
          dynamic_features: Json | null
          dynamic_range: number | null
          emotion_tags: string[] | null
          emotional_stability: number | null
          genre: string | null
          harmonic_complexity: number | null
          harmonic_features: Json | null
          id: string | null
          inharmonicity: number | null
          investigation_notes: string | null
          key_confidence: number | null
          key_strength: number | null
          last_analyzed_at: string | null
          last_error: string | null
          last_verified_at: string | null
          loudness_lufs: number | null
          mode: string | null
          mood_scores: Json | null
          neural_entrainment_potential: number | null
          onset_rate: number | null
          pitch_mean: number | null
          play_count: number | null
          psychoacoustic_features: Json | null
          rhythmic_complexity: number | null
          rhythmic_features: Json | null
          rms_energy: number | null
          roughness: number | null
          scale: string | null
          skip_count: number | null
          spectral_bandwidth: number | null
          spectral_centroid: number | null
          spectral_complexity: number | null
          spectral_features: Json | null
          spectral_rolloff: number | null
          storage_bucket: string | null
          storage_key: string | null
          structural_features: Json | null
          tempo_stability: number | null
          therapeutic_effectiveness: number | null
          therapeutic_use: string[] | null
          title: string | null
          tonal_features: Json | null
          tuning_frequency: number | null
          valence: number | null
          zero_crossing_rate: number | null
        }
        Insert: {
          ai_score?: number | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          dominance?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          id?: string | null
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          mode?: string | null
          mood_scores?: Json | null
          neural_entrainment_potential?: number | null
          onset_rate?: number | null
          pitch_mean?: number | null
          play_count?: number | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          structural_features?: Json | null
          tempo_stability?: number | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title?: string | null
          tonal_features?: Json | null
          tuning_frequency?: number | null
          valence?: number | null
          zero_crossing_rate?: number | null
        }
        Update: {
          ai_score?: number | null
          analysis_status?: string | null
          analysis_timestamp?: string | null
          analysis_version?: string | null
          arousal?: number | null
          audio_status?: string | null
          bpm?: number | null
          camelot?: string | null
          cognitive_load?: number | null
          comprehensive_analysis?: Json | null
          created_date?: string | null
          crest_factor?: number | null
          danceability_score?: number | null
          dominance?: number | null
          dynamic_complexity?: number | null
          dynamic_features?: Json | null
          dynamic_range?: number | null
          emotion_tags?: string[] | null
          emotional_stability?: number | null
          genre?: string | null
          harmonic_complexity?: number | null
          harmonic_features?: Json | null
          id?: string | null
          inharmonicity?: number | null
          investigation_notes?: string | null
          key_confidence?: number | null
          key_strength?: number | null
          last_analyzed_at?: string | null
          last_error?: string | null
          last_verified_at?: string | null
          loudness_lufs?: number | null
          mode?: string | null
          mood_scores?: Json | null
          neural_entrainment_potential?: number | null
          onset_rate?: number | null
          pitch_mean?: number | null
          play_count?: number | null
          psychoacoustic_features?: Json | null
          rhythmic_complexity?: number | null
          rhythmic_features?: Json | null
          rms_energy?: number | null
          roughness?: number | null
          scale?: string | null
          skip_count?: number | null
          spectral_bandwidth?: number | null
          spectral_centroid?: number | null
          spectral_complexity?: number | null
          spectral_features?: Json | null
          spectral_rolloff?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          structural_features?: Json | null
          tempo_stability?: number | null
          therapeutic_effectiveness?: number | null
          therapeutic_use?: string[] | null
          title?: string | null
          tonal_features?: Json | null
          tuning_frequency?: number | null
          valence?: number | null
          zero_crossing_rate?: number | null
        }
        Relationships: []
      }
      tracks_id_mapping: {
        Row: {
          created_at: string | null
          new_id: string
          old_id: number
        }
        Insert: {
          created_at?: string | null
          new_id: string
          old_id: number
        }
        Update: {
          created_at?: string | null
          new_id?: string
          old_id?: number
        }
        Relationships: []
      }
      trial_requests: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          employee_count: string | null
          full_name: string
          id: string
          notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          employee_count?: string | null
          full_name: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          employee_count?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          created_at: string | null
          id: string
          reason: string | null
          track_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          track_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          track_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_downloads: {
        Row: {
          downloaded_at: string | null
          file_size_mb: number | null
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string | null
          file_size_mb?: number | null
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string | null
          file_size_mb?: number | null
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_downloads_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          added_at: string | null
          created_at: string | null
          id: string
          last_played_at: string | null
          play_count: number | null
          track_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          play_count?: number | null
          track_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          play_count?: number | null
          track_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_genre_preferences: {
        Row: {
          created_at: string | null
          id: string
          preference_score: number | null
          therapeutic_category: Database["public"]["Enums"]["therapeutic_category"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preference_score?: number | null
          therapeutic_category: Database["public"]["Enums"]["therapeutic_category"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preference_score?: number | null
          therapeutic_category?: Database["public"]["Enums"]["therapeutic_category"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_listening_history: {
        Row: {
          completed: boolean | null
          duration_listened_seconds: number | null
          id: string
          listened_at: string | null
          playlist_id: string | null
          track_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          duration_listened_seconds?: number | null
          id?: string
          listened_at?: string | null
          playlist_id?: string | null
          track_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          duration_listened_seconds?: number | null
          id?: string
          listened_at?: string | null
          playlist_id?: string | null
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_listening_history_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_listening_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_listening_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_listening_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_music_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["music_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["music_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["music_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_playback_state: {
        Row: {
          bucket_name: string | null
          id: string
          playlist_index: number | null
          playlist_name: string | null
          playlist_tracks: Json | null
          position_seconds: number | null
          track_file_path: string | null
          track_title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bucket_name?: string | null
          id?: string
          playlist_index?: number | null
          playlist_name?: string | null
          playlist_tracks?: Json | null
          position_seconds?: number | null
          track_file_path?: string | null
          track_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bucket_name?: string | null
          id?: string
          playlist_index?: number | null
          playlist_name?: string | null
          playlist_tracks?: Json | null
          position_seconds?: number | null
          track_file_path?: string | null
          track_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_accessed: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_accessed?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_accessed?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vad_poetry: {
        Row: {
          author: string | null
          created_at: string | null
          full_text: string | null
          id: string
          language: string
          line_count: number | null
          per_line_vad: Json | null
          poem_id: string
          title: string | null
          url: string | null
          vad_arousal_mean: number | null
          vad_arousal_median: number | null
          vad_dominance_mean: number | null
          vad_dominance_median: number | null
          vad_valence_mean: number | null
          vad_valence_median: number | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          full_text?: string | null
          id?: string
          language: string
          line_count?: number | null
          per_line_vad?: Json | null
          poem_id: string
          title?: string | null
          url?: string | null
          vad_arousal_mean?: number | null
          vad_arousal_median?: number | null
          vad_dominance_mean?: number | null
          vad_dominance_median?: number | null
          vad_valence_mean?: number | null
          vad_valence_median?: number | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          full_text?: string | null
          id?: string
          language?: string
          line_count?: number | null
          per_line_vad?: Json | null
          poem_id?: string
          title?: string | null
          url?: string | null
          vad_arousal_mean?: number | null
          vad_arousal_median?: number | null
          vad_dominance_mean?: number | null
          vad_dominance_median?: number | null
          vad_valence_mean?: number | null
          vad_valence_median?: number | null
        }
        Relationships: []
      }
      working_edge_collection: {
        Row: {
          bpm: number | null
          created_at: string
          energy_level: number | null
          genre: string | null
          id: string
          last_played_at: string | null
          play_count: number
          reliability_score: number
          storage_bucket: string
          storage_key: string
          therapeutic_goal: string | null
          track_id: string
          updated_at: string
          verified_at: string
        }
        Insert: {
          bpm?: number | null
          created_at?: string
          energy_level?: number | null
          genre?: string | null
          id?: string
          last_played_at?: string | null
          play_count?: number
          reliability_score?: number
          storage_bucket: string
          storage_key: string
          therapeutic_goal?: string | null
          track_id: string
          updated_at?: string
          verified_at?: string
        }
        Update: {
          bpm?: number | null
          created_at?: string
          energy_level?: number | null
          genre?: string | null
          id?: string
          last_played_at?: string | null
          play_count?: number
          reliability_score?: number
          storage_bucket?: string
          storage_key?: string
          therapeutic_goal?: string | null
          track_id?: string
          updated_at?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "working_edge_collection_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: true
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      enhanced_user_favorites: {
        Row: {
          added_at: string | null
          album: string | null
          artist: string | null
          artwork_url: string | null
          display_title: string | null
          genre: Database["public"]["Enums"]["music_genre"] | null
          id: string | null
          mood: string | null
          playlist_id: string | null
          storage_bucket: string | null
          storage_path: string | null
          track_id: string | null
          track_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generic_titled_tracks: {
        Row: {
          artist: string | null
          bucket_name: string | null
          created_at: string | null
          file_path: string | null
          id: string | null
          issue_type: string | null
          title: string | null
        }
        Insert: {
          artist?: string | null
          bucket_name?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string | null
          issue_type?: never
          title?: string | null
        }
        Update: {
          artist?: string | null
          bucket_name?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string | null
          issue_type?: never
          title?: string | null
        }
        Relationships: []
      }
      pg_stat_monitor: {
        Row: {
          application_name: string | null
          bucket: number | null
          bucket_done: boolean | null
          bucket_start_time: string | null
          calls: number | null
          client_ip: unknown
          cmd_type: number | null
          cmd_type_text: string | null
          comments: string | null
          cpu_sys_time: number | null
          cpu_user_time: number | null
          datname: string | null
          dbid: unknown
          elevel: number | null
          jit_deform_count: number | null
          jit_deform_time: number | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blk_read_time: number | null
          local_blk_write_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          message: string | null
          min_exec_time: number | null
          min_plan_time: number | null
          minmax_stats_since: string | null
          pgsm_query_id: number | null
          planid: number | null
          plans: number | null
          query: string | null
          query_plan: string | null
          queryid: number | null
          relations: string[] | null
          resp_calls: string[] | null
          rows: number | null
          shared_blk_read_time: number | null
          shared_blk_write_time: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          sqlcode: string | null
          stats_since: string | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          top_query: string | null
          top_queryid: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown
          username: string | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      user_favorites_view: {
        Row: {
          added_at: string | null
          artist: string | null
          artwork_url: string | null
          bucket_name: string | null
          duration_seconds: number | null
          file_path: string | null
          genre: Database["public"]["Enums"]["music_genre"] | null
          id: string | null
          play_count: number | null
          playlist_id: string | null
          title: string | null
          track_created_at: string | null
          track_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generic_titled_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_favorite: {
        Args: { p_track_id: string; p_user_id: string }
        Returns: string
      }
      add_favorite_by_file: {
        Args: {
          p_bucket_name?: string
          p_file_path: string
          p_title?: string
          p_user_id: string
        }
        Returns: string
      }
      add_to_favorites: { Args: { p_track_id: string }; Returns: boolean }
      add_to_working_collection: {
        Args: { _reliability_score?: number; _track_id: string }
        Returns: boolean
      }
      add_user_favorite_unified:
        | {
            Args: {
              p_artist?: string
              p_storage_bucket?: string
              p_storage_path?: string
              p_track_id: string
              p_track_name?: string
              p_user_id: string
            }
            Returns: string
          }
        | {
            Args: { p_track_identifier: string; p_user_id: string }
            Returns: string
          }
      analyze_session_coverage: {
        Args: never
        Returns: {
          analysis_type: string
          count_value: number
          details: string
          percentage: number
        }[]
      }
      analyze_storage_columns: {
        Args: never
        Returns: {
          column_name: string
          data_type: string
          table_name: string
          table_schema: string
        }[]
      }
      apply_database_repairs: {
        Args: { dry_run?: boolean }
        Returns: {
          column_name: string
          operation_type: string
          rows_affected: number
          table_name: string
        }[]
      }
      calculate_genre_success_score: {
        Args: {
          _award_nominations?: number
          _award_wins?: number
          _chart_position?: number
          _critical_score?: number
          _genre: string
          _streaming_count?: number
          _track_id: string
        }
        Returns: number
      }
      calculate_hit_score: {
        Args: {
          feature_alignment?: number
          genre_weight?: number
          popularity_score: number
          trend_alignment?: number
        }
        Returns: number
      }
      clean_track_title_from_filename: {
        Args: { storage_key: string }
        Returns: string
      }
      cleanup_expired_playlists: { Args: never; Returns: number }
      cleanup_expired_sessions: { Args: never; Returns: number }
      clear_relaxing_sambas_artwork_conflicts: {
        Args: never
        Returns: undefined
      }
      create_magic_link_for_vip: {
        Args: {
          expires_in_hours?: number
          link_metadata?: Json
          target_user_id: string
        }
        Returns: {
          expires_at: string
          link_id: string
          token: string
        }[]
      }
      decode_error_level: { Args: { elevel: number }; Returns: string }
      find_broken_tracks: {
        Args: never
        Returns: {
          id: string
          issue: string
          storage_bucket: string
          storage_key: string
          title: string
        }[]
      }
      find_cross_bucket_candidates: {
        Args: never
        Returns: {
          current_bucket: string
          storage_key: string
          suggested_bucket: string
          title: string
          track_id: string
        }[]
      }
      find_users_without_sessions: {
        Args: never
        Returns: {
          created_at: string
          days_since_signup: number
          email: string
          has_profile: boolean
          last_sign_in_at: string
          user_id: string
        }[]
      }
      fix_invalid_uuids: { Args: never; Returns: undefined }
      fix_track_id_inconsistencies: { Args: never; Returns: undefined }
      generate_magic_link_token: { Args: never; Returns: string }
      generate_unique_filename: {
        Args: { base_name: string; bucket_name: string; exclude_id?: string }
        Returns: string
      }
      get_album_cover_url: {
        Args: { bucket_name_param: string }
        Returns: string
      }
      get_all_animated_artworks: {
        Args: never
        Returns: {
          artwork_semantic_label: string
          artwork_type: string
          artwork_url: string
          display_order: number
          id: string
        }[]
      }
      get_all_display_groups: {
        Args: never
        Returns: {
          avg_duration: number
          display_group: string
          genre_count: number
        }[]
      }
      get_bucket_repair_status: {
        Args: { _bucket_name: string }
        Returns: {
          files_needing_repair: number
          files_repaired: number
          sample_repairs: Json
          total_files: number
        }[]
      }
      get_camelot_neighbors: {
        Args: { input_camelot: string }
        Returns: string[]
      }
      get_cmd_type: { Args: { cmd_type: number }; Returns: string }
      get_curated_tracks_safe: {
        Args: { track_ids?: string[] }
        Returns: {
          artist: string
          curated_storage_key: string
          duration_seconds: number
          id: string
          original_filename: string
          title: string
        }[]
      }
      get_genre_appropriate_recommendations: {
        Args: { _genre: string; _track_id: string }
        Returns: Json
      }
      get_genres_by_display_group: {
        Args: { group_name: string }
        Returns: {
          art_file: string
          benefit: string
          bucket: string
          category: string
          color_hex: string
          description: string
          display_group: string
          id: string
          intensity: string
          recommended_duration: number
          therapeutic_category: string
        }[]
      }
      get_genres_by_therapeutic_category: {
        Args: { category_name: string }
        Returns: {
          art_file: string
          benefit: string
          bucket: string
          category: string
          color_hex: string
          description: string
          display_group: string
          id: string
          intensity: string
          recommended_duration: number
          therapeutic_category: string
        }[]
      }
      get_histogram_timings: { Args: never; Returns: string }
      get_hit_potential_tracks: {
        Args: { limit_count?: number; min_score?: number }
        Returns: {
          actionable_deltas: Json
          hit_probability: number
          hit_score: number
          title: string
          track_id: string
        }[]
      }
      get_or_create_patient_for_user: {
        Args: { user_id: string }
        Returns: string
      }
      get_playlist_tracks_enhanced: {
        Args: { p_bucket_name: string }
        Returns: {
          artist: string
          artwork_url: string
          duration_seconds: number
          storage_path: string
          therapeutic_tags: string[]
          title: string
          track_id: string
        }[]
      }
      get_random_animated_artwork: {
        Args: never
        Returns: {
          artwork_semantic_label: string
          artwork_type: string
          artwork_url: string
          id: string
        }[]
      }
      get_sambajazznocturnes_url: {
        Args: { file_path: string }
        Returns: string
      }
      get_therapeutic_recommendations: {
        Args: { min_evidence_score?: number; target_condition: string }
        Returns: {
          evidence_score: number
          frequency_band: string
          track_id: string
        }[]
      }
      get_track_public_url: {
        Args: { bucket_name: string; file_path: string }
        Returns: string
      }
      get_track_stats: {
        Args: never
        Returns: {
          missing_tracks: number
          total_tracks: number
          unknown_tracks: number
          working_tracks: number
        }[]
      }
      get_tracks_by_bpm_range: {
        Args: { max_bpm: number; min_bpm: number }
        Returns: {
          album: string | null
          artist: string | null
          bpm: number | null
          created_at: string | null
          display_order: number | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          mood_tags: string[] | null
          play_count: number | null
          storage_path: string
          therapeutic_category: string[] | null
          title: string
          track_number: number | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "sambajazznocturnes_tracks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_tracks_by_category: {
        Args: { category: string }
        Returns: {
          album: string | null
          artist: string | null
          bpm: number | null
          created_at: string | null
          display_order: number | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          mood_tags: string[] | null
          play_count: number | null
          storage_path: string
          therapeutic_category: string[] | null
          title: string
          track_number: number | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "sambajazznocturnes_tracks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_unplayable_tracks_diagnostic: {
        Args: never
        Returns: {
          audio_status: string
          created_at: string
          days_broken: number
          issue_category: string
          issue_description: string
          last_error: string
          last_verified_at: string
          storage_bucket: string
          storage_key: string
          suggested_fix: string
          title: string
          track_id: string
        }[]
      }
      get_unplayable_tracks_summary: {
        Args: never
        Returns: {
          by_bucket: Json
          file_corrupted: number
          file_not_found: number
          missing_bucket: number
          missing_metadata: number
          needs_reverification: number
          never_verified: number
          oldest_issue_days: number
          total_unplayable: number
        }[]
      }
      get_user_favorites: {
        Args: { p_user_id: string }
        Returns: {
          added_at: string
          artist: string
          artwork_url: string
          bucket_name: string
          duration_seconds: number
          favorite_id: string
          file_path: string
          genre: string
          title: string
          track_id: string
        }[]
      }
      get_user_genre_recommendations: {
        Args: { target_user_id?: string }
        Returns: {
          benefits: string[]
          bucket_name: string
          description: string
          display_name: string
          recommendation_score: number
          therapeutic_category: string
        }[]
      }
      get_user_music_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["music_role"]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_working_edge_tracks: {
        Args: { _genre?: string; _limit?: number; _therapeutic_goal?: string }
        Returns: {
          play_count: number
          reliability_score: number
          storage_bucket: string
          storage_key: string
          title: string
          track_id: string
        }[]
      }
      has_medical_access: { Args: never; Returns: boolean }
      has_music_role: {
        Args: {
          _role: Database["public"]["Enums"]["music_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_patient_access: { Args: { _patient_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      histogram: {
        Args: { _bucket: number; _quryid: number }
        Returns: Record<string, unknown>[]
      }
      increment_play_count: { Args: { track_id: string }; Returns: undefined }
      increment_track_play_count: {
        Args: { track_id: string }
        Returns: undefined
      }
      is_blocked_company_email: { Args: { email: string }; Returns: boolean }
      is_favorite: { Args: { p_track_id: string }; Returns: boolean }
      is_favorited: {
        Args: { p_track_id: string; p_user_id: string }
        Returns: boolean
      }
      is_favorited_by_file: {
        Args: { p_file_path: string; p_user_id: string }
        Returns: boolean
      }
      is_track_favorited_unified: {
        Args: { p_track_id: string; p_user_id: string }
        Returns: boolean
      }
      is_valid_uuid: { Args: { input_text: string }; Returns: boolean }
      is_vip_member: { Args: { _user_id?: string }; Returns: boolean }
      mark_likely_missing_tracks: { Args: never; Returns: number }
      mark_messages_as_read: {
        Args: { p_ticket_id: string }
        Returns: undefined
      }
      mark_track_as_missing: {
        Args: { error_message?: string; track_uuid: string }
        Returns: undefined
      }
      pg_stat_monitor_internal: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_monitor_reset: { Args: never; Returns: undefined }
      pg_stat_monitor_version: { Args: never; Returns: string }
      pgsm_create_11_view: { Args: never; Returns: number }
      pgsm_create_13_view: { Args: never; Returns: number }
      pgsm_create_14_view: { Args: never; Returns: number }
      pgsm_create_15_view: { Args: never; Returns: number }
      pgsm_create_17_view: { Args: never; Returns: number }
      pgsm_create_view: { Args: never; Returns: number }
      populate_bucket_repair_map: {
        Args: { _bucket_name: string }
        Returns: {
          sample_mappings: Json
          total_unsafe_keys: number
        }[]
      }
      populate_repair_map: {
        Args: never
        Returns: {
          buckets_affected: string[]
          total_unsafe_keys: number
        }[]
      }
      range: { Args: never; Returns: string[] }
      remove_favorite: {
        Args: { p_track_id: string; p_user_id: string }
        Returns: boolean
      }
      remove_favorite_by_file: {
        Args: { p_file_path: string; p_user_id: string }
        Returns: boolean
      }
      remove_from_favorites: { Args: { p_track_id: string }; Returns: boolean }
      remove_user_favorite_unified: {
        Args: { p_track_id: string; p_user_id: string }
        Returns: boolean
      }
      resolve_track_info_unified: {
        Args: { p_track_id: string }
        Returns: {
          artist: string
          storage_bucket: string
          storage_path: string
          title: string
          track_id: string
        }[]
      }
      safe_cast_to_music_genre: {
        Args: { text_value: string }
        Returns: Database["public"]["Enums"]["music_genre"]
      }
      safe_key: { Args: { raw: string }; Returns: string }
      save_playback_state: {
        Args: {
          p_bucket_name: string
          p_playlist_index?: number
          p_playlist_name?: string
          p_playlist_tracks?: Json
          p_position_seconds?: number
          p_track_file_path: string
          p_track_title: string
          p_user_id: string
        }
        Returns: undefined
      }
      seed_sambajazznocturnes_tracks: { Args: never; Returns: undefined }
      session_data_quality_check: {
        Args: never
        Returns: {
          check_type: string
          description: string
          issue_count: number
          percentage: number
          total_sessions: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      suggest_commercial_titles: {
        Args: { p_bucket_name?: string; p_genre?: string }
        Returns: {
          current_title: string
          reasoning: string
          suggested_title: string
          track_id: string
        }[]
      }
      sync_hiit_storage: { Args: never; Returns: undefined }
      update_session_activity: {
        Args: { session_id: string }
        Returns: undefined
      }
      update_track_bucket: {
        Args: { new_bucket: string; track_id: string }
        Returns: boolean
      }
      update_track_title: {
        Args: {
          p_new_artist?: string
          p_new_title: string
          p_old_title: string
        }
        Returns: {
          new_file_path: string
          new_title: string
          old_file_path: string
          old_title: string
          updated_id: string
        }[]
      }
      update_user_genre_preference: {
        Args: {
          score: number
          target_category: Database["public"]["Enums"]["therapeutic_category"]
        }
        Returns: undefined
      }
      update_working_edge_play_stats: {
        Args: { _track_id: string }
        Returns: undefined
      }
      validate_magic_link: {
        Args: { link_token: string }
        Returns: {
          reason: string
          user_id: string
          valid: boolean
        }[]
      }
      validate_repairs: {
        Args: never
        Returns: {
          check_name: string
          count: number
          details: string
          status: string
        }[]
      }
      validate_user_name: { Args: { full_name: string }; Returns: boolean }
      verify_all_tracks: {
        Args: never
        Returns: {
          bucket_corrections: number
          now_working: number
          still_missing: number
          total_checked: number
        }[]
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "moderator"
        | "premium_user"
        | "user"
        | "clinical_user"
      message_type: "user" | "bot" | "support_agent"
      music_genre:
        | "classical"
        | "crossover_classical"
        | "sonatas"
        | "new_age"
        | "world"
        | "electronica"
        | "house"
        | "reggaeton"
        | "edm"
        | "pop"
        | "tropical_house"
        | "House EDM"
        | "EDM"
        | "Electronic"
      music_intensity: "low" | "medium" | "high"
      music_role: "producer" | "engineer" | "singer_songwriter"
      playlist_category:
        | "focus"
        | "relaxation"
        | "rest"
        | "meditation"
        | "mood_boost"
        | "energy"
      spatial_audio_profile:
        | "cathedral"
        | "live_concert"
        | "studio"
        | "forest"
        | "ocean_depths"
        | "space_station"
      support_ticket_category:
        | "bug_report"
        | "feature_request"
        | "payment_issue"
        | "login_help"
        | "technical"
        | "other"
      support_ticket_priority: "low" | "medium" | "high" | "critical"
      support_ticket_status: "open" | "in_progress" | "resolved" | "closed"
      therapeutic_category:
        | "cognitive_enhancement"
        | "stress_relief"
        | "pain_management"
        | "energy_boost"
        | "sleep_improvement"
        | "mood_regulation"
        | "focus_concentration"
        | "relaxation_meditation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "moderator",
        "premium_user",
        "user",
        "clinical_user",
      ],
      message_type: ["user", "bot", "support_agent"],
      music_genre: [
        "classical",
        "crossover_classical",
        "sonatas",
        "new_age",
        "world",
        "electronica",
        "house",
        "reggaeton",
        "edm",
        "pop",
        "tropical_house",
        "House EDM",
        "EDM",
        "Electronic",
      ],
      music_intensity: ["low", "medium", "high"],
      music_role: ["producer", "engineer", "singer_songwriter"],
      playlist_category: [
        "focus",
        "relaxation",
        "rest",
        "meditation",
        "mood_boost",
        "energy",
      ],
      spatial_audio_profile: [
        "cathedral",
        "live_concert",
        "studio",
        "forest",
        "ocean_depths",
        "space_station",
      ],
      support_ticket_category: [
        "bug_report",
        "feature_request",
        "payment_issue",
        "login_help",
        "technical",
        "other",
      ],
      support_ticket_priority: ["low", "medium", "high", "critical"],
      support_ticket_status: ["open", "in_progress", "resolved", "closed"],
      therapeutic_category: [
        "cognitive_enhancement",
        "stress_relief",
        "pain_management",
        "energy_boost",
        "sleep_improvement",
        "mood_regulation",
        "focus_concentration",
        "relaxation_meditation",
      ],
    },
  },
} as const
