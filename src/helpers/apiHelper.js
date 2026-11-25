export const TOKEN_KEY = 'delcom_blog_token'
export const USER_KEY = 'delcom_blog_user'
export const AUTH_EXPIRED_EVENT = 'auth:expired'

const NETWORK_ERROR_MESSAGE = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
const GENERIC_ERROR_MESSAGE = 'Terjadi kesalahan pada server.'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// VITE_API_URL kosong -> memakai proxy Vite (/api). Terisi -> backend di domain lain.
export function apiUrl(path) {
  return `${import.meta.env.VITE_API_URL || ''}/api${path}`
}

/**
 * Pembungkus fetch untuk API standar {status, message, data?}.
 * Mengembalikan payload penuh bila sukses, melempar ApiError bila gagal.
 */
export async function apiRequest(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { Accept: 'application/json' }
  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.status !== 'success') {
    if (response.status === 401 && token) {
      clearSession()
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    throw new ApiError(payload?.message || GENERIC_ERROR_MESSAGE, response.status)
  }

  return payload
}