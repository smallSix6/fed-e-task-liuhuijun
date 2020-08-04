<template>
  <div id="app">
    {{message}}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  components: {},
  // Nuxt 中提供一个钩子函数`asyncData()`，专门用于获取服务端渲染的数据。
  async asyncData () {
    const { data } = await axios({
      method: 'GET',
      // 注意此处的 URL 要指定当前端口，否则默认会去服务端的 80 端口去查找。
      url: 'http://localhost:3000/data.json'
    })
    // 这里返回的数据会和 `data () {}` 中的数据合并到一起给页面使用
    return data
  }
}
</script>

<style scoped>

</style>
