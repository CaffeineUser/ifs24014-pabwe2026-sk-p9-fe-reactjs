import { useCallback, useEffect, useState } from 'react'

export const THEME_KEY = 'delcom_blog_theme'
export const ACCENT_KEY = 'delcom_blog_accent'
export const THEMES = ['light', 'dark']
export const ACCENTS = ['indigo', 'emerald', 'rose', 'amber']
const DEFAULT_ACCENT = 'indigo'

function initialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (THEMES.includes(stored)) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function initialAccent() {
  const stored = localStorage.getItem(ACCENT_KEY)
  return ACCENTS.includes(stored) ? stored : DEFAULT_ACCENT
}

// Panggil SEKALI di App lalu turunkan lewat props.
export default function useTheme() {
  const [theme, setTheme] = useState(initialTheme)
  const [accent, setAccentState] = useState(initialAccent)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.accent = accent
    localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const toggleTheme = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), [])

  const setAccent = useCallback((next) => {
    if (ACCENTS.includes(next)) setAccentState(next)
  }, [])

  return { theme, accent, accents: ACCENTS, toggleTheme, setAccent }
}