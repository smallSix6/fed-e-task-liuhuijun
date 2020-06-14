//沙箱模式  --allow-net


// const res = await fetch('https://api.github.com')
// const data = await res.json()
// console.log(data)

// 全局的 Deno 对象（命名空间）
// Deno.args

//Deno 中的运行时 API 默认全部使用 Promise
const decoder = new TextDecoder('utf-8')
const buffer = await Deno.readFile('./foo.txt')
const contents = decoder.decode(buffer)
console.log(contents)
