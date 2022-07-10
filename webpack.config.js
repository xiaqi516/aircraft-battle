const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'aircraft-battle': './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].min.js',
        publicPath: '/',
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: '> 2.5%',
                                },
                            ],
                            ['@babel/typescript'],
                        ],
                        sourceType: 'unambiguous',
                    },
                },
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: 'images/'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
    ]
};