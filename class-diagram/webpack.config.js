const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue'], // giúp import file không cần viết đuôi mở rộng
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'vue$': 'vue/dist/vue.runtime.esm-bundler.js', // vue 3
        },
    },
    entry: path.resolve(__dirname, 'src/main.js'),
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html', inject: 'body' })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devtool: 'eval-source-map',
    devServer: {
        static: { directory: path.resolve(__dirname, 'dist') },
        hot: true, open: true, //port: 8080,
        watchFiles: ['src/**/*'], liveReload: true,
        client: { overlay: true },  // hiện lỗi trực tiếp trên trình duyệt
    },
};