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
            var filterView = this;
            _.each(App.views.members, function (member) {
                if(filterView.matchesMember(member, filter)) {
                    member.show();
                } else {
                    member.hide();
                }
            });
        },
        isSet: function () {
            var val = this.$el.val();
            return (val !== null && val !== "");
        },
        matchesMember: function (member, filter) {
            if(!filter) {
                filter = filter = this.$el.val();
            }
            if (!filter && member.model.get("seat") && App.hideMembersWithSeat) {
                return false;
            } else {
                if (!filter || filter === "") {
                    return true;
                }
                var name = member.model.get("fullname");
                if (name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    });

    return FilterView;
});