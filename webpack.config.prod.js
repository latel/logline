var pkg = require('./package.json');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        logline: './src/logline.js'
    },
    output: {
        path: './dist',
        filename: '[name].min.js',
        library: 'Logline',
        libraryTarget: 'umd',
        umdNameDefine: true,
        sourceMapFilename: '[name].min.map'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
            'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.BannerPlugin([
            pkg.name + ' v' + pkg.version + ' (' + pkg.homepage + ')',
            'Copyright ' + new Date().getFullYear() + ', ' + pkg.author,
            pkg.license + ' license'
        ].join('\n')),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ]

};
