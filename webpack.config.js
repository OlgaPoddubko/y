let path = require('path');
//var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry:[
        'babel-polyfill',
        './js/main.js'
    ],
    output: {
        filename: 'build.js'
    },

    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader',
                include: [
                    "./app/js",
                ],
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
