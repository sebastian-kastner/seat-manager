define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var FilterView = Backbone.View.extend({
        initialize: function () {
            this.$el.val("");
        },
        events: {
            'keyup': function () {
                _.debounce(this.filterMembers(), 300);
            }
        },
        render: function () {
            return this;
        },
        filterMembers: function () {
            var filter = this.$el.val();
            _.each(App.views.members, function (member) {
                if (member.model.get("seat") && App.hideMembersWithSeat) {
                    member.hide();
                } else {
                    if (!filter || filter === "") {
                        member.show();
                    }
                    var name = member.model.get("fullname");
                    if (name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
                        member.show();
                    } else {
                        member.hide();
                    }
                }
            });
        }
    });

    return FilterView;
});