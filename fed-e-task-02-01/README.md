# 刘惠俊 Part2 模块一 前端工程化 作业

## 简答题

### 1. 谈谈你对前端工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。
+ 答：
    + 工程化的认识：
        + 主要解决的问题：
            + 传统语言或语法的弊端
            + 无法使用模块化/组件化
            + 重复的机械工作
            + 代码风格统一、质量保证
            + 依赖后端服务接口支持
            + 整体依赖后端项目
        + 工程化的定义：一切以提高效率、降低成本、质量保证为目的的手段都属于工程化
        + 工程化在项目中的应用：
            + 创建项目：创建项目结构、创建特定类型的文件
            + 编码：格式化代码、效验代码风格、编译/构建/打包
            + 预览/测试：Web Server/Mock、Live Reloading/HMR、Source Map
            + 提交：Git Hooks、Lint-staged、持续集成
            + 部署：CI/CD、自动发布
        + 工程化内容概要：
            + 脚手架工具开发
            + 自动化构建系统
            + 模块化打包
            + 项目代码规范化
            + 自动化部署
    + 解决的问题：
        + 1、提交：Git Hooks、Lint-staged。具体的package.json文件中的代码如下： 
        ```js
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
                "eject": "react-scripts eject",
                "lint": "eslint --ext .js,.jsx,.ts,.tsx src --fix"
            },
            "husky": {
                "hooks": {
                "pre-commit": "lint-staged"
                }
            },
            "lint-staged": {
                "src/**/*.{js,ts,jsx,tsx}": [
                "npm run lint",
                "git add"
                ]
            },
        ```
        + 这样在git提交代码的commit阶段时，如果有同事的代码不符合eslint规范，就不会提交成功，保证了远程仓库的代码质量。
        
        + 2、创建项目：创建项目结构、创建特定类型的文件.各种脚手架的使用大大简化了我们创建项目的成本和时间，且脚手架配置的很完善也很规范，可以让我们更专注于项目的开发。

        + 部署：CI/CD、自动发布。可以自动化的部署，且部署流程可配置，大大简化了部署的成本和出错几率。

### 2. 你认为脚手架除了为我们创建项目结构，还有什么更深的意义？
+ 答：还可以提供项目规范和约定。在脚手架配置中，会规定项目的大体结构、骨架，以及在什么文件夹下写什么代码。变化的是你在与脚手架交互时的参数，不变的是脚手架的自动化创建项目结构的逻辑以及配置参数。脚手架使得多人协同开发时，有了更多的约束。


## 编程题

### 1. 概述脚手架实现的过程，并使用NodeJS完成一个自定义的小型脚手架工具

答：脚手架的实现过程就是在启动脚手架之后，根据一些预设的问题和用户的输入，结合一些模板文件，生成项目结构、项目文件和项目依赖。

使用NodeJS开发一个小型的脚手架工具：

+ 用`yarn init`初始化一个空文件夹：`liuhuijun-pro`

+ 在`package.json`中添加` bin`属性指定脚手架的命令入口文件为`cli.js`

  ```json
  {
  "name": "liuhuijun-pro",
  "version": "1.0.0",
  "main": "index.js",
  "bin": "cli.js",
  "license": "MIT",
  "dependencies": {
    "ejs": "^3.1.3",
    "inquirer": "^7.1.0"
  }
  }
  ```


+ 编写`cli.js`

  ```js
  #!/usr/bin/env node
  
  // Node CLI 应用入口文件必须要有这样的文件头
  // 如果Linux 或者 Mac 系统下，还需要修改此文件权限为755: chmod 755 cli.js
  
  // 脚手架工作过程：
  // 1. 通过命令行交互询问用户问题
  // 2. 根据用户回答的结果生成文件
  
  const path = require('path')
  const fs = require('fs')
  const inquirer = require('inquirer') // 发起命令行交互询问
  const ejs = require('ejs') // 模板引擎
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name?'
    }
  ]).then(answer => {
    // 模板目录
    const tempDir = path.join(__dirname, 'templates')
    // 目标目录
    const destDir = process.cwd()
  
    // 将模板下的文件全部转换到目标目录
    fs.readdir(tempDir, (err, files) => {
      if (err) throw err
      files.forEach(file => {
        // 通过模板引擎渲染文件
        ejs.renderFile(path.join(tempDir, file), answer, (err, result) => {
          if(err) throw err
          // 将结果写入到目标目录
          fs.writeFileSync(path.join(destDir, file), result)
        })
      })
    })
  })
  ```

+ 命令行中修改`cli.js`文件权限：`chmod 755 cli.js`

+ 模板文件`templates/index.html`如下：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %></title>
  </head>
  <body>
    
  </body>
  </html>
  ```

+ 执行命令将该cli程序link到全局：`yarn link`

+ 然后再其他文件夹中执行：`liuhuijun-pro`命令，就可以根据模板自动化创建文件了  



