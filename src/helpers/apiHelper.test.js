import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ApiError,
  AUTH_EXPIRED_EVENT,
  TOKEN_KEY,
  USER_KEY,
  apiRequest,
  apiUrl,
  clearSession,
  getToken,
  getUser,
  saveSession,
} from './apiHelper'

const fetchMock = vi.fn()

const reply = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
})

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('sesi pengguna', () => {
  it('menyimpan, membaca, dan menghapus token serta user', () => {
    saveSession('token-abc', { id: 1, username: 'budi' })

    expect(getToken()).toBe('token-abc')
    expect(getUser()).toEqual({ id: 1, username: 'budi' })

    clearSession()
    expect(getToken()).toBeNull()
    expect(getUser()).toBeNull()
  })

  it('getUser mengembalikan null bila data rusak', () => {
    localStorage.setItem(USER_KEY, '{rusak')
    expect(getUser()).toBeNull()
  })
})

describe('apiUrl', () => {
  it('memakai proxy bila VITE_API_URL kosong', () => {
    vi.stubEnv('VITE_API_URL', '')
    expect(apiUrl('/posts')).toBe('/api/posts')
  })

  it('memakai domain backend bila VITE_API_URL terisi', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.contoh.com')
    expect(apiUrl('/posts')).toBe('https://api.contoh.com/api/posts')
  })
})

describe('apiRequest', () => {
  it('GET tanpa token: tanpa header Authorization dan tanpa body', async () => {
    fetchMock.mockResolvedValue(reply({ status: 'success', message: 'ok', data: [1] }))

    const payload = await apiRequest('/public/posts')

    expect(payload.data).toEqual([1])
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/public/posts')
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
    expect(init.headers.Authorization).toBeUndefined()
    expect(init.headers['Content-Type']).toBeUndefined()
  })

  it('menyertakan token Bearer dan body JSON', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-abc')
    fetchMock.mockResolvedValue(reply({ status: 'success', message: 'dibuat' }, 201))

    await apiRequest('/posts', { method: 'POST', body: { title: 'Halo' } })

    const init = fetchMock.mock.calls[0][1]
    expect(init.headers.Authorization).toBe('Bearer token-abc')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(init.body).toBe('{"title":"Halo"}')
  })

  it('mengabaikan token bila auth=false', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-abc')
    fetchMock.mockResolvedValue(reply({ status: 'success', message: 'ok' }))

    await apiRequest('/auth/login', { method: 'POST', body: {}, auth: false })

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('meneruskan AbortSignal ke fetch', async () => {
    fetchMock.mockResolvedValue(reply({ status: 'success', message: 'ok' }))
    const controller = new AbortController()

    await apiRequest('/x', { signal: controller.signal })

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal)
  })

  it('melempar ApiError berisi pesan dan status dari server', async () => {
    fetchMock.mockResolvedValue(reply({ status: 'fail', message: 'Judul wajib diisi' }, 400))

    const error = await apiRequest('/posts').catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Judul wajib diisi')
    expect(error.status).toBe(400)
    expect(error.name).toBe('ApiError')
  })

  it('memakai pesan umum bila respons bukan JSON', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 502, json: () => Promise.reject(new Error('bukan json')) })

    const error = await apiRequest('/x').catch((e) => e)

    expect(error.message).toBe('Terjadi kesalahan pada server.')
    expect(error.status).toBe(502)
  })

  it('menolak respons 200 yang statusnya bukan success', async () => {
    fetchMock.mockResolvedValue(reply({ status: 'fail', message: 'ditolak' }, 200))

    await expect(apiRequest('/x')).rejects.toThrow('ditolak')
  })

  it('401 pada permintaan bertoken menghapus sesi dan memicu event', async () => {
    saveSession('token-abc', { id: 1 })
    const listener = vi.fn()
    window.addEventListener(AUTH_EXPIRED_EVENT, listener)
    fetchMock.mockResolvedValue(reply({ status: 'fail', message: 'Token tidak valid' }, 401))

    await expect(apiRequest('/auth/profile')).rejects.toThrow('Token tidak valid')

    expect(getToken()).toBeNull()
    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(AUTH_EXPIRED_EVENT, listener)
  })

  it('401 tanpa token (login salah) tidak menyentuh sesi dan tidak memicu event', async () => {
    const listener = vi.fn()
    window.addEventListener(AUTH_EXPIRED_EVENT, listener)
    fetchMock.mockResolvedValue(reply({ status: 'fail', message: 'Username atau password salah' }, 401))

    await expect(apiRequest('/auth/login', { method: 'POST', body: {}, auth: false })).rejects.toThrow(
      'Username atau password salah',
    )

    expect(listener).not.toHaveBeenCalled()
    window.removeEventListener(AUTH_EXPIRED_EVENT, listener)
  })

  it('kegagalan jaringan menjadi ApiError status 0', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await apiRequest('/x').catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.message).toContain('Tidak dapat terhubung')
  })

  it('pembatalan (AbortError) diteruskan apa adanya', async () => {
    const abort = new DOMException('Dibatalkan', 'AbortError')
    fetchMock.mockRejectedValue(abort)

    await expect(apiRequest('/x')).rejects.toBe(abort)
  })
})