
const loadSwal = async () => (await import('sweetalert2')).default

const baseOptions = () => ({
  confirmButtonColor: '#4338ca',
  cancelButtonColor: '#475569',
  ...(document.documentElement.classList.contains('dark')
    ? { background: '#1f2937', color: '#f9fafb' }
    : {}),
})

// Mengembalikan "-" bila nilai kosong atau bukan tanggal yang valid.
export function formatDate(value, withTime = false) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const options = withTime ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' }
  return new Intl.DateTimeFormat('id-ID', options).format(date)
}

export function formatReadingTime(minutes) {
  return `${minutes} menit baca`
}

export async function showSuccessAlert(message) {
  const Swal = await loadSwal()
  return Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1800,
    showConfirmButton: false,
    ...baseOptions(),
  })
}

export async function showErrorAlert(message) {
  const Swal = await loadSwal()
  return Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'Tutup',
    ...baseOptions(),
  })
}

// Mengembalikan true bila pengguna menekan tombol konfirmasi.
export async function showConfirmDialog({ title, text, confirmText = 'Ya' }) {
  const Swal = await loadSwal()
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    reverseButtons: true,
    ...baseOptions(),
  })
  return result.isConfirmed
}