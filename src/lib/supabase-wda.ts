import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://urryrxlzyepwklzwwxwa.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycnlyeGx6eWVwd2tsend3eHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODI1NTUsImV4cCI6MjA2NDM1ODU1NX0.MpP8LQloERRtMzrXwfmuKcPagsxOOkJlBsUjSFocvPI'

export const supabaseWDA = createClient(supabaseUrl, supabaseKey)

// 取得活動詳情
export async function getWDAEventDetail(eventCode: string) {
  const { data, error } = await supabaseWDA.rpc('wavedanceasia_get_event_detail', {
    p_event_code: eventCode
  })
  if (error) throw error
  return data
}

// 取得活動列表
export async function getWDAEvents(filters?: {
  eventType?: string
  isActive?: boolean
  hasSlots?: boolean
  startDate?: string
  limit?: number
  offset?: number
}) {
  const { data, error } = await supabaseWDA.rpc('wavedanceasia_get_events', {
    p_event_type: filters?.eventType,
    p_is_active: filters?.isActive,
    p_has_slots: filters?.hasSlots,
    p_start_date: filters?.startDate,
    p_limit: filters?.limit,
    p_offset: filters?.offset
  })
  if (error) throw error
  return data
}

// 建立報名 (v2 版本 - 自動同步客戶資料)
export async function createWDARegistration(registrationData: {
  eventId: number
  participantName: string
  participantEmail: string
  participantPhone?: string
  instagramHandle?: string
  ticketType?: string
  paymentMethod?: string
  participantCount?: number
  transferAmount?: string
  transferLastFive?: string
  dietaryRestrictions?: string
  emergencyContact?: string
  emergencyPhone?: string
  customFields?: Record<string, unknown>
  notes?: string
}) {
  const { data, error } = await supabaseWDA.rpc('wavedanceasia_create_registration_v2', {
    p_event_id: registrationData.eventId,
    p_participant_name: registrationData.participantName,
    p_participant_email: registrationData.participantEmail,
    p_participant_phone: registrationData.participantPhone,
    p_instagram_handle: registrationData.instagramHandle,
    p_ticket_type: registrationData.ticketType || 'standard',
    p_payment_method: registrationData.paymentMethod || 'transfer',
    p_dietary_restrictions: registrationData.dietaryRestrictions,
    p_emergency_contact: registrationData.emergencyContact,
    p_emergency_phone: registrationData.emergencyPhone,
    p_custom_fields: {
      ...registrationData.customFields,
      participant_count: registrationData.participantCount,
      transfer_amount: registrationData.transferAmount,
      transfer_last_five: registrationData.transferLastFive
    },
    p_notes: registrationData.notes
  })
  if (error) throw error
  return data
}

// 確保 Coffee Party 活動存在
export async function ensureCoffeePartyExists() {
  const { data, error } = await supabaseWDA.rpc('wavedanceasia_upsert_event', {
    p_event_code: 'COFFEE-2025-0726',
    p_event_name: 'Coffee Party in Wavedance',
    p_event_type: 'coffee_party',
    p_location: '浪花舞往海邊藝文聚落｜261宜蘭縣頭城鎮演海路二段405號',
    p_start_date: '2025-07-26',
    p_start_time: '08:30:00',
    p_max_participants: 50,
    p_price_config: {
      default: 300,
      early_bird: 300,
      onsite: 400
    },
    p_description: '週六早晨咖啡派對，DJ Louis 現場演出。來點音樂、來點咖啡、來點 chill。',
    p_included_items: ['咖啡一杯', '麵包一份', 'DJ音樂表演'],
    p_custom_fields: {
      dj_name: 'DJ Louis (Wolfie)',
      dj_description: 'A healer. A pioneer. A lover. A DJ. A pilot in the making.',
      bank_account: {
        bank: '國泰世華銀行 (宜蘭分行)',
        code: '013',
        account: '105035006962',
        name: '浪花舞號王思敏'
      }
    }
  })
  if (error) throw error
  return data
}