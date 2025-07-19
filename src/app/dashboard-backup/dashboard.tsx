'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MetricCard from '../../components/MetricCard'
import RevenueChart from '../../components/RevenueChart'
import { getBusinessSummary, getWavedanceData } from '../../lib/supabase'

interface BusinessSummary {
  total_customers: number
  active_inquiries: number
  monthly_revenue: number
  inventory_value: number
  taiwan_revenue: number
  overseas_revenue: number
}

interface ConversionFunnelData {
  inquiry_status: string
  count: number
  percentage: number
}

export default function Home() {
  const router = useRouter()
  const [businessData, setBusinessData] = useState<BusinessSummary | null>(null)
  const [conversionData, setConversionData] = useState<ConversionFunnelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 取得業務總覽資料
        const summaryData = await getBusinessSummary()
        if (summaryData) {
          setBusinessData(summaryData)
        }
        
        // 取得轉換漏斗資料
        const funnelData = await getWavedanceData('conversion_funnel')
        if (funnelData && Array.isArray(funnelData)) {
          setConversionData(funnelData)
        }
        
      } catch (err) {
        console.error('資料載入失敗:', err)
        setError('資料載入失敗，請稍後重試')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 計算台灣vs海外收入百分比
  const getTaiwanPercentage = () => {
    if (!businessData) return 0
    const total = businessData.taiwan_revenue + businessData.overseas_revenue
    return total > 0 ? Math.round((businessData.taiwan_revenue / total) * 100) : 0
  }

  const getOverseasPercentage = () => {
    if (!businessData) return 0
    const total = businessData.taiwan_revenue + businessData.overseas_revenue
    return total > 0 ? Math.round((businessData.overseas_revenue / total) * 100) : 0
  }

  // 格式化金額
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-ocean-deep text-lg">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sand-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-coral-pink text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-warm">
      {/* Header */}
      <header className="bg-ocean-deep text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌊</span>
            <h1 className="text-2xl font-bold">Wavedance 經營儀表板</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#overview" className="hover:text-wave-teal transition-colors">總覽</a>
            <a href="#revenue" className="hover:text-wave-teal transition-colors">收入分析</a>
            <a href="#customers" className="hover:text-wave-teal transition-colors">客戶分析</a>
            <a href="#inventory" className="hover:text-wave-teal transition-colors">商品管理</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="總客戶數" 
            value={businessData?.total_customers.toString() || '0'} 
            trend="實時數據" 
            icon="👥"
            trendDirection="up"
            onClick={() => router.push('/customer-details')}
          />
          <MetricCard 
            title="活躍詢問" 
            value={businessData?.active_inquiries.toString() || '0'} 
            trend="進行中詢問" 
            icon="💬"
            trendDirection="up"
            onClick={() => router.push('/customer-details')}
          />
          <MetricCard 
            title="本月收入" 
            value={formatAmount(businessData?.monthly_revenue || 0)} 
            trend="本月累計" 
            icon="💰"
            trendDirection="up"
            onClick={() => router.push('/revenue-details')}
          />
          <MetricCard 
            title="庫存價值" 
            value={formatAmount(businessData?.inventory_value || 0)} 
            trend="健康狀態" 
            icon="📦"
            trendDirection="neutral"
            onClick={() => router.push('/inventory-details')}
          />
        </section>

        {/* Main Chart Area */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ocean-deep flex items-center">
              <span className="mr-2">🌊</span>
              收入趨勢 - 如海浪般起伏
            </h2>
          </div>
          <div className="bg-white rounded-xl p-4">
            <RevenueChart />
          </div>
        </section>

        {/* Secondary Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 台灣 vs 海外收入對比 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
            <h3 className="text-lg font-bold text-ocean-deep mb-4 flex items-center">
              <span className="mr-2">🌏</span>
              台灣 vs 海外收入
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-primary">台灣</span>
                <span className="text-ocean-deep font-semibold">
                  {getTaiwanPercentage()}% ({formatAmount(businessData?.taiwan_revenue || 0)})
                </span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-3">
                <div 
                  className="bg-wave-teal h-3 rounded-full transition-all duration-500" 
                  style={{width: `${getTaiwanPercentage()}%`}}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-primary">海外</span>
                <span className="text-ocean-deep font-semibold">
                  {getOverseasPercentage()}% ({formatAmount(businessData?.overseas_revenue || 0)})
                </span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-3">
                <div 
                  className="bg-ocean-blue h-3 rounded-full transition-all duration-500" 
                  style={{width: `${getOverseasPercentage()}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* 客戶轉換漏斗 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
            <h3 className="text-lg font-bold text-ocean-deep mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              客戶轉換漏斗
            </h3>
            <div className="space-y-3">
              {conversionData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary">{item.inquiry_status}</span>
                    <span className="text-ocean-deep font-semibold">
                      {item.count}人 ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-sand-light rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-sunset-gold' : 
                        index === 1 ? 'bg-wave-teal' : 'bg-ocean-blue'
                      }`}
                      style={{width: `${item.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部資訊 */}
        <section className="text-center py-8">
          <p className="text-text-primary text-sm">
            🏄‍♂️ 準備好迎接數據浪潮了嗎？讓我們一起在數據海洋中衝浪！
          </p>
        </section>
      </main>
    </div>
  );
}