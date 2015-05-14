/*global require*/
'use strict';

requirejs([
    'App',
    'data/DataLoader',
    'views/ImportView',
    'initializers/BodyEventInitializer',
    'initializers/SeatInitializer',
    'initializers/ViewInitializer',
    'initializers/SvgInitializer',
    'views/NotifactionView',
    'bootstrap'
], function (App, DataLoader, ImportView, BodyEventInit, SeatInit, ViewInit, SvgInit, NotificationView) {

    App.addInitializer(BodyEventInit);
    App.addInitializer(SeatInit);
    App.addInitializer(ViewInit);
    App.addInitializer(SvgInit);

    App.start();

    var localStorageData = sessionStorage.getItem("seatingData");
    if (localStorageData
            && typeof localStorageData === "string"
            && localStorageData.length > 0) {
        DataLoader(JSON.parse(localStorageData));
        _.each(App.views.parties, function (party) {
            party.render();
        });
        
        var notification = new NotificationView("Sitzplandaten erfolgreich aus dem Browsercache geladen!", 7000);
        notification.show();
        
        App.searchFilter.filterMembers();
    } else {
        ImportView.show();
    }
});