const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


// module.exports = (env, argv) => {
//     const config = {
//         mode: 'development',
//         entry: './src/main.js',
//         output: {
//             filename: 'js/bundle.js'
//         },
//         devtool: 'cheap-eval-module-source-map',
//         devServer: {
//             hot: true,
//             contentBase: 'public'
//         },
//         module: {
//             rules: [{
//                     test: /\.css$/,
//                     use: [
//                         'style-loader',
//                         'css-loader'
//                     ]
//                 },
//                 {
//                     test: /\.(png|jpe?g|gif)$/,
//                     use: {
//                         loader: 'file-loader',
//                         options: {
//                             outputPath: 'img',
//                             name: '[name].[ext]'
//                         }
//                     }
//                 }
//             ]
//         },
//         plugins: [
//             new HtmlWebpackPlugin({
//                 title: 'Webpack Tutorial',
//                 template: './src/index.html'
//             }),
//             new webpack.HotModuleReplacementPlugin()
//         ]
//     }
//     if (env === 'production') {
//         config.mode = 'production'
//         config.devtool = false
//         config.plugins = [
//             ...config.plugins,
//             new CleanWebpackPlugin(),
//             new CopyWebpackPlugin({
//                 patterns: [
//                     { from: 'public', to: 'public' },
//                 ],
//             }),
//         ]
//     }
//     return config
// }



module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'js/bundle.js'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            API_BASE_URL: '"https://api.example.com"'
        })
    ]
}