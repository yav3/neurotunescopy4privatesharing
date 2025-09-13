import React from 'react'
import type { FrequencyBand as FrequencyBandType } from '@/types'

interface FrequencyBandProps {
  band: FrequencyBandType
  isActive: boolean
  onClick: (band: FrequencyBandType) => void
  count?: number
}

const bandInfo = {
  delta: { 
    range: '0.5-4Hz', 
    purpose: 'Deep Sleep & Healing', 
    color: 'from-blue-800 to-slate-600', 
    icon: '🌙',
    description: 'Promotes deep sleep, healing, and regeneration'
  },
  theta: { 
    range: '4-8Hz', 
    purpose: 'Meditation & Creativity', 
    color: 'from-blue-600 to-teal-600', 
    icon: '🧘',
    description: 'Enhances meditation, creativity, and intuition'
  },
  alpha: { 
    range: '8-13Hz', 
    purpose: 'Relaxed Focus', 
    color: 'from-teal-600 to-green-600', 
    icon: '🌊',
    description: 'Calms the mind while maintaining alertness'
  },
  beta: { 
    range: '13-30Hz', 
    purpose: 'Active Concentration', 
    color: 'from-green-600 to-yellow-600', 
    icon: '⚡',
    description: 'Supports focused thinking and problem-solving'
  },
  gamma: { 
    range: '30-100Hz', 
    purpose: 'Peak Performance', 
    color: 'from-yellow-600 to-red-600', 
    icon: '🚀',
    description: 'Enhances cognitive function and peak performance'
  }
} as const

export const FrequencyBand: React.FC<FrequencyBandProps> = ({ 
  band, 
  isActive, 
  onClick, 
  count 
}) => {
  console.log('🎛️ FrequencyBand rendered:', band, 'active:', isActive)
  const info = bandInfo[band]
  
  return (
    <button
      onClick={() => {
        console.log('🎛️ FrequencyBand clicked:', band)
        onClick(band)
      }}
      className={`
        group relative p-6 rounded-2xl border-2 transition-all duration-300
        ${isActive 
          ? `bg-gradient-to-r ${info.color} text-primary-foreground shadow-lg transform scale-105 border-transparent` 
          : 'bg-card hover:bg-card/80 text-foreground border-border hover:border-border/60'
        }
      `}
      aria-label={`${band} frequency band: ${info.purpose}`}
    >
      <div className="text-center">
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
          {info.icon}
        </div>
        
        <h3 className="text-lg font-bold capitalize mb-1">
          {band}
        </h3>
        
        <div className={`text-sm mb-2 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {info.range}
        </div>
        
        <div className={`text-xs font-medium mb-3 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
          {info.purpose}
        </div>
        
        {count !== undefined && (
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${isActive 
              ? 'bg-primary-foreground/20 text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
            }
          `}>
            {count} tracks
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 border
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none z-10 whitespace-nowrap
      ">
        {info.description}
      </div>
    </button>
  )
}

export default FrequencyBand