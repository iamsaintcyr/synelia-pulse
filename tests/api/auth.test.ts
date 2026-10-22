import { describe, it, expect } from 'vitest'

describe('admin auth', () => {
  it('AUTH_SECRET env var is defined', () => {
    // In production AUTH_SECRET must be set. This test verifies the project
    // correctly reads it from the environment. Set it in .env.local before running.
    expect(typeof process.env.AUTH_SECRET).toBe('string')
  })
})
