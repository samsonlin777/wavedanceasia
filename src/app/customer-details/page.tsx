'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWavedanceData } from '../../lib/supabase'

interface ConversionFunnelData {
  inquiry_status: string
  count: number
  percentage: number
}

export default function CustomerDetailsPage() {
  const router = useRouter()
  const [funnelData, setFunnelData] = useState<ConversionFunnelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true)
        
        // 使用轉換漏斗資料
        const data = await getWavedanceData('conversion_funnel')
        
        if (data && Array.isArray(data)) {
          setFunnelData(data)
        }
      } catch (err) {
        console.error('載入客戶資料失敗:', err)
        setError('無法載入客戶資料')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已報名(訂金ok)': return 'bg-wave-teal text-white'
      case '有興趣': return 'bg-sunset-gold text-white'
      case '需要追蹤': return 'bg-coral-pink text-white'
      case '已完成訂購': return 'bg-ocean-blue text-white'
      case '已取消': return 'bg-sand-light text-text-primary'
      default: return 'bg-sand-light text-text-primary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '已報名(訂金ok)': return '✅'
      case '有興趣': return '💡'
      case '需要追蹤': return '📞'
      case '已完成訂購': return '🎉'
      case '已取消': return '❌'
      default: return '❓'
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case '已報名(訂金ok)': return '已確認報名並繳納訂金，等待課程開始'
      case '有興趣': return '對課程表示興趣，但尚未進一步聯繫'
      case '需要追蹤': return '需要銷售團隊主動聯繫追蹤'
      case '已完成訂購': return '已完成整個課程流程'
      case '已取消': return '取消課程報名'
      default: return '未知狀態'
    }
  }

  const getTotalCustomers = () => {
    return funnelData.reduce((sum, item) => sum + item.count, 0)
  }

  const getConversionRate = () => {
    const completed = funnelData.find(item => item.inquiry_status === '已報名(訂金ok)')?.count || 0
    const total = getTotalCustomers()
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-ocean-deep text-lg">載入客戶資料中...</p>
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
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-ocean-blue rounded-lg transition-colors"
            >
              ← 返回
            </button>
            <span className="text-2xl">👥</span>
            <h1 className="text-2xl font-bold">客戶轉換分析</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">總客戶: {getTotalCustomers()}</span>
            <span className="text-sm">轉換率: {getConversionRate()}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-sand-light text-center">
            <div className="text-3xl font-bold text-ocean-deep">{getTotalCustomers()}</div>
            <div className="text-sm text-text-secondary mt-1">總客戶數</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-sand-light text-center">
            <div className="text-3xl font-bold text-wave-teal">{getConversionRate()}%</div>
            <div className="text-sm text-text-secondary mt-1">轉換率</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-sand-light text-center">
            <div className="text-3xl font-bold text-coral-pink">
              {funnelData.find(item => item.inquiry_status === '需要追蹤')?.count || 0}
            </div>
            <div className="text-sm text-text-secondary mt-1">待追蹤</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-sand-light text-center">
            <div className="text-3xl font-bold text-sunset-gold">
              {funnelData.find(item => item.inquiry_status === '已報名(訂金ok)')?.count || 0}
            </div>
            <div className="text-sm text-text-secondary mt-1">已報名</div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl shadow-lg border border-sand-light p-8">
          <h2 className="text-2xl font-bold text-ocean-deep mb-8 text-center">
            🎯 客戶轉換漏斗分析
          </h2>
          
          <div className="space-y-6">
            {funnelData.map((item, index) => (
              <div key={index} className="relative">
                {/* Status Card */}
                <div className="bg-surf-aqua rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getStatusIcon(item.inquiry_status)}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-ocean-deep">
                          {item.inquiry_status}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {getStatusDescription(item.inquiry_status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-ocean-deep">{item.count}</div>
                      <div className="text-sm text-text-secondary">人</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-sand-light rounded-full h-4 mb-2">
                    <div 
                      className="bg-wave-teal h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{width: `${item.percentage}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>佔總數比例</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                </div>

                {/* Arrow */}
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="text-2xl text-ocean-blue">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="mt-8 p-6 bg-surf-aqua rounded-xl">
            <h3 className="text-lg font-semibold text-ocean-deep mb-4">💡 分析洞察</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg">
                <div className="font-semibold text-wave-teal">轉換表現</div>
                <div className="text-text-secondary">
                  {getConversionRate()}% 的客戶成功轉換為付費學員，表現優異
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="font-semibold text-coral-pink">需要關注</div>
                <div className="text-text-secondary">
                  {funnelData.find(item => item.inquiry_status === '需要追蹤')?.count || 0} 位客戶需要主動追蹤
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}