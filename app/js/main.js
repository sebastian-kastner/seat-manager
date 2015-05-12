/*global require*/
'use strict';

requirejs([
    'App',
    'backbone',
    'jquery',
    'underscore',
    'models/Member',
    'collections/Members',
    'views/MemberView',
    'models/Party',
    'collections/Parties',
    'views/PartyView',
    'models/Seat',
    'views/SeatView',
    'data/DataLoader',
    'views/ImportView',
    'bootstrap'
], function (App, Backbone, $, _, Member, Members, MemberView, Party, Parties, PartyView, Seat, SeatView, DataLoader, ImportView) {
    App.start();

    var localStorageData = sessionStorage.getItem("seatingData");
    if (localStorageData 
            && typeof localStorageData === "string" 
            && localStorageData.length > 0) {
        DataLoader(JSON.parse(localStorageData));
        _.each(App.views.parties, function (party) {
            party.render();
        });
    } else {
        ImportView.show();
    }
});