import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useInput from './useInput'

describe('useInput', () => {
  it('nilai awal bawaan adalah string kosong', () => {
    const { result } = renderHook(() => useInput())
    expect(result.current[0]).toBe('')
  })

  it('memakai nilai awal yang diberikan', () => {
    const { result } = renderHook(() => useInput('halo'))
    expect(result.current[0]).toBe('halo')
  })

  it('onChange memperbarui nilai dari event input', () => {
    const { result } = renderHook(() => useInput())

    act(() => result.current[1]({ target: { value: 'baru' } }))

    expect(result.current[0]).toBe('baru')
  })

  it('setValue mengubah nilai langsung dan reset mengembalikannya', () => {
    const { result } = renderHook(() => useInput('awal'))

    act(() => result.current[2]('lain'))
    expect(result.current[0]).toBe('lain')

    act(() => result.current[3]())
    expect(result.current[0]).toBe('awal')
  })
})