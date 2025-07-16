import MetricCard from '../components/MetricCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-sand-warm">
      {/* Header */}
      <header className="bg-ocean-deep text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌊</span>
            <h1 className="text-2xl font-bold">Wavedance 財務儀表板</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#overview" className="hover:text-wave-teal transition-colors">總覽</a>
            <a href="#revenue" className="hover:text-wave-teal transition-colors">收入分析</a>
            <a href="#customers" className="hover:text-wave-teal transition-colors">客戶分析</a>
            <a href="#inventory" className="hover:text-wave-teal transition-colors">商品管理</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="總客戶數" 
            value="25" 
            trend="本月 +3位" 
            icon="👥"
            trendDirection="up"
          />
          <MetricCard 
            title="活躍詢問" 
            value="22" 
            trend="轉換率 88%" 
            icon="💬"
            trendDirection="up"
          />
          <MetricCard 
            title="本月收入" 
            value="NT$ 45,230" 
            trend="+12.5%" 
            icon="💰"
            trendDirection="up"
          />
          <MetricCard 
            title="庫存價值" 
            value="NT$ 334,000" 
            trend="健康狀態" 
            icon="📦"
            trendDirection="neutral"
          />
        </section>

        {/* Main Chart Area */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ocean-deep flex items-center">
              <span className="mr-2">🌊</span>
              收入趨勢 - 如海浪般起伏
            </h2>
          </div>
          <div className="h-80 bg-surf-aqua rounded-xl flex items-center justify-center">
            <div className="text-center text-text-secondary">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-lg font-semibold">收入趨勢圖</p>
              <p className="text-sm">連接 Supabase 後顯示實際數據</p>
            </div>
          </div>
        </section>

        {/* Secondary Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 台灣 vs 海外收入對比 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
            <h3 className="text-lg font-bold text-ocean-deep mb-4 flex items-center">
              <span className="mr-2">🌏</span>
              台灣 vs 海外收入
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">台灣</span>
                <span className="text-ocean-deep font-semibold">35%</span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-3">
                <div className="bg-wave-teal h-3 rounded-full" style={{width: '35%'}}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">海外</span>
                <span className="text-ocean-deep font-semibold">65%</span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-3">
                <div className="bg-ocean-blue h-3 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>

          {/* 客戶轉換漏斗 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-sand-light">
            <h3 className="text-lg font-bold text-ocean-deep mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              客戶轉換漏斗
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">有興趣</span>
                <span className="text-ocean-deep font-semibold">100人</span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-2">
                <div className="bg-sunset-gold h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">報名諮詢</span>
                <span className="text-ocean-deep font-semibold">45人</span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-2">
                <div className="bg-wave-teal h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">完成報名</span>
                <span className="text-ocean-deep font-semibold">25人</span>
              </div>
              <div className="w-full bg-sand-light rounded-full h-2">
                <div className="bg-ocean-blue h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部資訊 */}
        <section className="text-center py-8">
          <p className="text-text-muted text-sm">
            🏄‍♂️ 準備好迎接數據浪潮了嗎？讓我們一起在數據海洋中衝浪！
          </p>
        </section>
      </main>
    </div>
  );
}
