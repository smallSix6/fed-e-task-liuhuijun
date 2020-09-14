## 1、已知如下对象，请基于 es6 的 proxy 方法设计一个属性拦截读取操作的例子，要求实现去访问目标对象 example 中不存在的属性时，抛出错误：Property "$(property)" does not exist

```js
// 案例代码
const man = {
  name: 'jscoder',
  age: 22
}
//补全代码
const proxy = new Proxy(...)
proxy.name // "jscoder"
proxy.age // 22
proxy.location // Property "$(property)" does not exist
```

+ 回答如下代码：
```js
const proxy = new Proxy(man, {
  get(target, key) {
    if (target[key]) {
      return target[key]
    }
    return `Property "＄(property)" does not exist`
  }
})
```

## 2、红灯三秒亮一次, 绿灯一秒亮一次, 黄灯2秒亮一次
+ 实现一个函数，如何让三个灯不断交替重复亮灯? (用Promise实现) 三个亮灯函数已经存在:
```js
function red() {
  console.log('red')
} // 3秒
function green() {
  console.log('green')
} // 1秒
function yellow() {
  console.log('yellow')
} // 2秒
```

+ 回答如下代码：
```js
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
```
 
## 3、按顺序写出控制台打印结果 （2020 碧桂园）
```js
var User = {
     count:1,
     action:{
     getCount:function () {
         return this.count
         }
     }
}
var getCount = User.action.getCount;
    setTimeout(() => {
    console.log("result 1",User.action.getCount())
})
console.log("result 2",getCount())
```

+ 回答如下：
+ result 2  undefined
+ result 1 undefined
+ 原因：首先浏览器执行 js 进入第一个宏任务进入主线程，代码从上往下执行，遇到 setTimeout 则放入宏任务队列先不执行，Call Stack 往下走，则打印出 ‘result 2  undefined’，执行到这儿的时候 Call Stack 为空，则看看有没有本轮的微任务，这段代码没有微任务，则执行第二轮宏任务，打印 setTimeout 里面的结果 ‘result 1 undefined’，这里需要注意的是 getCount 函数是 action 调用的，所以 this 指向 action，而 action 没有 count 属性，所以为 undefined

## 4、简答 (字节跳动 二面)
+ 你觉得 typescript 和 javascript 有什么区别?
+ typescript 你都用过哪些类型?
+ typescript 中 type 和 interface 的区别?

+ 回答如下：
  1. typescript 和 javascript 的区别：
    + TypeScript 和 JavaScript 是目前项目开发中较为流行的两种脚本语言，我们已经熟知 TypeScript 是 JavaScript 的一个超集。JavaScript 和 TypeScript 的主要差异：
      + 1、TypeScript 可以使用 JavaScript 中的所有代码和编码概念，TypeScript 是为了使 JavaScript 的开发变得更加容易而创建的。例如，TypeScript 使用类型和接口等概念来描述正在使用的数据，这使开发人员能够快速检测错误并调试应用程序
      + 2、TypeScript 从核心语言方面和类概念的模塑方面对 JavaScript 对象模型进行扩展。
      + 3、JavaScript 代码可以在无需任何修改的情况下与 TypeScript 一同工作，同时可以使用编译器将 TypeScript 代码转换为 JavaScript。
      + 4、TypeScript 通过类型注解提供编译时的静态类型检查。
      + 5、TypeScript 中的数据要求带有明确的类型，JavaScript不要求。
      + 6、TypeScript 引入了 JavaScript 中没有的“类”概念。
      + 7、TypeScript 中引入了模块的概念，可以把声明、数据、函数和类封装在模块中。
  2. typescript 你都用过哪些类型?
    + 数据类型：
      + String
      + Boolen
      + Number
      + Array
      + Enums
      + Any 
      + Void
  3. typescript 中 type 和 interface 的区别：
    + interface是接口，type是类型，本身就是两个概念。只是碰巧表现上比较相似。希望定义一个变量类型，就用type，如果希望是能够继承并约束的，就用interface。interface 可以 extends 和 implement 的，但 type 是不允许 extends 和 implement 的。

## 5、对 async/await 的理解，分析内部原理
+ 回答如下：
  1. async/await 就是 Generator 的语法糖，使得异步操作变得更加方便
  2. async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await
  3. async 是 Generator 的语法糖，这个糖体现在这几个方面：
    + async 函数内置执行器，函数调用之后，会自动执行，输出最后结果，而 Generator 需要调用 next 或者配合 co 模块使用
    + 更好的语义，async 和 await，比起星号和 yield，语义更清楚了，async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果
    + 更广的适用性，co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值
    + 返回值是 Promise，async 函数的返回值是 Promise 对象，Generator 的返回值是 Iterator，Promise 对象使用起来更加方便
  4. async/await 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里
  5. 实例代码分析：
  ```js
  function my_co(it) {
      return new Promise((resolve, reject) => {
          function next(data) {
              try {
                  var { value, done } = it.next(data);
              }catch(e){
                  return reject(e);
              }
              if (!done) { 
                  //done为true,表示迭代完成
                  //value 不一定是 Promise，可能是一个普通值。使用 Promise.resolve 进行包装。
                  Promise.resolve(value).then(val => {
                      next(val);
                  }, reject);
              } else {
                  resolve(value);
              }
          }
          next(); //执行一次next
      });
  }
  function* test() {
      yield new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
      });
      yield new Promise((resolve, reject) => {
          // throw Error(1);
          resolve(10)
      });
      yield 10;
      return 1000;
  }

  my_co(test()).then(data => {
      console.log(data); //输出1000
  }).catch((err) => {
      console.log('err: ', err);
  });
  ```

## 6、async/await 如果右边方法执行出错该怎么办？（百度一面 2020）
+ 回答如下：
  + await 命令后面的 Promise 对象，运行结果可能是 rejected，此时等同于 async 函数返回的 Promise 对象被 reject。因此需要加上错误处理，可以给每个 await 后的 Promise 增加 catch 方法；也可以将 await 的代码放在 try…catch 中。

## 7、说一下 event loop 的过程？promise 定义时传入的函数什么时候执行？（小米 三面）
+ 回答如下：
  + javascript 上， 所有同步任务都在主线程上执行，也可以理解为存在一个“执行栈”。主线程外，还有一个“任务队列”，任务队列的作用，就在等待异步任务的结果，只要异步任务有了运行结果，就会加入到“任务队列”中。一旦执行栈中所有同步任务执行完毕，就从 任务队列 中读取“任务”加入到“执行栈”中。主线程不断的在循环上面的步骤，所以整个的这种运行机制又称为Event Loop（事件循环）。
  + promise 属于微任务，微任务是在主线程空闲时批量执行,在执行上下文栈的同步任务执行完后，首先执行 Microtask 队列，按照队列先进先出的原则，一次执行完所有 Microtask 队列任务，然后执行 Macrotask/Task 队列，一次执行一个，一个执行完后，检测 Microtask 是否为空，为空则执行下一个 Macrotask/Task，不为空则执行 Microtask

## 8、说一下防抖函数的应用场景，并简单说下实现方式 （滴滴）
+ 回答如下：
  + 防抖的应用场景：在经过指定的间隔内没有触发该函数方法时才会调用该函数方法，例如键盘输入事件等
  + 实现：
  ```js
  function debounce(fun,delay){
    let timer ;
    return function(args){
        const that = this
        clearTimeout(timer)
        timer = setTimeout(function(){
            fun.call(that,args)
        },delay)
    }
  }
  ```

## 9、说一下V8的垃圾回收机制 （小米）
+ 回答如下：
  + V8 的垃圾回收策略主要基于分代垃圾回收机制。在分代回收的基础上，针对新生代和老龄代在其内部又做了相对应的回收算法：新生代内使用的是复制算法、老龄代内使用的是标记－清除算法以及标记－合并算法。
    1. 内存堆内存分配－分代算法
      + 将整个堆内存分为新生代和老龄代，新生代内保存的是最新创建且存活周期短的对象。老龄代内保存的是较为活跃且存活周期长的对象
    2. 复制算法（新生代内存）
      + 该算法将内存一分为二，每一部分空间称为 semispace。在这两个 semispace 空间中，只有一个处于使用中，另一个处于闲置状态。正在使用的 semispace 空间我们称之为 From 空间，处于闲置的 semispace 空间我们称之为 To 空间。当我们分配对象时，先是在 From 空间进行分配。当新生代内存中开始垃圾回收时，会检查 From 空间中的存活对象，这些存活对象将被复制到 To 空间中，而非存活对象占用的空间将被释放。完成复制后，From 空间和 To 空间的角色发生互换，From 空间变为 To 空间，To 空间变为 From 空间
    3. 标记－清除算法（老龄代内存）
      + 标记清除算法分为两个阶段，一阶段是标记，另一阶段是清除。与复制算法相比，标记－清除算法并不会将内存空间划分为两半，所以不存在浪费一半空间的行为。与复制算法不同的是，标记－清除算法在标记阶段遍历堆中的所有对象，并标记活着的对象，在随后的清除阶段中，只清除没有被标记的对象。可以看出复制算法只复制活着的对象，而标记－清除算法只清理死亡的对象。这是因为活对象在新生代中占较小部分，死对象在老龄代中占较小部分，这也是两种回收方式能高效工作的原因。
      + 标记－清除算法最大的问题是在进行一次标记清除回收后，内存空间会出现不连续的状态。这些内存碎片会对后续的内存分配造成问题，因为很可能出现需要分配一个大内存对象的情况，这时无法分配的情况下就会再次触发垃圾回收，而这次的回收是不必要的，这时就该下面的回收算法登场了：标记－合并算法。
    4. 标记－合并算法（老龄代内存）
      + 上面也说到了标记－清除算法存在的弊端，标记－合并算法就是为了解决这些弊端而设计演变出来的。它们的差别在于对象在标记为死亡后，在整理的过程中，将活着的对象往一端移动，在移动完成后，直接清理掉另一端死亡的对象。完成移动并清理完另一端死亡对象的内存后，老龄代内存空间就是连续的未使用和已使用了，这样就可以进行大内存对象的分配了。

## 10、performance API 中什么指标可以衡量首屏时间
+ 回答如下：
  ```js
  // 计算加载时间
  function getPerformanceTiming () {  
      var performance = window.performance;
  
      if (!performance) {
          // 当前浏览器不支持
          console.log('你的浏览器不支持 performance 接口');
          return;
      }
  
      var t = performance.timing;
      var times = {};
  
      //【重要】页面加载完成的时间
      //【原因】这几乎代表了用户等待页面可用的时间
      times.loadPage = t.loadEventEnd - t.navigationStart;
  
      //【重要】解析 DOM 树结构的时间
      //【原因】反省下你的 DOM 树嵌套是不是太多了！
      times.domReady = t.domComplete - t.responseEnd;
  
      //【重要】重定向的时间
      //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
      times.redirect = t.redirectEnd - t.redirectStart;
  
      //【重要】DNS 查询时间
      //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
      times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
  
      //【重要】读取页面第一个字节的时间
      //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
      // TTFB 即 Time To First Byte 的意思
      // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
      times.ttfb = t.responseStart - t.navigationStart;
  
      //【重要】内容加载完成的时间
      //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
      times.request = t.responseEnd - t.requestStart;
  
      //【重要】执行 onload 回调函数的时间
      //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
      times.loadEvent = t.loadEventEnd - t.loadEventStart;
  
      // DNS 缓存时间
      times.appcache = t.domainLookupStart - t.fetchStart;
  
      // 卸载页面的时间
      times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
  
      // TCP 建立连接完成握手的时间
      times.connect = t.connectEnd - t.connectStart;
  
      return times;
  }
  ```
  + 以上可知代码可知 `performance.timing` 中的各种指标可以计算出 `页面加载完成的时间`、`解析 DOM 树结构的时间`、`DNS 查询时间` 等等时间数据。

## 11、在 EcmaScript 新特性中，暂时性死区有什么作用
+ 回答如下：
  + 暂时性死区（temporal dead zone,简称TDZ）,只要块级作用域内有 let 命令，它所声明的变量就会绑定这个区域，不收外部的的影响。简单的来说，在代码块中，使用 let 命令声明变量之前，变量都是不能用的。
  + JavaScript引擎在扫描代码发现变量声明时，要么将它们提升至作用域顶部（遇到var声明），要么将声明放到TDZ中（遇到let和const声明），访问TDZ中的变量会触发运行时错误。只要执行过变量声明语句后，变量才会从TDZ中移除，然后方可正常访问。
  ```js
  vartmp = 123;
  if (true) {
    tmp = 'abc'; //ReferenceError:tmp is not defined 
    let tmp;
  }
  ```
  + 当访问if里的tmp时，访问的是TDZ中的tmp,而不是全局的tmp。
  + 作用是：访问暂时性死区中的变量会触发运行时报错

## 12、观察者模式和发布订阅模式的区别
+ 回答如下：
  + 观察者模式中观察者和目标直接进行交互，而发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰。这样一方面实现了解耦，还有就是可以实现更细粒度的一些控制。比如发布者发布了很多消息，但是不想所有的订阅者都接收到，就可以在调度中心做一些处理，类似于权限控制之类的。还可以做一些节流操作。
  + 观察者模式是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的
  + 发布订阅模式由统一调度中心调用，因此发布者与订阅者不需要知道对方的存在

## 13、gulp自己写过任务吗？说一下它的构建流程（阿里 2018）
+ 回答如下：
  1. 项目根目录下创建 gulpfile.js
  2. 安装依赖：
    + browser-sync：用于开启服务器
    + del：删除文件夹和文件
    + gulp-load-plugins：gulp 插件的管理
    + sass：解析 sass 文件
    + babel：编译 js 文件
    + swig：动态数据模板编译输出html文件
    + imagemin: 压缩图片
  3. 编写自动化流程
  ```js
    // 实现这个项目的构建任务
    const {src, dest, parallel, series, watch} = require('gulp')
    const del = require('del')
    const browserSync = require('browser-sync')  
    const bs = browserSync.create()  
    const loadPlugins = require('gulp-load-plugins')
    const plugins = loadPlugins()    
    const {sass, babel, swig, imagemin} = plugins 
    const data = {
      menus: [
        {
          name: 'Home',
          icon: 'aperture',
          link: 'index.html'
        },
        {
          name: 'Features',
          link: 'features.html'
        },
        {
          name: 'About',
          link: 'about.html'
        },
        {
          name: 'Contact',
          link: '#',
          children: [
            {
              name: 'Twitter',
              link: 'https://twitter.com/w_zce'
            }
          ]
        }
      ],
      pkg: require('./package.json'),
      date: new Date()
    }
    const clean = () => {
      return del(['dist', 'temp'])
    }   
    const style = () => {
      return src('src/assets/styles/*.scss', { base: 'src' })
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(dest('temp'))
      .pipe(bs.reload({stream: true}))
    }    
    const script = () => {
      return src('src/assets/scripts/*.js', { base: 'src' })
      .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(dest('temp'))
      .pipe(bs.reload({stream: true}))
    }   
    const page = () => {
      return src('src/**/*.html', {base: 'src'})
      .pipe(swig(data,defaults: {
          cache: false,
        }))
      .pipe(dest('temp'))
      .pipe(bs.reload({stream: true}))
    }  
    const image = () => {
      return src('src/assets/images/**', {base: 'src'})
      .pipe(imagemin())
      .pipe(dest('dist'))
    }  
    const font = () => {
      return src('src/assets/fonts/**', {base: 'src'})
      .pipe(imagemin())
      .pipe(dest('dist'))
    } 
    const extra = () => {
      return src('public/**', {base: 'public'})
      .pipe(dest('dist'))
    } 
    const serve = () => {
      watch('src/assets/styles/*.scss', style)
      watch('src/assets/scripts/*.js', script)
      watch('src/*.html', page)
      watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
      ], bs.reload)    
      bs.init({
        notify: false,
        port: 2080,
        open: false,
        // files: 'temp/**',
        server: {
          baseDir: ['temp', 'src', 'public'], // 按顺序查找
          routes: {
            '/node_modules': 'node_modules'
          }
        }
      })
    }
    const useref = () => {
      return src('temp/*.html', { base: 'temp' })
      .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      })))
      .pipe(dest('dist'))
    }
    const compile = parallel(style, script, page)
    const build = series(
      clean,
      parallel(
        series(compile, useref),
        image,
        font,
        extra
      )
    )
    const develop = series(compile, serve)
    module.exports = {
      clean,
      compile,
      build,
      develop,
    }
    ```
## 14、package-lock.json 有什么作用，如果项目中没有它会怎么样，举例说明
+ 回答如下：
  + 作用：package-lock.json 是在 `npm install` 时候生成一份文件，用以记录当前状态下实际安装的各个 npm package 的具体来源和版本号，锁定安装时的包的版本号，并且需要上传到 git，以保证其他人在 npm install 时大家的依赖能保证一致
  + 注意：在以前可能就是直接改 package.json 里面的版本，然后再 npm install 了，但是5版本后就不支持这样做了，因为版本已经锁定在 package-lock.json 里了，所以我们只能 npm install xxx@x.x.x  这样去更新我们的依赖，然后 package-lock.json 也能随之更新
  + 如果项目中没有 package-lock.json，则有可能会导致项目成员在安装 package 的时候 package 的来源和版本不一致，导致项目报错。

## 15、webpack 常用配置项有哪些，并说明用途 （跟谁学 2020）
+ 回答如下：
```js
module.exports = {
  entry: './src/index.js', // 指定打包入口文件，如果是相对路径，前面的点不能少
  output: {
    filename: 'bundle.js', // 输出文件的名称
    path: path.join(__dirname, 'output'), // 输出路径，为绝对路径
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],  // 省略文件的后缀名，查找顺序从数组中第一项依次往后查找
    alias: { // 路径简写
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'api':resolve('src/api'),
      'storage':resolve('src/module/storage.js'),
      'common':resolve('src/components/common')
    }
  },
  mode: none,  // 工作模式
  module: { // 这些选项决定了如何处理项目中的不同类型的模块
    rules: [ // 解析模块的规则
      {
        test: /.css$/,
        use: 'css-loader',
        exclude: /(node_modules)/  //不解析的文件夹
      }
    ],
    // 从 webpack 3.0.0 开始
    noParse: function(content) { // 不解析的模块名
      return /jquery|lodash/.test(content);
    }
  },
  plugins: [  // plugins 选项用于以各种方式自定义 webpack 构建过程
    new webpack.optimize.CommonsChunkPlugin({ // 提取公用模块
      ...
    }),
    new HtmlWebpackPlugin({ // 自动生成HTML插件
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      }
    }),
    new CopyWebpackPlugin({ // 拷贝那些不需要参与打包的资源文件到输出目录
      patterns: ['public']
    }),
    devServer: { // webpack-dev-server支持配置代理
      contentBase: './public',
      proxy: {
        '/api': {// 以/api开头的地址都会被代理到接口当中
          // http://localhost:8080/api/users -> https://api.github.com/api/users
          target: 'https://api.github.com',
          // http://localhost:8080/api/users -> https://api.github.com/users
          pathRewrite: {
            '^/api': ''
          },
          // 不能使用localhost:8080作为请求GitHub的主机名
          changeOrigin: true, // 以实际代理的主机名去请求
        }
      }
    }
  ],
  devtool: 'eval-cheap-module-source-ma', // 此选项控制是否生成，以及如何生成 source map
  optimization: { // 开启 Tree-Shaking 和 Scope Hoisting
    usedExports: true,
    minimize: true,
    concatenateModules: true
  }
}
```

## 16、阐述 webpack css-loader 的作用 和 原理？ （跟谁学）
+ 回答如下：
  + 作用：webpack官方的解释是：css-loader 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们。css-loader 只会把 css 模块加载到 JS 代码中，并不会使用这个模块。
  + 原理：css-loader 将 css 代码变成 js 字符串形式 push 到 css-loader 模块提供的数组中
+ 链接见：https://blog.csdn.net/huige232508/article/details/108221449

## 17、webpack 中 loader 和 plugin 的区别是什么 （字节跳动 搜狐）
+ 回答如下：
  + loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理，loader 被用于转换某些类型的模块。而 plugin 则可以用于执行范围更广的任务，plugin 的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。plugin 接口功能极其强大，可以用来处理各种各样的任务，Webpack 要求 plugin 必须是一个函数或者是一个包含 apply 方法的对象。通过在生命周期的钩子中挂载函数实现扩展。plugin 机制是 webpack 一个核心特性，目的是为了增强 webpack 自动化方面的能力。

## 18、webpack、rollup、parcel 它们的优劣？
+ 回答如下：
  + webpack 适⽤于⼤型复杂的前端站点构建: webpack 有强⼤的 loader 和插件⽣态,打包后的⽂件实际上就是⼀个⽴即执⾏函数，这个⽴即执⾏函数接收⼀个参数，这个参数是模块对象，键为各个模块的路径，值为模块内容。⽴即执行函数内部则处理模块之间的引⽤，执⾏模块等,这种情况更适合⽂件依赖复杂的应⽤开发.
  + rollup 适⽤于基础库的打包，如 vue、d3 等: Rollup 就是将各个模块打包进⼀个⽂件中，并且通过 Tree-shaking 来删除⽆⽤的代码,可以最⼤程度上降低代码体积,但是rollup 没有 webpack 如此多的功能，如代码分割、按需加载等⾼级功能，其更聚焦于库的打包，因此更适合库的开发.
  + parcel 适⽤于简单的实验性项⽬: 他可以满⾜低⻔槛的快速看到效果,但是⽣态差、报错信息不够全⾯都是他的硬伤，除了⼀些玩具项⽬或者实验项⽬不建议使⽤

## 19、babel.config.js 和 .babelrc 有什么区别？
+ 回答如下：
  + Babel有两种并行的配置文件格式，可以一起使用，也可以独立使用。
    + 项目范围的配置
      + babel.config.js 文件，具有不同的扩展名,是按照 commonjs 导出对象，可以写 js 的逻辑。
    + 相对文件配置
      + .babelrc.json 文件，具有不同的扩展名（出于兼容性原因，.babelrc是 .babelrc.json 别名）
  + 区别(见<https://www.babeljs.cn/docs/config-files#file-relative-configuration>)：
    + 由于项目范围的配置文件与相对文件配置的物理位置是分开的，因此它们对于必须广泛应用的配置非常理想，甚至允许插件和预设轻松应用于 node_modules 对称链接包中的文件或传统链接包中的文件。
    + 另外以 .js 后缀名结尾的文件相对于以 .json 后缀名结尾的文件来说，有如下区别
      + 如果您有条件的复杂配置或在构建时进行了其他计算，则 JS 配置文件非常方便。但是，缺点是 JS 配置无法进行静态分析，因此对可缓存性，linting，IDE 自动完成等具有负面影响。由于 babel.config.json 和 .babelrc.json 都是静态 JSON 文件，因此它允许使用 Babel 的其他工具（例如 bundlers ）来缓存结果。
    + baberc 的加载规则是按目录加载的，是只针对自己的代码。config 的配置针对了第三方的组件和自己的代码内容。babel.config.js 是一个项目级别的配置

## 20、webpack 中 tree shaking 的用途和原理是什么？
+ 回答如下：
  + 用途：Tree-shaking是一种通过清除多余代码的方式来优化项目打包体积的技术。我们在开发一个项目的时候，总会遇到这样的问题，就是比如我们写了一个 utils 工具类，我们在某一个组件内要用到 utils 这个类里的其中一个或者某几个方法，但是当我们引入 utils 的时候，实际是将 utils 里的方法全都引入了，这样就会导致将没有必要的东西也引入，包提就会越来越大。那么我们如何解决这个问题呢？是的，tree-shaking 看名字就知道是将哪些没有用的东西都 shaking 掉。
  + 原理：
    + 利用 es6 模块的特点：
      + 只能作为模块顶层的语句出现
      + import 的模块名只能是字符串常量，不能动态引入
      + import binding 是 immutable, 引入的模块不能再做修改
    + 其实 tree-shaking 的概念很早就提出了，但是直到 es6 的 ES6-style 模块出现后才被真正的利用起来，这是因为 tree-shaking 只能在静态 modules 下工作，Es6 模块的加载是静态的。因此整个依赖树可以被静态的推导出解析语法树，所以在 es6 模块中使用 tree-shaking 是非常容易的。而且也支持 statement (声明级别)。es6 的 import 语法可以完美使用 tree-shaking, 因为可以在代码不运行的情况下就能分析出不需要的代码。

## 21、阐述一下 eventbus 的原理，讲述 eventbus 在 vue 中的实践 （猿辅导）
+ 回答如下：
  + eventbus 的概念：
    + eventBus 是消息传递的一种方式，基于一个消息中心，订阅和发布消息的模式，称为发布订阅者模式。
      + on('name', fn) 订阅消息，name: 订阅的消息名称， fn: 订阅的消息
      + emit('name', args) 发布消息, name: 发布的消息名称 ，args：发布的消息
  + 实现：
  ```js
  class Bus {
    constructor () {
      this.callbacks = {}
    }
    $on(name,fn) {
      this.callbacks[name] = this.callbacks[name] || []
      this.callbacks[name].push(fn)
    }
    $emit(name,args) {
      if(this.callbacks[name]){
        //存在遍历所有callback
        this.callbacks[name].forEach(cb => cb(args))
      }
    }
  }
  ```
  + 在 vue 中的实践：
  ```js
  // 在入口文件创建 vue 实例
  const vm = new Vue()

  // 父组件 创建订阅的消息名称，并放入对应的 callbacks 数组中
  this.on('fn1', function(msg) {
      alert(`订阅的消息是：${msg}`);
  });

  // 子组件 来发布这个消息，并传入父组件 callbacks 函数中需要的参数
  this.emit('fn1', '你好，世界！');
  ```

## 22、vue-loader 的实现原理是什么
+ 回答如下：
  + vue-loader 的核心首先是将以 .vue 为结尾的组件进行分析、提取和转换，那么首先我们要找到以下几个 loader
    + selector：将 .vue 文件解析拆分成一个 parts 对象，其中分别包含 style、script、template
    + style-compiler： 解析 style 部分
    + template：compiler 解析 template 部分
    + babel-loader： 解析 script 部分，并转换为浏览器能识别的普通 js
  + 首先在 loader.js 这个总入口中，我们不关心其他的，先关心这几个加载的 loader，从名字判断这事解析 css、template 的关键
+ 首先是 selector
```js
var path = require('path')
var parse = require('./parser')
var loaderUtils = require('loader-utils')
 
module.exports = function (content) {
  this.cacheable()
  var query = loaderUtils.getOptions(this) || {}
  var filename = path.basename(this.resourcePath)
  // 将.vue文件解析为对象parts,parts包含style, script, template
  var parts = parse(content, filename, this.sourceMap)
  var part = parts[query.type]
  if (Array.isArray(part)) {
    part = part[query.index]
  }
  this.callback(null, part.content, part.map)
}
```
  +  selector的最主要的功能就是拆分parts，这个parts是一个对象，用来盛放将.vue文件解析出的style、script、template等模块，他调用了方法parse。
  + parse.js
  ```js
  var compiler = require('vue-template-compiler')
  var cache = require('lru-cache')(100)
  var hash = require('hash-sum')
  var SourceMapGenerator = require('source-map').SourceMapGenerator
  
  
  var splitRE = /\r?\n/g
  var emptyRE = /^(?:\/\/)?\s*$/
  
  module.exports = function (content, filename, needMap) {
    // source-map cache busting for hot-reloadded modules
    // 省略部分代码
    var filenameWithHash = filename + '?' + cacheKey
    var output = cache.get(cacheKey)
    if (output) return output
    output = compiler.parseComponent(content, { pad: 'line' })
    if (needMap) {
    }
    cache.set(cacheKey, output)
    return output
  }
  
  function generateSourceMap (filename, source, generated) {
    // 生成sourcemap
    return map.toJSON()
  }
  ```
  + parse.js 其实也没有真正解析 .vue 文件的代码，只是包含一些热重载以及生成 sourceMap 的代码，最主要的还是调用了 compiler.parseComponent 这个方法，但是compiler 并不是 vue-loader 的方法，而是调用 vue 框架的 parse, 这个文件在 vue/src/sfc/parser.js 中，一层层的揭开面纱终于找到了解析 .vue 文件的真正处理方法 parseComponent。
  + vue的parse.js
  ```js
  export function parseComponent (
    content: string,
    options?: Object = {}
  ): SFCDescriptor {
    const sfc: SFCDescriptor = {
      template: null,
      script: null,
      styles: [],
      customBlocks: [] // 当前正在处理的节点
    }
    let depth = 0 // 节点深度
    let currentBlock: ?(SFCBlock | SFCCustomBlock) = null
  
    function start (
      tag: string,
      attrs: Array<Attribute>,
      unary: boolean,
      start: number,
      end: number
    ) {
      // 略
    }
  
    function checkAttrs (block: SFCBlock, attrs: Array<Attribute>) {
      // 略
    }
  
    function end (tag: string, start: number, end: number) {
      // 略
    }
  
    function padContent (block: SFCBlock | SFCCustomBlock, pad: true | "line" | "space") {
      // 略
    }
    parseHTML(content, {
      start,
      end
    })
  
    return sfc
  }
  ```
+ 至此完成了将 .vue 文件解析拆分成一个 parts 对象，其中分别包含 style、script、template 属性和值
+ 再用相应的 loader 来解析 style、script、template 部分