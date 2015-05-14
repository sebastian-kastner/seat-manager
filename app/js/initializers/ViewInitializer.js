define([
    'views/MenuView',
    'views/MemberFilterView'
], function (MenuView, MemberFilterView) {
    
    function initialize() {
        App.menu = new MenuView({el: "#menu"});
        App.searchFilter = new MemberFilterView({el : "#searchfilter"});
    }

    return {
        initialize : initialize
    };
});