define([
    'backbone',
    'views/MemberView'
], function (Backbone, MemberView) {

    var PartyView = Backbone.View.extend({
        template: _.template("<div class='party'><%= name %></div>"),
        initialize: function (params) {
            this.parent = params.parent;
            this.memberViews = params.memberViews;
            this.el = this.template(this.model.toJSON());
        },
        tagName: 'div',
        render: function () {
            $(this.parent).append(this.el);
            for (var i in this.memberViews) {
                this.memberViews[i].render();
            }
            return this;
        }
    });

    return PartyView;
});