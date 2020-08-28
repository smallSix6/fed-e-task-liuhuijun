const proxy = new Proxy(man, {
  get(target, key) {
    if (target[key]) {
      return target[key]
    }
    return `Property "＄(property)" does not exist`
  }
})