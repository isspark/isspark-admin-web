import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/fus/role/list',
    method: 'get',
    params: data
  })
}

export function tree(data) {
  return request({
    url: '/fus/role/list/tree',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/fus/role/add',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/fus/role/delete',
    method: 'delete',
    params: data
  })
}

export function getResourceIdsByRoleId(data) {
  return request({
    url: '/fus/roleResource/resourceIds/byRoleId',
    method: 'get',
    params: data
  })
}
