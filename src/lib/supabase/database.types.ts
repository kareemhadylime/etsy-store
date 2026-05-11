// GENERATED FILE — DO NOT EDIT BY HAND.
//
// Source:    Supabase project `ronfbjpqyhxipnitxrif` (production schema).
// Generator: `supabase gen types typescript --project-id ronfbjpqyhxipnitxrif`,
//            invoked via the Supabase MCP `generate_typescript_types` tool.
//
// Current integration status (2026-05-11):
//   Reference artefact only. NOT YET wired into `service.ts`'s
//   `SupabaseClient<>` generic because the 19 callsites that use
//   `asTable<T>(client, name: string)` would fail to typecheck —
//   `SupabaseClient<Database>.from()` requires literal table names.
//
//   This file's immediate value is:
//     - ground truth for table/column shapes that grep / IDE can walk
//     - source for hand-rolled types in `types.ts` (which add domain
//       narrowing — e.g. `status: 'draft' | 'live'` instead of `string`)
//     - drift signal: if regeneration produces different output than
//       what's committed, the schema has changed
//
// Regeneration workflow after a migration lands:
//   1. Apply the migration to Supabase (via MCP `apply_migration` or
//      the SQL Editor).
//   2. Re-invoke the MCP `generate_typescript_types` tool, or run
//      `npx supabase gen types typescript --project-id ronfbjpqyhxipnitxrif`.
//   3. Replace the body of this file with the new output.
//   4. Run `npm run lint && npm test && npm run build` to surface any
//      hand-rolled type in `types.ts` that's now out of sync.
//
// Future ship: migrate the 19 `asTable<T>(client, name)` callsites to
// `client.from('exact_name')` and switch `service.ts`'s Service type
// from `SupabaseClient<Record<string,never>>` to `SupabaseClient<Database>`.
// That gives every .insert/.update/.upsert payload schema-checked types.
//
// See `docs/deployment-runbook.md` section 2 → "Apply migrations".

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          account_id: string
          budget_daily: number | null
          created_at: string
          currency: string | null
          external_id: string
          id: string
          name: string
          objective: string | null
          platform: string
          product_id: string | null
          raw_payload: Json | null
          source_created_at: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          budget_daily?: number | null
          created_at?: string
          currency?: string | null
          external_id: string
          id?: string
          name: string
          objective?: string | null
          platform: string
          product_id?: string | null
          raw_payload?: Json | null
          source_created_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          budget_daily?: number | null
          created_at?: string
          currency?: string | null
          external_id?: string
          id?: string
          name?: string
          objective?: string | null
          platform?: string
          product_id?: string | null
          raw_payload?: Json | null
          source_created_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_commands: {
        Row: {
          attempts: number
          command_type: string
          completed_at: string | null
          external_campaign_id: string
          id: string
          last_error: string | null
          payload: Json | null
          platform: string
          requested_at: string
          requested_by: string | null
          status: string
        }
        Insert: {
          attempts?: number
          command_type: string
          completed_at?: string | null
          external_campaign_id: string
          id?: string
          last_error?: string | null
          payload?: Json | null
          platform: string
          requested_at?: string
          requested_by?: string | null
          status?: string
        }
        Update: {
          attempts?: number
          command_type?: string
          completed_at?: string | null
          external_campaign_id?: string
          id?: string
          last_error?: string | null
          payload?: Json | null
          platform?: string
          requested_at?: string
          requested_by?: string | null
          status?: string
        }
        Relationships: []
      }
      ad_creative_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string
          creative_id: string
          external_ad_id: string | null
          external_campaign_id: string
          id: string
          last_error: string | null
          platform: string
          status: string
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string
          creative_id: string
          external_ad_id?: string | null
          external_campaign_id: string
          id?: string
          last_error?: string | null
          platform: string
          status?: string
        }
        Update: {
          assigned_at?: string | null
          created_at?: string
          creative_id?: string
          external_ad_id?: string | null
          external_campaign_id?: string
          id?: string
          last_error?: string | null
          platform?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_creative_assignments_creative_id_fkey"
            columns: ["creative_id"]
            isOneToOne: false
            referencedRelation: "ad_creatives"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_creatives: {
        Row: {
          ai_job_id: string | null
          approved_at: string | null
          approved_by: string | null
          atom_id: string | null
          copy: string | null
          created_at: string
          created_by: string | null
          format: string
          headline: string | null
          id: string
          image_prompt: string | null
          image_url: string | null
          platform: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_job_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atom_id?: string | null
          copy?: string | null
          created_at?: string
          created_by?: string | null
          format: string
          headline?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_job_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atom_id?: string | null
          copy?: string | null
          created_at?: string
          created_by?: string | null
          format?: string
          headline?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_creatives_ai_job_id_fkey"
            columns: ["ai_job_id"]
            isOneToOne: false
            referencedRelation: "ai_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_creatives_atom_id_fkey"
            columns: ["atom_id"]
            isOneToOne: false
            referencedRelation: "content_atoms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_creatives_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_metrics_daily: {
        Row: {
          campaign_id: string | null
          clicks: number
          conversions: number
          created_at: string
          currency: string | null
          date: string
          external_campaign_id: string
          id: string
          impressions: number
          platform: string
          raw_payload: Json | null
          revenue: number
          spend: number
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          created_at?: string
          currency?: string | null
          date: string
          external_campaign_id: string
          id?: string
          impressions?: number
          platform: string
          raw_payload?: Json | null
          revenue?: number
          spend?: number
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          created_at?: string
          currency?: string | null
          date?: string
          external_campaign_id?: string
          id?: string
          impressions?: number
          platform?: string
          raw_payload?: Json | null
          revenue?: number
          spend?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_metrics_daily_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_jobs: {
        Row: {
          cost_usd: number | null
          created_at: string
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          input: Json
          input_tokens: number | null
          model: string
          output_tokens: number | null
          product_id: string | null
          prompt_template_id: string | null
          raw_response: Json | null
          started_at: string
          status: string
          type: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input: Json
          input_tokens?: number | null
          model: string
          output_tokens?: number | null
          product_id?: string | null
          prompt_template_id?: string | null
          raw_response?: Json | null
          started_at?: string
          status?: string
          type: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json
          input_tokens?: number | null
          model?: string
          output_tokens?: number | null
          product_id?: string | null
          prompt_template_id?: string | null
          raw_response?: Json | null
          started_at?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_jobs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_outputs: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          id: string
          job_id: string
          output_json: Json | null
          output_text: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          id?: string
          job_id: string
          output_json?: Json | null
          output_text?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          id?: string
          job_id?: string
          output_json?: Json | null
          output_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_outputs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "ai_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_daily: {
        Row: {
          ad_spend: number | null
          channel: string
          clicks: number | null
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          impressions: number | null
          raw_data: Json | null
          revenue: number | null
          sessions: number | null
        }
        Insert: {
          ad_spend?: number | null
          channel: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          impressions?: number | null
          raw_data?: Json | null
          revenue?: number | null
          sessions?: number | null
        }
        Update: {
          ad_spend?: number | null
          channel?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          impressions?: number | null
          raw_data?: Json | null
          revenue?: number | null
          sessions?: number | null
        }
        Relationships: []
      }
      bundle_products: {
        Row: {
          bundle_id: string
          id: string
          product_id: string
        }
        Insert: {
          bundle_id: string
          id?: string
          product_id: string
        }
        Update: {
          bundle_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      content_atoms: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          key_message: string | null
          status: string
          target_product_id: string | null
          title: string
          tone: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          key_message?: string | null
          status?: string
          target_product_id?: string | null
          title: string
          tone?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          key_message?: string | null
          status?: string
          target_product_id?: string | null
          title?: string
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_atoms_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      content_renditions: {
        Row: {
          ai_job_id: string | null
          approved_at: string | null
          approved_by: string | null
          atom_id: string
          copy: string
          created_at: string
          id: string
          image_prompt: string | null
          image_url: string | null
          platform: string
          raw_payload: Json | null
          schedule_at: string | null
          status: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ai_job_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atom_id: string
          copy: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform: string
          raw_payload?: Json | null
          schedule_at?: string | null
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ai_job_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atom_id?: string
          copy?: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform?: string
          raw_payload?: Json | null
          schedule_at?: string | null
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_renditions_ai_job_id_fkey"
            columns: ["ai_job_id"]
            isOneToOne: false
            referencedRelation: "ai_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_renditions_atom_id_fkey"
            columns: ["atom_id"]
            isOneToOne: false
            referencedRelation: "content_atoms"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_events: {
        Row: {
          created_at: string | null
          currency: string | null
          email_hash: string | null
          event_id: string | null
          event_type: string
          ga4_response: Json | null
          id: string
          ip_address: string | null
          meta_response: Json | null
          product_id: string | null
          retry_count: number | null
          sent_at: string | null
          sent_to_ga4: boolean | null
          sent_to_meta: boolean | null
          sent_to_tiktok: boolean | null
          source_platform: string | null
          tiktok_response: Json | null
          user_agent: string | null
          user_hash: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          email_hash?: string | null
          event_id?: string | null
          event_type: string
          ga4_response?: Json | null
          id?: string
          ip_address?: string | null
          meta_response?: Json | null
          product_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          sent_to_ga4?: boolean | null
          sent_to_meta?: boolean | null
          sent_to_tiktok?: boolean | null
          source_platform?: string | null
          tiktok_response?: Json | null
          user_agent?: string | null
          user_hash?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          email_hash?: string | null
          event_id?: string | null
          event_type?: string
          ga4_response?: Json | null
          id?: string
          ip_address?: string | null
          meta_response?: Json | null
          product_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          sent_to_ga4?: boolean | null
          sent_to_meta?: boolean | null
          sent_to_tiktok?: boolean | null
          source_platform?: string | null
          tiktok_response?: Json | null
          user_agent?: string | null
          user_hash?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cron_runs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          name: string
          raw_log: Json | null
          rows_processed: number | null
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          name: string
          raw_log?: Json | null
          rows_processed?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          name?: string
          raw_log?: Json | null
          rows_processed?: number | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          consent_email: boolean | null
          consent_marketing: boolean | null
          consent_sms: boolean | null
          country: string | null
          created_at: string | null
          email: string
          etsy_buyer_id: string | null
          first_purchase_at: string | null
          id: string
          klaviyo_id: string | null
          language: string | null
          last_seen_at: string | null
          name: string | null
          tags: string[] | null
          total_spend: number | null
          updated_at: string | null
        }
        Insert: {
          consent_email?: boolean | null
          consent_marketing?: boolean | null
          consent_sms?: boolean | null
          country?: string | null
          created_at?: string | null
          email: string
          etsy_buyer_id?: string | null
          first_purchase_at?: string | null
          id?: string
          klaviyo_id?: string | null
          language?: string | null
          last_seen_at?: string | null
          name?: string | null
          tags?: string[] | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Update: {
          consent_email?: boolean | null
          consent_marketing?: boolean | null
          consent_sms?: boolean | null
          country?: string | null
          created_at?: string | null
          email?: string
          etsy_buyer_id?: string | null
          first_purchase_at?: string | null
          id?: string
          klaviyo_id?: string | null
          language?: string | null
          last_seen_at?: string | null
          name?: string | null
          tags?: string[] | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          click_rate: number | null
          created_at: string
          id: string
          klaviyo_campaign_id: string
          name: string
          open_rate: number | null
          raw_payload: Json | null
          revenue_attributed: number
          sent_at: string | null
          sent_count: number
          updated_at: string
        }
        Insert: {
          click_rate?: number | null
          created_at?: string
          id?: string
          klaviyo_campaign_id: string
          name: string
          open_rate?: number | null
          raw_payload?: Json | null
          revenue_attributed?: number
          sent_at?: string | null
          sent_count?: number
          updated_at?: string
        }
        Update: {
          click_rate?: number | null
          created_at?: string
          id?: string
          klaviyo_campaign_id?: string
          name?: string
          open_rate?: number | null
          raw_payload?: Json | null
          revenue_attributed?: number
          sent_at?: string | null
          sent_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string | null
          id: string
          klaviyo_event_id: string
          occurred_at: string
          payload: Json | null
          subscriber_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          klaviyo_event_id: string
          occurred_at: string
          payload?: Json | null
          subscriber_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          klaviyo_event_id?: string
          occurred_at?: string
          payload?: Json | null
          subscriber_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string
          id: string
          klaviyo_profile_id: string | null
          list_id: string | null
          raw_payload: Json | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email: string
          id?: string
          klaviyo_profile_id?: string | null
          list_id?: string | null
          raw_payload?: Json | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string
          id?: string
          klaviyo_profile_id?: string | null
          list_id?: string | null
          raw_payload?: Json | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_subscribers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      etsy_stats: {
        Row: {
          avg_rating: number
          favorites: number
          id: string
          product_id: string
          revenue: number
          reviews_count: number
          sales_count: number
          synced_at: string
          views: number
        }
        Insert: {
          avg_rating?: number
          favorites?: number
          id?: string
          product_id: string
          revenue?: number
          reviews_count?: number
          sales_count?: number
          synced_at?: string
          views?: number
        }
        Update: {
          avg_rating?: number
          favorites?: number
          id?: string
          product_id?: string
          revenue?: number
          reviews_count?: number
          sales_count?: number
          synced_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "etsy_stats_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      fulfillment_logs: {
        Row: {
          created_at: string | null
          expires_at: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          order_id: string
          recipient_email: string | null
          resend_email_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          recipient_email?: string | null
          resend_email_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          recipient_email?: string | null
          resend_email_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fulfillment_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          id: string
          order_id: string
          price: number
          product_file_id: string | null
          product_id: string | null
          quantity: number | null
          tier: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          order_id: string
          price: number
          product_file_id?: string | null
          product_id?: string | null
          quantity?: number | null
          tier?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_file_id?: string | null
          product_id?: string | null
          quantity?: number | null
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_file_id_fkey"
            columns: ["product_file_id"]
            isOneToOne: false
            referencedRelation: "product_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string | null
          customer_id: string | null
          etsy_receipt_id: string
          id: string
          ordered_at: string
          raw_payload: Json | null
          status: string | null
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          etsy_receipt_id: string
          id?: string
          ordered_at: string
          raw_payload?: Json | null
          status?: string | null
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          etsy_receipt_id?: string
          id?: string
          ordered_at?: string
          raw_payload?: Json | null
          status?: string | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_credentials: {
        Row: {
          access_token_encrypted: string
          account_id: string
          account_name: string | null
          created_at: string | null
          encryption_version: string
          expires_at: string | null
          id: string
          last_refreshed_at: string | null
          platform: string
          refresh_token_encrypted: string | null
          scopes: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          access_token_encrypted: string
          account_id: string
          account_name?: string | null
          created_at?: string | null
          encryption_version?: string
          expires_at?: string | null
          id?: string
          last_refreshed_at?: string | null
          platform: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token_encrypted?: string
          account_id?: string
          account_name?: string | null
          created_at?: string | null
          encryption_version?: string
          expires_at?: string | null
          id?: string
          last_refreshed_at?: string | null
          platform?: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_files: {
        Row: {
          created_at: string
          format: string
          id: string
          label: string
          product_id: string
          tier: string
          url: string
          version: string
        }
        Insert: {
          created_at?: string
          format: string
          id?: string
          label: string
          product_id: string
          tier: string
          url: string
          version?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          label?: string
          product_id?: string
          tier?: string
          url?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          etsy_listing_id: string | null
          etsy_url: string | null
          id: string
          name: string
          price: number
          price_ai: number | null
          price_essentials: number | null
          price_pro: number | null
          slug: string
          status: string
          tab_count: number | null
          type: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          etsy_listing_id?: string | null
          etsy_url?: string | null
          id?: string
          name: string
          price?: number
          price_ai?: number | null
          price_essentials?: number | null
          price_pro?: number | null
          slug: string
          status?: string
          tab_count?: number | null
          type: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          etsy_listing_id?: string | null
          etsy_url?: string | null
          id?: string
          name?: string
          price?: number
          price_ai?: number | null
          price_essentials?: number | null
          price_pro?: number | null
          slug?: string
          status?: string
          tab_count?: number | null
          type?: string
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          active: boolean
          created_at: string
          id: string
          model: string | null
          name: string
          template: string
          type: string
          updated_at: string
          variables_json: Json | null
          version: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          model?: string | null
          name: string
          template: string
          type: string
          updated_at?: string
          variables_json?: Json | null
          version?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          model?: string | null
          name?: string
          template?: string
          type?: string
          updated_at?: string
          variables_json?: Json | null
          version?: string
        }
        Relationships: []
      }
      published_posts: {
        Row: {
          created_at: string
          id: string
          platform: string
          platform_post_id: string
          platform_post_url: string | null
          posted_at: string
          raw_response: Json | null
          rendition_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          platform_post_id: string
          platform_post_url?: string | null
          posted_at?: string
          raw_response?: Json | null
          rendition_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          platform_post_id?: string
          platform_post_url?: string | null
          posted_at?: string
          raw_response?: Json | null
          rendition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_posts_rendition_id_fkey"
            columns: ["rendition_id"]
            isOneToOne: false
            referencedRelation: "content_renditions"
            referencedColumns: ["id"]
          },
        ]
      }
      publishing_queue: {
        Row: {
          attempts: number
          created_at: string
          id: string
          last_attempted_at: string | null
          last_error: string | null
          rendition_id: string
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          last_attempted_at?: string | null
          last_error?: string | null
          rendition_id: string
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          last_attempted_at?: string | null
          last_error?: string | null
          rendition_id?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publishing_queue_rendition_id_fkey"
            columns: ["rendition_id"]
            isOneToOne: false
            referencedRelation: "content_renditions"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_buckets: {
        Row: {
          count: number
          created_at: string
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          created_at?: string
          key: string
          window_start: string
        }
        Update: {
          count?: number
          created_at?: string
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          body: string
          created_at: string
          id: string
          posted_at: string | null
          review_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          posted_at?: string | null
          review_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          posted_at?: string | null
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          alerted_at: string | null
          created_at: string
          id: string
          language: string | null
          listing_id: string | null
          product_id: string | null
          rating: number
          raw_payload: Json | null
          reviewer_buyer_id: string | null
          sentiment: string | null
          sentiment_model: string | null
          sentiment_score: number | null
          source: string
          source_created_at: string
          source_review_id: string
          source_updated_at: string | null
          text: string | null
          updated_at: string
        }
        Insert: {
          alerted_at?: string | null
          created_at?: string
          id?: string
          language?: string | null
          listing_id?: string | null
          product_id?: string | null
          rating: number
          raw_payload?: Json | null
          reviewer_buyer_id?: string | null
          sentiment?: string | null
          sentiment_model?: string | null
          sentiment_score?: number | null
          source: string
          source_created_at: string
          source_review_id: string
          source_updated_at?: string | null
          text?: string | null
          updated_at?: string
        }
        Update: {
          alerted_at?: string | null
          created_at?: string
          id?: string
          language?: string | null
          listing_id?: string | null
          product_id?: string | null
          rating?: number
          raw_payload?: Json | null
          reviewer_buyer_id?: string | null
          sentiment?: string | null
          sentiment_model?: string | null
          sentiment_score?: number | null
          source?: string
          source_created_at?: string
          source_review_id?: string
          source_updated_at?: string | null
          text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          buyer_country: string | null
          etsy_order_id: string | null
          id: string
          product_id: string
          sold_at: string
        }
        Insert: {
          amount: number
          buyer_country?: string | null
          etsy_order_id?: string | null
          id?: string
          product_id: string
          sold_at?: string
        }
        Update: {
          amount?: number
          buyer_country?: string | null
          etsy_order_id?: string | null
          id?: string
          product_id?: string
          sold_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string
          difficulty: number | null
          id: string
          keyword: string
          search_volume: number | null
          target_product_id: string | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          id?: string
          keyword: string
          search_volume?: number | null
          target_product_id?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          id?: string
          keyword?: string
          search_volume?: number | null
          target_product_id?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_keywords_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_rankings_daily: {
        Row: {
          clicks: number
          created_at: string
          ctr: number | null
          date: string
          id: string
          impressions: number
          keyword: string
          position: number | null
          raw_payload: Json | null
          search_engine: string
          updated_at: string
          url: string | null
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number | null
          date: string
          id?: string
          impressions?: number
          keyword: string
          position?: number | null
          raw_payload?: Json | null
          search_engine?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number
          keyword?: string
          position?: number | null
          raw_payload?: Json | null
          search_engine?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
