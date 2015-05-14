define([
    'jquery'
], function ($) {
    function initialize() {
        var splitViewbox = $("#seating_chart")[0].getAttribute("viewBox").split(" ");
        App.viewbox = {
            x: splitViewbox[0],
            y: splitViewbox[1],
            width: splitViewbox[2],
            height: splitViewbox[3]
        };
    }

    return {
        initialize : initialize
    };
});