### 模块化开发与规范化标准

#### 任务一：模块化开发

##### 1、模块化演变过程
+ 第一阶段：引入script标签的形式（<script src='module-a.js'></script>），早期模块化完全依靠约定,缺点如下：
    + 污染全局作用域
    + 命名冲突问题
    + 无法管理模块依赖关系
+ 第二阶段：命名空间方式
    + 每个模块只暴露一个全局对象，所有模块都挂载到这个对象上
    + 减少了命名冲突的可能
    + 但是没有私有空间，模块成员可以在外部被访问或修改
    + 模块之间的依赖关系没有得到解决
+ 第三阶段：IIFE(使用立即执行函数表达式)
    + 使用立即执行函数包裹代码，要输出的遍历挂载到一个全局对象上
    + 变量拥有了私有空间，只有通过闭包修改和访问变量
    + 参数作为依赖声明去使用，使得每个模块的依赖关系变得明显

##### 2、模块化规范的出现
+ 1）CommonJs规范，同步模式加载模块
    + 一个文件就是一个模块
    + 每个模块都有单独的作用域
    + 通过module.exports导出成员
    + 通过require函数载入模块
+ 2）AMD规范，以require.js为代表
    + 定义一个模块：
    ```js
    define('module1', ['jquery', './module2'], function ($, module2) {
        return {
            start: function () {
                $('body').animate({ margin: '200px' })
                module2()
            }
        }
    })
    ```
    + 载入一个模块
    ```js
    require(['./module1'], function (module1) {
        module1.start()
    })
    ```
    + AMD使用起来相对复杂，模块js文件请求频繁
+ 3）淘宝推出的Sea.js + CMD(Common Module Definition)通用模块规范
    ```js
    // CMD 规范 （类似 CommonJS 规范）
    define(function (require, exports, module) {
         // 通过 require 引入依赖
        var $ = require('jquery')
        // 通过 exports 或者 module.exports 对外暴露成员
        module.exports = function () {
            console.log('module 2~')
            $('body').append('<p>module2</p>')
        }
    })
    ```

##### 3、ES Modules特性
+ 通过给 script 添加 type=module 的属性，就可以以ES Module 的标准执行其中的 js 代码
  ```js
  <script type='module'></script>
  ```
+ ES Module 自动采用严格模式
  ```js
  <script type='module'>
    console.log(this) //undefined
  </script>
  ```
+ 每个 ES Module 都是运行在单独的私有作用域中
  ```js
  <script type='module'>
    var foo = 100
    console.log(foo) // 100
  </script>
  <script type='module'>
    console.log(foo) // undefined
  </script>
  ```
+ ES Module 是通过 CORS 的方式请求外部 JS 模块的
  ```js
  <script type="module" src="https://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>  // 请求失败，这个资源所在服务器不支持CORS
  <script type="module" src="https://unpkg.com/jquery@3.4.1/dist/jquery.min.js"></script> // 请求成功，这个资源所在的服务器支持CORS
  ```
+ ES Module 的 script 标签会延迟执行脚本
  ```js
  <script type="module" src="demo.js"></script> // 这个脚本文件不会阻碍下边标签的渲染
  <p>需要显示的内容</p>
  ```

##### 4、ES Module与CommonJS交互
+ ES Module 中可以导入 CommonJS 模块
+ 不能再 CommonJS 模块中通过 require 载入 ES Module(node不支持，webpack支持)
+ CommonJS 始终只会导出一个默认对象
+ 注意 import 不是解构导出对象
+ ES Module 中没有 CommonJS 中的那些模块全局成员了
  + require, module, exports 可以通过 import 和 export来代替
  + __filename 和 __dirname 可以用如下方法来代替：
  ```js
    import { fileURLToPath } from 'url'
    import { dirname } from 'path'
    const __filename = fileURLToPath(import.meta.url)
    console.log(__filename)
    const __dirname = dirname(__filename)
    console.log(__dirname)
  ```
+ package.json 文件中添加 "type" : "module" 字段后则默认以 .js 结尾的文件会以 ES Module的形式运行，如果想以 CommonJS 的形式运行文件，文件需以 .cjs 结尾

##### 5、babel兼容方案
+ 安装依赖： npm i @babel/node @babel/core @babel/preset-env -D
+ babel 转化为 es5 的代码的方法
  + 1、npx babel-node index.js --presets=@babel/preset-env
  + 2、添加 .babelrc 文件，配置为 "presets" : ["@babel/preset-env"]
  + 3、npm i @babel/plugin-transform-modules-commonjs -D,添加 .babelrc 文件，配置为 "plugins" : ["@babel/plugin-transform-modules-commonjs"]


#### 任务二、webpack打包
##### 1、模块化打包工具由来：
+ 为什么会出现模块化打包：
  + ES Module 存在环境兼容问题
  + 模块文件过多，网络请求频繁
  + 所有的前端资源都需要模块化

##### 2、模块化打包工具概要
+ webpack 的组成成分
  + 模块打包器（Module bundler)
  + 模块加载器（Loader)
  + 代码拆分（code splitting)
  + 资源模块 （Asset Module)

##### 3、webpack快速上手、配置文件、工作模式、打包运行结果、资源模块加载、导入资源模块、文件资源加载器、URL加载器、自动清除输出目录插件、自动生成HTML插件、webpack-dev-server、webpack-dev-server 代理 API
+ 代码部分见./code/webpack/start-01
+ Data URLs(data:[<mediatype>][;base64],<data>): 示例（data:text/html;charset=UTF-8,<h1>html content</h1>）,组成部分如下
  + （data）: 协议
  + （[<mediatype>][;base64],）：媒体类型和编码
  + （<data>):文件内容

+ loader：
  + "css-loader": css解析loader，
  + "file-loader": 图片解析loader
  + "style-loader": style插入html
  + "url-loader": 解析为data URLs的形式
  + "babel-loader","@babel/core","@babel/preset-env": 解析为 es2015
  + "html-loader": 解析html

##### 4、常用加载器分类
+ 编译转换类
+ 文件操作类
+ 代码检查类

##### 5、加载资源的方式
+ 遵循 ES Modules 标准的 import 声明
+ 遵循 CommonJS 标准的 require 函数
+ 遵循 AMD 标准的 define 函数和 require 函数
+ 样式代码中的 @import 指令和 url 函数
+ HTML 代码中图片标签的 src 属性

##### 6、读取md文档的loader插件
+ 代码部分见./code/webpack/markdownLoader

##### 7、开发一个插件
+ 一个函数或者是一个包含apply方法的对象
+ 通过在生命周期的钩子中挂载函数实现扩展
+ 代码部分见./code/webpack/start-01

##### 8、devtool模式对比
+ 模式汇总：
  + 'eval'：模块代码放到eval函数中执行
	+ 'cheap-eval-source-map'：生成map文件，代码经过 loader 转化，但只能定位错误的行,
	+ 'cheap-module-eval-source-map'：生成map文件,代码为编写的源代码，但只能定位错误的行,
	+ 'eval-source-map'：生成map文件，并可定位错误的行和列,
	+ 'cheap-source-map'：生成map文件，没有eval函数,
	+ 'cheap-module-source-map'：,
	+ 'inline-cheap-source-map',
	+ 'inline-cheap-module-source-map',
	+ 'source-map',
	+ 'inline-source-map',
	+ 'hidden-source-map',
	+ 'nosources-source-map'：不暴露源代码，但显示错误的行和列
+ 代码部分见./code/webpack/devtool

##### 9、选择合适的 source map 模式
+ 开发模式下：cheap-module-eval-source-map,原因如下：
  + 代码每行不会超过80个字符，所以只需定位到行
  + 代码经过 Loader 转换过后的差异较大
  + 首次打包速度慢无所谓，重写打包相对快
+ 生产模式：none,原因如下
  + Source Map 会暴露源代码
  + 调试是开发阶段的事情

##### 10、HMR 介绍
+ HMR定义：热替换只将修改的模块实时替换至应用中，而不用刷新页面，webpack中最强大的功能之一，极大地提高了开发效率
+ 代码部分见./code/webpack/webpack-hmr

##### 11、DefinePlugin
+ 用处：为代码注入全局成员
+ 代码部分见./code/webpack/webpack-hmr

##### 12、Tree Shaking、Scope Hoisting
+ Tree Shaking: 用到什么模块就导出什么模块，没有用到的模块就不打包
+ Scope Hoisting:既提升了运行效率，又减少了代码的体积
+ 最新版的babel-loader不会将 esm 转化为 commonjs ,如果需要转化，代码如下
```js
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        // 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
        // ['@babel/preset-env', { modules: 'commonjs' }]
        // ['@babel/preset-env', { modules: false }]
        // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
        ['@babel/preset-env', { modules: 'auto' }]
      ]
    }
  }
}
```
+ 代码部分见./code/webpack/tree-shaking


#### 任务三、 其它打包工具

Rollup也是一款ESModule打包器，可以将项目中的细小模块打包成整块代码，使得划分的模块可以更好的运行在浏览器环境或者是Nodejs环境。Rollup与Webpack作用非常类似，不过Rollup更为小巧。webpack结合插件可以完成前端工程化的绝大多数工作，而Rollup仅仅是一款ESM打包器，没有其他功能，例如Rollup中并不支持类似HMR这种高级特性。Rollup并不是要与Webpack全面竞争，而是提供一个充分利用ESM各项特性的高效打包器。

##### 1、rollup使用

./src/message.js

```js
export default {
  hi: 'I am liuzi '
}
```

./src/logger.js

```js
export const log = msg => {
  console.log(msg)
}

export const error = msg => {
  console.error(mes)
}
```

./src/index.js

```js
import {log} from './logger'
import messages from './message'

const msg = messages.hi

log(msg)
```

安装Rollup：`yarn add rollup --dev`

运行：`yarn rollup ./src/index.js --format iife --file dist/bundle.js`

./dist/bundle.js

```js
(function () {
  'use strict';

  const log = msg => {
    console.log(msg);
  };

  var messages = {
    hi: 'I am liuzi '
  };

  const msg = messages.hi;

  log(msg);

}());

```

Rollup默认会开启TreeShaking优化输出结果。

配置文件：rollup.config.js

```js
export default {
  input: './src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  }
}
```

运行：`yarn rollup --config` , 指定配置文件：`yarn rollup --config rollup.config.js`

##### 2、 rollup插件

Rollup自身的功能就是对ESM进行合并打包，如果需要更高级的功能，如加载其他类型资源模块，导入CommonJS模块，编译ES新特性，Rollup支持使用插件的方式扩展实现，插件是Rollup唯一的扩展方式。

通过导入json文件学习如何使用Rollup插件。

安装插件`rollup-plugin-json`, 运行：`yarn add rollup-plugin-json --dev`

Rollup.config.js

```js
import json from 'rollup-plugin-json'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json()
  ]
}
```

./src/index.js

```js
import {log} from './logger'
import messages from './message'
import {name, version} from '../package.json'
const msg = messages.hi

log(msg)
log(name)
log(version)
```

./dist/bundle.js

```js
(function () {
  'use strict';

  const log = msg => {
    console.log(msg);
  };

  var messages = {
    hi: 'I am liuzi '
  };

  var name = "Rollup-test";
  var version = "1.0.0";

  const msg = messages.hi;

  log(msg);
  log(name);
  log(version);

}());
```

json中用到的属性被打包进来了，没用到的属性被TreeShaking移除掉了。

##### 3、 rollup 加载npm依赖

Rollup不能像webpack那样通过模块名称加载npm模块，为了抹平差异，Rollup官方提供了一个插件`rollup-plugin-node-resolve`，通过这个插件，就可以在代码中使用模块名称导入模块。

安装插件：`yarn add rollup-plugin-node-resolve --dev`

Rollup.config.js

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
export default {
  input: './src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve()
  ]
}
```

./src/index.js

```js
import _ from 'lodash-es' // lodash模块的ESM版本
import {log} from './logger'
import messages from './message'
import {name, version} from '../package.json'
const msg = messages.hi

log(msg)
log(name)
log(version)
log(_.camelCase('hello world'))
```

##### 4、 Rollup加载CommonJS模块

安装插件: `yarn add rollup-plugin-commonjs`

Rollup.config.js

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
export default {
  input: './src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}
```

./src/index.js

```js
import _ from 'lodash-es' // lodash模块的ESM版本
import {log} from './logger'
import messages from './message'
import {name, version} from '../package.json'
import cjs from './cjs.module'
const msg = messages.hi

log(msg)
log(name)
log(version)
log(_.camelCase('hello world'))

log(cjs)
```

./dist/bundle.js

```js
// ...

  var cjs_module = {
    foo: 'bor'
  };

// ...

  log(cjs_module);
// ...
```

##### 5、 Rollup代码差分 : 动态导入

使用动态导入的方式实现模块的按需加载，Rollup内部会自动去处理代码的拆分，也就是分包。

Rollup.config.js

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
export default {
  input: './src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife',
    dir: 'dist',
    format: 'amd'
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}
```

./src/index.js

```js
import('./logger').then(({ log }) => {
  log('code splitting~')
})
```

##### 6、 Rollup多入口打包

rollup.config.js

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
export default {
  // input: './src/index.js',
  // input: ['src/index.js', 'src/album.js'], // 多入口打包
  input: { // 这种写法也可以进行多入口打包
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife',
    dir: 'dist', // 动态导入时会分包成多文件
    format: 'amd' // 动态导入不支持iife
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}
```

注意此时生成的js文件就要以AMD标准的require方式引入

##### 7、 Rollup优势

+ 输出结果更加扁平，执行效率更高
+ 自动移除未引用的代码
+ 打包结果依然完全可读

##### 8、 Rollup缺点

+ 加载非ESM的第三方模块比较复杂
+ 模块最终都会被打包到一个函数中，无法实现HMR
+ 浏览器环境中，代码拆分功能依赖AMD库

如果我们正在开发应用程序，需要引入大量的第三方库，代码量又大，需要分包打包，Rollup的作用则会比较欠缺。

如果我们正在开发一个框架或者类库，Rollup的这些优点则非常有必要，缺点则可以忽略。所以大多数知名框架/库都在使用Rollup作为模块打包器。

总结：Webpack大而全，Rollup小而美。

选择标准：

+ 开发应用程序选择Webpack
+ 开发框架/库使用Rollup

##### 9、 Parcel 零配置的前端应用打包器

安装Parcel：`yarn add parcel-bundler --dev`

./src/index.html  Parcel中的入口文件是HTML文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parcel Test</title>
</head>
<body>
  <script src="./main.js"></script>
</body>
</html>
```

./src/main.js

```js
// import $ from 'jquery' // 自动安装依赖
import foo from './foo'
import './style.css'
import img from './1.png'
foo.bar()

// 动态导入，自动拆分模块
import('jquery').then($=>{
  $(document.body).append('<h1>Hello</h1>')
  $(document.body).append(`<img src="${img}" />`)
})

if(module.hot) {
  module.hot.accept(() => {
    console.log('hmr') // 模块热替换
  })
}
```

./src/foo.js

```js
export default {
  bar: () => {
    console.log('bar')
  }
}
```

./src/style.css

```css
body {
  background-color: pink;
}
```

./src/1.png

执行命令：`yarn parcel src/index.html` 会自动启动一个http服务，并且监听文件的变化，自动开启了模块热替换功能，依赖文件也是自动安装，整个过程都是零配置。

如何以生产模式进行打包：`yarn parcel build src/index.html`

对于相同体量的项目进行打包，Parcel会比Webpack快很多，因为在Parcel内部使用的是多进程同时去工作，充分发挥了多核CPU的性能，而Webpack中可以使用happypack插件实现这一点。

Parcel首个版本发布于2017年，当时Webpack使用上过于繁琐。Parcel真正意义上实现了完全零配置，而且Parcel构建速度更快。

而现在大多数项目还是使用Webpack作为打包器，可能是因为Webpack有更好的生态、Webpack越来越好用。


## 规范化标准

为什么要有规范化标准

+ 软件开发需要多人协同
+ 不同开发者具有不同的编码习惯和喜好
+ 不同的喜好增加项目维护成本
+ 每个项目或者团队需要明确统一的标准

哪里需要规范化标准

+ 代码、文档、甚至是提交日志
+ 开发过程中人为编写的成果图
+ 代码标准化规范最为重要

实施规范化的方法

+ 编码前人为的标准约定
+ 通过工具实现Lint

常见的规范化实现方式

+ ESLint 工具使用
+ 定制ESLint校验规则
+ ESLint对TypeScript的支持
+ ESLint结合自动化工具或者Webpack
+ 基于ESLint的衍生工具
+ StyleLint工具的使用

### 一、ESLint

#### 1. ESLint介绍

+ 最为主流的JavaScript Lint工具，检测JS代码质量
+ ESLint很容易统一开发者的编码风格
+ ESLint可以帮助开发者提升编码能力

#### 2. ESLInt安装

+ 初始化项目: `yarn init -y`
+ 安装ESLint模块为开发依赖: `yarn add eslint --dev`
+ 通过CLI命令验证安装结果：`yarn eslint -v`

#### 3. ESLint 检查步骤

+ 编写“问题”代码
+ 使用eslint执行检测 : 执行`yarn eslint 01-prepare.js`，执行自动修复`yarn eslint 01-prepare.js --fix`
+ 完成eslint使用配置 : `yarn eslint --init`

#### 4. ESLint配置文件解析

```js
module.exports = {
  env: {
    // 运行的环境，决定了有哪些默认全局变量
    browser: true,
    es2020: true
  },
  // eslint 继承的共享配置
  extends: [
    'standard'
  ],
  // 设置语法解析器，控制是否允许使用某个版本的语法
  parserOptions: {
    ecmaVersion: 11
  },
  // 控制某个校验规则的开启和关闭
  rules: {
    'no-alert': 'error'
  },
  // 添加自定义的全局变量
  globals: {
    "$": 'readonly', 
  }
}
```

#### 5. ESLint配置注释

将配置写在代码的注释中，然后再对代码进行校验

```js
const str1 = "${name} is coder" // eslint-disable-line no-template-curly-in-string

console.log(str1)
```

#### 6. ESLint 结合自动化工具

+ 集成之后，ESLint一定会工作
+ 与项目统一，管理更加方便

#### 7. ESLint结合Webpack

eslint通过loader形式校验JavaScript代码

前置工作：

+ git clone 仓库
+ 安装对应模块
+ 安装eslint模块
+ 安装eslint-loader模块
+ 初始化.eslintrc.js配置文件

后续配置：

```js
reles: {
  'react/jsx-uses-react': 2
},
  plugins: [
    'react'
  ]
```

#### 8 现代化项目集成ESLint

#### 9 ESLint检查TypeScript

### 二、StyleLint

#### 1. StyleLint使用介绍

+ 提供默认的代码检查规则
+ 提供CLI工具，快速调用
+ 通过插件支持Sass、Less、PostCSS
+ 支持Gulp或者Webpack集成

`npm install stylelint --dev`

`npx stylelint ./index.css`

`npm install stylelint-config-sass-guidelines`

.stylelintrc.js

```js
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-sass-guidelines"
  ]
}
```

运行：`npx stylelint ./index.css`

### 三、Prettier 的使用

近两年流行的前端代码通用型格式化工具，几乎可以完成各种代码的格式化。

`yarn add prettier --dev`安装prettier到当前项目

`yarn prettier style.css`将格式化的结果输出到命令行

`yarn prettier style.css --write` 将格式化的结果覆盖原文件

`yarn prettier . --write`对当前整个项目进行格式化

### 四、Git Hooks 介绍

代码提交至仓库之前为执行lint工作

+ Git Hook也称为Git钩子，每个钩子都对应一个任务
+ 通过shell脚本可以编写钩子任务出发时要具体执行的操作

在一个Git仓库中，进入`.git/hooks`目录，然后看到很多sample文件，执行`cp pre-commit.sample pre-commit`,拷贝了一份pre-commit文件出来，把里面的内容先去掉，就写一句简单的echo看看Git钩子的效果(第一行是可执行文件必须要有的固定语法，不可以删除)

```bash
#!/bin/sh
echo "git hooks"
```

然后回到仓库根目录，执行`git add .`,`git commit -m"xx"`

就可以看到输出了git hooks，说明pre-commit这个钩子已经生效了

#### 五、ESLint结合Git Hooks

很多前端开发者并不擅长使用shell，Husky可以实现Git Hooks的使用需求

在已有了eslint的Git项目中，安装husky，实现在Git commit的时候，进行lint

`yarn add husky --dev`

package.json

```json
{
  "name": "GitHooks",
  "version": "1.0.0",
  "main": "index.js",
  "author": "",
  "license": "MIT",
  "scripts": {
    "test": "eslint ./index.js"
  },
  "devDependencies": {
    "eslint": "^7.3.1",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.21.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "husky": "^4.2.5"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn test"
    }
  }
}

```

然后执行

` echo node_modules > .gitignore`

 `git add .`

`git commit -m "husky"`

可以看到我们的index.js的代码报错被输出到控制台了，并且Git commit失败了。

说明husky已经完成了在代码提交前的lint工作。不过husky并不能对代码进行格式化，此时可以使用lint-stage

`yarn add lint-staged --dev`

package.json

```json
{
  "name": "GitHooks",
  "version": "1.0.0",
  "main": "index.js",
  "author": "",
  "license": "MIT",
  "scripts": {
    "test": "eslint ./index.js",
    "precommit": "lint-staged"
  },
  "devDependencies": {
    "eslint": "^7.3.1",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.21.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "husky": "^4.2.5",
    "lint-staged": "^10.2.11"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn precommit"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint",
      "git add"
    ]
  }
}

```

















#### 任务四、规范化标准

##### 1、规范化介绍
+ 为什么要有规范化标准
    + 软件开发需要多人协同
    + 不同开发者具有不同的编码习惯和喜好
    + 不同的喜好增加项目维护成本
    + 每个项目或者团队需要明确统一的标准
+ 实施规范化的方法
    + 编码前人为的标准约定
    + 通过工具实现lint
+ 常见的规范化实现方式
    + ESLint工具使用
    + 定制ESLint效验规则
    + ESLint对ts的支持
    + ESLint结合自动化工具或者Webpack
    + 基于ESLint的衍生工具
    + Stylelint工具的使用

##### 2、ESLint安装
+ 初始化项目
+ 安装ESLint模块为开发依赖
+ 通过cli命令验证安装结果

##### 3、配置文件解析
+ 

