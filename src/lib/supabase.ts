import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 業務總覽資料
export const getBusinessSummary = async () => {
  const { data, error } = await supabase.rpc('get_business_summary')
  
  if (error) {
    console.error('Error fetching business summary:', error)
    return null
  }
  
  return data
}

// 彈性資料查詢
export const getWavedanceData = async (viewName: string, limit: number | null = null) => {
  const { data, error } = await supabase.rpc('get_wavedance_data', {
    view_name: viewName,
    limit_count: limit
  })
  
  if (error) {
    console.error(`Error fetching ${viewName} data:`, error)
    return null
  }
  
  return data
}

// 日期範圍查詢
export const getRevenueByPeriod = async (startDate: string, endDate: string, region: string | null = null) => {
  const { data, error } = await supabase.rpc('get_revenue_by_period', {
    start_date: startDate,
    end_date: endDate,
    region_filter: region
  })
  
  if (error) {
    console.error('Error fetching revenue by period:', error)
    return null
  }
  
  return data
}