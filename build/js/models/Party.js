define([
    'backbone'
], function (Backbone) {
    var Party = Backbone.Model.extend({
        defaults: {
            name: null,
            color: "lightgray",
            members : []
        },
        addMember : function(member) {
            this.get("members").push(member);
        }
    });
    return Party;
});