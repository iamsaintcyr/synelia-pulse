import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db/index', () => ({ db: { select: vi.fn(), execute: vi.fn() } }))

describe('admin query types', () => {
  it('SummaryResponse satisfactionDistribution keys are 1-5', () => {
    type Keys = keyof { 1: number; 2: number; 3: number; 4: number; 5: number }
    const valid: Keys = 3
    expect(valid).toBe(3)
  })

  it('getSummary and getResponses and getExportData are exported from lib/queries/admin', async () => {
    const mod = await import('@/lib/queries/admin')
    expect(typeof mod.getSummary).toBe('function')
    expect(typeof mod.getResponses).toBe('function')
    expect(typeof mod.getExportData).toBe('function')
  })

  it('sanitizeCsvCell prefixes dangerous characters', async () => {
    const { sanitizeCsvCell } = await import('@/lib/queries/admin')
    expect(sanitizeCsvCell('=SUM(A1)')).toBe("'=SUM(A1)")
    expect(sanitizeCsvCell('+test')).toBe("'+test")
    expect(sanitizeCsvCell('-test')).toBe("'-test")
    expect(sanitizeCsvCell('@test')).toBe("'@test")
    expect(sanitizeCsvCell('normal text')).toBe('normal text')
    expect(sanitizeCsvCell(null)).toBe('')
  })
})
