
module.exports = {
    entry: './public/app.jsx',
    output: {
        path: __dirname,
        filename: './client/js/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            
        },
        extensions: ['','.js','.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|.jsx?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query:
                  {
                    presets:["react", "stage-0", "es2015"]
                  },
                plugins: ["transform-decorators-legacy", "transform-es2015-modules-simple-commonjs"]
            }
        ]
    }
};
