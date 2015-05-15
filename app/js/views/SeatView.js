define([
    'backbone',
    'jquery'
], function (Backbone, $) {
    var emptyColor = '#ffffff';
    var hoverColor = 'lightgray';
    var imageContainer = $("#member_images");
    var nameContainer = $("#member_names");

    var SeatView = Backbone.View.extend({
        initialize: function () {
            var self = this;
            this.$el.attr("fill", emptyColor);

            this.model.on("change:member", function () {
                self.hideMemberName();
                self.hideMemberImage();
                self.update();
            });
        },
        render: function () {
            return this;
        },
        update: function () {
            if (App.showMemberImages) {
                this.showMemberImg();
            } else if (App.hoveredSeat !== this) {
                this.hideMemberImage();
            }
            if (App.showShortMemberNames) {
                this.showShortMemberName();
            } else if (App.hoveredSeat !== this) {
                this.hideMemberName();
            }

            var memberModel = this.model.get("member");
            if (!memberModel) {
                this.$el.attr("fill", "#ffffff");
                this.hideMemberImage();
                this.hideMemberName();
            } else {
                var party = memberModel.get("party");
                var color = party.get("color");
                this.$el.attr("fill", color);
            }
        },
        highlight: function () {
            this.showMemberName();
            this.showMemberImg();
        },
        removeHighlight: function () {
            if (!App.showMemberImages) {
                this.hideMemberImage();
            }
            if (!App.showShortMemberNames) {
                this.hideMemberName();
            }
        },
        showMemberName: function () {
            var member = this.model.get("member");
            if (!member) {
                // nothing to show if there is no member on the seat
                return;
            }
            _showMemberText(this, member.get("fullname"));
        },
        showShortMemberName: function () {
            var member = this.model.get("member");
            if (!member) {
                // nothing to show if there is no member on the seat
                return;
            }
            var text = member.get("name").substr(0, 2)
                    + "," + member.get("firstname").substr(0, 1);
            _showMemberText(this, text);
        },
        showMemberImg: function () {
            var id = this.$el.attr("id") + "_img";
            var member = this.model.get("member");
            if (!member) {
                //nothing to show if there is no member on the seat
                return;
            }
            if ($("#" + id).length > 0) {
                // do nothing if an the image is already attached
                return;
            }
            var img = _createSvgElement("image", {
                transform: this.$el.attr("transform"),
                x: this.$el.attr("x"),
                y: this.$el.attr("y"),
                width: 40,
                height: 40,
                id: id,
                style: "pointer-events:none;"
            });

            img.setAttributeNS("http://www.w3.org/1999/xlink", "href", member.getImageUrl());
            imageContainer.append(img);
        },
        hideMemberName: function () {
            $("#" + this.el.id + "_rect").remove();
        },
        hideMemberImage: function () {
            $("#" + this.el.id + "_img").remove();
        },
        events: {
            mouseover: function (ev) {
                if (App.isDragMode) {
                    App.hoveredSeat = this;
                    this.$el.attr("fill", hoverColor);
                    return;
                }
                if (this.model.get("member")) {
                    this.highlight();
                }
            },
            mouseout: function (ev) {
                App.hoveredSeat = null;

                if (App.clickedSeat !== null && App.clickedSeat.el.id === this.el.id) {
                    App.draggedMember =
                            App.views.members[this.model.get("member").get("member_id")];
                    if (App.draggedMember) {
                        App.isDragMode = true;
                        App.draggedSeatContainer.css("visibility", "visible");
                        App.draggedSeatContainer.text(App.draggedMember.model.get("fullname"));
                    }
                }

                this.update();
                this.removeHighlight();
            },
            mousedown: function (ev) {
                App.clickedSeat = this;
                return false;
            }
        }
    });

    var _showMemberText = function (seat, displayText) {
        var member = seat.model.get("member");
        if (!member) {
            //nothing to show if there is no member
            return;
        }

        var id = seat.el.id + "_rect";
        if ($("#" + id).length > 0) {
            //nothing to do if the name is already displayed
            return;
        }

        var seatWidth = parseFloat(seat.$el.attr("width"));
        var seatX = parseFloat(seat.$el.attr("x"));
        var seatY = parseFloat(seat.$el.attr("y")) - 7;

        var transform = seat.$el.attr("transform");
        if (App.isFlipped) {
            //spiegelung rückgängig machen für die text gruppe
            transform = transform + "translate(0, " + App.viewbox.height + ") scale(1, -1)";
            seatY = App.viewbox.height - seatY + 10;
        }
        
        var g = _createSvgElement("g", {id: id, transform: transform});
        //append the text invisibly first so we can determine its width for pixel perfect positioning
        var text = _createSvgElement("text", {
            x: seatX,
            y: seatY,
            style : "visibility: hidden;"
        });
        var textNode = document.createTextNode(displayText);
        text.appendChild(textNode);
        g.appendChild(text);
        nameContainer.append(g);
        
        var textWidth = text.getBBox().width;
        
        var x = seatX + (seatWidth / 2) - (textWidth / 2);
        $(text).attr("x", x);
        $(text).css("visibility", "visible");
    };

    var _createSvgElement = function (element, attributes) {
        var el = document.createElementNS("http://www.w3.org/2000/svg", element);
        for (var attribute in attributes) {
            if (attributes[attribute] === undefined) {
                continue;
            }
            el.setAttributeNS(null, attribute, attributes[attribute]);
        }
        return el;
    };

    return SeatView;
});