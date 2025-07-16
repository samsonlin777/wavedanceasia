import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  trend: string
  icon: string
  trendDirection?: 'up' | 'down' | 'neutral'
  onClick?: () => void
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  icon, 
  trendDirection = 'neutral',
  onClick
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-sunset-gold'
      case 'down':
        return 'text-coral-pink'
      default:
        return 'text-text-muted'
    }
  }

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg border border-sand-light hover:shadow-xl transition-shadow duration-300 ${
        onClick ? 'cursor-pointer hover:border-wave-teal' : ''
      }`}
      onClick={onClick}
    >
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surf-aqua rounded-lg">
            <span className="text-xl">{icon}</span>
          </div>
          <h3 className="text-text-secondary font-medium">{title}</h3>
        </div>
      </div>
      
      {/* Main Value */}
      <div className="mb-2">
        <span className="text-3xl font-bold text-ocean-deep">{value}</span>
      </div>
      
      {/* Trend Indicator */}
      <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
        <span>🌊</span>
        <span>{trend}</span>
      </div>
    </div>
  )
}

export default MetricCard