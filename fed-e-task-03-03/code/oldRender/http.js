
  const http = require('http')
  // 通过程序获取指定网页的内容
  http.get('http://localhost:3000', res => {
    let data = ''
    res.on('data', chunk => {
      data += chunk
    })
    res.on('end', () => {
      console.log(data)
    })
  })