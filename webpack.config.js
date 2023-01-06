const path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: './src/index.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    resolve: {
        extensions: ['.jsx', '.tsx', '.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.(js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: false,
                        presets: ['solid'],
                    }
                }
            }
        ],
    },
};