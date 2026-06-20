import { describe, it, expect } from 'vitest'
import { percentileRanks, invert, meanDefined } from './normalize'

describe('percentileRanks', () => {
  it('ranks distinct values monotonically within 0-100', () => {
    const r = percentileRanks([10, 20, 30, 40]) as number[]
    expect(r[0]).toBeLessThan(r[1])
    expect(r[1]).toBeLessThan(r[2])
    expect(r[2]).toBeLessThan(r[3])
    for (const v of r) expect(v).toBeGreaterThanOrEqual(0), expect(v).toBeLessThanOrEqual(100)
  })

  it('gives the lowest value the smallest rank and highest the largest', () => {
    const r = percentileRanks([5, 1, 9]) as number[]
    expect(Math.min(...r)).toBe(r[1]) // value 1
    expect(Math.max(...r)).toBe(r[2]) // value 9
  })

  it('assigns equal mid-rank to ties', () => {
    const r = percentileRanks([10, 10, 10]) as number[]
    expect(r).toEqual([50, 50, 50])
  })

  it('returns 50 (neutral) for a single value', () => {
    expect(percentileRanks([42])).toEqual([50])
  })

  it('preserves undefined and ignores it when ranking', () => {
    const r = percentileRanks([10, undefined, 30])
    expect(r[1]).toBeUndefined()
    // ranked among the two present values only
    expect(r[0]).toBe(25)
    expect(r[2]).toBe(75)
  })

  it('returns all undefined when nothing is present', () => {
    expect(percentileRanks([undefined, undefined])).toEqual([undefined, undefined])
  })
})

describe('invert', () => {
  it('mirrors around 100', () => {
    expect(invert(0)).toBe(100)
    expect(invert(100)).toBe(0)
    expect(invert(30)).toBe(70)
  })
  it('passes through undefined', () => {
    expect(invert(undefined)).toBeUndefined()
  })
})

describe('meanDefined', () => {
  it('averages only defined values', () => {
    expect(meanDefined([10, undefined, 20])).toBe(15)
  })
  it('is undefined when nothing is defined', () => {
    expect(meanDefined([undefined, undefined])).toBeUndefined()
  })
})
