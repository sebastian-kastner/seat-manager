/* global module, require */

//TODO
/*
 * build:
 * - minify (/)
 * - alle bower dependencies in eine datei (grunt-bower-concat, http://bower.io/docs/tools/)
 * - require.js in eine datei packen: grunt-bower-requirejs? grunt-contrib-requirejs?
 * - pfade in index (grunt-preprocess) und require.js (??) config anpassen
 * - unbenutze css styles von bootstrap entfernen: uncss (https://github.com/addyosmani/grunt-uncss)
 * 
 * watch:
 * - css changes -> css kompilieren und ersetzen
 * - evtl: pfade im html anpassen?
 * - require etc: nothing! 
 */


module.exports = function (grunt) {

    // load all libraries specified in the package.json
    // (instead of loading each library using  grunt.loadNpmTasks('...');
    require("matchdep")
            .filterDev("grunt-*")
            .forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        //define package.json to be used
        pkg: grunt.file.readJSON('package.json'),
        //setup htmlhint
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['app/index.html']
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "app/js",
                    mainConfigFile: "app/require_config.js",
                    include: [
                        "main.js",
                        "../bower_components/requirejs/require.js",
                        '../bower_components/jquery/dist/jquery.js',
                        '../bower_components/backbone/backbone.js',
                        '../bower_components/underscore/underscore.js',
                        '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                        '../bower_components/jquery-ui/ui/jquery-ui.js',
                        '../bower_components/jquery-ui/ui/jquery.ui.draggable.js'
                    ],
                    out: "app/build/app.min.js"
                }
            }
        },
        processhtml: {
            options: {
            },
            dist: {
                files: {
                    'app/build/index.html': ['app/index.html']
                }
            }
        },
        //uglify js
        uglify: {
            build: {
                files: {
                    'app/build/js/main.min.js': ['app/js/main.js']
                }
            }
        },
        //build css
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    'app/build/css/main.css': 'app/build/css/main.css'
                }
            },
            dev: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    'app/css/main.css': 'app/css/main.css'
                }
            }
        },
        cssmin: {
            build: {
                src: 'app/build/css/main.css',
                dest: 'app/build/css/main.css'
            }
        },
        sass: {
            build: {
                files: {
                    'app/build/css/main.css': 'app/sass/main.scss'
                }
            },
            dev: {
                files: {
                    'app/css/main.css': 'app/sass/main.scss'
                }
            }
        },
        //run tasks upon file changes
        watch: {
            css: {
                files: ['app/sass/**/*.scss'],
                tasks: ['buildcss:dev']
            }
        }
    });

    grunt.registerTask('default', []);

    grunt.registerTask('buildcss:build', ['sass:build', 'cssc:build', 'cssmin']);
    grunt.registerTask('buildcss:dev', ['sass:dev', 'cssc:dev']);

    grunt.registerTask('build', ['requirejs', 'processhtml', 'buildcss:build']);

};
