import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TherapeuticChart from '../TherapeuticChart'

const mockData = [
  { band: 'Alpha', power: 0.8, therapeutic_score: 0.9, condition: 'Focus' },
  { band: 'Delta', power: 0.6, therapeutic_score: 0.85, condition: 'Sleep' },
  { band: 'Theta', power: 0.7, therapeutic_score: 0.75, condition: 'Meditation' }
]

describe('TherapeuticChart', () => {
  it('renders chart with default title', () => {
    render(<TherapeuticChart data={mockData} />)
    
    expect(screen.getByText('Therapeutic Efficacy by Frequency Band')).toBeInTheDocument()
  })

  it('renders chart with custom title', () => {
    const customTitle = 'Custom Chart Title'
    render(<TherapeuticChart data={mockData} title={customTitle} />)
    
    expect(screen.getByText(customTitle)).toBeInTheDocument()
  })

  it('renders frequency band data', () => {
    render(<TherapeuticChart data={mockData} />)
    
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.getByText('Theta')).toBeInTheDocument()
  })

  it('renders therapeutic scores as percentages', () => {
    render(<TherapeuticChart data={mockData} />)
    
    expect(screen.getByText('90%')).toBeInTheDocument() // Alpha: 0.9 * 100
    expect(screen.getByText('85%')).toBeInTheDocument() // Delta: 0.85 * 100
    expect(screen.getByText('75%')).toBeInTheDocument() // Theta: 0.75 * 100
  })

  it('renders condition labels', () => {
    render(<TherapeuticChart data={mockData} />)
    
    expect(screen.getByText('Focus')).toBeInTheDocument()
    expect(screen.getByText('Sleep')).toBeInTheDocument()
    expect(screen.getByText('Meditation')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    render(<TherapeuticChart data={[]} />)
    
    expect(screen.getByText('Therapeutic Efficacy by Frequency Band')).toBeInTheDocument()
    // Should not crash and should render the container
  })
})