define([
    'backbone',
    'jquery',
    'views/ImportView',
    'data/DataExporter',
    'views/NotifactionView'
], function (Backbone, $, ImportView, Exporter, NotificationView) {
    var Menu = {};
    var Menu = Backbone.View.extend({
        initialize: function () {
            $("#showShortnames").attr("checked", App.showShortMemberNames);
            $("#showMemberImages").attr("checked", App.showMemberImages);
            $("#hideMembersWithSeat").attr("checked", App.hideMembersWithSeat);
            $("#flip").attr("checked", App.isFlipped);
        },
        events: {
            "click #save": function () {
                this.save();
            },
            "click #flip": function (ev) {
                flip(ev.currentTarget.checked);
            },
            "click #hideMembersWithSeat": function (ev) {
                this.hideMembersWithSeat(ev.currentTarget.checked);
            },
            "click #import": function () {
                ImportView.show();
            },
            "mousedown #exportAsText": function () {
                var exportButton = $("#exportAsText");
                var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Exporter()));
                exportButton.attr("href", 'data:' + data);
                exportButton.attr("download", "sitzplan.json");
            },
            "mouseup #exportAsText": function () {
                setTimeout(function () {
                    var exportButton = $("#exportAsText");
                    exportButton.attr("href", "#");
                    exportButton.attr("download", null);
                }, 500);
            },
            "click #exportAsImage": function () {
                var exportButton = $("#exportAsImage");
                var svg = $("#svg-container");
                var data = "image/svg+xml;charset=utf-8," + encodeURIComponent(svg.html());
                exportButton.attr("href", 'data:' + data);
                exportButton.attr("download", "sitzplan.svg");
            },
            "click #showMemberImages": function (ev) {
                App.showMemberImages = ev.currentTarget.checked;
                _.each(App.views.seats, function (seatView) {
                    seatView.update();
                });
            },
            "click #showShortnames": function (ev) {
                App.showShortMemberNames = ev.currentTarget.checked;
                _.each(App.views.seats, function (seatView) {
                    seatView.update();
                });
            }
        },
        render: function () {
            return this;
        },
        hideMembersWithSeat: function (menu, hide) {
            App.hideMembersWithSeat = hide;
            App.searchFilter.filterMembers();
        },
        save: function () {
            var data = Exporter();
            sessionStorage.setItem("seatingData", JSON.stringify(data));
            var notification = new NotificationView("Die Sitzplandaten wurden erfolgreich \n\
                                                     im Browsercache gespeichert", 7000);
            notification.show();
            return;
        }
    });
    function flip(flipped) {
        if (App.isFlipped === flipped) {
            return;
        }
        var layer = $("#flippable");
        if (App.isFlipped) {
            layer.removeAttr("transform");
            App.isFlipped = false;
        } else {
            layer.attr("transform", "translate(0, " + App.viewbox.height + ") scale(1, -1)");
            App.isFlipped = true;
        }
    }

    return Menu;
});