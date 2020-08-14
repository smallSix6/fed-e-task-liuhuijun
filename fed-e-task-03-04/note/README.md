## 搭建自己的SSR、静态站点生成（SSG）及封装 Vue.js 组件库 （项目见：<https://github.com/smallSix6/fed-e-task-liuhuijun/tree/master/fed-e-task-03-04>

### 任务一：搭建自己的 SSR
#### 1、渲染一个 Vue 的实例
+ npm init -y
+ npm i vue vue-server-renderer
+ 根目录下新建 server.js
```js
const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

const app = new Vue({
  template: `
      <div id="app">
        <h1> {{ message }}</h1 >
      </div >
  `,
  data: {
    message: '刘惠俊'
  }
})
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
})
```
+ 执行上述代码，结果如下：
```js
<div id="app" data-server-rendered="true"><h1> 刘惠俊</h1></div>
```

#### 2、使用 HTML 模板结合到 web 服务器中
+ index.template.html 中内容如下：
```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {{{meta}}}
  <title>{{title}}</title>
</head>

<body>
  <!--vue-ssr-outlet-->
</body>

</html>
```
+ server.js 中内容如下：
```js
const Vue = require('vue')
const fs = require('fs')
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8')
})
const express = require('express')

const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    template: `
      <div id="app">
        <h1> {{ message }}</h1 >
      </div >
  `,
    data: {
      message: '刘惠俊'
    }
  })
  renderer.renderToString(app, {
    title: '刘惠俊',  // html 中用 {{title}}, title 字段会被解析
    meta: `<meta name="description" content="刘惠俊">`  // html 中用 {{{meta}}}, meta 字段不会被解析
  }, (err, html) => {
    if (err) {
      res.status(500).end('server Error')
    }
    res.setHeader('Content-Type', 'text/html;charset=utf8')
    res.end(html)
  })
})

server.listen(3000, () => {
  console.log('server running at port 3000')
})
```


#### 3、构建配置
+ 基本思路
  + ![](../images/vueSSR构建流程.png)
+ 源码结构(< https://ssr.vuejs.org/zh/guide/structure.html#%E4%BD%BF%E7%94%A8-webpack-%E7%9A%84%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84 >)
  + +src
    + -app.js
    ```js
    // 通用入口
    import Vue from 'vue'
    import App from './App.vue'

    // 导出一个工厂函数，用于创建新的
    // 应用程序、router 和 store 实例
    export function createApp() {
      const app = new Vue({
        // 根实例简单的渲染应用程序组件。
        render: h => h(App)
      })
      return { app }
    }
    ```
    + -App.vue
    ```js
    <template>
      <div id="app">
        <h1>{{message}}</h1>
        <h2>客户端动态交互</h2>
        <div>
          <input v-model="message" />
        </div>
        <div>
          <button @click="onClick">点击测试</button>
        </div>
      </div>
    </template>

    <script>
    export default {
      name: "App",
      data() {
        return {
          message: "拉钩教育"
        };
      },
      methods: {
        onClick() {
          console.log("Hello World!");
        }
      }
    };
    </script>

    <style scoped>
    </style>
    ```
    + -entry-client.js
    ```js
    import { createApp } from './app'

    // 客户端特定引导逻辑……

    const { app } = createApp()

    // 这里假定 App.vue 模板中根元素具有 `id="app"`
    app.$mount('#app')
    ```
    + -entry-server.js
    ```js
    import { createApp } from './app'

    export default context => {
      const { app } = createApp()
      return app
    }
    ```
+ 安装依赖
  + 构建配置
    1. 安装生产依赖
      + npm i vue vue-server-renderer express cross-env

      |包                    |说明|
      |  -----              | -----|
      |vue                  | Vue.js 核心库|
      |vue-server-renderer  | Vue 服务端渲染工具|
      |express              | 基于 Node 的 Web 服务框架|
      |cross-env            | 通过 npm scripts 设置跨平台环境变量|
    2. 安装开发依赖
      + npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin
      + ![](../images/开发依赖包说明.png)
+ webpack 配置文件
  + 根目录新建 build 文件夹，文件夹中的子文件如下：
    + webpack.base.config.js
    ```js
    /* 
    公共配置
    */

    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    const path = require('path')
    const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
    const resolve = file => path.resolve(__dirname, file)

    const isProd = process.env.NODE_ENV === 'production'

    module.exports = {
      mode: isProd ? 'production' : 'development',
      output: {
        path: resolve('../dist/'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
      },
      resolve: {
        alias: {
          // 路径别名，@ 指向 src
          '@': resolve('../src/')
        },
        // 可以省略的扩展名
        // 当省略扩展名的时候，按照从前往后的顺序依次解析
        extensions: ['.js', '.vue', '.json']
      },
      devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
      module: {
        rules: [
          // 处理图片资源
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                }
              }
            ]
          },
          // 处理字体资源
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader']
          },
          // 处理 .vue 资源
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          // 处理 css 资源
          // 它会应用到普通的 .css 文件
          // 以及 .vue 文件中的 style 块
          {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          },
          // css 预处理器
          // 例如处理 less 资源
          // {
          //   test: /\.less$/,
          //   use: [
          //     'vue-style-loader',
          //     'css-loader',
          //     'less-loader'
          //   ]
          // }
        ]
      },
      plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
      ]
    }
    ```
    + webpack.client.config.js
    ```js
    /* 
    客户端打包配置
    */
    const { merge } = require('webpack-merge')
    const baseConfig = require('./webpack.base.config')
    const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

    module.exports = merge(baseConfig, {
      entry: {
        app: './src/entry-client.js'
      },
      module: {
        rules: [
          // ES6 转 ES5
          {
            test: /\.m?js/,
            exclude: /(node_modules|brower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true,
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          }
        ]
      },
      // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中
      // 以便可以在之后正确注入异步 chunk
      optimization: {
        splitChunks: {
          name: 'manifest',
          minChunks: Infinity
        }
      },
      plugins: [
        // 此插件在输出目录中生成 'vue-ssr-client-manifest.json'
        new VueSSRClientPlugin()
      ]
    })
    ```
    + webpack.server.config.js
    ```js
    /* 
    服务端打包配置
    */
    const { merge } = require('webpack-merge')
    const nodeExternals = require('webpack-node-externals')
    const baseConfig = require('./webpack.base.config')
    const VueSSRClientPlugin = require('vue-server-renderer/server-plugin')

    module.exports = merge(baseConfig, {
      // 将 entry 指向应用程序的 server entry 文件
      entry: './src/entry-server.js',

      // 这允许 webpack 以 Node 使用方式处理模块加载
      // 并且还会在编译 Vue 组件时，告知 vue-loader 输送面向服务器代码（server-oriented code)
      target: 'node',
      output: {
        filename: 'server-bundle.js',
        // 此处告知 server bundle 使用 Node 风格导出模块 (Node-style exports)
        libraryTarget: 'commonjs2'
      },
      // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
      externals: [nodeExternals({
        // 白名单中的资源依然正常打包
        allowlist: [/\.css$/]
      })],
      plugins: [
        // 这是将服务器的整个输出构建为单个 JSON 文件的插件
        // 默认文件名为 vue-ssr-server-bundle.json
        new VueSSRClientPlugin()
      ]
    })
    ```
+ 配置构建文件
  + package.json 中新增 script 命令
  ```js
  "scripts": {
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
    "build": "rimraf dist && npm run build:client && npm run build:server"
  },
  ```
+ 启动应用
  + 根目录下的 server.js 如下
  ```js
  const Vue = require('vue')
  const fs = require('fs')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    // runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
  const express = require('express')
  const server = express()
  server.use('/dist', express.static('./dist'))
  server.get('/', (req, res) => {

    renderer.renderToString({
      title: '刘惠俊',  // html 中用 {{title}}, title 字段会被解析
      meta: `<meta name="description" content="刘惠俊">`  // html 中用 {{{meta}}}, meta 字段不会被解析
    }, (err, html) => {
      if (err) {
        res.status(500).end('server Error')
      }
      res.setHeader('Content-Type', 'text/html;charset=utf8')
      res.end(html)
    })
  })
  server.listen(3000, () => {
    console.log('server running at port 3000')
  })
  ```
+ 解析渲染流程
  > 注意：在开发模式下，Vue 将推断客户端生成的虚拟 DOM 树 (virtual DOM tree)，是否与从服务器渲染的 DOM 结构 (DOM structure) 匹配。如果无法匹配，它将退出混合模式，丢弃现有的 DOM 并从头开始渲染。**在生产模式下，此检测会被跳过，以避免性能损耗。**
  + 一些需要注意的坑：
    + 使用「SSR + 客户端混合」时，需要了解的一件事是，浏览器可能会更改的一些特殊的 HTML 结构。例如，当你在 Vue 模板中写入：
    ```js
    <table>
      <tr><td>hi</td></tr>
    </table>
    ```
    + 浏览器会在 <table> 内部自动注入 <tbody>，然而，由于 Vue 生成的虚拟 DOM (virtual DOM) 不包含 <tbody>，所以会导致无法匹配。为能够正确匹配，请确保在模板中写入有效的 HTML。

#### 4、构建配置开发模式
+ 基本思路：
  + package.json 中新增 script 命令：
    ```js
    "start": "cross-env NODE_ENV=production node server.js",
    "dev": "node server.js"
    ```
  + 更新 server.js 中的代码如下：
  ```js
  const Vue = require('vue')
  const fs = require('fs')

  const isProd = process.env.NODE_ENV === 'production'
  let renderer

  if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
      // runInNewContext: false, // 推荐
      template, // （可选）页面模板
      clientManifest // （可选）客户端构建 manifest
    })
  } else {
    // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器

  }

  const express = require('express')
  const server = express()
  server.use('/dist', express.static('./dist'))

  const render = (req, res) => {
    renderer.renderToString({
      title: '刘惠俊',  // html 中用 {{title}}, title 字段会被解析
      meta: `<meta name="description" content="刘惠俊">`  // html 中用 {{{meta}}}, meta 字段不会被解析
    }, (err, html) => {
      if (err) {
        res.status(500).end('server Error')
      }
      res.setHeader('Content-Type', 'text/html;charset=utf8')
      res.end(html)
    })
  }
  server.get('/', isProd
    ? render
    : (req, res) => {
      // TODO:等待有了 Renderer 渲染器以后，调用 render 进行渲染
      render()
    }
  )
  server.listen(3000, () => {
    console.log('server running at port 3000')
  })
  ```
+ 提取处理模块
  + 根目录下新建 setup-dev-server.js，代码如下：
  ```js
  module.exports = (server, callback) => {
    const onReady = new Promise()

    // 监视构建 -> 更新 Renderer

    return onReady
  }
  ```
  + 更新 server.js 中的代码如下：
  ```js
  const Vue = require('vue')
  const fs = require('fs')
  const { createBundleRenderer } = require('vue-server-renderer')
  const setupDevServer = require('./build/setup-dev-server')


  const express = require('express')
  const server = express()
  server.use('/dist', express.static('./dist'))

  const isProd = process.env.NODE_ENV === 'production'
  let renderer
  let onReady
  if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
      // runInNewContext: false, // 推荐
      template, // （可选）页面模板
      clientManifest // （可选）客户端构建 manifest
    })
  } else {
    // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
      renderer = createBundleRenderer(serverBundle, {
        // runInNewContext: false, // 推荐
        template, // （可选）页面模板
        clientManifest // （可选）客户端构建 manifest
      })
    })
  }

  const render = (req, res) => {
    renderer.renderToString({
      title: '刘惠俊',  // html 中用 {{title}}, title 字段会被解析
      meta: `<meta name="description" content="刘惠俊">`  // html 中用 {{{meta}}}, meta 字段不会被解析
    }, (err, html) => {
      if (err) {
        res.status(500).end('server Error')
      }
      res.setHeader('Content-Type', 'text/html;charset=utf8')
      res.end(html)
    })
  }
  server.get('/', isProd
    ? render
    : async (req, res) => {
      // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
      await onReady
      render()
    }
  )
  server.listen(3000, () => {
    console.log('server running at port 3000')
  })
  ```
+ update 更新函数
  + /build/setup-dev-server.js 中的代码更新为：
  ```js
  module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    // 监视构建 -> 更新 Renderer
    let template
    let serverBundle
    let clientManifest

    const update = () => {
      if (template && serverBundle && clientManifest) {
        ready()
        callback(serverBundle, template, clientManifest)
      }
    }

    // 监视构建 template -> 调用 update -> 更新 Renderer 渲染器
    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    return onReady
  }
  ```
+ 处理模板文件
  + /build/setup-dev-server.js 中的代码更新为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')

  module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    // 监视构建 -> 更新 Renderer
    let template
    let serverBundle
    let clientManifest

    const update = () => {
      if (template && serverBundle && clientManifest) {
        ready()
        callback(serverBundle, template, clientManifest)
      }
    }

    // 监视构建 template -> 调用 update -> 更新 Renderer 渲染器
    const templatePath = path.resolve(__dirname, '../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
    // fs.watch   fs.watchFile
    // chokidar
    chokidar.watch(templatePath).on('change', () => {
      template = fs.readFileSync(templatePath, 'utf-8')
      update()
    })

    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    return onReady
  }
  ```
+ 


