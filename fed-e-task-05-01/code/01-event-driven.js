const EventEmitter = require('events')
const myEvent = new EventEmitter()
myEvent.on('event1', () => {
  console.log('事件1执行了')
})
myEvent.on('event1', () => {
  console.log('事件2执行了')
})
myEvent.emit('event1')
