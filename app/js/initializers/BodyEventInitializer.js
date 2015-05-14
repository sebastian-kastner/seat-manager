define([
    'jquery'
], function ($) {
    function initialize() {
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
    }
    
    return {
        initialize : initialize
    };
});