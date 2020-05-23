const fs = require('fs')
const path = require('path')
const { task } = require('folktale/concurrency/task')
const { split, find } = require('lodash/fp')

function readFile(filename) {
  return task(resolver => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolver.reject(err)
      resolver.resolve(data)
    })
  })
}

readFile(path.resolve(__dirname, '../../../package.json'))
  .map(split('\n'))
  .map(find(x=>x.includes('version')))
  .run()
  .listen({
    onRejected: err => {
      console.log(err)
    },
    onResolved: value => {
      console.log(value)
    }
  })


