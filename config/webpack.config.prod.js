/*eslint-disable*/
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./webpack.common.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config');
const seen = new Set();
const nameLength = 4;
const path = require('path');


const publicConfig = {
    entry: {
        app: [
            '@babel/polyfill',
            config.appIndexJs
        ],
        vendor: config.reactzoology,
        views: config.viewers,
        utiles: config.utiles
    },

    output: {
        path: config.appbuild,
        filename: 'app/js/[name].[chunkhash:8].js',
        chunkFilename: 'app/js/[name].[chunkhash:8].bundle.js',
        publicPath: '/dist'
    },

    // devtool: 'source-map',
    mode: 'production',

    plugins: [
        new webpack.optimize.RuntimeChunkPlugin({
            name: 'runtime'
        }),

        new webpack.optimize.SplitChunksPlugin({
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    chunks: 'all',
                    minChunks: 2,
                    test: /node_modules\/(.*)\.js/,
                    maxInitialRequests: 5,
                    minSize: 30000,
                    name: 'vendor',
                },
                views: {
                    chunks: 'all',
                    minChunks: 2,
                    test: /node_modules\/(.*)\.js/,
                    maxInitialRequests: 5,
                    minSize: 30000,
                    name: 'vendor',
                },
                utiles: {
                    chunks: 'all',
                    minChunks: 2,
                    test: /node_modules\/(.*)\.js/,
                    maxInitialRequests: 5,
                    minSize: 30000,
                    name: 'vendor',
                }
            }
        }),

        //需要从本地文件拷贝到打包的dist文件下的
        new CopyWebpackPlugin([
            {
                from: path.resolve(config.appPublic, 'js'),
                to: path.resolve(config.appbuild, 'public/js')
            }]
        ),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),

        // root是必须要写的
        new CleanWebpackPlugin([path.resolve(config.appbuild, 'app'), path.resolve(config.appbuild, 'public')], {
            root: config.appPulicPath,
            verbose: true,
            dry: false
        }),

        // 整合css
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}],
            },
            canPrint: true
        }),

        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name;
            }
            const modules = Array.from(chunk.modulesIterable);
            if (modules.length > 1) {
                const hash = require('hash-sum');
                const joinedHash = hash(modules.map(m => m.id).join('_'));
                let len = nameLength;
                while (seen.has(joinedHash.substr(0, len))) {
                    len++;
                }
                seen.add(joinedHash.substr(0, len));
                return `chunk-${joinedHash.substr(0, len)}`;
            } else {
                return modules[0].id;
            }
        }),

        // 配和MiniCssExtractPlugin.loader, 提取css
        new MiniCssExtractPlugin({
            filename: 'app/css/[name].[contenthash:8].css',
            chunkFilename: 'app/css/[name].[contenthash:8].css'
        }),


        new UglifyJSPlugin({
            parallel: true,
            cache: true,
            include: /\/src/,

            uglifyOptions: {
                compress: {
                    drop_console: true,
                    reduce_vars: true
                },
                output: {
                    comments: false,
                    beautify: false
                }
            }
        })
    ],

    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: [
                'css-hot-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader?importLoaders=1',
                    options: {
                        publicPath: config.staticPublicPath,
                        minimize: true
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'less-loader',
                    options: {
                        // 使用less默认运行时替换配置的@color样式
                        modifyVars: config.color,
                        javascriptEnabled: true,
                    },
                }
            ]
        }, {
            test: /\.(sass|scss)$/,
            use: [
                'css-hot-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader?importLoaders=1',
                    options: {
                        publicPath: config.staticPublicPath,
                        minimize: true // css压缩
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }
            ]
        }]
    }
};

module.exports = merge(commonConfig, publicConfig);
