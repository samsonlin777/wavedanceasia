'use client'

import Link from 'next/link'

export default function CoffeePartyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            浪花舞 Coffee Party 派對 🌊☕
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            &quot;Buzzed on coffee? Nah, but you. But I&apos;m off surfing.&quot;
          </p>
          <p className="text-lg mb-8 text-blue-200">
            週六早晨，不只是衝浪
          </p>
          <Link 
            href="/events/registration?event=coffee-party"
            className="inline-block bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            立即報名參加
          </Link>
        </div>
      </section>

      {/* 活動介紹 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              活動介紹
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-center text-xl mb-6">
                來點音樂、來點咖啡、來點 chill
              </p>
              <p className="mb-4">
                我們邀請了 <strong>DJ Louis</strong>
              </p>
              <p className="mb-4">
                用他的音樂為這個早晨調味
              </p>
              <p className="mb-4">
                你只需要帶著輕鬆的心情
              </p>
              <p className="mb-4">
                享受咖啡香、麵包香，還有海的味道
              </p>
              <p className="mb-4">
                聊天也好、放空也好、隨音樂搖擺也好
              </p>
              <p className="mb-4">
                這是屬於我們的 coffee time
              </p>
              <p className="mb-4">
                派對結束，浪還在等你
              </p>
              <p className="text-center text-lg font-semibold text-blue-800">
                要不要一起下水？
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DJ */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              DJ
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🎧</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-blue-800 mb-2">
                  DJ Louis (Wolfie)
                </h3>
                <p className="text-gray-600 mb-4">
                  北藝大畢業的社畜~
                </p>
                <p className="text-lg text-blue-700 font-medium italic">
                  &quot;A healer. A pioneer. A lover. A DJ. A pilot in the making.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 活動詳情 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              活動詳情
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">日期時間</h3>
                    <p className="text-gray-600">2025/07/26 (週六)</p>
                    <p className="text-gray-600">8:30 開始入場</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">活動地點</h3>
                    <p className="text-gray-600">浪花舞往海邊藝文聚落</p>
                    <p className="text-sm text-gray-500">261宜蘭縣頭城鎮演海路二段405號</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">活動費用</h3>
                    <p className="text-blue-600 font-semibold">預售 NT$300</p>
                    <p className="text-gray-600">現場 NT$400</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">包含項目</h3>
                    <p className="text-gray-600">咖啡一杯 + 麵包一份</p>
                    <p className="text-gray-600">DJ 音樂表演</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 付款資訊 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              付款資訊
            </h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-center text-gray-700 mb-4">
                請計算好您的報名費後，匯款至以下帳號後填報名表單喔，預售1人300，算算你要出賣幾個朋友來聯誼？喔，不，是你想帶幾位朋友一起來衝浪和party。
                如果要現場繳費400元，就直接填寫下面報名表單喔。(有人數限制)
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">銀行</p>
                  <p className="text-gray-600">國泰世華銀行 (宜蘭分行)</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">代碼</p>
                  <p className="text-gray-600">013</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">帳號</p>
                  <p className="text-gray-600 font-mono text-lg">105035006962</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">戶名</p>
                  <p className="text-gray-600">浪花舞號王思敏</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link 
                href="/events/registration?event=coffee-party"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                點此填寫報名表單
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-blue-200">
            © 2025 WDA Wave Dance Team. 準備好和我們一起享受完美的週六早晨了嗎？
          </p>
        </div>
      </footer>
    </div>
  )
}