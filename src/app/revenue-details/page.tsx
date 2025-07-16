'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface RevenueRecord {
  id: string
  transaction_date: string
  transaction_type: string
  category: string
  amount: number
  region: string
  description: string
  payment_method: string
  accounting_period: string
  created_at: string
}

export default function RevenueDetailsPage() {
  const router = useRouter()
  const [revenueData, setRevenueData] = useState<RevenueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    const fetchRevenueDetails = async () => {
      try {
        setLoading(true)
        
        // 使用 service role key 直接查詢資料表
        const { data, error } = await supabase
          .from('wavedanceasia.financial_records')
          .select('*')
          .eq('transaction_type', 'income')
          .gte('transaction_date', `${currentMonth}-01`)
          .lte('transaction_date', `${currentMonth}-31`)
          .order('transaction_date', { ascending: false })

        if (error) {
          throw error
        }

        setRevenueData(data || [])
      } catch (err) {
        console.error('載入收入明細失敗:', err)
        setError('無法載入收入明細')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueDetails()
  }, [currentMonth])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '海外團': return 'bg-ocean-blue text-white'
      case '課程': return 'bg-wave-teal text-white'
      case '住宿': return 'bg-sunset-gold text-white'
      case '商品': return 'bg-coral-pink text-white'
      default: return 'bg-sand-light text-text-primary'
    }
  }

  const getRegionFlag = (region: string) => {
    return region === 'taiwan' ? '🇹🇼' : '🌍'
  }

  const getTotalAmount = () => {
    return revenueData.reduce((sum, record) => sum + record.amount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-ocean-deep text-lg">載入收入明細中...</p>
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
            <span className="text-2xl">💰</span>
            <h1 className="text-2xl font-bold">收入明細</h1>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="px-3 py-2 bg-ocean-blue text-white rounded-lg border-none"
            />
            <span className="text-sm">總計: {formatAmount(getTotalAmount())}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-sand-light overflow-hidden">
          {/* Summary Cards */}
          <div className="p-6 border-b border-sand-light">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ocean-deep">{revenueData.length}</div>
                <div className="text-sm text-text-secondary">總交易數</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wave-teal">{formatAmount(getTotalAmount())}</div>
                <div className="text-sm text-text-secondary">總收入</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sunset-gold">
                  {formatAmount(getTotalAmount() / (revenueData.length || 1))}
                </div>
                <div className="text-sm text-text-secondary">平均客單價</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-pink">
                  {revenueData.filter(r => r.region === 'overseas').length}
                </div>
                <div className="text-sm text-text-secondary">海外交易數</div>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surf-aqua">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    類別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    地區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    付款方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    描述
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-light">
                {revenueData.map((record) => (
                  <tr key={record.id} className="hover:bg-surf-aqua hover:bg-opacity-30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {formatDate(record.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(record.category)}`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ocean-deep">
                      {formatAmount(record.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {getRegionFlag(record.region)} {record.region === 'taiwan' ? '台灣' : '海外'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {record.payment_method || '未指定'}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary max-w-xs truncate">
                      {record.description || '無描述'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {revenueData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-text-secondary">該月份沒有收入記錄</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}