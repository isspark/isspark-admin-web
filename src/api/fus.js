/* eslint-disable */

import axios from 'axios'
/**
 * 添加服务类别接口
 * @param {类别名称} name 
 */
export const addServerType = (data, token) => {
    console.log("name: " + data);
    return axios.request({
        url: '/fus/addOrUpdateServerType',
        method: 'post',
        data,
        params: { token }
    })
}
/**
 * 删除服务类别接口
 * @param {类别名称} name 
 */
export const deleteServerType = (id, token) => {
    console.log("删除服务类别: " + id);
    return axios.request({
        url: '/fus/deleteServerType/' + id,
        method: 'post',
        params: { token }
    })
}

/**
 * 获取服务类别列表
 * @param {获取服务类别列表} 查询参数 
 */
export const getServerTypeList = (data, token) => {
    console.log("getServerTypeList: " + data);
    return axios.request({
        url: '/fus/getSTList',
        method: 'post',
        data,
        params: { token }
    })
}



