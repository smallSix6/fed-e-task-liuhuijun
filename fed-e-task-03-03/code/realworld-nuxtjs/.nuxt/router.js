import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6bb89bfd = () => interopDefault(import('../pages/layouts' /* webpackChunkName: "" */))
const _0479502a = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _8a402446 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _5bc2bb1d = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _a4568da2 = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _d6dc1d0e = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _428cfe6a = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active-link',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _6bb89bfd,
    children: [{
      path: "",
      component: _0479502a,
      name: "home"
    }, {
      path: "/login",
      component: _8a402446,
      name: "login"
    }, {
      path: "/register",
      component: _8a402446,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _5bc2bb1d,
      name: "profile"
    }, {
      path: "/settings",
      component: _a4568da2,
      name: "settings"
    }, {
      path: "/editor",
      component: _d6dc1d0e,
      name: "editor"
    }, {
      path: "article/:slug",
      component: _428cfe6a,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
