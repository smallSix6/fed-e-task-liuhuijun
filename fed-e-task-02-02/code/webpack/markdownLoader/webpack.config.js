const path = require('path')
module.exports = {
    entry: path.join(__dirname, './src/main.js'), // 入口
    output: { // 输出路径
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    mode: 'none', // none development production
    module: {
        rules: [{
            test: /.md$/,
            use: [
                'html-loader',
                './markdown-loader'
            ]
        }]
    }
}