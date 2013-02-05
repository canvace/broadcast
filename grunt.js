/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		meta: {
			version: '1.0.0',
			banner: '/*! Broadcast channels <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'* Written by Alberto La Rocca aka 71104 <https://github.com/71104>\n' +
					'* part of the Canvace technology\n' +
					'* Copyright (c) <%= grunt.template.today("yyyy") %> Canvace Srl */',
		},
		concat: {
			dist: {
				src: [
					'<banner:meta.banner>',
					'<file_strip_banner:src/broadcast.js>'
				],
				dest: 'bin/broadcast.js'
			}
		},
		min: {
			dist: {
				src: [
					'<banner:meta.banner>',
					'<config:concat.dist.dest>'
				],
				dest: 'bin/broadcast.min.js'
			}
		},
		lint: {
				beforeconcat: [
					'src/broadcast.js'
				],
				afterconcat: '<config:concat.dist.dest>'
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
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
	});
	grunt.registerTask('default', 'lint:beforeconcat concat min');
};
