const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWbpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    // 优化项配置
    optimization: {
        minimizer: [ // 压缩方案
            // 压缩css文件，用了这个以后，js也得手动压缩了
            new OptimizeCSSAssetsPlugin(),
            // 压缩js文件
            new TerserWbpackPlugin()
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new CleanWebpackPlugin({
        //     // 在打包目录清空 默认就是全部清空，所以可以不设置此参数
        //     cleanOnceBeforeBuildPatterns: ['**/*']
        // }),
    ]
}