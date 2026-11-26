import { apiRequest } from '../../../helpers/apiHelper'

export function getAdminOverview() {
  return Promise.all([apiRequest('/admin/users'), apiRequest('/admin/posts')])
}
