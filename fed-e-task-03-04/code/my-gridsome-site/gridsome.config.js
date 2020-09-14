// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: '拉勾教育', // 为您的项目设置一个名称。该名称通常在标题标签中使用。
  siteDescription: '大前端', // meta 标签里的 description 属性
  plugins: [],
  pathPrefix: '', // 加项目前缀，如果是根目录，则不用配置该属性。如果 gridsome 项目在根目录的子目录里，则 pathPrefix 值为子目录路径
  templates: { // 定义集合的路由和模板。
    Post: [
      {
        path: '/posts/:id',
        component: './src/templates/Post.vue'
      }
    ]
  }
}
