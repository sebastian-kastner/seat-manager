define([
    'backbone'
], function (Backbone) {
    var Seat = Backbone.Model.extend({
        defaults: {
            seat_id: null,
            seat_nr: null,
            member : null
        },
        initialize : function(params) {
            this.attributes.seat_nr = parseInt(params.seat_id.substr(5));
        }
    });
    return Seat;
});