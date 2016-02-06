module.exports = {
    entry: "./src/app.js",
    output: {
        path: "./static",
        filename: "bundle.js"
    },
	module:{
		loaders: [
			{ test: /\.js$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components)/,
				query: {
				   presets: ['es2015']
				}
			},
      { test: /\.html$/,
        loader: 'raw'
      }
		]
	},
    resolve: {
    }
};
