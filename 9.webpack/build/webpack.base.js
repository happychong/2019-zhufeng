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
// js管理cdn资源引入插件 添加html资源作为cdn的webpack插件
const AddAssetHtmlCdnWebpackPlugin = require('add-asset-html-cdn-webpack-plugin');
// 引用打包好的第三方库
const DllReferencePlugin = require('webpack').DllReferencePlugin;
// 把打包好的第三方库的js，在html引入
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
// 打包分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// 费时分析插件 - 速度测量插件 ： 这里打包会报错，先注释掉，放弃应用
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
module.exports = (env) => {
    // env 是环境变量
    // "dev": "webpack --env.development --config ./build/webpack.base.js",
    console.log(env);
    // { development: true }

    let isDev = env.development;
    const base = {
        // js - react 入口文件
        // entry: path.resolve(__dirname, '../src/index.js'),
        // react - ts 入口文件
        // entry: path.resolve(__dirname, '../src/index-react.tsx'),
        // vue - ts 入口文件
        // entry: path.resolve(__dirname, '../src/index-vue.ts'),

        // entry 优化
        // entry 的3种写法 1：字符串  2：数组   3：对象
        // entry: path.resolve(__dirname, '../src/index-optimize.js'),
        // entry 的多入口配置
        entry: {
            index: path.resolve(__dirname, '../src/multiple-entry/index.js'),
            login: path.resolve(__dirname, '../src/multiple-entry/login.js'),
        },
        output: {
            // filename - 同步打包的名字
            // filename: 'bundle.js',
            filename: '[name].js', // 多入口 -> 也要配合多出口名称
            // 出口位置 要用绝对路径
            path: path.resolve(__dirname, '../dist'),
            // 异步打包的名字 ex: import()语法
            chunkFilename: '[name].min.js'
        },
        // 优化项配置
        optimization: {
            // 开发模式下，使用了哪个模块，打包代码中提示一下
            usedExports: true,
            
            splitChunks: { // 多入口文件，第三方公共代码的抽离配置，如果同时配置react的抽离的话，这里的配置没有dll优先级别高
                chunks: 'all', // async(默认)：支持异步代码的分割 ex：import()
                // async：只异步代码分割   initial：只同步代码分割   all：同步和异步都进行代码分割(单独打包)
                minSize: 30000, // 30000：文件超过30k，就会抽离它，，这里配置小点，以方便查看抽离打包效果
                // minRemainingSize: 0, // 最小的尺寸-webpack5新属性，确保拆分后保留的块的最小大小超过限制，从而避免模块大小为零
                maxSize: 0, // 最大的Size 0-无限制
                minChunks: 1, // 最少模块引用1次才抽离
                maxAsyncRequests: 6, // 最多抽离6个
                maxInitialRequests: 4, // 首页的请求，最多4个
                automaticNameDelimiter: '~', // 抽离的名字中间的分隔符 ex：xxx~a~b
                automaticNameMaxLength: 30, // 最长的名字的大小不能超过30字符
                cacheGroups: { // 缓存组
                    // 这里的优先级高级 splitChunks 下的设置
                    vue: { // vur~index~login.min.js
                        test: /[\\/]node_modules[\\/]vue/, // node_modules 下的 vue
                        // test: /[\\/]node_modules[\\/](react) | (react-dom)/, // 备注react写法
                        priority: -1 // 优先级  优先级别高的话，打包的时候会先匹配
                    },
                    defaultVendors: { // defaultVendors~index~login.min.js
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    common: { // common~index~login.min.js
                        minChunks: 2, // 至少引用2次
                        priority: -20,
                        minSize: 3,
                        reuseExistingChunk: true // 此项配置是否启用
                    }
                }
            }
        },
        // externals - 外部变量
        // externals: {
        //     // 代码中，import $ 的时候，使用 $ 的时候，是外部变量，不需要被打包
        //     'jquery': '$'
        // },
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
                    // use: {
                    //     loader: 'url-loader', 
                    //     // 希望当前比较小的图片转化为 base64 ，转化后尺寸比以前大，但是不用发http请求了
                    //     options: {
                    //         // 大于 100k 的图片，会用 file-loader
                    //         limit: 8 * 1024, // 一般为 8*1024
                    //         // 打包到目录下
                    //         name: 'image/[contentHash].[ext]'
                    //     }
                    // }
                    use: [{
                            loader: 'url-loader',
                            // 希望当前比较小的图片转化为 base64 ，转化后尺寸比以前大，但是不用发http请求了
                            options: {
                                // 大于 100k 的图片，会用 file-loader
                                limit: 8 * 1024, // 一般为 8*1024
                                // 打包到目录下
                                name: 'image/[contentHash].[ext]'
                            }
                        },
                        (!isDev) && {
                            // 可以在使用file-loader之前 对图片进行压缩
                            loader: 'image-webpack-loader',
                            options: {
                                // jpeg格式
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                // optipng.enabled: false will disable optipng
                                // 是否禁用png压缩：不禁用
                                optipng: {
                                    enabled: false,
                                },
                                // png格式
                                pngquant: {
                                    // 清晰度 64% - 90% 之间
                                    quality: [0.65, 0.90],
                                    speed: 4
                                },
                                // gif格式
                                gifsicle: {
                                    interlaced: false,
                                },
                                // the webp option will enable WEBP
                                // bp格式
                                webp: {
                                    quality: 75
                                }
                            }
                        }
                    ].filter(Boolean)
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
            // new htmlWebpackPlugin({
            //     template: path.resolve(__dirname, '../public/index.html'),
            //     filename: 'index.html',
            //     minify: !isDev && {
            //         removeAttributeQuotes: true,
            //         collapseWhitespace: true
            //     }
            // }),

            // entry 设置多入口了，html 也要配合多个 start
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                chunks: ['index'] // 打包index.html文件，其中引用了index.js
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'login.html',
                // chunks: ['login'], // 打包login.html文件，其中引用了login.js
                chunks: ['index', 'login'],
                // 如果 这个 login.html 中需要引用多个js文件，chunks可以设置多个，但是引用顺序并不按chunks中的顺序引用
                // chunksSortMode - 排序模式 : 可以设置 chunks 多个的时候，按照自己排列的顺序引用
                chunksSortMode: 'manual' // auto： 按照依赖排序   manual：手动排序,按照chunks的顺序引用js
            }),
            // entry 设置多入口了，html 也要配合多个 end
            // 生产模式下，设置抽离样式文件名称
            // 但是抽离出的样式文件未压缩，在webpack.prod.js > optimization > minimizer > OptimizeCSSAssetsPlugin 配置压缩css文件
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/base.css'
            }),
            new VueLoaderPlugin(),

            new PurgeCssWebpackPlugin({
                // glob.sync: 返回包含 src 目录下所有（深层）文件的文件名的数组
                paths: glob.sync("./src/**/*", { nodir: true })
            }),
            new AddAssetHtmlCdnWebpackPlugin(true, {
                'jquery': 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
            }),
            new DllReferencePlugin({
                manifest: path.resolve(__dirname, '../dll/manifest.json')
            }),
            // 把dll下的react.dll.js，拷贝到dist目录下，并让index.html引入react.dll.js
            new AddAssetHtmlWebpackPlugin({
                filepath: path.resolve(__dirname, '../dll/react.dll.js')
            }),
            !isDev && new BundleAnalyzerPlugin() // 生产环境下应用，运行npm run build 会起一个 http://127.0.0.1:8888 服务
        ].filter(Boolean) // filter 过滤掉false，解决 !isDev && new XXX()的插件
    };

    // 返回配置文件，没返回的话，采用默认配置
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
        // return smp.wrap(merge(base, prod));
    }
}