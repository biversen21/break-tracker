import { describe, it, expect } from 'vitest'
import { getTemplateTeamCount } from '@/lib/compute'
import { SAMPLE_TEMPLATE } from '@/lib/templates'
import type { BreakTemplate } from '@/lib/types'

describe('getTemplateTeamCount', () => {
  it('returns the correct team count for a populated template', () => {
    expect(getTemplateTeamCount(SAMPLE_TEMPLATE)).toBe(12)
  })

  it('returns 0 for an empty template', () => {
    const empty: BreakTemplate = { id: 'empty', name: 'Empty', teams: [] }
    expect(getTemplateTeamCount(empty)).toBe(0)
  })
})
