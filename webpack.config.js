const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'QianQian.js',
        path: path.resolve(__dirname, 'dist'),
        iife: false,
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            target: 'es6',
                        },
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            multiple: [
                                { search: 'return ', replace: '__SIYUAN_SCRIPT_RETURN__ = ', flags: 'g' },
                                // 【改动 1】: 将 'this' 伪装成一个不会被优化器修改的字符串属性访问
                                { search: 'this', replace: 'window["__SIYUAN_THIS__"]', flags: 'g' }
                            ]
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'QianQian.css',
        }),

        new webpack.BannerPlugin({
            banner: '/* @webpack */',
            raw: true,
            entryOnly: false,
            include: /\.css$/,
        }),

        // 我们自己的插件，只负责修复 JS 文件
        new (class SiyuanFinalizerPlugin {
            apply(compiler) {
                compiler.hooks.compilation.tap('SiyuanFinalizerPlugin', (compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: 'SiyuanFinalizerPlugin',
                            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
                        },
                        (assets) => {
                            for (const assetName in assets) {
                                if (assetName.endsWith('.js')) {
                                    let source = assets[assetName].source();
                                    source = source.replace(/__SIYUAN_SCRIPT_RETURN__\s*=\s*/g, 'return ');
                                    // 【改动 2】: 使用正则表达式精确地将伪装后的占位符复原成 'this'
                                    source = source.replace(/window\["__SIYUAN_THIS__"\]/g, 'this');
                                    assets[assetName] = new webpack.sources.RawSource(source);
                                }
                            }
                        }
                    );
                });
            }
        })(),
    ],
};
