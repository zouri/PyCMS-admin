// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse, articleManager, columnManager } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: 'analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: 'test-work',
            name: 'TestWork',
            component: () => import('@/views/dashboard/TestWork'),
            meta: { title: '测试功能', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      {
        path: '/column',
        name: 'column',
        component: () => import('@/views/column/Index'),
        meta: { title: '栏目管理', keepAlive: true, icon: columnManager }
      },
      // 文档管理界面
      {
        path: '/document_manager',
        name: 'document_manager',
        component: () => import('@/views/document/Index'),
        meta: { title: '文章管理', keepAlive: true, icon: articleManager, permission: [ 'dashboard' ] }
      },
      // 文档编辑界面,菜单中隐藏
      {
        path: '/document/editor/:colId/:docId',
        name: 'document_editor',
        component: () => import('@/views/document/Editor'),
        props: true,
        hidden: true,
        meta: { title: '编辑文章', keepAlive: false }
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
