## Vue.js + Vuex + TypeScript 实战项目开发与项目优化 （项目见：<https://github.com/smallSix6/fed-e-task-liuhuijun/tree/master/fed-e-task-03-06>

### 任务一：Vue 项目实战
#### 1、使用 VueCLI 创建项目
+ 创建项目：vue create liuzi-fed
+ 配置信息如下图：
+ ![](../images/vueCLI初试配置.png)
+ cd liuzi-fed
+ npm run serve
#### 2、调整初始目录结构
+ 在 src 目录下添加 services、styles 和 utils 文件夹
#### 3、使用 TS 开发 Vue 
+ 两种方式：
  1. 全新项目：使用 Vue CLI 脚手架工具创建 Vue 项目
  + ![](../images/vueCLITS.png)
  2. 已有项目：添加 Vue 官方配置的 TS 适配插件
  + 使用 @vue/cli 安装 TS 插件
  ```js
  vue add @vue/typescript
  ```
#### 4、使用 TS 开发 Vue 项目
+ 相关配置说明
  + 安装了 TS 相关的依赖项
    + dependencies 依赖：

    | 依赖项                        |  说明            |
    |-----                         |----             |
    |vue-class-component           |提供使用 Class 语法写 Vue 组件|
    |vue-property-decorator        |在 Class 语法基础上提供了一些辅助装饰器|

    + devDependencies 依赖：

    | 依赖项                             |  说明            |
    |-----                              |----             |
    |@typescript-eslint/eslint-plugin   |使用 ESLint 效验 ts 代码|
    |@typescript-eslint/parser          |将 ts 转为 AST 供 ESLint 效验使用|
    |@vue/cli-plugin-typescript         |使用 ts + ts-loader + fork-ts-checker-webpack-piugin 进行更快的类型检查|
    |@vue/eslint-config-typescript      |兼容 ESLint 的 ts 效验规则|
    |typescript                         |ts 编译器，提供类型效验和转换 js 功能|
  + ts 配置文件 `tsconfig.json`
    ```js
    {
      "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "importHelpers": true,
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "sourceMap": true,
        "baseUrl": ".",
        "types": [
          "webpack-env"
        ],
        "paths": {
          "@/*": [
            "src/*"
          ]
        },
        "lib": [
          "esnext",
          "dom",
          "dom.iterable",
          "scripthost"
        ]
      },
      "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "tests/**/*.ts",
        "tests/**/*.tsx"
      ],
      "exclude": [
        "node_modules"
      ]
    }
    ```
  + shims-vue.d.ts 文件的作用
  ```js
  // 主要用于 ts 识别 .vue 文件模板
  // ts 默认不支持导入 .vue 模板，这个文件告诉 ts 导入 .vue 文件模板都按 VueConstructor<Vue> 类型识别处理
  declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
  }
  ```
  + shims-tsx.d.ts 文件的作用
  ```js
  <!-- 为 jsx 组件模板补充类型声明 -->
  import Vue, { VNode } from 'vue'
  declare global {
    namespace JSX {
      // tslint:disable no-empty-interface
      interface Element extends VNode {}
      // tslint:disable no-empty-interface
      interface ElementClass extends Vue {}
      interface IntrinsicElements {
        [elem: string]: any;
      }
    }
  }
  ```
+ 使用 OptionsAPI 定义 Vue 组件
  + vue 官网中的 ts 支持 <https://cn.vuejs.org/v2/guide/typescript.html#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95>


