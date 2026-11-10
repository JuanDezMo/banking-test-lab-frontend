import { act, renderHook } from '@testing-library/react'
import { formatCountdown, useCountdown } from './useCountdown'

describe('useCountdown', () => {
  it('counts down to zero and stops', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown())

    act(() => result.current.start(2))
    expect(result.current).toMatchObject({ secondsLeft: 2, isRunning: true })

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.secondsLeft).toBe(1)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current).toMatchObject({ secondsLeft: 0, isRunning: false })
  })
})

describe('formatCountdown', () => {
  it.each([
    [0, '0:00'],
    [9, '0:09'],
    [75, '1:15'],
    [900, '15:00'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatCountdown(seconds)).toBe(expected)
  })
})
