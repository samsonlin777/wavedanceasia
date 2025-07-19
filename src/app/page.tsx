import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            WDA Wave Dance Team
          </h1>
          <p className="text-xl md:text-2xl text-blue-700 mb-8">
            探索海洋的節拍，感受浪花的律動
          </p>
          
          {/* 活動快速入口 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              🌊☕ 最新活動
            </h2>
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Coffee Party 派對</h3>
                <p className="text-sm text-gray-600">2025/07/26 (週六) 8:30</p>
                <p className="text-sm text-blue-600">DJ Louis 現場演出</p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/events/coffee-party"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                >
                  查看詳情
                </Link>
                <Link 
                  href="/events/registration?event=coffee-party"
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
                >
                  立即報名
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                href="/events"
                className="block w-full bg-gray-100 text-blue-900 py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                查看所有活動
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}