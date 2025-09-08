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
      adjacency_products: {
        Row: {
          capacity_annual_mbf: number | null
          capacity_annual_msf: number | null
          capex_requirement: number | null
          created_at: string
          cyclicality_correlation: number | null
          id: string
          margin_percent: number | null
          market_price_per_unit: number | null
          mill_id: string | null
          product_category: string
          production_cost_per_unit: number | null
          strategic_value: string | null
          technology_requirements: Json | null
        }
        Insert: {
          capacity_annual_mbf?: number | null
          capacity_annual_msf?: number | null
          capex_requirement?: number | null
          created_at?: string
          cyclicality_correlation?: number | null
          id?: string
          margin_percent?: number | null
          market_price_per_unit?: number | null
          mill_id?: string | null
          product_category: string
          production_cost_per_unit?: number | null
          strategic_value?: string | null
          technology_requirements?: Json | null
        }
        Update: {
          capacity_annual_mbf?: number | null
          capacity_annual_msf?: number | null
          capex_requirement?: number | null
          created_at?: string
          cyclicality_correlation?: number | null
          id?: string
          margin_percent?: number | null
          market_price_per_unit?: number | null
          mill_id?: string | null
          product_category?: string
          production_cost_per_unit?: number | null
          strategic_value?: string | null
          technology_requirements?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "adjacency_products_mill_id_fkey"
            columns: ["mill_id"]
            isOneToOne: false
            referencedRelation: "mill_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_data_sources: {
        Row: {
          api_endpoint: string | null
          created_at: string
          data_quality_score: number | null
          error_log: Json | null
          id: string
          last_sync_date: string | null
          records_imported: number | null
          source_name: string
          sync_frequency: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          data_quality_score?: number | null
          error_log?: Json | null
          id?: string
          last_sync_date?: string | null
          records_imported?: number | null
          source_name: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          data_quality_score?: number | null
          error_log?: Json | null
          id?: string
          last_sync_date?: string | null
          records_imported?: number | null
          source_name?: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string
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
      canadian_lumber_prices: {
        Row: {
          created_at: string
          exchange_rate_cad_usd: number | null
          export_tariff_rate: number | null
          grade: string | null
          harvest_volume: number | null
          id: string
          lumber_type: string
          mill_location: string | null
          price_cad_per_mbf: number | null
          price_date: string
          price_usd_per_mbf: number | null
          province: string | null
          species: string | null
        }
        Insert: {
          created_at?: string
          exchange_rate_cad_usd?: number | null
          export_tariff_rate?: number | null
          grade?: string | null
          harvest_volume?: number | null
          id?: string
          lumber_type: string
          mill_location?: string | null
          price_cad_per_mbf?: number | null
          price_date: string
          price_usd_per_mbf?: number | null
          province?: string | null
          species?: string | null
        }
        Update: {
          created_at?: string
          exchange_rate_cad_usd?: number | null
          export_tariff_rate?: number | null
          grade?: string | null
          harvest_volume?: number | null
          id?: string
          lumber_type?: string
          mill_location?: string | null
          price_cad_per_mbf?: number | null
          price_date?: string
          price_usd_per_mbf?: number | null
          province?: string | null
          species?: string | null
        }
        Relationships: []
      }
      capital_projects: {
        Row: {
          capex_per_mbf: number | null
          created_at: string
          decision_date: string | null
          fiber_security_score: number | null
          id: string
          incentive_package_millions: number | null
          irr_percent: number | null
          labor_availability_score: number | null
          location: string
          market_access_score: number | null
          mirr_percent: number | null
          npv_millions: number | null
          permit_risk_score: number | null
          project_name: string
          project_status: string | null
          project_timeline_months: number | null
          project_type: string
          risk_adjusted_hurdle: number | null
          target_capacity_mmbf: number | null
          total_capex_millions: number | null
          updated_at: string
        }
        Insert: {
          capex_per_mbf?: number | null
          created_at?: string
          decision_date?: string | null
          fiber_security_score?: number | null
          id?: string
          incentive_package_millions?: number | null
          irr_percent?: number | null
          labor_availability_score?: number | null
          location: string
          market_access_score?: number | null
          mirr_percent?: number | null
          npv_millions?: number | null
          permit_risk_score?: number | null
          project_name: string
          project_status?: string | null
          project_timeline_months?: number | null
          project_type: string
          risk_adjusted_hurdle?: number | null
          target_capacity_mmbf?: number | null
          total_capex_millions?: number | null
          updated_at?: string
        }
        Update: {
          capex_per_mbf?: number | null
          created_at?: string
          decision_date?: string | null
          fiber_security_score?: number | null
          id?: string
          incentive_package_millions?: number | null
          irr_percent?: number | null
          labor_availability_score?: number | null
          location?: string
          market_access_score?: number | null
          mirr_percent?: number | null
          npv_millions?: number | null
          permit_risk_score?: number | null
          project_name?: string
          project_status?: string | null
          project_timeline_months?: number | null
          project_type?: string
          risk_adjusted_hurdle?: number | null
          target_capacity_mmbf?: number | null
          total_capex_millions?: number | null
          updated_at?: string
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
      company_valuations: {
        Row: {
          book_value: number | null
          company_name: string
          company_symbol: string | null
          created_at: string
          debt_to_equity: number | null
          ebitda: number | null
          enterprise_value: number | null
          id: string
          market_cap: number | null
          net_income: number | null
          pb_ratio: number | null
          pe_ratio: number | null
          revenue: number | null
          updated_at: string
          valuation_date: string
        }
        Insert: {
          book_value?: number | null
          company_name: string
          company_symbol?: string | null
          created_at?: string
          debt_to_equity?: number | null
          ebitda?: number | null
          enterprise_value?: number | null
          id?: string
          market_cap?: number | null
          net_income?: number | null
          pb_ratio?: number | null
          pe_ratio?: number | null
          revenue?: number | null
          updated_at?: string
          valuation_date: string
        }
        Update: {
          book_value?: number | null
          company_name?: string
          company_symbol?: string | null
          created_at?: string
          debt_to_equity?: number | null
          ebitda?: number | null
          enterprise_value?: number | null
          id?: string
          market_cap?: number | null
          net_income?: number | null
          pb_ratio?: number | null
          pe_ratio?: number | null
          revenue?: number | null
          updated_at?: string
          valuation_date?: string
        }
        Relationships: []
      }
      competitor_capacity_events: {
        Row: {
          capacity_change_mmbf: number | null
          capex_amount: number | null
          capex_per_mbf: number | null
          competitor_id: string | null
          created_at: string
          event_date: string
          event_description: string | null
          event_type: string
          id: string
          location: string | null
          mill_name: string | null
          source_document: string | null
          strategic_rationale: string | null
        }
        Insert: {
          capacity_change_mmbf?: number | null
          capex_amount?: number | null
          capex_per_mbf?: number | null
          competitor_id?: string | null
          created_at?: string
          event_date: string
          event_description?: string | null
          event_type: string
          id?: string
          location?: string | null
          mill_name?: string | null
          source_document?: string | null
          strategic_rationale?: string | null
        }
        Update: {
          capacity_change_mmbf?: number | null
          capex_amount?: number | null
          capex_per_mbf?: number | null
          competitor_id?: string | null
          created_at?: string
          event_date?: string
          event_description?: string | null
          event_type?: string
          id?: string
          location?: string | null
          mill_name?: string | null
          source_document?: string | null
          strategic_rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_capacity_events_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "lumber_competitors"
            referencedColumns: ["id"]
          },
        ]
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
      esg_metrics: {
        Row: {
          carbon_footprint_tons: number | null
          community_acceptance_score: number | null
          compliance_score: number | null
          created_at: string
          environmental_incidents: number | null
          facility_id: string | null
          id: string
          local_employment_percent: number | null
          osha_recordable_rate: number | null
          permit_status: string
          permit_type: string
          renewable_energy_percent: number | null
          reporting_date: string
          sustainable_forestry_certification: string | null
          waste_diversion_percent: number | null
          water_usage_gallons: number | null
          workforce_headcount: number | null
        }
        Insert: {
          carbon_footprint_tons?: number | null
          community_acceptance_score?: number | null
          compliance_score?: number | null
          created_at?: string
          environmental_incidents?: number | null
          facility_id?: string | null
          id?: string
          local_employment_percent?: number | null
          osha_recordable_rate?: number | null
          permit_status: string
          permit_type: string
          renewable_energy_percent?: number | null
          reporting_date: string
          sustainable_forestry_certification?: string | null
          waste_diversion_percent?: number | null
          water_usage_gallons?: number | null
          workforce_headcount?: number | null
        }
        Update: {
          carbon_footprint_tons?: number | null
          community_acceptance_score?: number | null
          compliance_score?: number | null
          created_at?: string
          environmental_incidents?: number | null
          facility_id?: string | null
          id?: string
          local_employment_percent?: number | null
          osha_recordable_rate?: number | null
          permit_status?: string
          permit_type?: string
          renewable_energy_percent?: number | null
          reporting_date?: string
          sustainable_forestry_certification?: string | null
          waste_diversion_percent?: number | null
          water_usage_gallons?: number | null
          workforce_headcount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_metrics_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "mill_configurations"
            referencedColumns: ["id"]
          },
        ]
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
      hedging_positions: {
        Row: {
          contract_duration_months: number | null
          contract_price: number | null
          contract_volume_mbf: number | null
          counterparty: string | null
          created_at: string
          hedge_effectiveness: number | null
          hedge_ratio_percent: number | null
          id: string
          instrument_type: string
          margin_requirement: number | null
          mark_to_market_pnl: number | null
          market_price: number | null
          position_date: string
          scenario_protection: string | null
          underlying_commodity: string
        }
        Insert: {
          contract_duration_months?: number | null
          contract_price?: number | null
          contract_volume_mbf?: number | null
          counterparty?: string | null
          created_at?: string
          hedge_effectiveness?: number | null
          hedge_ratio_percent?: number | null
          id?: string
          instrument_type: string
          margin_requirement?: number | null
          mark_to_market_pnl?: number | null
          market_price?: number | null
          position_date: string
          scenario_protection?: string | null
          underlying_commodity: string
        }
        Update: {
          contract_duration_months?: number | null
          contract_price?: number | null
          contract_volume_mbf?: number | null
          counterparty?: string | null
          created_at?: string
          hedge_effectiveness?: number | null
          hedge_ratio_percent?: number | null
          id?: string
          instrument_type?: string
          margin_requirement?: number | null
          mark_to_market_pnl?: number | null
          market_price?: number | null
          position_date?: string
          scenario_protection?: string | null
          underlying_commodity?: string
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
      lumber_competitors: {
        Row: {
          company_name: string
          company_symbol: string | null
          created_at: string
          geographic_focus: string[] | null
          id: string
          na_capacity_bbft: number | null
          primary_products: string[] | null
          ranking_na: number | null
          ranking_us: number | null
          scope: string
          updated_at: string
          us_capacity_bbft: number | null
        }
        Insert: {
          company_name: string
          company_symbol?: string | null
          created_at?: string
          geographic_focus?: string[] | null
          id?: string
          na_capacity_bbft?: number | null
          primary_products?: string[] | null
          ranking_na?: number | null
          ranking_us?: number | null
          scope: string
          updated_at?: string
          us_capacity_bbft?: number | null
        }
        Update: {
          company_name?: string
          company_symbol?: string | null
          created_at?: string
          geographic_focus?: string[] | null
          id?: string
          na_capacity_bbft?: number | null
          primary_products?: string[] | null
          ranking_na?: number | null
          ranking_us?: number | null
          scope?: string
          updated_at?: string
          us_capacity_bbft?: number | null
        }
        Relationships: []
      }
      lumber_market_data: {
        Row: {
          created_at: string
          data_date: string
          demand_volume: number | null
          exports_volume: number | null
          futures_price: number | null
          id: string
          imports_volume: number | null
          inventory_levels: number | null
          lumber_grade: string | null
          lumber_price_usd: number | null
          market_region: string | null
          production_capacity: number | null
          supply_volume: number | null
        }
        Insert: {
          created_at?: string
          data_date: string
          demand_volume?: number | null
          exports_volume?: number | null
          futures_price?: number | null
          id?: string
          imports_volume?: number | null
          inventory_levels?: number | null
          lumber_grade?: string | null
          lumber_price_usd?: number | null
          market_region?: string | null
          production_capacity?: number | null
          supply_volume?: number | null
        }
        Update: {
          created_at?: string
          data_date?: string
          demand_volume?: number | null
          exports_volume?: number | null
          futures_price?: number | null
          id?: string
          imports_volume?: number | null
          inventory_levels?: number | null
          lumber_grade?: string | null
          lumber_price_usd?: number | null
          market_region?: string | null
          production_capacity?: number | null
          supply_volume?: number | null
        }
        Relationships: []
      }
      lumber_pricing_scenarios: {
        Row: {
          confidence_interval_lower: number | null
          confidence_interval_upper: number | null
          created_at: string
          dimensional_lumber_price: number | null
          ewp_price: number | null
          housing_starts_forecast: number | null
          id: string
          mortgage_rate_forecast: number | null
          osb_price: number | null
          ppi_lumber_index: number | null
          probability_weight: number | null
          random_lengths_price: number | null
          scenario_date: string
          scenario_type: string
          tariff_rate_cad: number | null
        }
        Insert: {
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
          created_at?: string
          dimensional_lumber_price?: number | null
          ewp_price?: number | null
          housing_starts_forecast?: number | null
          id?: string
          mortgage_rate_forecast?: number | null
          osb_price?: number | null
          ppi_lumber_index?: number | null
          probability_weight?: number | null
          random_lengths_price?: number | null
          scenario_date: string
          scenario_type: string
          tariff_rate_cad?: number | null
        }
        Update: {
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
          created_at?: string
          dimensional_lumber_price?: number | null
          ewp_price?: number | null
          housing_starts_forecast?: number | null
          id?: string
          mortgage_rate_forecast?: number | null
          osb_price?: number | null
          ppi_lumber_index?: number | null
          probability_weight?: number | null
          random_lengths_price?: number | null
          scenario_date?: string
          scenario_type?: string
          tariff_rate_cad?: number | null
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
      mill_configurations: {
        Row: {
          ai_log_scanning: boolean | null
          capacity_mmbf: number
          chip_recovery_rate: number | null
          continuous_dry_kilns: boolean | null
          created_at: string
          curve_sawing_enabled: boolean | null
          environmental_permits: Json | null
          id: string
          kiln_capacity_mmbf: number | null
          location: string
          log_class_mix: Json | null
          lumber_recovery_rate: number | null
          mill_name: string
          operating_cost_per_mbf: number | null
          owner_company: string | null
          planer_capacity_mmbf: number | null
          predictive_maintenance: boolean | null
          product_mix: Json | null
          recovery_rate_percent: number | null
          residue_monetization: Json | null
          sawdust_recovery_rate: number | null
          updated_at: string
          uptime_percent: number | null
        }
        Insert: {
          ai_log_scanning?: boolean | null
          capacity_mmbf: number
          chip_recovery_rate?: number | null
          continuous_dry_kilns?: boolean | null
          created_at?: string
          curve_sawing_enabled?: boolean | null
          environmental_permits?: Json | null
          id?: string
          kiln_capacity_mmbf?: number | null
          location: string
          log_class_mix?: Json | null
          lumber_recovery_rate?: number | null
          mill_name: string
          operating_cost_per_mbf?: number | null
          owner_company?: string | null
          planer_capacity_mmbf?: number | null
          predictive_maintenance?: boolean | null
          product_mix?: Json | null
          recovery_rate_percent?: number | null
          residue_monetization?: Json | null
          sawdust_recovery_rate?: number | null
          updated_at?: string
          uptime_percent?: number | null
        }
        Update: {
          ai_log_scanning?: boolean | null
          capacity_mmbf?: number
          chip_recovery_rate?: number | null
          continuous_dry_kilns?: boolean | null
          created_at?: string
          curve_sawing_enabled?: boolean | null
          environmental_permits?: Json | null
          id?: string
          kiln_capacity_mmbf?: number | null
          location?: string
          log_class_mix?: Json | null
          lumber_recovery_rate?: number | null
          mill_name?: string
          operating_cost_per_mbf?: number | null
          owner_company?: string | null
          planer_capacity_mmbf?: number | null
          predictive_maintenance?: boolean | null
          product_mix?: Json | null
          recovery_rate_percent?: number | null
          residue_monetization?: Json | null
          sawdust_recovery_rate?: number | null
          updated_at?: string
          uptime_percent?: number | null
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
      playlist_tracks: {
        Row: {
          added_date: string | null
          id: number
          playlist_id: number | null
          position: number
          track_id: number | null
        }
        Insert: {
          added_date?: string | null
          id?: number
          playlist_id?: number | null
          position: number
          track_id?: number | null
        }
        Update: {
          added_date?: string | null
          id?: number
          playlist_id?: number | null
          position?: number
          track_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_date: string | null
          description: string | null
          id: number
          name: string
          track_count: number | null
        }
        Insert: {
          created_date?: string | null
          description?: string | null
          id?: number
          name: string
          track_count?: number | null
        }
        Update: {
          created_date?: string | null
          description?: string | null
          id?: number
          name?: string
          track_count?: number | null
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
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
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
      timber_inventory: {
        Row: {
          annual_growth_mbf: number | null
          annual_removals_mbf: number | null
          county: string | null
          created_at: string
          delivered_log_cost_per_mbf: number | null
          haul_radius_miles: number | null
          id: string
          inventory_date: string
          permit_timeline_months: number | null
          port_access: boolean | null
          rail_access: boolean | null
          region: string
          species_group: string
          standing_volume_mbf: number | null
          state_province: string | null
          sustainability_rating: string | null
        }
        Insert: {
          annual_growth_mbf?: number | null
          annual_removals_mbf?: number | null
          county?: string | null
          created_at?: string
          delivered_log_cost_per_mbf?: number | null
          haul_radius_miles?: number | null
          id?: string
          inventory_date: string
          permit_timeline_months?: number | null
          port_access?: boolean | null
          rail_access?: boolean | null
          region: string
          species_group: string
          standing_volume_mbf?: number | null
          state_province?: string | null
          sustainability_rating?: string | null
        }
        Update: {
          annual_growth_mbf?: number | null
          annual_removals_mbf?: number | null
          county?: string | null
          created_at?: string
          delivered_log_cost_per_mbf?: number | null
          haul_radius_miles?: number | null
          id?: string
          inventory_date?: string
          permit_timeline_months?: number | null
          port_access?: boolean | null
          rail_access?: boolean | null
          region?: string
          species_group?: string
          standing_volume_mbf?: number | null
          state_province?: string | null
          sustainability_rating?: string | null
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
      tracks: {
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
          id: string
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
          title: string
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
          id?: string
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
          title: string
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
          id?: string
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
          title?: string
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
      user_favorites: {
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
      weather_data: {
        Row: {
          country: string | null
          created_at: string
          drought_index: number | null
          extreme_weather_events: string[] | null
          growing_season_length: number | null
          humidity_percent: number | null
          id: string
          location: string
          measurement_date: string
          rainfall_mm: number | null
          region: string | null
          temperature_avg: number | null
          temperature_max: number | null
          temperature_min: number | null
          wind_speed: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          drought_index?: number | null
          extreme_weather_events?: string[] | null
          growing_season_length?: number | null
          humidity_percent?: number | null
          id?: string
          location: string
          measurement_date: string
          rainfall_mm?: number | null
          region?: string | null
          temperature_avg?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          wind_speed?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string
          drought_index?: number | null
          extreme_weather_events?: string[] | null
          growing_season_length?: number | null
          humidity_percent?: number | null
          id?: string
          location?: string
          measurement_date?: string
          rainfall_mm?: number | null
          region?: string | null
          temperature_avg?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      my_favorites: {
        Row: {
          created_at: string | null
          id: string | null
          track_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          track_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          track_id?: number | null
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
          client_ip: unknown | null
          cmd_type: number | null
          cmd_type_text: string | null
          comments: string | null
          cpu_sys_time: number | null
          cpu_user_time: number | null
          datname: string | null
          dbid: unknown | null
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
          userid: unknown | null
          username: string | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_playlists: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      decode_error_level: {
        Args: { elevel: number }
        Returns: string
      }
      find_broken_tracks: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          issue: string
          storage_bucket: string
          storage_key: string
          title: string
        }[]
      }
      find_cross_bucket_candidates: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_bucket: string
          storage_key: string
          suggested_bucket: string
          title: string
          track_id: string
        }[]
      }
      get_camelot_neighbors: {
        Args: { input_camelot: string }
        Returns: string[]
      }
      get_cmd_type: {
        Args: { cmd_type: number }
        Returns: string
      }
      get_histogram_timings: {
        Args: Record<PropertyKey, never>
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
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
      mark_likely_missing_tracks: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_track_as_missing: {
        Args: { error_message?: string; track_uuid: string }
        Returns: undefined
      }
      pg_stat_monitor_internal: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_monitor_reset: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      pg_stat_monitor_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      pgsm_create_11_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      pgsm_create_13_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      pgsm_create_14_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      pgsm_create_15_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      pgsm_create_17_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      pgsm_create_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      range: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      update_track_bucket: {
        Args: { new_bucket: string; track_id: string }
        Returns: boolean
      }
      verify_all_tracks: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_corrections: number
          now_working: number
          still_missing: number
          total_checked: number
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator" | "premium_user" | "user"
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
      app_role: ["super_admin", "admin", "moderator", "premium_user", "user"],
    },
  },
} as const
