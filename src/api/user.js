import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/fus/login',
    method: 'get',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/fus/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/fus/logout',
    method: 'get'
  })
}
