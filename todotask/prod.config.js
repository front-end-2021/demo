const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmllInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    resolve: {
        extensions: ['.js', '.vue'], // giúp im___port file không cần viết đuôi mở rộng
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'vue$': 'vue/dist/vue.runtime.esm-bundler.js', // vue 3
        },
    },
    entry: path.resolve(__dirname, 'src/main.js'),
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
        new HtmlWebpackPlugin({ template: './src/index.html', inject: 'body' }),
        new HtmllInlineScriptPlugin(), // comment khi chạy dev server
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devtool: 'source-map',
};
