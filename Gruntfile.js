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
        //build css
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    'build/css/main.css': 'build/css/main.css',
                    'build/css/print.css': 'build/css/print.css'
                }
            },
            dev: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    'app/css/main.css': 'app/css/main.css',
                    'app/css/print.css': 'app/css/print.css'
                }
            }
        },
        cssmin: {
            build: {
                src: 'build/css/main.css',
                dest: 'build/css/main.css'
            }
        },
        sass: {
            build: {
                files: {
                    'build/css/main.css': 'app/sass/main.scss',
                    'build/css/print.css': 'app/sass/print.scss'
                }
            },
            dev: {
                files: {
                    'app/css/main.css': 'app/sass/main.scss',
                    'app/css/print.css': 'app/sass/print.scss'
                }
            }
        },
        clean: {
            build: ["build/*"],
            css: ["build/css/*.css.map"],
            cssDev: ["app/css/*.css.map"]
        },
        copy: {
            main: {
                files: [
                    {cwd: 'app', src: ['fonts/**', 'js/**'], dest: 'build', expand: true},
                    {cwd: 'app', src: ['index.html', 'require_config.js'], dest: 'build', expand: true},
                    {
                        cwd: 'app',
                        src: [
                            'bower_components/requirejs/require.js',
                            'bower_components/jquery/dist/jquery.js',
                            'bower_components/underscore/underscore.js',
                            'bower_components/backbone/backbone.js',
                            'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                            'bower_components/jquery-ui/ui/jquery-ui.js',
                            'bower_components/jquery-ui/ui/jquery.ui.draggable.js'
                        ],
                        dest: 'build',
                        expand: true
                    }
                ]
            }
        },
        uglify: {
            js: {
                cwd : 'app',
                src: 'js/**/*.js', 
                dest: 'build/', 
                expand: true, 
                flatten: false, 
                ext: '.js'
            },
            bower: {
                cwd : 'build',
                src : 'bower_components/**/*.js',
                dest : 'build',
                expand : true,
                flatten : false,
                ext : '.js'
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
    grunt.registerTask('buildcss:dev', ['sass:dev', 'cssc:dev', 'clean:cssDev']);

    grunt.registerTask('build', ['clean:build', 'buildcss:build', 'clean:css', 'copy', 'uglify:bower']);

};
