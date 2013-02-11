module.exports = function (grunt) {
	grunt.initConfig({
		meta: {
			version: '1.0.0',
			banner: '/*! Broadcast channels <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'* Written by Alberto La Rocca aka 71104 <https://github.com/71104>\n' +
					'* released under the MIT License\n' +
					'* part of the Canvace technology <http://www.canvace.com/>\n' +
					'* Copyright (c) <%= grunt.template.today("yyyy") %> Canvace Srl */',
		},
		lint: {
			dist: 'src/broadcast.js'
		},
		jshint: {
			options: {
				camelcase: true,
				curly: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				boss: true,
				debug: true,
				expr: true,
				loopfunc: true,
				multistr: true,
				smarttabs: true,
				supernew: true,
				node: true
			},
			globals: {
				module: false
			}
		},
		min: {
			dist: {
				src: [
					'<banner:meta.banner>',
					'src/broadcast.js'
				],
				dest: 'bin/broadcast.js'
			}
		}
	});
	grunt.registerTask('default', 'lint min');
};
