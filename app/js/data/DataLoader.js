define([
    'underscore',
    'jquery',
    'models/Member',
    'views/MemberView',
    'models/Party',
    'views/PartyView'
], function (_, $, Member, MemberView, Party, PartyView) {
    var loadData = function (data) {
        App.views.members = {};
        App.views.parties = {};

        App.models.members = {};
        App.models.parties = {};

        var sortedMembers = sortMembers(data);
        createMembersAndParties(sortedMembers, data);
        var sortedParties = sortParties(App.models.parties);
        createViews(sortedParties);
    };

    function sortMembers(data) {
        return data.abgeordnete.sort(function (a, b) {
            var nameA = a.nachname + a.vorname;
            var nameB = b.nachname + b.vorname;
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });
    }

    function createMembersAndParties(sortedData, data) {
        _.each(sortedData, function (item) {
            var party = null;
            for (var key in App.models.parties) {
                if (App.models.parties[key].get("name") === item.fraktion) {
                    party = App.models.parties[key];
                }
            }
            if (!party) {
                party = new Party({
                    name: item.fraktion,
                    color : data.parteien[item.fraktion],
                    members : []
                });
                App.models.parties[party.get("name")] = party;
            }

            var member = new Member({
                firstname: item.vorname,
                name: item.nachname,
                title: item.titel,
                fullname: item.titel + " " + item.nachname + " " + item.vorname,
                party: party,
                seat : item.sitz,
                member_id: item.id
            });

            App.models.members[item.id] = member;
            party.addMember(member);
        });
    }

    function sortParties(parties) {
        return _.sortBy(parties, function (party) {
            return -1 * party.get("members").length;
        });
    }

    function createViews(sortedParties) {
        var viewContainer = $("#abgeordnete");
        _.each(sortedParties, function (party) {
            var memberViews = [];
            _.each(party.get("members"), function (member) {
                var memberView = new MemberView({
                    model: member,
                    parent: viewContainer
                });
                var seatView = null;
                if(member.get("seat")) {
                    seatView = App.views.seats["seat_" + member.get("seat")];
                }
                memberView.assignToSeat(seatView);
                
                memberViews.push(memberView);
                App.views.members[member.get("member_id")] = memberView;
            });
            var partyView = new PartyView({
                model: party,
                memberViews: memberViews,
                parent: viewContainer
            });
            App.views.parties[party.get("name")] = partyView;
        });
    }

    return loadData;
});