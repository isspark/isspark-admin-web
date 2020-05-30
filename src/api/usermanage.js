import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/fus/user/list',
    method: 'get',
    params: data
  })
}

export function page(data) {
  return request({
    url: '/fus/user/page',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/fus/user/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/fus/user/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/fus/user/delete',
    method: 'delete',
    params: data
  })
}

export function getRoleIdsByUserId(data) {
  return request({
    url: '/fus/user/role/roleIds',
    method: 'get',
    params: data
  })
}
