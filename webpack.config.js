const path = require('path');
const webpack = require('webpack');

module.exports = {
    // 设置构建模式
    mode: 'production',

    // 定义入口文件
    entry: './src/index.ts',

    // 配置输出
    output: {
        filename: 'QianQian.js',
        path: path.resolve(__dirname, 'dist'),
        // 关键配置 1: 禁止 Webpack 用函数包装我们的代码
        iife: false,
        // 关键配置 2: 告诉 Webpack 我们的代码最终会在一个 `this` 的上下文中执行
        globalObject: 'this',
    },

    // 配置如何处理不同类型的文件
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    // 第二步: 使用 esbuild 高效地将 TypeScript 编译成 JavaScript
                    {
                        loader: 'esbuild-loader',
                        options: {
                            target: 'es6',
                        },
                    },
                    // 第一步: 在编译前，将 `return` 和 `this` 关键字替换为安全的占位符
                    // 这是一个小技巧，用来绕过 esbuild 的“顶层 return/this 非法”的检查。
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
        ],
    },

    // 配置模块解析
    resolve: {
        extensions: ['.ts', '.js'],
    },

    // 禁用代码压缩，避免不必要的麻烦
    optimization: {
        minimize: false,
    },

    // 使用一个插件，负责将所有占位符恢复
    plugins: [
        new (class {
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
                                    // 恢复 `return`
                                    source = source.replace(
                                        /__SIYUAN_SCRIPT_RETURN__\s*=\s*/g,
                                        'return '
                                    );
                                    // 恢复 `this`
                                    source = source.replace(
                                        /__SIYUAN_THIS__/g,
                                        'this'
                                    );
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

