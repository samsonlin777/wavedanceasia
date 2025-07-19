'use client'

import { useEffect, useState } from 'react'
import { supabaseWDA } from '@/lib/supabase-wda'

interface Registration {
  id: number
  participant_name: string
  participant_email: string
  participant_phone?: string
  instagram_handle?: string
  participant_count?: number
  ticket_type?: string
  payment_method?: string
  payment_status: string
  total_amount?: number
  transfer_amount?: string
  transfer_last_five?: string
  created_at: string
  custom_fields?: Record<string, unknown>
  // 可能的額外欄位
  event_id?: number
  notes?: string
}

export default function EventDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    totalParticipants: 0,
    onsite: 0,
    pendingTransfer: 0,
    confirmedTransfer: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    confirmedRevenue: 0
  })

  useEffect(() => {
    fetchRegistrations()
    // 每30秒自動刷新
    const interval = setInterval(fetchRegistrations, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRegistrations = async () => {
    try {
      // 直接查詢 wavedanceasia schema 的 event_registrations 表格
      // 使用 REST API 與指定 schema
      const url = 'https://urryrxlzyepwklzwwxwa.supabase.co/rest/v1/event_registrations?select=*&order=created_at.desc'
      const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycnlyeGx6eWVwd2tsend3eHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODI1NTUsImV4cCI6MjA2NDM1ODU1NX0.MpP8LQloERRtMzrXwfmuKcPagsxOOkJlBsUjSFocvPI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycnlyeGx6eWVwd2tsend3eHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODI1NTUsImV4cCI6MjA2NDM1ODU1NX0.MpP8LQloERRtMzrXwfmuKcPagsxOOkJlBsUjSFocvPI',
        'Accept-Profile': 'wavedanceasia',
        'Content-Profile': 'wavedanceasia'
      }

      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const registrationsData = await response.json()
      console.log('Direct API result:', registrationsData)
      console.log('Registrations data:', registrationsData) // 調試用
      setRegistrations(registrationsData)

      // 計算統計數據
      const stats = registrationsData.reduce((acc: {
        total: number
        totalParticipants: number
        onsite: number
        pendingTransfer: number
        confirmedTransfer: number
        totalRevenue: number
        pendingRevenue: number
        confirmedRevenue: number
      }, reg: Registration) => {
        acc.total++
        
        // 從 custom_fields 中取得資料
        const customFields = reg.custom_fields || {}
        const participantCount = Number(customFields.participant_count || reg.participant_count || 1)
        // const transferAmount = customFields.transfer_amount || reg.transfer_amount
        
        acc.totalParticipants += participantCount

        if (reg.payment_method === 'cash') {
          acc.onsite++
          acc.totalRevenue += 400 * participantCount // 現場價
        } else if (reg.payment_status === 'pending') {
          acc.pendingTransfer++
          const amount = reg.total_amount || 300 * participantCount // 預售價
          acc.pendingRevenue += amount
          acc.totalRevenue += amount
        } else if (reg.payment_status === 'completed') {
          acc.confirmedTransfer++
          const amount = reg.total_amount || 300 * participantCount
          acc.confirmedRevenue += amount
          acc.totalRevenue += amount
        }

        return acc
      }, {
        total: 0,
        totalParticipants: 0,
        onsite: 0,
        pendingTransfer: 0,
        confirmedTransfer: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        confirmedRevenue: 0
      })

      setStats(stats)
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (registration: Registration) => {
    if (registration.payment_method === 'cash') {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
          現場付款
        </span>
      )
    } else if (registration.payment_status === 'completed') {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          已確認匯款
        </span>
      )
    } else {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          待確認匯款
        </span>
      )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updatePaymentStatus = async (registrationId: number, newStatus: string) => {
    try {
      const { error } = await supabaseWDA.rpc('wavedanceasia_update_registration_status', {
        p_registration_id: registrationId,
        p_payment_status: newStatus,
        p_notes: `付款狀態更新為：${newStatus === 'completed' ? '已確認' : '待確認'}`
      })

      if (error) throw error
      
      // 刷新資料
      fetchRegistrations()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('更新失敗，請稍後再試')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-blue-600 text-lg">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold">Coffee Party 報名管理儀表板</h1>
          <p className="text-blue-200 mt-2">2025/07/26 活動報名狀況</p>
        </div>
      </header>

      {/* 統計卡片 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">總報名人次</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">共 {stats.totalParticipants} 人</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">現場付款</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.onsite}</p>
            <p className="text-sm text-gray-600 mt-1">NT$ {stats.onsite * 400}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">待確認匯款</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingTransfer}</p>
            <p className="text-sm text-gray-600 mt-1">NT$ {stats.pendingRevenue}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">已確認匯款</h3>
            <p className="text-3xl font-bold text-green-600">{stats.confirmedTransfer}</p>
            <p className="text-sm text-gray-600 mt-1">NT$ {stats.confirmedRevenue}</p>
          </div>
        </div>

        {/* 報名表格 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">報名明細</h2>
            <button 
              onClick={fetchRegistrations}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              🔄 重新整理
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    報名時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    人數/金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    匯款資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(registration.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.participant_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.instagram_handle || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {registration.participant_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.participant_phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Number(registration.custom_fields?.participant_count || registration.participant_count || 1)} 人
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        NT$ {registration.total_amount || (Number(registration.custom_fields?.participant_count || 1) * (registration.ticket_type === 'onsite' ? 400 : 300))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.payment_method === 'transfer' ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            金額: {String(registration.custom_fields?.transfer_amount || registration.transfer_amount || '-')}
                          </div>
                          <div className="text-sm text-gray-500">
                            後五碼: {String(registration.custom_fields?.transfer_last_five || registration.transfer_last_five || '-')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(registration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.payment_method === 'transfer' && registration.payment_status === 'pending' && (
                        <button
                          onClick={() => updatePaymentStatus(registration.id, 'completed')}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          確認匯款
                        </button>
                      )}
                      {registration.payment_status === 'completed' && (
                        <button
                          onClick={() => updatePaymentStatus(registration.id, 'pending')}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          取消確認
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {registrations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                目前還沒有報名資料
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}