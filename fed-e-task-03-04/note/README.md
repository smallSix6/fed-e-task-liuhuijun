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
  + /build/setup-dev-server.js 中的代码更新部分为：
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
  + /build/setup-dev-server.js 中的代码更新部分为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')

  module.exports = (server, callback) => {
    ...
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
+ 服务端监视打包
  + /build/setup-dev-server.js 中的代码更新部分为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')
  const webpack = require('webpack')

  const resolve = file => path.resolve(__dirname, file)

  module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

   ...
    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err
      if (stats.hasErrors()) return
      serverBundle = JSON.parse(
        fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
      )
      console.log(serverBundle)
      update()
    })

    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器

    update()
    return onReady
  }
  ```
+ 把数据写入内存中
  + 默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘。但是，还可以使用不同类型的文件系统（内存(memory), webDAV 等）来更改输入或输出行为。为了实现这一点，可以改变 inputFileSystem 或 outputFileSystem。例如，可以使用 memory-fs 替换默认的 outputFileSystem，以将文件写入到内存中，而不是写入到磁盘
  + 值得一提的是，被 webpack-dev-server 及众多其他包依赖的 webpack-dev-middleware 就是通过这种方式，将你的文件神秘地隐藏起来，但却仍然可以用它们为浏览器提供服务！
  +  /build/setup-dev-server.js 中的代码： 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器，这一步骤的代码使用 webpack-dev-middleware 更新为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')
  const webpack = require('webpack')
  const devMiddleware = require('webpack-dev-middleware');

  const resolve = file => path.resolve(__dirname, file)

  module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)
    ...
    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
      logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
    })
    serverCompiler.hooks.done.tap('server', () => {
      serverBundle = JSON.parse(
        serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
      )
      console.log(serverBundle)
      update()
    })
    // serverCompiler.watch({}, (err, stats) => {
    //   if (err) throw err
    //   if (stats.hasErrors()) return
    // serverBundle = JSON.parse(
    //   fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    // )
    // console.log(serverBundle)
    // update()
    // })

    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器

    update()
    return onReady
  }
  ```
+ 客户端构建
  + /build/setup-dev-server.js 中的代码更新部分为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')
  const webpack = require('webpack')
  const devMiddleware = require('webpack-dev-middleware');

  const resolve = file => path.resolve(__dirname, file)

  module.exports = (server, callback) => {
  ...
    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
    })
    clientCompiler.hooks.done.tap('client', () => {
      clientManifest = JSON.parse(
        clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
      )
      update()
    })
    // 重要！！！将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)
    update()
    return onReady
  }
  ```
  + /server.js 中的代码更新部分为：
  ```js
  server.get('/', isProd
    ? render
    : async (req, res) => {
      // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
      await onReady
      render(req, res)
    }
  )
  ```
+ 热更新
  +  /build/setup-dev-server.js 中的代码更新部分为：
  ```js
  const path = require('path')
  const fs = require('fs')
  const chokidar = require('chokidar')
  const webpack = require('webpack')
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware')

  const resolve = file => path.resolve(__dirname, file)

  module.exports = (server, callback) => {
    ...
    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
      'webpack-hot-middleware/client?quiet=true&reload=true',  // 和服务端交互处理热更新一个客户端脚本
      clientConfig.entry.app
    ]
    clientConfig.output.filename = '[name].js'
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
    })
    clientCompiler.hooks.done.tap('client', () => {
      clientManifest = JSON.parse(
        clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
      )
      update()
    })
    server.use(hotMiddleware(clientCompiler, {
      log: false  // 关闭日志输出
    }))
    // 重要！！！将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)
    update()
    return onReady
  }
  ```

#### 5、编写通用应用注意事项
+ 服务器上的数据响应
  + 在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)。
  + 因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。
+ 组件生命周期钩子函数
  + 由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染 (SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 beforeMount 或 mounted），只会在客户端执行。
  + 此外还需要注意的是，你应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码，例如在其中使用 setInterval 设置 timer。在纯客户端 (client-side only) 的代码中，我们可以设置一个 timer，然后在 beforeDestroy 或 destroyed 生命周期时将其销毁。但是，由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 beforeMount 或 mounted 生命周期中。
+ 访问特定平台(Platform-Specific) API
  + 通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 window 或 document，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。
  + 对于共享于服务器和客户端，但用于不同平台 API 的任务(task)，建议将平台特定实现包含在通用 API 中，或者使用为你执行此操作的 library。例如，axios 是一个 HTTP 客户端，可以向服务器和客户端都暴露相同的 API。
  + 对于仅浏览器可用的 API，通常方式是，在「纯客户端 (client-only)」的生命周期钩子函数中惰性访问 (lazily access) 它们。
  + 请注意，考虑到如果第三方 library 不是以上面的通用用法编写，则将其集成到服务器渲染的应用程序中，可能会很棘手。你可能要通过模拟 (mock) 一些全局变量来使其正常运行，但这只是 hack 的做法，并且可能会干扰到其他 library 的环境检测代码。
+ 自定义指令
  + 大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：
    + 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。
    + 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 directives 选项所提供"服务器端版本(server-side version)"。

#### 6、路由处理
+ 配置 VueRouter
  + src/router/index.js
  ```js
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  export const createRouter = () => {
    const router = new VueRouter({
      mode: 'history', // 兼容前后端
      routes: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/pages/About')
        },
        {
          path: '/posts',
          name: 'post-list',
          component: () => import('@/pages/Posts')
        },
        {
          path: '*',
          name: 'error404',
          component: () => import('@/pages/404')
        }
      ]
    })
    return router
  }
  ```
+ 将路由注册到根实例
  + src/app.js
  ```js
  // 通用入口
  import Vue from 'vue'
  import App from './App.vue'
  import { createRouter } from './router'

  // 导出一个工厂函数，用于创建新的
  // 应用程序、router 和 store 实例
  export function createApp() {
    const router = createRouter()
    const app = new Vue({
      router,  // 把路由挂载到 Vue 根实例中
      // 根实例简单的渲染应用程序组件。
      render: h => h(App)
    })
    return { app, router }
  }
  ```
+ 适配服务端入口
  + src/entry-server.js
  ```js
  // 通用入口
  import Vue from 'vue'
  import App from './App.vue'
  import { createRouter } from './router'

  // 导出一个工厂函数，用于创建新的
  // 应用程序、router 和 store 实例
  export function createApp() {
    const router = createRouter()
    const app = new Vue({
      router,  // 把路由挂载到 Vue 根实例中
      // 根实例简单的渲染应用程序组件。
      render: h => h(App)
    })
    return { app, router }
  }
  ```
+ 服务端 server 适配
  + src/server.js
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

  const render = async (req, res) => {
    try {
      const html = await renderer.renderToString({
        title: '拉勾教育',  // html 中用 {{title}}, title 字段会被解析
        meta: `
          <meta name="description" content="拉勾教育">
        `,  // html 中用 {{{meta}}}, meta 字段不会被解析
        url: req.url
      })
      res.setHeader('Content-Type', 'text/html; charset=utf8')
      res.end(html)
    } catch (err) {
      res.status(500).end('Internal Server Error.')
    }
  }

  // 服务端路由设置为 *，意味着所有的路由都会进入这里
  server.get('*', isProd
    ? render
    : async (req, res) => {
      // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
      await onReady
      render(req, res)
    }
  )
  server.listen(3000, () => {
    console.log('server running at port 3000')
  })
  ```
+ 适配客户端入口
  + src/entry-client.js
  ```js
  /**
  * 客户端入口
  */
  import { createApp } from './app'

  // 客户端特定引导逻辑……

  const { app, router, store } = createApp()

  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

  router.onReady(() => {
    app.$mount('#app')
  })
  ```
+ 处理完成
  + src/App.vue
  ```js
  <template>
    <div id="app">
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>

      <!-- 路由出口 -->
      <router-view />
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
#### 7、管理页面 Head 内容
+ src/app.js 中注册 vue-meta
```js
...
import VueMeta from 'vue-meta'
import App from './App.vue'
import { createRouter } from './router'

Vue.use(VueMeta)

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s - 拉勾教育'
  }
})
...
```
+ src/entry-server.js 中挂载到 context 中
```js
// entry-server.js
import { createApp } from './app'

export default async context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router } = createApp()
  const meta = app.$meta()
  // 设置服务器端 router 的位置
  router.push(context.url)
  context.meta = meta
  // 等到 router 将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router))
  return app
}
```
+ src/index.template.html 中注入
```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {{{ meta.inject().title.text() }}}
  {{{ meta.inject().meta.text() }}}
</head>

<body>
  <!--vue-ssr-outlet-->
</body>

</html>
```
+ src/pages/Home.vue 中配置 head
```js
<script>
export default {
  name: "HomePage",
  metaInfo: {
    title: "首页"
  }
};
</script>
```
#### 8、数据预取和状态管理
+ 思路分析：
  + 在服务器端渲染(SSR)期间，我们本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析好这些数据。
  + 另一个需要关注的问题是在客户端，在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。
  + 为了解决这个问题，获取的数据需要位于视图组件之外，即放置在专门的数据预取存储容器(data store)或"状态容器(state container)）"中。首先，在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。此外，我们将在 HTML 中序列化(serialize)和内联预置(inline)状态。这样，在挂载(mount)到客户端应用程序之前，可以直接从 store 获取到内联预置(inline)状态。
+ 数据预取
  + src 目录下新建 store 文件夹，store 文件夹下新建 index.js 文件：
  ```js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import axios from 'axios'

  Vue.use(Vuex)

  export const createStore = () => {
    return new Vuex.Store({
      state: () => ({
        posts: []
      }),

      mutations: {
        setPosts(state, data) {
          state.posts = data
        }
      },

      actions: {
        // 在服务端渲染期间务必让 action 返回一个 Promise
        async getPosts({ commit }) {
          // return new Promise()
          const { data } = await axios.get('https://cnodejs.org/api/v1/topics')
          commit('setPosts', data.data)
        }
      }
    })
  }
  ```
  + src/app.js 中注入 store:
  ```js
  /**
  * 通用启动入口
  */
  import Vue from 'vue'
  import App from './App.vue'
  import { createRouter } from './router/'
  import VueMeta from 'vue-meta'
  import { createStore } from './store'

  Vue.use(VueMeta)

  Vue.mixin({
    metaInfo: {
      titleTemplate: '%s - 拉勾教育'
    }
  })

  // 导出一个工厂函数，用于创建新的
  // 应用程序、router 和 store 实例
  export function createApp() {
    const router = createRouter()
    const store = createStore()
    const app = new Vue({
      router, // 把路由挂载到 Vue 根实例中
      store, // 把容器挂载到 Vue 根实例中
      // 根实例简单的渲染应用程序组件。
      render: h => h(App)
    })
    return { app, router, store }
  }
  ```
  + src/pages/Posts.vue 中引入 store 中的数据：
  ```js
  <template>
    <div>
      <h1>Post List</h1>
      <ul>
        <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
    </div>
  </template>

  <script>
  // import axios from 'axios'
  import { mapState, mapActions } from "vuex";

  export default {
    name: "PostList",
    metaInfo: {
      title: "Posts"
    },
    data() {
      return {
        // posts: []
      };
    },
    computed: {
      ...mapState(["posts"])
    },

    // Vue SSR 特殊为服务端渲染提供的一个生命周期钩子函数
    serverPrefetch() {
      // 发起 action，返回 Promise
      // this.$store.dispatch('getPosts')
      return this.getPosts();
    },
    methods: {
      ...mapActions(["getPosts"])
    }
    // 服务端渲染
    //     只支持 beforeCreate 和 created
    //     不会等待 beforeCreate 和 created 中的异步操作
    //     不支持响应式数据
    // 所有这种做法在服务端渲染中是不会工作的！！！
    // async created () {
    //   console.log('Posts Created Start')
    //   const { data } = await axios({
    //     method: 'GET',
    //     url: 'https://cnodejs.org/api/v1/topics'
    //   })
    //   this.posts = data.data
    //   console.log('Posts Created End')
    // }
  };
  </script>

  <style>
  </style>
  ```
+ 将预取数据同步导客户端
  + src/entry-server.js 更新为：
  ```js
  // entry-server.js
  import { createApp } from './app'

  export default async context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router, store } = createApp()
    const meta = app.$meta()
    // 设置服务器端 router 的位置
    router.push(context.url)
    context.meta = meta
    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router))

    context.rendered = () => {
      // Renderer 会把 context.state 数据对象内联到页面模板中
      // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
      // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
      context.state = store.state
    }
    return app
  }
  ```
  + src/entry-client.js
  ```js
  /**
  * 客户端入口
  */
  import { createApp } from './app'

  // 客户端特定引导逻辑……

  const { app, router, store } = createApp()

  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

  router.onReady(() => {
    app.$mount('#app')
  })
  ```

### 任务二：静态站点生成 
#### 1、创建 Gridsome 项目
+ Gridsome 介绍
  - GitHub 仓库：https://github.com/gridsome/gridsome
  - 官网：https://gridsome.org/
  - Gridsome 是由Vue.js驱动的Jamstack框架，用于构建默认情况下快速生成的静态生成的网站和应用。
  - Gridsome是Vue提供支持的静态站点生成器，用于为任何无头CMS，本地文件或API构建可用于CDN的网站
  - 使用Vue.js，webpack和Node.js等现代工具构建网站。通过npm进行热重载并访问任何软件包，并使用自动前缀在您喜欢的预处理器（如Sass或Less）中编写CSS。
  - 基于 Vue.js 的 Jamstack 框架
  - Gridsome 使开发人员可以轻松构建默认情况下快速生成的静态生成的网站和应用程序
  - Gridsome允许在内容里面引用任何CMS或数据源。
  - 从WordPress，Contentful或任何其他无头CMS或API中提取数据，并在组件和页面中使用GraphQL访问它。
  - sudo npm install --global @gridsome/cli
+ sharp
  + https://sharp.pixelplumbing.com/install
  + npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
  + npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
+ node-gyp: 编译 node 中的 c++ 模块
  + npm install -g node-gyp
+ gridsome create my-gridsome-site

### 任务三：封装 Vue.js 组件库
#### 1、课程目标
+ CDD(Component-Driven Development)
  + 自下而上
  + 从组件级别开始，到页面级别结束
+ CDD 的好处
  + 组件在最大程度被重用
  + 并行开发
  + 可视化测试
+ 课程介绍
  + 处理组件的边界情况
  + 快速原型开发
  + 组件开发
  + Storybook
  + Monorepo
  + 基于模板生成包的结构
  + Lerna + yarn workspaces
  + 组件测试
  + Rollup 打包
#### 2、处理组件的边界情况
+ $root
+ $parent/$children
+ $refs
```js
this.$refs[formName].validate((valid)=>{
  if(valid){
    alert('submit')
  }else{
    console.log('error submit!!!')
    return false
  }
})
```
+ 依赖注入 provide/inject
#### 3、$attrs/$listeners
+ $attrs: 把父组件中非 prop 属性绑定到内部组件
+ $listeners: 把父组件中的 DOM 对象的原生事件绑定到内部组件
#### 4、快速原型开发
+ VueCLI 中提供了一个插件可以进行原型快速开发
+ 需要先额外安装一个全局的扩展
  + npm install -g @vue/cli-service-global
+ 使用 vue serve 快速查看组件的运行效果
+ vue serve
  + vue serve 如果不指定参数默认会在当前目录找以下的入口文件
    + main.js、index.js、App.vue、app.vue
  + 可以指定要加载的组件
    + vue serve ./src/login.vue
+ ElementUI
  + 安装 ElementUI 
    + 初始化 package.json
      + npm init -y
  + 安装 ElementUI
    + vue add element
  + 加载 ElementUI，使用 Vue.use()安装插件











