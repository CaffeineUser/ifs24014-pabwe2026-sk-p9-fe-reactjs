import { apiRequest } from '../../../helpers/apiHelper'

export function getPublicPosts(queryString = '') {
  const query = queryString ? `?${queryString}` : ''
  return apiRequest(`/public/posts${query}`, { auth: false })
}

export function getPublicPost(slug) {
  return apiRequest(`/public/posts/${encodeURIComponent(slug)}`, { auth: false })
}
