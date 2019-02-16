// Karma configuration
// Generated on Wed Aug 22 2018 15:20:23 GMT+0300 (FLE Daylight Time)

module.exports = function(config) {
  config.set({

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: '',


	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['mocha', 'chai', 'sinon', 'browserify'],

	// list of plugins
	plugins: [
		'karma-mocha-reporter',
		'karma-webpack',
        'karma-coverage',
		'karma-mocha',
		'karma-chai',
		'karma-sinon',
		'karma-chrome-launcher',
		'karma-babel-preprocessor',
		'karma-browserify'
   ],
   //plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chai', 'karma-chrome-launcher', "karma-webpack", "karma-sourcemap-loader"],

	// list of files / patterns to load in the browser
	files: [
        // 'src/tests/test-setup.js',
		'src/tests/**/*.test.js'
		// 'test-main.js'
	],

	crossOriginAttribute: true,


	// list of files / patterns to exclude
	exclude: [
		
	],


	// preprocess matching files before serving them to the browser
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {
		 // 'src/*': ['browserify'],
         // 'src/tests/test-setup.js': ["browserify"],
		 'src/tests/**/*.test.js': ["browserify"]
	},
	
	browserify: {
        debug: true,
        transform: ['babelify', 'reactify', 'scssify'],

         // don't forget to register the extensions
        extensions: ['.js', '.jsx', '.css']
    },
	
	// babelPreprocessor: {
		// options: {
			// presets: ["react", "es2015", "stage-0"],
			// sourceMap: 'inline'
      // },
      // filename: function (file) {
        // return file.originalPath.replace(/\.js$/, '.es5.js');
      // },
      // sourceFileName: function (file) {
        // return file.originalPath;
      // }
    // },
    
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },


	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	//reporters: ['progress', 'coverage'],
	reporters: ['mocha'],


	// web server port
	port: 9876,


	// enable / disable colors in the output (reporters and logs)
	colors: true,


	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,


	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,


	// start these browsers
	// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
	browsers: ['Chrome'],


	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: false,

	// Concurrency level
	// how many browser should be started simultaneous
	concurrency: Infinity
  })
}
