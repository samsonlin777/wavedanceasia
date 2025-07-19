'use client'

import { useEffect, useState } from 'react'
import { supabaseWDA } from '@/lib/supabase-wda'

interface PaymentOrder {
  id: number
  order_number: string
  buyer_name: string
  buyer_email: string
  buyer_phone?: string
  instagram_handle?: string
  participant_count?: number
  product_name: string
  payment_method?: string
  payment_status: string
  amount?: number
  transfer_amount?: string
  sender_account_last5?: string
  created_at: string
  confirmed_at?: string
  confirmed_by?: string
  registration_id?: number
}

export default function EventDashboard() {
  const [payments, setPayments] = useState<PaymentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set())
  const [stats, setStats] = useState({
    total: 0,
    totalParticipants: 0,
    onsite: 0,
    pendingTransfer: 0,
    confirmedTransfer: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    confirmedRevenue: 0,
    checkedIn: 0
  })

  useEffect(() => {
    // 從 localStorage 載入已簽到的資料
    const savedCheckedIn = localStorage.getItem('coffeePartyCheckedIn')
    if (savedCheckedIn) {
      setCheckedIn(new Set(JSON.parse(savedCheckedIn)))
    }
    
    fetchPayments()
    // 每30秒自動刷新
    const interval = setInterval(fetchPayments, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPayments = async () => {
    try {
      // 使用新的基於 payment_orders 的 RPC 函數
      const { data, error } = await supabaseWDA.rpc('wavedanceasia_get_payment_dashboard', {
        p_event_name: 'Coffee Party'
      })

      if (error) {
        console.error('Error fetching payments:', error)
        throw error
      }
      
      console.log('Payment dashboard data:', data)
      setPayments(data || [])

      // 計算統計數據
      const stats = (data || []).reduce((acc: {
        total: number
        totalParticipants: number
        onsite: number
        pendingTransfer: number
        confirmedTransfer: number
        totalRevenue: number
        pendingRevenue: number
        confirmedRevenue: number
        checkedIn: number
      }, payment: PaymentOrder) => {
        acc.total++
        
        const participantCount = payment.participant_count || 1
        acc.totalParticipants += participantCount

        // 計算已簽到人數（使用 registration_id 或 order_number）
        const savedCheckedIn = localStorage.getItem('coffeePartyCheckedIn')
        const checkedInSet = savedCheckedIn ? new Set(JSON.parse(savedCheckedIn)) : new Set()
        if (checkedInSet.has(payment.id)) {
          acc.checkedIn++
        }

        // 計算正確的總金額
        const totalAmount = payment.transfer_amount ? 
          parseFloat(payment.transfer_amount) : 
          (payment.amount || 0) * participantCount

        if (payment.payment_method === 'cash') {
          acc.onsite++
          if (payment.payment_status === 'completed') {
            acc.confirmedRevenue += totalAmount
          } else {
            acc.pendingRevenue += totalAmount
          }
          acc.totalRevenue += totalAmount
        } else if (payment.payment_method === 'transfer') {
          if (payment.payment_status === 'completed') {
            acc.confirmedTransfer++
            acc.confirmedRevenue += totalAmount
          } else {
            acc.pendingTransfer++
            acc.pendingRevenue += totalAmount
          }
          acc.totalRevenue += totalAmount
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
        confirmedRevenue: 0,
        checkedIn: 0
      })

      setStats(stats)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCheckIn = (paymentId: number) => {
    const newCheckedIn = new Set(checkedIn)
    if (newCheckedIn.has(paymentId)) {
      newCheckedIn.delete(paymentId)
    } else {
      newCheckedIn.add(paymentId)
    }
    setCheckedIn(newCheckedIn)
    
    // 儲存到 localStorage
    localStorage.setItem('coffeePartyCheckedIn', JSON.stringify(Array.from(newCheckedIn)))
    
    // 重新計算統計
    fetchPayments()
  }

  const getStatusBadge = (payment: PaymentOrder) => {
    const isCheckedIn = checkedIn.has(payment.id)
    
    return (
      <div className="flex flex-col gap-1">
        {/* 付款狀態 */}
        {payment.payment_method === 'cash' ? (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
            現場付款
          </span>
        ) : payment.payment_status === 'completed' ? (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            已確認匯款
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            待確認匯款
          </span>
        )}
        
        {/* 簽到狀態 */}
        {isCheckedIn && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            ✓ 已簽到
          </span>
        )}
        
        {/* 已確認標記 */}
        {payment.confirmed_at && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
            {payment.confirmed_by}
          </span>
        )}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updatePaymentStatus = async (paymentId: number, newStatus: string) => {
    try {
      const { error } = await supabaseWDA.rpc('wavedanceasia_update_payment_status', {
        p_order_id: paymentId,
        p_payment_status: newStatus,
        p_confirmed_by: 'Dashboard User' // 之後可以改成實際操作人員
      })

      if (error) throw error
      
      // 刷新資料
      fetchPayments()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('更新失敗，請稍後再試')
    }
  }

  // 計算實際金額
  const calculateTotalAmount = (payment: PaymentOrder) => {
    if (payment.transfer_amount) {
      return parseFloat(payment.transfer_amount)
    }
    return (payment.amount || 0) * (payment.participant_count || 1)
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">總報名人次</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">共 {stats.totalParticipants} 人</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">已簽到</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.checkedIn}</p>
            <p className="text-sm text-gray-600 mt-1">已到場</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">現場付款</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.onsite}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.onsite > 0 ? `每人 NT$ 400` : '-'}
            </p>
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
            <h2 className="text-xl font-semibold text-gray-800">付款明細</h2>
            <button 
              onClick={fetchPayments}
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
                    簽到
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
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
                {payments.map((payment) => {
                  const isCheckedIn = checkedIn.has(payment.id)
                  return (
                    <tr key={payment.id} className={`hover:bg-gray-50 ${isCheckedIn ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleCheckIn(payment.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isCheckedIn 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isCheckedIn ? '✓ 已到' : '簽到'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.buyer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.instagram_handle ? `@${payment.instagram_handle}` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.buyer_email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.buyer_phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.participant_count || 1} 人
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          NT$ {calculateTotalAmount(payment)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.payment_method === 'transfer' ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              金額: {payment.transfer_amount || payment.amount}
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              後五碼: {payment.sender_account_last5 || '-'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">現場收款</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {/* 轉帳確認按鈕 */}
                          {payment.payment_method === 'transfer' && 
                           payment.payment_status === 'pending' && (
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'completed')}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              確認匯款
                            </button>
                          )}
                          
                          {/* 現場收款確認按鈕 */}
                          {payment.payment_method === 'cash' && 
                           payment.payment_status === 'pending' && 
                           isCheckedIn && (
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              確認收款
                            </button>
                          )}
                          
                          {/* 取消確認按鈕 */}
                          {payment.payment_status === 'completed' && (
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'pending')}
                              className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                              取消確認
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {payments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                目前還沒有付款資料
              </div>
            )}
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 簽到統計 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">簽到統計</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">已簽到人數</p>
                <p className="text-2xl font-bold text-purple-600">{stats.checkedIn} / {stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">簽到率</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* 收款統計 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">收款統計</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">預計總收入</span>
                <span className="font-semibold">NT$ {stats.totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">已確認收入</span>
                <span className="font-semibold text-green-600">NT$ {stats.confirmedRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">待確認收入</span>
                <span className="font-semibold text-yellow-600">NT$ {stats.pendingRevenue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}