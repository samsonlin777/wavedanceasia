'use client'

import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getWavedanceData } from '../lib/supabase'

interface DailyRevenueData {
  transaction_date: string
  daily_income: number
  daily_expenses: number
  net_income: number
  transaction_count: number
}

interface ChartDataPoint {
  date: string
  income: number
  expenses: number
  net: number
  displayDate: string
}

const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const data = await getWavedanceData('daily_revenue', 30)
        
        if (data && Array.isArray(data)) {
          // 反轉資料順序，讓時間從舊到新
          const reversedData = [...data].reverse()
          
          const formattedData: ChartDataPoint[] = reversedData.map((item: DailyRevenueData) => ({
            date: item.transaction_date,
            income: item.daily_income,
            expenses: Math.abs(item.daily_expenses), // 取絕對值讓支出為正數
            net: item.net_income,
            displayDate: formatDate(item.transaction_date)
          }))
          
          setChartData(formattedData)
        }
      } catch (err) {
        console.error('載入收入趨勢資料失敗:', err)
        setError('無法載入收入趨勢資料')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatAmount = (value: number) => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-sand-light rounded-lg shadow-lg">
          <p className="text-ocean-deep font-semibold">{`日期: ${label}`}</p>
          <p className="text-wave-teal">{`收入: NT$${payload[0].value.toLocaleString()}`}</p>
          <p className="text-coral-pink">{`支出: NT$${payload[1].value.toLocaleString()}`}</p>
          <p className="text-ocean-blue font-semibold">{`淨收入: NT$${payload[2].value.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🌊</div>
          <p className="text-ocean-deep">載入收入趨勢中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-coral-pink">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="displayDate" 
            stroke="#4a5568"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#4a5568"
            fontSize={12}
            tickLine={false}
            tickFormatter={formatAmount}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4fd1c7"
            strokeWidth={2}
            dot={{ fill: '#4fd1c7', strokeWidth: 2, r: 4 }}
            name="收入"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#fc8181"
            strokeWidth={2}
            dot={{ fill: '#fc8181', strokeWidth: 2, r: 4 }}
            name="支出"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#2b77a3"
            strokeWidth={3}
            dot={{ fill: '#2b77a3', strokeWidth: 2, r: 5 }}
            name="淨收入"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart