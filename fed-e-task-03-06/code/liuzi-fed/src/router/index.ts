import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: 'login' */ "@/views/login/index.vue")
  },
  {
    path: "/",
    component: Layout,
    meta: { // 父路由写过了 requiresAuth ，子路由就可以不用写了
      requiresAuth: true // 自定义数据
    }, // meta 默认就是一个空对象，不写也行
    children: [
      {
        path: "",
        name: "home",
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home/index.vue")
        // meta: {
        //   requiresAuth: true // 自定义数据
        // } // meta 默认就是一个空对象，不写也行
      },
      {
        path: "/user",
        name: "user",
        component: () => import(/* webpackChunkName: 'user' */ "@/views/user/index.vue")
      },
      {
        path: "/role",
        name: "role",
        component: () => import(/* webpackChunkName: 'role' */ "@/views/role/index.vue")
      },
      {
        path: "/advert",
        name: "advert",
        component: () => import(/* webpackChunkName: 'advert' */ "@/views/advert/index.vue")
      },
      {
        path: "/advert-space",
        name: "advert-space",
        component: () => import(/* webpackChunkName: 'advert-space' */ "@/views/advert-space/index.vue")
      },
      {
        path: "/menu",
        name: "menu",
        component: () => import(/* webpackChunkName: 'menu' */ "@/views/menu/index.vue")
      },
      {
        path: "/resource",
        name: "resource",
        component: () => import(/* webpackChunkName: 'resource' */ "@/views/resource/index.vue")
      },
      {
        path: "/course",
        name: "course",
        component: () => import(/* webpackChunkName: 'course' */ "@/views/course/index.vue")
      },
      {
        path: "/menu/create",
        name: "menu-create",
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ "@/views/menu/create.vue")
      },
      {
        path: "/menu/:id/edit",
        name: "menu-edit",
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ "@/views/menu/edit.vue")
      },
      {
        path: "/advert-space/create",
        name: "advert-space-create",
        component: () => import(/* webpackChunkName: 'advert-create-create' */ "@/views/advert-space/create.vue")
      },
      {
        path: "/advert-space/:id/edit",
        name: "advert-space-edit",
        component: () => import(/* webpackChunkName: 'advert-create-edit' */ "@/views/advert-space/edit.vue")
      },
      {
        path: "/course/create",
        name: "course-create",
        component: () => import(/* webpackChunkName: 'course' */ "@/views/course/create.vue")
      },
      {
        path: "/course/:courseId/edit",
        name: "course-edit",
        component: () => import(/* webpackChunkName: 'course' */ "@/views/course/edit.vue")
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: '404' */ "@/views/error-page/404.vue")
  }
];

const router = new VueRouter({
  routes
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 只要有一级路由需要身份认证，就需要验证登录状态
    if (!store.state.user) {
      next({
        name: "login",
        query: {
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      });
    } else {
      next(); // 允许通过
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

export default router;
