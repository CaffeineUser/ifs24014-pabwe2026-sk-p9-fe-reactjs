import { describe, expect, it, vi } from 'vitest'
import Swal from 'sweetalert2'
import {
  formatDate,
  formatReadingTime,
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from './toolsHelper'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

describe('formatDate', () => {
  it('memformat tanggal dalam bahasa Indonesia', () => {
    expect(formatDate('2026-11-24T12:00:00Z')).toBe('24 November 2026')
  })

  it('menyertakan jam bila diminta', () => {
    expect(formatDate('2026-11-24T12:00:00Z', true)).toMatch(/24 November 2026.*\d{2}[.:]\d{2}/)
  })

  it('mengembalikan "-" untuk nilai kosong atau tidak valid', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('')).toBe('-')
    expect(formatDate('bukan tanggal')).toBe('-')
  })
})

describe('formatReadingTime', () => {
  it('menambahkan satuan menit baca', () => {
    expect(formatReadingTime(3)).toBe('3 menit baca')
  })
})

describe('dialog SweetAlert2', () => {
  it('showSuccessAlert menampilkan ikon sukses dan pesan', async () => {
    await showSuccessAlert('Tersimpan')
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'success', text: 'Tersimpan', showConfirmButton: false }),
    )
  })

  it('showErrorAlert menampilkan ikon galat dan pesan', async () => {
    await showErrorAlert('Gagal menyimpan')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', text: 'Gagal menyimpan' }))
  })

  it('memakai warna gelap saat mode gelap aktif', async () => {
    document.documentElement.classList.add('dark')
    await showErrorAlert('x')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ background: '#1f2937', color: '#f9fafb' }))
  })

  it('tidak menambahkan warna latar saat mode terang, tetapi tetap memakai warna tombol aksesibel', async () => {
    await showErrorAlert('x')
    const options = Swal.fire.mock.calls[0][0]
    expect(options).not.toHaveProperty('background')
    expect(options.confirmButtonColor).toBe('#4338ca')
  })

  it('showConfirmDialog mengembalikan true saat dikonfirmasi dan memakai teks bawaan', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true })

    const confirmed = await showConfirmDialog({ title: 'Hapus?', text: 'Yakin?' })

    expect(confirmed).toBe(true)
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ confirmButtonText: 'Ya', showCancelButton: true, cancelButtonText: 'Batal' }),
    )
  })

  it('showConfirmDialog mengembalikan false saat dibatalkan dan memakai teks kustom', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false })

    const confirmed = await showConfirmDialog({ title: 'Hapus?', text: 'Yakin?', confirmText: 'Hapus' })

    expect(confirmed).toBe(false)
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonText: 'Hapus' }))
  })
})