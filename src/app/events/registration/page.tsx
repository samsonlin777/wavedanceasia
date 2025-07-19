'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// 活動配置
const eventConfigs = {
  'coffee-party': {
    title: 'in search of summit X 浪花舞 Coffee Party🌊☕',
    date: '2025/07/26 (週六) 8:30',
    location: '浪花舞往海邊藝文聚落',
    description: 'DJ Louis 現場演出 × 海邊咖啡時光',
    earlyPrice: 300,
    onsitePrice: 400,
    included: ['咖啡一杯', '麵包一份', 'DJ音樂表演', '無價的情誼']
  }
}

function RegistrationForm() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event') || 'coffee-party'
  const eventConfig = eventConfigs[eventId as keyof typeof eventConfigs]
  
  useEffect(() => {
    document.title = 'Coffee Party 報名表單 | 浪花舞'
  }, [])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagramId: '',
    paymentType: 'early_bird' as 'early_bird' | 'onsite',
    participantCount: 1,
    transferAmount: '',
    transferLastFive: '',
    notes: '',
    subscribeNewsletter: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{success: boolean, message: string} | null>(null)

  if (!eventConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">活動不存在</h2>
          <p className="text-gray-600 mb-6">找不到指定的活動</p>
          <Link 
            href="/events"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            回到活動列表
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventCode: eventId,
          ...formData
        })
      })

      const result = await response.json()
      setSubmitResult(result)
      
      if (result.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          instagramId: '',
          paymentType: 'early_bird',
          participantCount: 1,
          transferAmount: '',
          transferLastFive: '',
          notes: '',
          subscribeNewsletter: false
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: '網路錯誤，請稍後再試'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentPrice = formData.paymentType === 'early_bird' ? eventConfig.earlyPrice : eventConfig.onsitePrice
  const totalAmount = currentPrice * formData.participantCount

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            活動報名表單
          </h1>
          <p className="text-blue-200 text-center">
            {eventConfig.title}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 活動資訊 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">活動資訊</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">活動名稱</h3>
                  <p className="text-gray-600 text-sm">{eventConfig.title}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">日期時間</h3>
                  <p className="text-gray-600 text-sm">{eventConfig.date}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">活動地點</h3>
                  <p className="text-gray-600 text-sm">{eventConfig.location}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">包含項目</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {eventConfig.included.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">費用計算</h3>
                  <p className="text-sm text-gray-600">
                    NT$ {currentPrice} × {formData.participantCount} 人
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    NT$ {totalAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.paymentType === 'early_bird' ? '預售價格' : '現場價格'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 報名表單 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {submitResult?.success ? (
                /* 報名成功頁面 */
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-bold text-green-600 mb-4">報名成功！</h2>
                  <div className="text-gray-700 space-y-4">
                    <p>感謝您報名參加 Coffee Party！</p>
                    <p>請依照活動頁面的指示完成轉帳付款。</p>
                    <div className="bg-blue-50 rounded-lg p-6 my-6">
                      <p className="font-semibold text-blue-800 mb-2">📸 重要提醒</p>
                      <p className="text-blue-700">
                        完成轉帳後，請到我們的 Instagram 告知付款完成！
                      </p>
                      <a 
                        href="https://www.instagram.com/wavedancesurflife/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        🔗 前往 @wavedancesurflife
                      </a>
                    </div>
                    <button
                      onClick={() => setSubmitResult(null)}
                      className="mt-6 text-blue-600 hover:text-blue-800 underline"
                    >
                      ← 重新填寫表單
                    </button>
                  </div>
                </div>
              ) : (
                /* 原本的表單內容 */
                <>
                  {submitResult && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                      {submitResult.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本資料 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    基本資料
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="請輸入您的 Email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      聯絡電話
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="請輸入您的聯絡電話"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      報名人數 *
                    </label>
                    <select
                      name="participantCount"
                      value={formData.participantCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num} 人</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram ID
                    </label>
                    <input
                      type="text"
                      name="instagramId"
                      value={formData.instagramId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="@your_instagram_id"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      請分享付款截圖到 @wavedancesurflife
                    </p>
                  </div>
                </div>

                {/* 付款選項 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    付款選項
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentType === 'early_bird' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="early_bird"
                        checked={formData.paymentType === 'early_bird'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">預售價</div>
                        <div className="text-2xl font-bold text-blue-800">NT$ {eventConfig.earlyPrice}</div>
                        <div className="text-sm text-gray-600">需提前付款</div>
                      </div>
                    </label>
                    
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentType === 'onsite' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="onsite"
                        checked={formData.paymentType === 'onsite'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">現場價</div>
                        <div className="text-2xl font-bold text-orange-800">NT$ {eventConfig.onsitePrice}</div>
                        <div className="text-sm text-gray-600">現場付款</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 匯款資訊 - 只在預售時顯示 */}
                {formData.paymentType === 'early_bird' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">
                      匯款資訊
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        匯款金額 *
                      </label>
                      <input
                        type="number"
                        name="transferAmount"
                        value={formData.transferAmount}
                        onChange={handleInputChange}
                        required={formData.paymentType === 'early_bird'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder={`應匯金額：NT$ ${totalAmount}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        請確認匯款金額正確：NT$ {totalAmount}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        匯款帳號後五碼 *
                      </label>
                      <input
                        type="text"
                        name="transferLastFive"
                        value={formData.transferLastFive}
                        onChange={handleInputChange}
                        required={formData.paymentType === 'early_bird'}
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="請輸入您匯款帳號的後五碼"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        用於對帳確認，請輸入您匯款帳號的後五碼數字
                      </p>
                    </div>
                  </div>
                )}

                {/* 備註 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    備註
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="有任何特殊需求或想說的話嗎？"
                  />
                </div>

                {/* 電子報訂閱 */}
                <div className="border-t pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        訂閱《浪花舞—不只是衝浪》生活電子報
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        收到更多有關衝浪學習、藝文、選物、海邊生活相關電子報，以及正在規劃中的「進階衝浪常見問題指南」。
                      </p>
                    </div>
                  </label>
                </div>

                {/* 提交按鈕 */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '提交中...' : '確認報名'}
                  </button>
                </div>
              </form>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-blue-600 text-lg">載入中...</div>
      </div>
    }>
      <RegistrationForm />
    </Suspense>
  )
}