define([
    'backbone',
    'jquery',
    'models/Seat',
    'views/SeatView',
    'views/MenuView'
], function (Backbone, $, Seat, SeatView, MenuView) {

    var initializers = [];
    
    window.App = {
        collections: {},
        models: {},
        views: {},
        imgUrl: "http://www.bremische-buergerschaft.de/fileadmin/user_upload/images_lp18/",
        isDragMode: false, // whether or not a seat is currently being dragged
        hoveredSeat: null, //The seat that is currently hovered (SeatView)
        clickedSeat: null, //The seat that was clicked (SeatView)
        draggedMember: null, //the seat that is currently being dragged (SeatView)
        draggedSeatContainer: $("#draggedSeatContainer"), //The div describing the seat that is currently being dragged (div)
        isFlipped: false, // whether or not the chart is currently flipped
        memberListHovered: false, //whether or not the list of members is hovered by the mouse,
        searchFilter: null,
        hideMembersWithSeat: true,
        showMemberImages: false,
        showShortMemberNames: false,
        menu: null
    };

    App.addInitializer = function(initializer) {
        initializers.push(initializer);
    };
    
    App.start = function () {
        _.each(initializers, function(initializer) {
            initializer.initialize();
        });
    };

    return App;
});