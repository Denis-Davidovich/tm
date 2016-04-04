/*global module: true */
module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> */'
		},
		outputDir: '<%= pkg.folders.build + pkg.name + "-" + pkg.version %>',
		clean: {
			all: ['<%=pkg.folders.build %>']
		},
		jshint: {
			src: '<%=pkg.folders.jsSource %>' + '**/*.js',
			grunt: ['gruntfile.js'],
			options: {
				jshintrc: '.jshintrc',
				globals: {
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "<%= pkg.folders.jsSource %>",
					name: "../../bower_components/almond/almond",
					include: "main",
					mainConfigFile: "<%= pkg.folders.jsSource %>/main.js",
					out: "<%= outputDir %>/modules/main.js",
					optimize: "uglify2",
					paths: {
						'angular':'../../bower_components/angular/angular.min'
					},
					generateSourceMaps: false,
					preserveLicenseComments: true,
					useSourceUrl: true,
					uglify2: {
						// TODO - angular.js is already minified, mangling destroys it, so mangling is currently globally disabled
						mangle: false
					}
				}
			}
		},
		processhtml: {
			build: {
				files: {
					"<%= outputDir %>/index.html": ['<%=pkg.folders.wwwRoot%>/index.html']
				}
			}
		},
		appcache: {
			options: {
				basePath: "<%= outputDir %>"
			},
			build: {
				dest: "<%= outputDir %>/<%= pkg.name %>.manifest",
				cache: "<%= outputDir %>/**/*",
				network: '*',
				fallback: ''
			}
		},
		compress: {
			tgz: {
				options: {
					mode: "tgz",
					archive: "<%= pkg.folders.build + pkg.name + '-' + pkg.version + '.tar.gz'%>"
				},
				expand: true,
				src:  ['**/*', '**/.*'],
				dest: '<%= pkg.name + "-" + pkg.version %>/',
				cwd: '<%= outputDir %>/'
			}
		},
		watch: {
			javascript: {
				files: ['<%=pkg.folders.jsSource %>' + '**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			html: {
				files: ['<%=pkg.folders.wwwRoot %>' + '**/*.html'],
				options: {
					livereload: true
				}
			},
            css: {
                files: ['<%=pkg.folders.wwwRoot %>' + '**/*.html'],
                options: {
                    livereload: true
                }
            },
			images: {
				files: ['<%=pkg.folders.wwwRoot %>' + 'images/*'],
				options: {
					livereload: true
				}
			}
		},
		connect: {
			server: {
				options:  {
					port: 8000,
					base: '',
					hostname: '*'
				}
			}
		},
		copy: {
            deploy: {
				files: [{
					expand: true,
					dest: '<%=deployOrdner %>',
					src: ['<%= pkg.name + "-" + pkg.version + ".tar.gz"%>'],
					cwd: '<%= pkg.folders.build%>'
				}]
			}
		},
        concat:{
            css:{
                src:['bower_components/material-design-lite/material.min.css'],
                dest: '<%= outputDir %>/style.css'
            }
        }
	});

	grunt.registerTask("install", "Create a deployable artifact for server environments", function () {
        grunt.task.run("jshint");
        grunt.task.run("clean:all");
        grunt.task.run("concat:css");
        grunt.task.run("requirejs");
        grunt.task.run("processhtml:build");
        grunt.task.run("appcache:build");
        grunt.task.run("compress");
    });

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('web', ['connect:server', 'watch']);

	//call grunt.loadNpmTasks for all dependencies in package.json which names start with "grunt-"
    require('load-grunt-tasks')(grunt);
};