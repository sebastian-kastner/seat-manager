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
            this.setElement(el);
            var memberView = this;

            this.$el.draggable({
                start: function () {
                    $(this).css("pointer-events", "none");
                    App.isDragMode = true;
                    App.draggedMember = memberView;
                },
                stop: function () {
                    $(this).css("pointer-events", "auto");
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
            if(seatView) {
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
            if (seat && App.hideMembersWithSeat) {
                this.hide();
            } else {
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