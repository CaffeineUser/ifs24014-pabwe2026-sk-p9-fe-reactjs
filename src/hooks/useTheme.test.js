import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useTheme, { ACCENTS, ACCENT_KEY, THEME_KEY } from './useTheme'

const originalMatchMedia = window.matchMedia

const prefersDark = (matches) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({ matches, media: query }))
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('useTheme', () => {
  it('mengikuti preferensi sistem (terang) bila belum ada pilihan tersimpan', () => {
    prefersDark(false)
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('mengikuti preferensi sistem (gelap) bila belum ada pilihan tersimpan', () => {
    prefersDark(true)
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('memakai tema tersimpan yang valid dan mengabaikan yang tidak valid', () => {
    prefersDark(false)
    localStorage.setItem(THEME_KEY, 'dark')
    expect(renderHook(() => useTheme()).result.current.theme).toBe('dark')

    localStorage.setItem(THEME_KEY, 'neon')
    expect(renderHook(() => useTheme()).result.current.theme).toBe('light')
  })

  it('toggleTheme bolak-balik terang <-> gelap dan menyimpannya', () => {
    prefersDark(false)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('aksen bawaan indigo dan terpasang di atribut data-accent', () => {
    prefersDark(false)
    const { result } = renderHook(() => useTheme())

    expect(result.current.accent).toBe('indigo')
    expect(result.current.accents).toEqual(ACCENTS)
    expect(document.documentElement.dataset.accent).toBe('indigo')
  })

  it('memakai aksen tersimpan yang valid dan mengabaikan yang tidak valid', () => {
    prefersDark(false)
    localStorage.setItem(ACCENT_KEY, 'rose')
    expect(renderHook(() => useTheme()).result.current.accent).toBe('rose')

    localStorage.setItem(ACCENT_KEY, 'ungu')
    expect(renderHook(() => useTheme()).result.current.accent).toBe('indigo')
  })

  it('setAccent mengganti aksen yang valid dan menolak yang tidak valid', () => {
    prefersDark(false)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setAccent('emerald'))
    expect(result.current.accent).toBe('emerald')
    expect(localStorage.getItem(ACCENT_KEY)).toBe('emerald')
    expect(document.documentElement.dataset.accent).toBe('emerald')

    act(() => result.current.setAccent('ungu'))
    expect(result.current.accent).toBe('emerald')
  })
})