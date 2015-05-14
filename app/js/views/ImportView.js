define([
    'backbone',
    'underscore',
    'jquery',
    'data/DataLoader',
    'views/NotifactionView',
    'vendor/backbone.bootstrap-modal'
], function (Backbone, _, $, DataLoader, NotificationView) {
    var ImportView = Backbone.View.extend({
        tagName: 'p',
        importFile: null,
        template: '\
    Wählen sie eine Datei vom Typ .json oder .txt um Sitzplandaten zu importieren. \n\
    Diese Daten können sie über die "Exportieren als Text" \n\
    Funktion erzeugen oder erhalten Sie von ihrem Support\n\
    <br><br>\
    <input type="file" id="importFileUpload" accept=".json,.txt" name="files[]"/>',
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
            try {
                var data = JSON.parse(view.importFile);
            } catch (err) {
                var notification = new NotificationView("\
Die Daten konnten nicht erfolgreich importiert werden, bitte prüfen Sie das Dateiformat \n\
und wenden Sie sich gegebenfalls an den Support", 10000, true);
                notification.show();
                return;
            }
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

            App.searchFilter.filterMembers();
            var notification = new NotificationView("Die Daten wurden erfolgreich importiert", 7000);
            notification.show();
        }
    }

    return {
        show: showModal
    };
});