// 基础设置
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 优化
const glob = require('glob'); // 查找匹配的文件
// 删除无意义的css，只能配合mini-css-extract-plugin
const PurgeCssWebpackPlugin = require('purgecss-webpack-plugin');


const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
module.exports = (env) => {
    // env 是环境变量
    // "dev": "webpack --env.development --config ./build/webpack.base.js",
    console.log(env);
    // { development: true }
    
    let isDev = env.development;
    const base= {
        // js - react 入口文件
        // entry: path.resolve(__dirname, '../src/index.js'),
        // react - ts 入口文件
        entry: path.resolve(__dirname, '../src/index-react.tsx'),
        // vue - ts 入口文件
        // entry: path.resolve(__dirname, '../src/index-vue.ts'),
        output: {
            filename: 'bundle.js',
            // 出口位置 要用绝对路径
            path: path.resolve(__dirname, '../dist')
        },
        module: {
            // 转化什么文件 用什么去转 使用哪些loader
            rules: [
                // loader 写法 1：[]   2: {}   3: ''
                // {
                //     test: /\.css/,
                //     use: 'style-loader'
                // },
                // {
                //     test: /\.css/,
                //     use: 'css-loader'
                // }
                {
                    test: /\.css/,
                    // use: ['style-loader', 'css-loader']
                    use: [
                        // 开发模式不抽离单独css，生产模式抽离
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // 给loader传递参数
                                importLoaders: 2 // 如果当前css引用（@import）了其他类型的文件，从当前这个loader之后的1个loader进行转化，如果设置为2，就从之后2个loader开始进行转化
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.scss/,
                    // 匹配到scss结尾的文件，使用sass-loader自动调用node-sass处理sass文件
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                // {
                //     test: /\.less/,
                //     // less-loader > less
                //     use: ['style-loader', 'css-loader', 'less-loader']
                // },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    // use: 'file-loader' // file-loader 默认功能是拷贝
                    use: {
                        loader: 'url-loader', 
                        // 希望当前比较小的图片转化为 base64 ，转化后尺寸比以前大，但是不用发http请求了
                        options: {
                            // 大于 100k 的图片，会用 file-loader
                            limit: 8 * 1024, // 一般为 8*1024
                            // 打包到目录下
                            name: 'image/[contentHash].[ext]'
                        }
                    }
                },
                {
                    // 图标字体，一般不转base64，有时会失效
                    test: /\.(woff|ttf|eot|svg)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                    // use: {
                    //     loader: 'babel-loader',
                    //     options: {
                    //         // babel 配置 也可以设置在 .babelrc 中

                    //     }
                    // }
                },
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.vue?$/,
                    use: 'vue-loader'
                }
            ]
        },
        plugins: [
            // 生产模式下，设置抽离样式文件名称
            // 但是抽离出的样式文件未压缩，在webpack.prod.js > optimization > minimizer > OptimizeCSSAssetsPlugin 配置压缩css文件
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/base.css'
            }),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true
                }
            }),
            new PurgeCssWebpackPlugin({
                // glob.sync: 返回包含 src 目录下所有（深层）文件的文件名的数组
                paths: glob.sync("./src/**/*", { nodir: true })
            })
        ].filter(Boolean) // filter 过滤掉false，解决 !isDev && new XXX()的插件
    };

    // 返回配置文件，没返回的话，采用默认配置
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}