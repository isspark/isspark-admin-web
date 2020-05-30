import { constantRoutes } from '@/router'
import Layout from '@/layout'
// const _import = require('./router/_import_development')
const _import = require('@/router/_import_development')

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, userInfo) {
    return new Promise(resolve => {
      // const accessedRoutes = [
      //   {
      //     path: 'table',
      //     component: 'Layout',
      //     name: '商户管理',
      //     meta: { title: '商户管理', icon: 'example' },
      //     children: [
      //       {
      //         path: 'addproduct',
      //         component: '/fus/products/addproducts/add-products',
      //         name: 'add-products',
      //         meta: { title: '添加商品', icon: 'icon', noCache: true }
      //       },
      //       {
      //         path: 'addServerType',
      //         component: '/fus/products/addproducts/add-products',
      //         name: 'addServerType',
      //         meta: { title: '添加服务类别', icon: 'icon', noCache: true }
      //       }
      //     ]
      //   },
      //   // 404 page must be placed at the end !!!
      //   { path: '*', redirect: '/404', hidden: true }
      // ]
      // const res = []
      // for (var j = 0, len = accessedRoutes.length; j < len; j++) {
      //   res.push(backendMenuToRoute(accessedRoutes[j]))
      // }
      // commit('SET_ROUTES', res)
      // resolve(res)
      const dynamicRoute = toRouteMenus(userInfo.menus)
      dynamicRoute.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', dynamicRoute)
      resolve(dynamicRoute)
    })
  }
}

// eslint-disable-next-line no-unused-vars
function toRouteMenus(menus) {
  const result = []
  menus.forEach(menu => {
    result.push(toRouteMenu(menu))
  })
  return result
}

function toRouteMenu(menu) {
  const result = {
    path: '',
    component: '',
    name: '',
    meta: { title: '', elicon: '' },
    children: []
  }
  result.path = '/' + menu.value
  result.name = menu.name
  result.meta.title = menu.name
  if (menu.icon) {
    result.meta.elicon = menu.icon.substr(8)
  }

  if (menu.type === 0) {
    result.component = Layout
  } else if (menu.type === 1) {
    result.component = _import(menu.url)
  }
  if (menu.children) {
    menu.children.forEach(tmp => {
      result.children.push(toRouteMenu(tmp))
    })
  }
  return result
}
/* eslint-disable */
function backendMenuToRoute(menu) {
  // 具体内容根据自己的数据结构来定，这里需要注意的一点是
  // 原先routers写法是component: () => import('@/view/error-page/404.vue')
  // 经过json数据转换，这里会丢失，所以需要按照上面提过的做转换，下面只写了核心点，其他自行处理
  let tmp = Object.assign({}, menu)
  if(tmp.component){
    tmp.component = ( tmp.component == 'Layout' ? Layout : _import(tmp.component))
  }
  if(tmp.children){
    for(var j = 0,len = tmp.children.length; j < len; j++){
      tmp.children[j] = backendMenuToRoute(tmp.children[j])
    }
  }
  return tmp
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
