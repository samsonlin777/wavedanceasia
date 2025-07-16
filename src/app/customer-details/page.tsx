'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface CustomerRecord {
  id: string
  name: string
  email: string
  phone: string
  surf_level: string
  first_contact_source: string
  created_at: string
}

interface InquiryRecord {
  id: string
  customer_id: string
  inquiry_date: string
  inquiry_status: string
  inquiry_content: string
  course_interest: string
  expected_date: string
  follow_up_notes: string
  created_at: string
  updated_at: string
}

export default function CustomerDetailsPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'customers' | 'inquiries'>('customers')

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true)
        
        // 獲取客戶資料
        const { data: customerData, error: customerError } = await supabase
          .from('wavedanceasia.customers')
          .select('*')
          .order('created_at', { ascending: false })

        if (customerError) {
          throw customerError
        }

        // 獲取詢問資料
        const { data: inquiryData, error: inquiryError } = await supabase
          .from('wavedanceasia.course_inquiries')
          .select('*')
          .order('inquiry_date', { ascending: false })

        if (inquiryError) {
          throw inquiryError
        }

        setCustomers(customerData || [])
        setInquiries(inquiryData || [])
      } catch (err) {
        console.error('載入客戶資料失敗:', err)
        setError('無法載入客戶資料')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

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

  const getSurfLevelColor = (level: string) => {
    switch (level) {
      case '初學者': return 'bg-sunset-gold text-white'
      case '中階': return 'bg-wave-teal text-white'
      case '高階': return 'bg-ocean-blue text-white'
      default: return 'bg-sand-light text-text-primary'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Facebook': return '📘'
      case 'Instagram': return '📷'
      case 'Google': return '🔍'
      case '朋友推薦': return '👥'
      case '網站': return '🌐'
      default: return '❓'
    }
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
            <h1 className="text-2xl font-bold">客戶管理</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">總客戶: {customers.length}</span>
            <span className="text-sm">待追蹤: {inquiries.filter(i => i.inquiry_status === '需要追蹤').length}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto pt-6 px-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'customers'
                ? 'bg-ocean-deep text-white'
                : 'text-text-secondary hover:text-ocean-deep'
            }`}
          >
            客戶列表 ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-ocean-deep text-white'
                : 'text-text-secondary hover:text-ocean-deep'
            }`}
          >
            詢問追蹤 ({inquiries.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-sand-light overflow-hidden">
          {activeTab === 'customers' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surf-aqua">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      客戶資訊
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      衝浪等級
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      來源
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      加入時間
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-light">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-surf-aqua hover:bg-opacity-30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-ocean-deep">{customer.name}</div>
                          <div className="text-sm text-text-secondary">{customer.email}</div>
                          <div className="text-sm text-text-secondary">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSurfLevelColor(customer.surf_level)}`}>
                          {customer.surf_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {getSourceIcon(customer.first_contact_source)} {customer.first_contact_source}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {formatDate(customer.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surf-aqua">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      詢問日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      課程興趣
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      預期日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                      追蹤備註
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-light">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-surf-aqua hover:bg-opacity-30">
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {formatDate(inquiry.inquiry_date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.inquiry_status)}`}>
                          {inquiry.inquiry_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {inquiry.course_interest}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {inquiry.expected_date ? formatDate(inquiry.expected_date) : '未指定'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary max-w-xs truncate">
                        {inquiry.follow_up_notes || '無備註'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {((activeTab === 'customers' && customers.length === 0) || 
            (activeTab === 'inquiries' && inquiries.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-text-secondary">暫無資料</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}