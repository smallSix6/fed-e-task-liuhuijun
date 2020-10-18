## React 设计原理解密及核心源码解读 （项目见：<https://github.com/smallSix6/fed-e-task-liuhuijun/tree/master/fed-e-task-04-01>

### 任务一：React 基础回顾
#### 1、React 介绍
+ React 是一个用于构建用户界面的 js 库，它只负责应用的视图层，帮助开发人员构建快速且交互式的 web 应用程序
+ React 使用组件的方式构建用户界面
#### 2、JSX 语法回顾
+ JSX 语法
  + 在 react 使用 jsx 语法描述用户界面，它是一种 js 语法扩展
  + 在 react 代码执行之前，Babel 会将 jsx 语法转换为标准的 js API 
  + jsx 语法就是一种语法糖，让开发人员使用更加舒服的代码构建用户界面




### 任务二：VDOM 及 diff 算法
#### 1、


### 任务三：Fiber
#### 1、开发配置：
+ 安装依赖：
  ```js
  npm i webpack webpack-cli webpack-node-externals @babel/core @babel/preset-env @babel/preset-react babel-loader nodemon npm-run-all express -D
  ```