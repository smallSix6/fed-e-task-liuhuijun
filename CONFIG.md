## Eslint+TS+React Hooks
### 一、安装相关依赖
#### 1.1 安装 Typescript
+ 推荐使用全局安装，可以在其他项目中也使用TS   npm install -g typescript
#### 1.2 安装声明文件
+ 所需的 react, react-dom 的声明文件, 以及加载TS的ts-loader    npm install --save-dev @types/react @types/react-dom ts-loader
#### 1.3 配置 tsconfig.json
+ 在使用Typescript时需要根据实际项目的需要进行相关规则的配置，具体配置根据项目而异、可参考官网，具体看这里TS官网。我的配置项如下所示：
```js
    {
        "compilerOptions": {
            "allowSyntheticDefaultImports": true,
            "noUnusedParameters": true,
            "outDir": "build/dist",
            "baseUrl": ".",
            "strict": true,
            "noImplicitAny": true,
            "removeComments": true,
            "preserveConstEnums": true,
            "sourceMap": true,
            "forceConsistentCasingInFileNames": true,
            "strictPropertyInitialization": true,
            "experimentalDecorators": true,
            "noImplicitReturns": true,
            "moduleResolution": "node",
            "strictNullChecks": true,
            "esModuleInterop": true,
            "noUnusedLocals": true,
            "importHelpers": true,
            "noImplicitThis": false,
            "suppressImplicitAnyIndexErrors": false,
            "skipLibCheck": true,
            "noResolve": false,
            "module": "es2015",
            "allowJs": true,
            "target": "es5",
            "jsx": "react",
            "lib": [
            "es5",
            "es2015",
            "dom",
            "es7",
            "es2018"
            ],
            "paths": {
            "@/*": [
                "./src/*"
            ]
            }
        },
        "exclude": [
            "node_modules",
            "build",
            "scripts",
            "acceptance-tests",
            "webpack",
            "jest",
            "src/setupTests.ts",
            "tslint:latest",
            "tslint-config-prettier"
        ]
    }
```
### 二、ESLint代码规范
#### 2.1 ESLint规范TS代码
+ npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
+ eslint: ESLint的核心代码
+ @typescript-eslint/parser：ESLint的解析器，用于解析Typescript文件，从而检查和规范Typescript代码
+ @typescript-eslint/eslint-plugin：这是一个ESLint插件，包含了各类定义好的检测Typescript代码的规范
+ 安装好依赖后，需要在项目根目录中的.eslintrc.js中配置，包括解析器、继承的代码规范、插件和环境:
```js
    module.exports = {
        parser:  '@typescript-eslint/parser', //定义ESLint的解析器
        extends: ['plugin:@typescript-eslint/recommended'],//定义文件继承的子规范
        plugins: ['@typescript-eslint'],//定义了该eslint文件所依赖的插件
        env:{                          //指定代码的运行环境
            browser: true,
            node: true,
        }                                
    }
```
#### 2.2 规范React代码
#### 2.2.1安装插件
+ npm i eslint-plugin-react --save-dev
#### 2.2.2 配置React规范
+ 然后修改.eslintrc.js的配置，如下所示：
```js
    module.exports = {
        parser:  '@typescript-eslint/parser',
        extends: [
            'plugin:react/recommended',
            'plugin:@typescript-eslint/recommended'
        ],//使用推荐的React代码检测规范
        plugins: ['@typescript-eslint','react'],
        env:{                          
            browser: true,
            node: true,
            es6: true,
        },
        settings: {//自动发现React的版本，从而进行规范react代码
            "react": {
                "pragma": "React",
                "version": "detect"
            }
        },  
        parserOptions: {//指定ESLint可以解析JSX语法
            "ecmaVersion": 2019,
            "sourceType": 'module',
            "ecmaFeatures":{
                jsx:true
            }
        }
        rules: {
            quotes: ['error', 'single'], //强制使用单引号
            semi: ['error', 'never'], // 要求或禁止使用分号而不是 ASI
            camelcase: 0, // 双峰驼命名格式
            eqeqeq: 2, //必须使用全等
            yoda: [2, 'never'], //禁止尤达条件
            strict: [2, 'never'], // 禁用严格模式，禁止在任何地方出现 'use strict'
            'no-extra-boolean-cast': 2, //禁止不必要的bool转换
            'no-lone-blocks': 2, //禁止不必要的嵌套块
            'no-plusplus': 0, //禁止使用++，--
            'no-proto': 2, //禁止使用__proto__属性
            'no-self-compare': 2, //不能比较自身
            'no-undef': 2, //不能有未定义的变量
            'no-unreachable': 2, //不能有无法执行的代码
            'no-unused-expressions': 2, //禁止无用的表达式
            'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
            'no-alert': 2, //禁止使用alert
            'no-caller': 1, //禁止使用arguments.caller或arguments.callee
            'no-inline-comments': 2, //禁止行内备注
            'no-func-assign': 2, //禁止重复的函数声明
            'no-eval': 2, //禁止使用eval,
            'no-empty': 2, //块语句中的内容不能为空
            'no-const-assign': 2, //禁止修改const声明的变量
            'no-var': 2, //禁止使用var
            'no-multiple-empty-lines': [1, { max: 2 }], //空行最多不能超过2行
            'no-extra-semi': 'error', // 禁止不必要的分号
            'array-bracket-spacing': [2, 'never'], //是否允许非空数组里面有多余的空格
            'linebreak-style': ['error', 'unix'], // 强制使用一致的换行风格
            'brace-style': [2, '1tbs', { allowSingleLine: true }], // if while function 后面的{必须与if在同一行，java风格。
            'comma-dangle': 0, // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
            'comma-spacing': [2, { before: false, after: true }], // 控制逗号前后的空格
            'computed-property-spacing': [2, 'never'], // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
            'use-isnan': 2, //禁止比较时使用NaN，只能用isNaN()
            'default-case': 2, //switch语句最后必须有default
            'newline-after-var': 2, //变量声明后是否需要空一行
            'max-depth': [2, 4], //嵌套块深度最多四层
            'max-params': [2, 4], //函数最多只能有4个参数
            'no-else-return': 2, //如果if语句里面有return,后面不能跟else语句，禁止出现 if (cond) { return a } else { return b }，应该写为 if (cond) { return a } return b
            'no-eq-null': 2, //禁止对null使用==或!=运算符
            'no-iterator': 2, //禁止使用__iterator__ 属性
            'no-mixed-spaces-and-tabs': [2, false], //禁止混用tab和空格
            'no-new-func': 1, //禁止使用new Function
            'no-new-object': 2, //禁止使用new Object()
            'no-self-compare': 2, //不能比较自身
            'no-unused-vars': [2, { vars: 'all', args: 'after-used' }], //不能有声明后未被使用的变量或参数
            'no-use-before-define': 0, //未定义前不能使用
            'valid-typeof': 2, //无效的类型判断
            'wrap-iife': [2, 'inside'], //立即执行函数表达式的小括号风格
            // 注释的斜线和星号后要加空格
            'spaced-comment': [
                2,
                'always',
                {
                    block: {
                        exceptions: ['*'],
                        balanced: true,
                    },
                },
            ],
            // new, delete, typeof, void, yield 等表达式前后必须有空格，-, +, --, ++, !, !! 等表达式前后不许有空格
            'space-unary-ops': [
                2,
                {
                    words: true,
                    nonwords: false,
                },
            ],
            'prefer-rest-params': 2, // 必须使用解构 ...args 来代替 arguments
            'consistent-this': [2, 'self', 'that'], // this 的别名规则，只允许 self 或 that
            curly: [2, 'multi-line', 'consistent'], // if 后必须包含 { ，单行 if 除外
            'for-direction': 2, // for 循环不得因方向错误造成死循环
            'getter-return': [2, { allowImplicit: true }], // getter 必须有返回值，允许返回 undefined
            'keyword-spacing': 2, // 关键字前后必须有空格
            // new关键字后类名应首字母大写
            'new-cap': [
                2,
                {
                    capIsNew: false, // 允许大写开头的函数直接执行
                },
            ],
            'no-await-in-loop': 2, // 禁止将 await 写在循环里
            'no-class-assign': 2, // class定义的类名不得与其它变量重名
            'no-dupe-args': 2, // 函数参数禁止重名
            'no-duplicate-case': 2, // 禁止 switch 中出现相同的 case
            'no-duplicate-imports': 2, // 禁止重复 import
            'no-empty-function': 0, // 禁止空的 function,包含注释的情况下允许
            'no-empty-pattern': 2, // 禁止解构中出现空 {} 或 []
            'no-ex-assign': 2, // catch 定义的参数禁止赋值
            'no-extend-native': [2, { exceptions: ['Array', 'Object'] }], // 禁止扩展原生对象
            'no-extra-parens': [2, 'functions'], // 禁止额外的括号，仅针对函数体
            'no-floating-decimal': 2, // 不允许使用 2. 或 .5 来表示数字，需要用 2、2.0、0.5 的格式
            'no-func-assign': 2, // 禁止对函数声明重新赋值
            'no-implied-eval': 2, // 禁止在 setTimeout 和 setInterval 中传入字符串，因会触发隐式 eval
            'no-multi-assign': 2, // 禁止连等赋值
            '@typescript-eslint/explicit-function-return-type': [
                'off',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/no-explicit-any': 0, // 特殊情况可将类型显示设置为any
            '@typescript-eslint/interface-name-prefix': 0, // 允许接口命名以I开头
            '@typescript-eslint/no-var-requires': 0, // antd中引用style需要用require
            '@typescript-eslint/no-use-before-define': 0, // mapStateToProps在之前就用到(typeof推断类型)
            '@typescript-eslint/camelcase': 0, // 驼峰命名格式
            '@typescript-eslint/no-empty-function': 0, // 给函数默认值可以为空
            'react/display-name': 0, // 一个莫名其妙的Bug
            'react/no-find-dom-node': 0,
            '@typescript-eslint/no-non-null-assertion': 0, // 允许用！断言不为空
        }
    }
```
#### 2.2.3 配置setting，保存自动校验
+ prettier和eslint可以在保存时自动检查并自动格式化一部分问题，在settings.json文件中修改其配置文件如下：
```js
{
    "eslint.enable": true, //是否开启vscode的eslint
    "eslint.options": { //指定vscode的eslint所处理的文件的后缀
        "extensions": [
            ".js",
            ".vue",
            ".ts",
            ".tsx"
        ]
    },
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [ //确定校验准则
        "javascript",
        "javascriptreact",
        {
            "language": "html",
            "autoFix": true
        },
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ]
}
```
#### 2.2.4 安装依赖
+ npm install husky --save-dev
+ 在package.json的script中配置：
```js
    "scripts": {
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
  }
```