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

### 2. 尝试使用Gulp完成项目的自动化构建

#### gulpfile.js
```js
// 实现这个项目的构建任务
const {
  src,
  dest,
  parallel,
  series,
  watch,
} = require("gulp");
const path = require('path')
const Comb = require('csscomb')
const standard = require('standard')
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const del = require("del");
const browserSync = require("browser-sync");
const config = require('./pages.config');
const bs = browserSync.create();
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const isProd = process.env.NODE_ENV ?
  process.env.NODE_ENV === 'production' :
  argv.production || argv.prod || false

const cwd = process.cwd();

const clean = () => {
  return del([config.build.dist, config.build.temp]);
};

const lint = done => {
  const comb = new Comb(require('./csscomb.json'))
  comb.processPath(config.build.src)
  const cwd = path.join(__dirname, config.build.src)
  standard.lintFiles(config.build.paths.scripts, {
    cwd,
    fix: true
  }, done)
}

const style = () => {
  return src(config.build.paths.styles, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.sass({
      outputStyle: "expanded",
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const script = () => {
  return src(config.build.paths.scripts, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.babel({
      presets: [require("@babel/preset-env")],
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const page = () => {
  return src(config.build.paths.pages, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.swig({
      data: config.data,
      defaults: {
        cache: false,
      },
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const image = () => {
  return src(config.build.paths.images, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));
};

const font = () => {
  return src(config.build.paths.fonts, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));
};

const extra = () => {
  return src("public/**", {
      base: "public",
    })
    .pipe(dest(config.build.dist));
};

const server = () => {
  watch(config.build.paths.styles, {
    cwd: config.build.src,
  }, style);
  watch(config.build.paths.scripts, {
    cwd: config.build.src,
  }, script);
  watch(config.build.paths.pages, {
    cwd: config.build.src,
  }, page);
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  watch([
    config.build.paths.images,
    config.build.paths.fonts,
  ], {
    cwd: config.build.src,
  }, bs.reload());
  watch("**", {
    cwd: config.build.public
  }, bs.reload);
  bs.init({
    notify: false,
    port: argv.port === undefined ? 2080 : argv.port,
    open: argv.open === undefined ? false : argv.open,
    // files: 'dist/**',
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const upload = () => {
  console.log(argv.branch)
  return src('dist/**')
    .pipe(
      plugins.ghPages([{
        branch: argv.branch === undefined ? 'gh-pages' : argv.branch
      }])
    )
}

const useref = () => {
  return src("temp/*.html", {
      base: "temp",
    })
    .pipe(plugins.useref({
      searchPath: ["temp", "."],
    }))
    .pipe(plugins.if(/.js$/, plugins.uglify()))
    .pipe(plugins.if(/.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    })))
    .pipe(dest(config.build.dist));
};

const distServer = () => {
  bs.init({
    notify: false,
    port: argv.port === undefined ? 2080 : argv.port,
    open: argv.open === undefined ? false : argv.open,
    server: config.build.dist
  })
}

const measure = () => {
  return src('**', {
      cwd: config.build.dist
    })
    .pipe(
      plugins.size({
        title: `${isProd ? 'Prodcuction' : 'Development'} mode build`,
        gzip: true
      })
    )
}

const compile = parallel(style, script, page);
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra,
  ),
  measure
);
const serve = series(compile, server);
const start = series(build, distServer)
const deploy = series(build, upload)
module.exports = {
  lint,
  compile,
  serve,
  build,
  start,
  deploy,
  clean,
};
```
#### csscomb.json的内容
```js
{
  "always-semicolon": true,
  "block-indent": 2,
  "color-case": "lower",
  "color-shorthand": true,
  "element-case": "lower",
  "eof-newline": true,
  "exclude": ["node_modules/**"],
  "leading-zero": true,
  "lines-between-rulesets": 1,
  "quotes": "single",
  "remove-empty-rulesets": false,
  "sort-order": [
    [
      "$variable"
    ],
    [
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "display",
      "visibility",
      "float",
      "clear",
      "overflow",
      "overflow-x",
      "overflow-y",
      "clip",
      "align-content",
      "align-items",
      "align-self",
      "flex",
      "flex-flow",
      "flex-basis",
      "flex-direction",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "justify-content",
      "order",
      "box-sizing",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
      "width",
      "height",
      "outline",
      "outline-width",
      "outline-style",
      "outline-color",
      "outline-offset",
      "border",
      "border-spacing",
      "border-collapse",
      "border-width",
      "border-style",
      "border-color",
      "border-top",
      "border-top-width",
      "border-top-style",
      "border-top-color",
      "border-right",
      "border-right-width",
      "border-right-style",
      "border-right-color",
      "border-bottom",
      "border-bottom-width",
      "border-bottom-style",
      "border-bottom-color",
      "border-left",
      "border-left-width",
      "border-left-style",
      "border-left-color",
      "border-radius",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
      "border-image",
      "border-image-source",
      "border-image-slice",
      "border-image-width",
      "border-image-outset",
      "border-image-repeat",
      "border-top-image",
      "border-right-image",
      "border-bottom-image",
      "border-left-image",
      "border-corner-image",
      "border-top-left-image",
      "border-top-right-image",
      "border-bottom-right-image",
      "border-bottom-left-image",
      "background",
      "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader",
      "background-color",
      "background-image",
      "background-attachment",
      "background-position",
      "background-position-x",
      "background-position-y",
      "background-clip",
      "background-origin",
      "background-size",
      "background-repeat",
      "box-decoration-break",
      "box-shadow",
      "color",
      "table-layout",
      "caption-side",
      "empty-cells",
      "list-style",
      "list-style-position",
      "list-style-type",
      "list-style-image",
      "quotes",
      "content",
      "counter-increment",
      "counter-reset",
      "vertical-align",
      "text-align",
      "text-align-last",
      "text-decoration",
      "text-emphasis",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-emphasis-color",
      "text-indent",
      "text-justify",
      "text-outline",
      "text-transform",
      "text-wrap",
      "text-overflow",
      "text-overflow-ellipsis",
      "text-overflow-mode",
      "text-shadow",
      "white-space",
      "word-spacing",
      "word-wrap",
      "word-break",
      "tab-size",
      "hyphens",
      "letter-spacing",
      "font",
      "font-weight",
      "font-style",
      "font-variant",
      "font-size-adjust",
      "font-stretch",
      "font-size",
      "font-family",
      "src",
      "line-height",
      "opacity",
      "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity",
      "filter",
      "resize",
      "cursor",
      "nav-index",
      "nav-up",
      "nav-right",
      "nav-down",
      "nav-left",
      "transition",
      "transition-delay",
      "transition-timing-function",
      "transition-duration",
      "transition-property",
      "transform",
      "transform-origin",
      "animation",
      "animation-name",
      "animation-duration",
      "animation-play-state",
      "animation-timing-function",
      "animation-delay",
      "animation-iteration-count",
      "animation-direction",
      "pointer-events",
      "unicode-bidi",
      "direction",
      "columns",
      "column-span",
      "column-width",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-width",
      "column-rule-style",
      "column-rule-color",
      "break-before",
      "break-inside",
      "break-after",
      "page-break-before",
      "page-break-inside",
      "page-break-after",
      "orphans",
      "widows",
      "zoom",
      "max-zoom",
      "min-zoom",
      "user-zoom",
      "orientation"
    ],
    [
      "..."
    ],
    [
      "$include",
      "$extend",
      "$import"
    ]
  ],
  "sort-order-fallback": "abc",
  "space-after-colon": 1,
  "space-before-colon": 0,
  "space-after-combinator": 1,
  "space-before-combinator": 1,
  "space-between-declarations": "\n",
  "space-after-opening-brace": "\n",
  "space-before-opening-brace": 1,
  "space-after-selector-delimiter": "\n",
  "space-before-selector-delimiter": 0,
  "space-before-closing-brace": "\n",
  "strip-spaces": true,
  "tab-size": 2,
  "unitless-zero": true,
  "vendor-prefix-align": true,
  "verbose": false
}
```
### 2. 尝试使用Gulp完成项目的自动化构建

#### gruntfile.js
```js
const sass = require('sass')
const fs = require('fs')
const useref = require('useref')
const loadGruntTasks = require('load-grunt-tasks')
const browserSync = require('browser-sync')
const bs = browserSync.create()

const data = {
  menus: [{
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
      children: [{
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
module.exports = grunt => {
  grunt.initConfig({
    clean: ['dist/**'],

    sass: {
      options: {
        sourceMap: true,
        implementation: sass, // implementation指定在grunt-sass中使用哪个模块对sass进行编译，我们使用npm中的sass
      },
      main: {
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },

    babel: {
      options: {
        presets: ['@babel/preset-env'],
        sourceMap: true
      },
      main: {
        files: {
          'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    web_swig: {
      options: {
        swigOptions: {
          cache: false
        },
        getData() {
          return data;
        }
      },
      main: {
        expand: true,
        cwd: 'src/',
        src: "**/*.html",
        dest: "dist/"
      },
    },

    uglify: {
      production: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/scripts/*.js'],
          dest: 'dist/',
        }]
      },
      dev: {}
    },
    cssmin: {
      production: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/styles/*.css'],
          dest: 'dist/',
        }]
      },
      dev: {}
    },
    htmlmin: {
      production: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      },
      dev: {}
    },
    image: {
      production: {
        options: {
          optipng: false,
          pngquant: true,
          zopflipng: true,
          jpegRecompress: false,
          mozjpeg: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/fonts/*', 'assets/images/*'],
          dest: 'dist/'
        }]
      },
      dev: {}
    },
    eslint: {
      options: {
        rulePaths: ['src/assets/scripts/']
      },
      target: ['src/assets/scripts/main.js']
    },
    sasslint: {
      main: {
        options: {
          configFile: 'config/.sass-lint.yml',
          rulePaths: ['src/assets/scripts/']
        },
        target: ['src/assets/styles/main.scss']
      }
    },
    copy: {
      main: {
        files: [{
            expand: true,
            cwd: 'public/',
            src: ['**'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src',
            src: ['assets/fonts/*'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src',
            src: ['assets/images/*'],
            dest: 'dist/'
          }
        ]
      }
    },
    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: ['babel', 'bs-reload']
      },
      css: {
        files: ['src/scss/*.scss'],
        tasks: ['sass', 'bs-reload']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['web_swig', 'bs-reload']
      }
    },

    ghDeploy: {
      options: {
        repository: 'https://github.com/smallSix6/liuziGulp.git',
        deployPath: 'dist',
        branch: grunt.option('branch') || 'gh-pages',
        message: 'Auto deplyment ' + grunt.template.today()
      },
    }
  })

  grunt.registerTask("useref", function () {
    const done = this.async()
    const cwd = 'dist/'
    const htmls = ['index.html', 'about.html']
    htmls.forEach((html, index) => {
      const inputHtml = fs.readFileSync(cwd + html, "utf8")
      const [code, result] = useref(inputHtml)
      for (const type in result) {
        const dests = Object.keys(result[type])
        dests.forEach(dest => {
          const src = result[type][dest].assets
          let read
          const files = src.map(file => {
            read = cwd + file
            if (file[0] === '/') {
              read = file.substr(1)
            }
            return fs.readFileSync(read)
          })
          fs.writeFile(cwd + dest, files.join(''), (err) => {
            if (err) {
              return console.error(err);
            }
          })
        })
      }
      fs.writeFile(cwd + html, code, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log(`${cwd + html}success`);
        if (index === htmls.length - 1) {
          done()
        }
      })
    })
  });

  // grunt.loadNpmTasks('grunt-sass')


  // 启动browserSync
  grunt.registerTask("bs", function () {
    const done = this.async();
    bs.init({
      notify: false,
      port: grunt.option('port') || 2080,
      open: grunt.option('open'),
      // files: 'temp/**',
      server: {
        baseDir: ['dist', 'src', 'public'], // 按顺序查找
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    }, function () {
      done();
    });
  });
  grunt.registerTask("bs-reload", function () {
    bs.reload()
  });

  // 获取命令行参数是否含有production或者prod，判断是开发模式还是生产模式
  const mode = (grunt.option('production') || grunt.option('prod')) ? 'production' : 'development'

  loadGruntTasks(grunt) // 自动加载所有的grunt插件中的任务

  // 根据命令行参数判断是否需要压缩
  grunt.registerTask('mini:production', ['image', 'uglify', 'cssmin', 'htmlmin'])
  grunt.registerTask('mini:development', [])

  grunt.registerTask('lint', ['sasslint', 'eslint'])

  grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])

  grunt.registerTask('serve', ['compile', 'bs', 'watch'])

  grunt.registerTask('build', ['clean', 'compile', 'copy', 'useref', `mini:${mode}`])

  grunt.registerTask('start', ['clean', 'compile', 'copy', 'useref', 'mini:production', 'bs', 'watch'])

  grunt.registerTask('deploy', ['clean', 'compile', 'copy', 'useref', 'mini:production', 'ghDeploy'])

}
```

#### package.json的部分内容
```js
"scripts": {
    "clean": "gulp clean",
    "lint": "gulp lint",
    "serve": "gulp serve",
    "build": "gulp build",
    "start": "gulp start",
    "deploy": "gulp deploy --production",
    "gruntClean": "grunt clean",
    "gruntLint": "grunt lint",
    "gruntServe": "grunt serve",
    "gruntBuild": "grunt build",
    "gruntStart": "grunt start",
    "gruntDeploy": "grunt deploy --production"
  },
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "browser-sync": "^2.26.7",
    "csscomb": "^4.3.0",
    "del": "^5.1.0",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^4.2.0",
    "gulp-gh-pages": "^0.5.4",
    "gulp-htmlmin": "^5.0.1",
    "gulp-if": "^3.0.0",
    "gulp-imagemin": "^6.1.0",
    "gulp-load-plugins": "^2.0.1",
    "gulp-sass": "^4.0.2",
    "gulp-size": "^3.0.0",
    "gulp-swig": "^0.9.1",
    "gulp-uglify": "^3.0.2",
    "gulp-useref": "^3.1.6",
    "minimist": "^1.2.5",
    "standard": "^13.1.0",
    "concat": "^1.0.3",
    "grunt": "^1.1.0",
    "grunt-babel": "^8.0.0",
    "grunt-browser-sync": "^2.2.0",
    "grunt-contrib-clean": "^2.0.0",
    "grunt-contrib-concat": "^1.0.1",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-csslint": "^2.0.0",
    "grunt-contrib-cssmin": "^3.0.0",
    "grunt-contrib-htmlmin": "^3.1.0",
    "grunt-contrib-jshint": "^2.1.0",
    "grunt-contrib-uglify": "^4.0.1",
    "grunt-contrib-watch": "^1.1.0",
    "grunt-eslint": "^23.0.0",
    "grunt-gh-deploy": "^0.1.3",
    "grunt-html-build": "^0.7.1",
    "grunt-html-template": "^0.1.6",
    "grunt-image": "^6.3.0",
    "grunt-sass": "^3.1.0",
    "grunt-sass-lint": "^0.2.4",
    "grunt-scss-lint": "^0.5.0",
    "grunt-useref": "^0.0.16",
    "grunt-web-swig": "^0.3.1",
    "load-grunt-tasks": "^5.1.0",
    "sass": "^1.26.8",
    "useref": "^1.4.3"
  }
```

