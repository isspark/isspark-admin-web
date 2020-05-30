import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/fus/resource/list/tree',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/fus/resource/add',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/fus/resource/delete',
    method: 'delete',
    params: data
  })
}
