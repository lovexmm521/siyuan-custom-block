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
                                { search: 'this', replace: '__SIYUAN_THIS__', flags: 'g' }
                            ]
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    // 步骤 1: 将 CSS 提取到独立文件中
                    MiniCssExtractPlugin.loader,
                    // 步骤 2: 将 CSS 转换为 CommonJS 模块
                    'css-loader',
                    // 步骤 3: 将 Sass/SCSS 编译成 CSS
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
        // 注册 CSS 提取插件，并指定输出的文件名
        new MiniCssExtractPlugin({
            filename: 'QianQian.css',
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
                                    source = source.replace(/__SIYUAN_THIS__/g, 'this');
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

