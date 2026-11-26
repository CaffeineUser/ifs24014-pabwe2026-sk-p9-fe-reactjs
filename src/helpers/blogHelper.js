export const categories = ['Semua', 'Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']
export const unwrap = (payload) => payload?.data ?? payload
export const listOf = (value) => Array.isArray(value) ? value : value?.items ?? value?.posts ?? value?.users ?? []
export const titleOf = (post) => post?.title ?? 'Tanpa judul'
export const categoryOf = (post) => post?.category?.name ?? post?.category ?? 'Umum'
export const slugOf = (post) => post?.slug ?? post?.id
export const dateOf = (value) => {
  if (!value) return 'Belum diterbitkan'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Belum diterbitkan' : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}
