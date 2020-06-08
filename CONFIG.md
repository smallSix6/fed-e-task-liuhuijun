## Eslint+TS+React Hooks
### 一、安装相关依赖
#### 1.1 安装 Typescript
##### 推荐使用全局安装，可以在其他项目中也使用TS   npm install -g typescript
#### 1.2 安装声明文件
##### 所需的 react, react-dom 的声明文件, 以及加载TS的ts-loader    npm install --save-dev @types/react @types/react-dom ts-loader
#### 1.3 配置 tsconfig.json
##### 在使用Typescript时需要根据实际项目的需要进行相关规则的配置，具体配置根据项目而异、可参考官网，具体看这里TS官网。我的配置项如下所示：
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

