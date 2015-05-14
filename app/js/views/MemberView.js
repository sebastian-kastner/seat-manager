define([
    'backbone',
    'jquery',
    'jqueryui',
    'draggable'
], function (Backbone, $) {
    var MemberView = Backbone.View.extend({
        template: _.template("<div class='member'><%= fullname %></div>"),
        initialize: function (params) {
            this.parent = params.parent;
        },
        tagName: 'div',
        render: function () {
            var el = $(this.template(this.model.toJSON())).appendTo(this.parent);
            this.elementIndex = el.index();
            
            this.setElement(el);
            var memberView = this;

            this.$el.draggable({
                start: function () {
                    var draggedDiv = $(this);
                    draggedDiv.css({
                        "pointer-events": "none"
                    });

                    var offset = draggedDiv.offset();
                    var dragContainer = $("<div>");
                    dragContainer.css({
                        position: "absolute",
                        top: offset.top,
                        left: offset.left
                    });
                    $("body").append(dragContainer);

                    draggedDiv.detach();
                    dragContainer.append(draggedDiv);
                    
                    App.isDragMode = true;
                    App.draggedMember = memberView;
                },
                stop: function () {
                    var draggedDiv = $(this);
                    var parent = draggedDiv.parent();
                    
                    draggedDiv.detach();
                    parent.remove();
                    
                    $("#abgeordnete div").eq(memberView.elementIndex).before(draggedDiv);
                    draggedDiv.css("pointer-events", "auto");
                    memberView.assignToSeat(App.hoveredSeat);
                    
                    App.isDragMode = false;
                    App.draggedMember = null;
                },
                revert: function () {
                    if (App.draggedMember === null || App.hoveredSeat === null) {
                        return true;
                    }
                    return false;
                }
            });
            return this;
        },
        events : {
            mouseover : function() {
                var seatView = this.getSeatView();
                if(seatView) {
                    seatView.highlight();
                }
            },
            mouseout : function() {
                var seatView = this.getSeatView();
                if(seatView) {
                    seatView.removeHighlight();
                }
            }
        },
        getSeatView : function() {
            var seat = this.model.get("seat");
            if(!seat) {
                return;
            }
            return App.views.seats[seat.get("seat_id")];
        },
        assignToSeat: function (seatView) {
            if (seatView) {
                var memberOnNewSeat = seatView.model.get("member");
                var oldSeat = this.model.get("seat");
                // handle the seat assignment for the member that was assigned to the 
                // given seat before
                if (memberOnNewSeat) {
                    var newSeat = this.model.get("seat");

                    memberOnNewSeat.setSeat(newSeat);
                    var memberId = memberOnNewSeat.get("member_id");
                    App.views.members[memberId].handleSeatChange(newSeat);
                } else {
                    // remove assignment to old seat
                    if (oldSeat && oldSeat.set) {
                        oldSeat.set("member", null);
                    }
                }
            }
            var seatModel = null;
            if (seatView) {
                seatModel = seatView.model;
            }
            this.model.setSeat(seatModel);
            this.handleSeatChange(seatView);
        },
        removeFromSeat: function () {
            var seatModel = this.model.get("seat");
            seatModel.set("member", null);
            this.model.set("seat", null);
        },
        handleSeatChange: function (seat) {
            //dont hide if the filter matches the member
            if(App.searchFilter.isSet() && App.searchFilter.matchesMember(this)) {
                this.show();
            } else if (seat && App.hideMembersWithSeat) {
                //hide if it has a seat assigned and members with seats shall be hidden
                this.hide();
            } else {
                //show in any other case
                this.show();
            }
        },
        hide: function () {
            this.$el.css("display", "none");
        },
        show: function () {
            this.$el.attr("style", "");
            this.$el.css("position", "relative");
        }
    });

    return MemberView;
});