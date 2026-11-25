import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom tidak menyediakan beberapa API yang dibutuhkan Toast UI Editor / ProseMirror.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

HTMLCanvasElement.prototype.getContext = () => null
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const emptyRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} })
Range.prototype.getBoundingClientRect = () => ({
  x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON() {},
})
Range.prototype.getClientRects = emptyRects

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('data-accent')
  vi.clearAllMocks()
})