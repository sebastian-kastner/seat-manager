define([
    'jquery',
    'views/SeatView',
    'models/Seat'
], function ($, SeatView, Seat) {
    
    function initialize() {
        var seatsDom = $(".seat");
        App.views.seats = {};
        App.models.seats = {};
        seatsDom.each(function () {
            var seatId = $(this).attr("id");
            var seatModel = new Seat({seat_id: seatId});
            App.models.seats[seatId] = seatModel;
            App.views.seats[seatId] = new SeatView({model: seatModel, el: $(this)});
        });
    }

    return {
        initialize: initialize
    };
});