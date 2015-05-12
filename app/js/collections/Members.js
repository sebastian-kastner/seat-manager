define([
    'backbone',
    '../models/Member'
], function (Backbone, Member) {
    var Members = Backbone.Collection.extend({
        model : Member
    });
    return Members;
});