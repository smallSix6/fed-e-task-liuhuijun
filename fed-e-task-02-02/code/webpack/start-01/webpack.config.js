const path = require('path')
module.exports = {
    entry: path.join(__dirname, './src/index.js'), // 入口
    output: { // 输出路径
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    mode: 'none', // none development production
    module: {
        rules: [{
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
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
            }
        ]
    }
}