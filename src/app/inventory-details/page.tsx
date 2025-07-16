'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWavedanceData } from '../../lib/supabase'

interface InventoryItem {
  product_name: string
  variant_code: string
  size_option: string
  color: string
  cost_price: number
  retail_price: number
  current_stock: number
  reserved_stock: number
  available_stock: number
  min_stock_alert: number
  stock_status: string
  inventory_value: number
}

export default function InventoryDetailsPage() {
  const router = useRouter()
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true)
        const data = await getWavedanceData('inventory_overview')
        
        if (data && Array.isArray(data)) {
          setInventoryData(data)
        }
      } catch (err) {
        console.error('載入庫存資料失敗:', err)
        setError('無法載入庫存資料')
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-wave-teal text-white'
      case 'LOW_STOCK': return 'bg-sunset-gold text-white'
      case 'OUT_OF_STOCK': return 'bg-coral-pink text-white'
      default: return 'bg-sand-light text-text-primary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OK': return '正常'
      case 'LOW_STOCK': return '庫存不足'
      case 'OUT_OF_STOCK': return '缺貨'
      default: return '未知'
    }
  }

  const getProductIcon = (productName: string) => {
    if (productName.includes('T恤')) return '👕'
    if (productName.includes('蠟塊')) return '🧴'
    if (productName.includes('衝浪板')) return '🏄‍♂️'
    return '📦'
  }

  const filteredData = inventoryData.filter(item => {
    if (filterStatus === 'all') return true
    return item.stock_status === filterStatus
  })

  const getTotalStats = () => {
    return {
      totalItems: inventoryData.length,
      totalValue: inventoryData.reduce((sum, item) => sum + item.inventory_value, 0),
      totalStock: inventoryData.reduce((sum, item) => sum + item.current_stock, 0),
      lowStockCount: inventoryData.filter(item => item.stock_status === 'LOW_STOCK').length,
      outOfStockCount: inventoryData.filter(item => item.stock_status === 'OUT_OF_STOCK').length
    }
  }

  const stats = getTotalStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-ocean-deep text-lg">載入庫存資料中...</p>
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
            <span className="text-2xl">📦</span>
            <h1 className="text-2xl font-bold">庫存管理</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">總價值: {formatAmount(stats.totalValue)}</span>
            <span className="text-sm">警告: {stats.lowStockCount + stats.outOfStockCount}</span>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light">
            <div className="text-2xl font-bold text-ocean-deep">{stats.totalItems}</div>
            <div className="text-sm text-text-secondary">總商品數</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light">
            <div className="text-2xl font-bold text-wave-teal">{formatAmount(stats.totalValue)}</div>
            <div className="text-sm text-text-secondary">總庫存價值</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light">
            <div className="text-2xl font-bold text-ocean-blue">{stats.totalStock}</div>
            <div className="text-sm text-text-secondary">總庫存量</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light">
            <div className="text-2xl font-bold text-sunset-gold">{stats.lowStockCount}</div>
            <div className="text-sm text-text-secondary">庫存不足</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sand-light">
            <div className="text-2xl font-bold text-coral-pink">{stats.outOfStockCount}</div>
            <div className="text-sm text-text-secondary">缺貨商品</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-sand-light">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text-primary">篩選狀態:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-sand-light rounded-md focus:ring-wave-teal focus:border-wave-teal"
            >
              <option value="all">全部商品</option>
              <option value="OK">正常庫存</option>
              <option value="LOW_STOCK">庫存不足</option>
              <option value="OUT_OF_STOCK">缺貨</option>
            </select>
            <span className="text-sm text-text-secondary">
              顯示 {filteredData.length} / {inventoryData.length} 項商品
            </span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-sand-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surf-aqua">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    商品資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    規格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    庫存量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    價格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    庫存價值
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ocean-deep uppercase tracking-wider">
                    狀態
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-light">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-surf-aqua hover:bg-opacity-30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getProductIcon(item.product_name)}</span>
                        <div>
                          <div className="text-sm font-medium text-ocean-deep">{item.product_name}</div>
                          <div className="text-sm text-text-secondary">{item.variant_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary">
                        <div>尺寸: {item.size_option}</div>
                        <div>顏色: {item.color}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary">
                        <div className="font-medium">現貨: {item.current_stock}</div>
                        <div className="text-text-secondary">可用: {item.available_stock}</div>
                        <div className="text-text-secondary">預留: {item.reserved_stock}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary">
                        <div>售價: {formatAmount(item.retail_price)}</div>
                        <div className="text-text-secondary">成本: {formatAmount(item.cost_price)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-ocean-deep">
                      {formatAmount(item.inventory_value)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.stock_status)}`}>
                        {getStatusText(item.stock_status)}
                      </span>
                      {item.current_stock <= item.min_stock_alert && (
                        <div className="text-xs text-coral-pink mt-1">
                          ⚠️ 低於警戒值 ({item.min_stock_alert})
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-text-secondary">沒有符合條件的商品</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}