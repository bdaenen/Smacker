(function() {
    'use strict';
    var app = window.app;
    var user = app.getUser();
    if (user) {
        app.$mainContent.find('#user-tag').text(', ' + user.tag);
    }
}());
