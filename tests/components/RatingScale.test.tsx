import { render, screen, fireEvent } from '@testing-library/react'
import { RatingScale } from '@/components/survey/RatingScale'
import { describe, it, expect, vi } from 'vitest'

describe('RatingScale', () => {
  it('renders 5 buttons', () => {
    render(<RatingScale value={null} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })
  it('marks selected item as aria-pressed', () => {
    render(<RatingScale value={3} onChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false')
  })
  it('calls onChange with numeric value on click', () => {
    const onChange = vi.fn()
    render(<RatingScale value={null} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('button')[4])
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
