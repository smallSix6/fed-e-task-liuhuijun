function red() {
  console.log('red')
}
function green() {
  console.log('green')
}
function yellow() {
  console.log('yellow')
}
function light(cb, timer) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve()
    }, timer);
  })
}

function lightRun() {
  light(red, 3000).then(() => {
    return light(green, 2000)
  }).then(() => {
    return light(yellow, 5000)
  }).finally(() => {
    return lightRun()
  })
}
lightRun()


