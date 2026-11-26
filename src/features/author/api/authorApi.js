import { apiRequest } from '../../../helpers/apiHelper'

export function getAuthorPosts() {
  return apiRequest('/posts')
}

export function getAuthorStats() {
  return apiRequest('/posts/stats')
}

export function saveAuthorPost(postId, body) {
  return apiRequest(postId ? `/posts/${postId}` : '/posts', {
    method: postId ? 'PUT' : 'POST',
    body,
  })
}

export function toggleAuthorPost(postId) {
  return apiRequest(`/posts/${postId}/toggle-publish`, { method: 'PATCH' })
}

export function deleteAuthorPost(postId) {
  return apiRequest(`/posts/${postId}`, { method: 'DELETE' })
}

export function generateAuthorDraft(payload) {
  return apiRequest('/posts/ai-generate', { method: 'POST', body: payload })
}
