// 需求：希望有一个服务，可以依据请求的接口内容返回相应的数据

import express from 'express'
import { DataStore } from './data'
const app = express()

app.get('/', (req, res) => {
  // res.end('1111111')
  res.json(DataStore.list)
})

app.listen(8080, () => {
  console.log('服务器已经开启了')
})

