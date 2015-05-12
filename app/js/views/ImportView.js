define([
    'backbone',
    'underscore',
    'jquery',
    'data/DataLoader',
    'vendor/backbone.bootstrap-modal',
], function (Backbone, _, $, DataLoader) {
    var ImportView = Backbone.View.extend({
        tagName: 'p',
        importFile: null,
        template: '\
    Wählen sie eine Datei die sie über die Exportieren als Text \n\
    Funktion erzeugt haben oder die sie vom Support erhalten haben\n\
    <br><br>\
    <input type="file" id="importFileUpload" name="files[]"/>',
        render: function () {
            this.$el.html(this.template);
            return this;
        },
        events: {
            "change #importFileUpload": function (ev) {
                if (ev.target.files.length !== 1) {
                    return;
                }
                var self = this;
                var reader = new FileReader();
                $(reader).on('load', function (load) {
                    self.importFile = load.target.result;
                });
                reader.readAsText(ev.target.files[0]);
            }
        }
    });

    var view;
    function showModal() {
        view = new ImportView();
        var modal = new Backbone.BootstrapModal({
            content: view,
            title: 'Zu importierende Datei auswählen',
            animate: false
        });
        modal.open(onSubmit);
    }

    function onSubmit() {
        if (view.importFile) {
            var data = JSON.parse(view.importFile);
            if (data) {
                App.views.parties = {};
                App.views.members = {};
                App.models.parties = {};
                App.models.members = {};
                $("#abgeordnete").empty();
                _.each(App.models.seats, function (seat) {
                    seat.set("member", null);
                });
                DataLoader(data);
                _.each(App.views.parties, function (party) {
                    party.render();
                });
            }
        }
    }

    return {
        show: showModal
    };
});