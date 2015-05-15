define([
    'backbone',
    '../models/Party'
], function (Backbone, Party) {
    var Parties = Backbone.Collection.extend({
        model : Party
    });
    return Parties;
});