const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { compilation } = require('webpack')

class Myplugin {
    apply(compiler) {
        console.log('qidong')
        compiler.hooks.emit.tap('MyPlugin', compilation => {
            // compilation:可以理解为此次打包的上下文
            for (const name in compilation.assets) {
                // console.log(name)
                // console.log(compilation.assets[name].source())
                if (name.endsWith('.js')) {
                    const contents = compilation.assets[name].source()
                    const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}

module.exports = {
    entry: path.join(__dirname, './src/index.js'), // 入口
    output: { // 输出路径
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    mode: 'none', // none development production
    // devServer: {
    //     contentBase: './public',
    //     proxy: {
    //         '/api': {
    //             // http://localhost:8080/api/users > https://api.github.com/api/users
    //             target: 'https://api.github.com',
    //             pathRewrite: {
    //                 // http://localhost:8080/api/users > https://api.github.com/users
    //                 '^/api': ''
    //             },
    //             // 不能使用 localhost:8080 作为请求 Github 的主机名
    //             changeOrigin: true
    //         }
    //     }
    // },
    devtool: 'source-map',
    module: {
        rules: [{
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.jpg$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1 * 1024
                    }
                }
            },
            {
                test: /.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attributes: {
                            list: [{
                                    tag: 'img',
                                    attribute: 'src',
                                    type: 'src'
                                },
                                {
                                    tag: 'a',
                                    attribute: 'href',
                                    type: 'src'
                                }
                            ]
                        }
                    }
                },
                include: /src/,
                exclude: /index.html/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'initial-scale=0.5'
            },
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html'
        }),
        // 开发阶段最好不要使用这个插件
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: 'public', to: 'public' },
        //     ],
        // }),
        // new Myplugin()
    ]
}