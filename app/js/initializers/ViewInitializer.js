define([
    'views/MenuView',
    'views/MemberFilterView',
    'views/MemberListOptionsView'
], function (MenuView, MemberFilterView, MemberListOptionsView) {
    
    function initialize() {
        App.menu = new MenuView({el: "#menu"});
        App.searchFilter = new MemberFilterView({el : "#searchfilter"});
        
        new MemberListOptionsView({
            el : "#sidebar .panel-heading"
        });
    }

    return {
        initialize : initialize
    };
});