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


