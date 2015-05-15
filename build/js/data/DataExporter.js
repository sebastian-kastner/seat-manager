define([
    'underscore'
], function (_) {
    var exportData = function () {
        var data = {};
        data.parteien = [];
        data.abgeordnete = [];
        _.each(App.models.parties, function (party) {
            data.parteien.push({
                name : party.get("name"),
                color : party.get("color")
            });
        });
        _.each(App.models.members, function (member) {
            var memberObj = {
                id: member.get("member_id"),
                nachname: member.get("name"),
                vorname: member.get("firstname"),
                titel: member.get("title"),
                fraktion: member.get("party").get("name")
            };
            if(member.get("seat")) {
                memberObj.sitz = member.get("seat").get("seat_nr");
            }
            data.abgeordnete.push(memberObj);
        });
        return data;
    };
    
    return exportData;
});