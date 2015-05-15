define([
    'backbone',
    'views/MemberView'
], function (Backbone, MemberView) {
    var Notification = function(text, duration, isError) {
        function show() {
            var div = $("<div class='notification'>");
            div.text(text);
            div.css("width", "250px");
            div.css("right", "15px");
            div.css("top", "15px");
            if(isError) {
                div.css("background", "#ff9999");
            }
            div.mouseup(function() {
                div.remove();
            });
            
            $("body").append(div);
            div.fadeOut(duration, function() {
                div.remove();
            });
        }
        
        return {
            show : show
        };
    };
    
    return Notification;
});