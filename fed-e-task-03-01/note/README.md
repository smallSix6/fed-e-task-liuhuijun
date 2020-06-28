## 手写 Vue Route、手写响应式、虚拟 DOM 和 Diff 算法

### 任务二：Vue-Router 原理实现
#### 1、Vue Router 使用步骤
+ router/index.js
  + 1、注册路有插件
  ```js
  // Vue.use 是用来注册插件，他会调用传入对象的 install 方法，如果是函数就直接调用函数
  Vue.use(VueRouter);
  ```
  + 2、定义路由规则
  ```js
  const routes = [{
          path: "/",
          name: "Home",
          component: Home
      },
      {
          path: "/about",
          name: "About",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () =>
              import ( /* webpackChunkName: "about" */ "../views/About.vue")
      }
  ];
  ```
  + 3、创建 router 对象
  ```js
  const router = new VueRouter({
      routes
  });
  ```
+ main.js
  + 注册 route 对象:
  ```js
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
  ```
+ App.vue:
  + 创建路由组件的占位
  ```js
  <router-view />
  ```

#### 2、动态路由
+ 在 path 后加参数：
```js
// 配置动态路由参数
{
    path: "/about/:user",
    name: "About",
    // 开启 props 会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/About.vue") // 路由懒加载
}

// 获取动态路由参数
<div>
  <!-- 方式1：通过当前路由规则，获取数据 -->
  通过当前路由规则获取： {{$route.params.user}}
</div>
---
<div>
  <!-- 方式2：路由规则中开启 props 传参 -->
  通过开启 props 获取： {{user}}
</div>
<script>
export default {
  props: ['user']
}
</script>
```

#### 3、嵌套路由
+ 1、components/Layout.vue,设置 <router-view> 占位
```js
<template>
  <div>
    <div>header</div>
    <div>
      <router-view></router-view>
    </div>
    <div>footer</div>
  </div>
</template>
```
+ 2、router/index.js, routes 配置如下
```js
// 加载组件
import Layout from '@/components/Layout.vue'
import Index from '@/views/Index.vue'
import Login from '@/views/Login.vue'
// 路由规则
const routes = [
    // 嵌套路由
    {
        path: "/",

        component: Layout,
        children: [{
                name: 'index',
                path: '',
                component: Index
            },
            {
                path: "/about/:user",
                name: "About",
                // 开启 props 会把 URL 中的参数传递给组件
                // 在组件中通过 props 来接收 URL 参数
                props: true,
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import ( /* webpackChunkName: "about" */ "../views/About.vue")
            }
        ]
    },
    {
        path: "/about/:user",
        name: "About",
        // 开启 props 会把 URL 中的参数传递给组件
        // 在组件中通过 props 来接收 URL 参数
        props: true,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ "../views/About.vue")
    }
];
```
#### 4、编程式导航
```js
<button @click="push"> push </button>
<script>
  export default {
methods: {
push () {
this.$router.push('/')
// this.$router.push({name: 'Index'})
}
}
}
</script>
```



