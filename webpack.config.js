let path = require('path');

module.exports = {
    entry:[
         './js/main.js'
    ],
    output: {
        filename: 'build.js'
    },

    module: {
        rules: [
            {
                test: /\.js/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre',
                options: {
                    configFile: path.resolve('./.eslintrc'),
                    fix: true
                }
            }
        ],
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader',

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
