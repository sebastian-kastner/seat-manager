define([
    'backbone'
], function (Backbone) {
    var Member = Backbone.Model.extend({
        defaults: {
            firstname: null,
            name: null,
            title: null,
            fullname: null,
            party: null,
            seat: null,
            member_id: null
        },
        setSeat: function (seat) {
            this.set("seat", seat);
            if (seat) {
                seat.set("member", this);
            }
        },
        getImageUrl : function() {
            return App.imgUrl + this.get("member_id") + ".jpg";
        }
    });
    return Member;
});