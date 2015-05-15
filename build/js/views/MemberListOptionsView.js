define([
    'backbone'
], function (Backbone) {
    var Menu = Backbone.View.extend({
        initialize: function () {
            $("#hideMembersWithSeat").attr("checked", App.hideMembersWithSeat);
        },
        events: {
            "click #hideMembersWithSeat": function (ev) {
                var hide = ev.currentTarget.checked;
                App.hideMembersWithSeat = hide;
                App.searchFilter.filterMembers();
            }
        },
        render: function () {
            return this;
        }
    });
    return Menu;
});