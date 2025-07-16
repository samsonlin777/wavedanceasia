'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWavedanceData } from '../../lib/supabase'

interface DailyRevenueData {
  transaction_date: string
  daily_income: number
  daily_expenses: number
  net_income: number
  income_transactions: number
  expense_transactions: number
}

export default function RevenueDetailsPage() {
  const router = useRouter()
  const [revenueData, setRevenueData] = useState<DailyRevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenueDetails = async () => {
      try {
        setLoading(true)
        
        // 使用 daily_revenue 視圖
        const data = await getWavedanceData('daily_revenue', 90) // 最近90天
        
        if (data && Array.isArray(data)) {
          setRevenueData(data)
        }
      } catch (err) {
        console.error('載入收入明細失敗:', err)
        setError('無法載入收入明細')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueDetails()
  }, [])

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

  const getIncomeIcon = (income: number) => {
    if (income > 50000) return '🎉'
    if (income > 20000) return '💰'
    if (income > 5000) return '💵'
    if (income > 0) return '💸'
    return '📊'
  }

  const getIncomeColor = (income: number) => {
    if (income > 50000) return 'text-sunset-gold'
    if (income > 20000) return 'text-wave-teal'
    if (income > 5000) return 'text-ocean-blue'
    if (income > 0) return 'text-text-primary'
    return 'text-text-secondary'
  }

  const getTotalStats = () => {
    return {
      totalIncome: revenueData.reduce((sum, day) => sum + day.daily_income, 0),
      totalExpenses: revenueData.reduce((sum, day) => sum + day.daily_expenses, 0),
      totalNet: revenueData.reduce((sum, day) => sum + day.net_income, 0),
      totalTransactions: revenueData.reduce((sum, day) => sum + day.income_transactions, 0),
      activeDays: revenueData.filter(day => day.daily_income > 0).length
    }
  }

  const stats = getTotalStats()

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
            <h1 className="text-2xl font-bold">收入明細分析</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">總收入: {formatAmount(stats.totalIncome)}</span>
            <span className="text-sm">活躍天數: {stats.activeDays}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light text-center">
            <div className="text-2xl font-bold text-wave-teal">{formatAmount(stats.totalIncome)}</div>
            <div className="text-sm text-text-secondary">總收入</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light text-center">
            <div className="text-2xl font-bold text-coral-pink">{formatAmount(stats.totalExpenses)}</div>
            <div className="text-sm text-text-secondary">總支出</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light text-center">
            <div className="text-2xl font-bold text-ocean-blue">{formatAmount(stats.totalNet)}</div>
            <div className="text-sm text-text-secondary">淨收入</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light text-center">
            <div className="text-2xl font-bold text-sunset-gold">{stats.totalTransactions}</div>
            <div className="text-sm text-text-secondary">總交易數</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light text-center">
            <div className="text-2xl font-bold text-ocean-deep">{stats.activeDays}</div>
            <div className="text-sm text-text-secondary">活躍天數</div>
          </div>
        </div>

        {/* Revenue Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-sand-light overflow-hidden">
          <div className="p-6 border-b border-sand-light">
            <h2 className="text-xl font-bold text-ocean-deep">📊 每日收入時間軸</h2>
            <p className="text-sm text-text-secondary mt-1">最近 90 天的收入記錄</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surf-aqua">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    收入
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    支出
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    淨收入
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    交易數
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    表現
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-light">
                {revenueData.map((day, index) => (
                  <tr key={index} className="hover:bg-surf-aqua hover:bg-opacity-30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {formatDate(day.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getIncomeIcon(day.daily_income)}</span>
                        <span className={`text-sm font-medium ${getIncomeColor(day.daily_income)}`}>
                          {formatAmount(day.daily_income)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-coral-pink">
                      {formatAmount(day.daily_expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ocean-blue">
                      {formatAmount(day.net_income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      收入: {day.income_transactions} | 支出: {day.expense_transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 bg-sand-light rounded-full h-2">
                        <div 
                          className="bg-wave-teal h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (day.daily_income / Math.max(...revenueData.map(d => d.daily_income))) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {revenueData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-text-secondary">沒有收入記錄</p>
            </div>
          )}
        </div>

        {/* Revenue Insights */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-sand-light p-6">
          <h3 className="text-lg font-bold text-ocean-deep mb-4">💡 收入分析洞察</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surf-aqua p-4 rounded-lg">
              <div className="text-sm font-semibold text-ocean-deep">日均收入</div>
              <div className="text-2xl font-bold text-wave-teal">
                {formatAmount(stats.totalIncome / Math.max(stats.activeDays, 1))}
              </div>
              <div className="text-xs text-text-secondary">基於 {stats.activeDays} 個活躍天數</div>
            </div>
            <div className="bg-surf-aqua p-4 rounded-lg">
              <div className="text-sm font-semibold text-ocean-deep">平均交易金額</div>
              <div className="text-2xl font-bold text-ocean-blue">
                {formatAmount(stats.totalIncome / Math.max(stats.totalTransactions, 1))}
              </div>
              <div className="text-xs text-text-secondary">每筆交易平均金額</div>
            </div>
            <div className="bg-surf-aqua p-4 rounded-lg">
              <div className="text-sm font-semibold text-ocean-deep">收支比例</div>
              <div className="text-2xl font-bold text-sunset-gold">
                {stats.totalExpenses > 0 ? (stats.totalIncome / stats.totalExpenses).toFixed(1) : '∞'}:1
              </div>
              <div className="text-xs text-text-secondary">收入對支出的比例</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}