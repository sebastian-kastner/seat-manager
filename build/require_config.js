/* global require */

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        jqueryui: ["jquery"],
        draggable: ['jqueryui']
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        bootstrap: '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
        jqueryui: '../bower_components/jquery-ui/ui/jquery-ui',
        draggable: '../bower_components/jquery-ui/ui/jquery.ui.draggable'
    }
});