import { apiRequest } from '../../../helpers/apiHelper'

export function authenticate(mode, payload) {
  return apiRequest(`/auth/${mode}`, {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export function logoutUser() {
  return apiRequest('/auth/logout', { method: 'POST' })
}
