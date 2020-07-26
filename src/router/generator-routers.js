// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
// import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  // 'IndexManager': () => import('@/views/dashboard/Analysis'),
  'IndexManager': () => import('@/views/banner/Index'),
  'IndexBanner': () => import('@/views/banner/Index'),
  'CacheManager': () => import('@/views/banner/Index'),
  'MediaManager': () => import('@/views/media/Index'),

  // 文章管理
  'DocumentManager': () => import(/* webpackChunkName: "fail" */ '@/views/document/Index'),
  'DocumentEdit': () => import(/* webpackChunkName: "fail" */ '@/views/document/Editor'),

  // 栏目管理
  'ColumnManager': () => import(/* webpackChunkName: "fail" */ '@/views/column/IndexTree')
  // 'ColumnManager': () => import(/* webpackChunkName: "fail" */ '@/views/column/Index')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 其他固定URl
const otherRouter = [
  {
    id: 'index',
    name: 'index',
    parentId: 'root',
    path: '/index',
    meta: {
      icon: 'dashboard',
      title: '系统设置',
      show: true
    },
    component: 'IndexManager'
  },
  {
    id: 'media',
    name: 'media',
    parentId: 'root',
    path: '/media',
    props: true,
    meta: {
      icon: 'folder',
      title: '媒体管理'
    },
    component: 'MediaManager'
  },
  {
    id: 'banner',
    name: 'banner',
    parentId: 'index',
    meta: {
      icon: 'picture',
      title: '轮播图管理',
      show: true
    },
    path: '/index/banner',
    component: 'IndexBanner'
  },
  {
    id: 'connect_us',
    name: 'connect_us',
    parentId: 'index',
    meta: {
      icon: 'picture',
      title: '联系我们',
      show: true
    },
    path: '/index/connect_us',
    component: 'IndexBanner'
  },
  {
    id: 'column',
    name: 'column',
    path: '/column',
    parentId: 'root',
    meta: {
      icon: 'cluster',
      title: '栏目管理'
    },
    component: 'ColumnManager'
  },
  {
    id: 'document',
    parentId: 'root',
    name: 'document',
    meta: {
      icon: 'align-left',
      title: '内容管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/document/news'
  },
  {
    id: 'cache',
    parentId: 'root',
    name: 'cache',
    meta: {
      icon: 'cluster',
      title: '网站缓存',
      show: true
    },
    component: 'CacheManager'
  },
  {
    id: 'editor',
    name: 'editor',
    parentId: 'root',
    path: '/document/editor/:colId/:docId',
    props: true,
    meta: {
      title: '编辑文档',
      show: false
    },
    component: 'DocumentEdit'
  }
]

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/index',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (token) => {
  return new Promise((resolve, reject) => {
    loginService.getCurrentUserNav(token).then(res => {
      // console.log('res', 'res', res.data)
      const { data } = res
      otherRouter.forEach(item => {
        data.push(item)
      })
      const menuNav = []
      const childrenNav = []
      // 后端数据, 根级树数组,  根级 PID
      listToTree(data, childrenNav, 'root')
      // 添加其他路由
      rootRouter.children = childrenNav
      menuNav.push(rootRouter)
      // console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      // console.log('routers', routers)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // console.log(item, '这里是栏目')
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
