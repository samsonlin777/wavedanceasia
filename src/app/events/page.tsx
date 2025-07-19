'use client'

import Link from 'next/link'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            WDA 活動列表
          </h1>
          <p className="text-xl text-blue-200 text-center">
            探索我們精彩的活動，體驗浪花舞的魅力
          </p>
        </div>
      </header>

      {/* 活動列表 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8">
            {/* Coffee Party 活動卡片 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                {/* 活動圖片 */}
                <div className="md:w-1/3 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-8">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🌊☕</div>
                    <p className="text-lg font-semibold">Coffee Party</p>
                  </div>
                </div>
                
                {/* 活動內容 */}
                <div className="md:w-2/3 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-900 mb-2">
                        浪花舞 Coffee Party 派對
                      </h2>
                      <p className="text-blue-600 font-medium">
                        DJ Louis 現場演出 × 海邊咖啡時光
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      報名中
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-blue-500">📅</span>
                      <span>2025/07/26 (週六) 8:30 開始</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-blue-500">📍</span>
                      <span>浪花舞往海邊藝文聚落</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-blue-500">💰</span>
                      <span>預售 NT$300 / 現場 NT$400</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    週六早晨，來點音樂、來點咖啡、來點 chill。享受咖啡香、麵包香，還有海的味道。
                  </p>
                  
                  <div className="flex gap-4">
                    <Link 
                      href="/events/coffee-party"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      查看詳情
                    </Link>
                    <Link 
                      href="/events/registration?event=coffee-party"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      立即報名
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 更多活動提示 */}
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🏄‍♂️</div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  更多精彩活動即將推出
                </h3>
                <p className="text-gray-600 mb-6">
                  敬請期待更多浪花舞的特色活動！
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  回到首頁
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}