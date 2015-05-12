define([
    'backbone',
    'jquery',
    'models/Seat',
    'views/SeatView',
    'views/MenuView'
], function (Backbone, $, Seat, SeatView, MenuView) {

    //TODO it should not be necessary to make App global
    // define app wide state variables and data
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
        searchFilterField: null,
        hideMembersWithSeat: true,
        showMemberImages: false,
        showShortMemberNames: false,
        menu: null
    };

    App.start = function () {
        initMenu();
        initSvgViewbox();
        initSeats();
        initBodyEvents();
        initSearchFilter();
    };

    function initSvgViewbox() {
        var splitViewbox = $("#seating_chart")[0].getAttribute("viewBox").split(" ");
        App.viewbox = {
            x: splitViewbox[0],
            y: splitViewbox[1],
            width: splitViewbox[2],
            height: splitViewbox[3]
        };
    }

    function initSeats() {
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

    function initBodyEvents() {
        // monitor members that are being dragged or dropped
        var body = $("body");
        body.mousemove(function (ev) {
            handleSeatDrag(ev, App.draggedMember);
        });
        body.mouseup(function (ev) {
            handleSeatDragEnd(ev, App.draggedMember);
        });
        $("#abgeordnete").hover(function () {
            App.memberListHovered = true;
        }, function () {
            App.memberListHovered = false;
        });
    }

    function initSearchFilter() {
        App.searchFilterField = $("#searchfilter");
        App.searchFilterField.val("");
        App.searchFilterField.on("keyup", _.debounce(App.menu.filterMembers(), 300));
    }

    function initMenu() {
        App.menu = new MenuView({el: "#menu"});
    }

    function handleSeatDrag(ev, seat) {
        if (seat && App.clickedSeat) {
            moveDraggedSeatCaption(ev);
        }
    }

    function handleSeatDragEnd() {
        if (App.hoveredSeat) {
            App.draggedMember.assignToSeat(App.hoveredSeat);
        } else if (App.memberListHovered) {
            var memberView = getMemberView(App.draggedMember);
            memberView.removeFromSeat();
        }

        App.clickedSeat = null;
        App.draggedSeatContainer.css("visibility", "hidden");
        App.draggedSeat = null;
        App.isDragMode = false;
    }

    function getMemberView(memberModel) {
        var memberId = memberModel.get("member_id");
        return App.views.members[memberId];
    }

    function moveDraggedSeatCaption(ev) {
        App.draggedSeatContainer.css("left", (ev.pageX + 10) + "px");
        App.draggedSeatContainer.css("top", (ev.pageY + 10) + "px");
    }

    return App;
});