(function(app, $) {
    'use strict';
    var user = app.getUser();
    if (user) {
        app.$mainContent.find('#user-tag').text(', ' + user.tag);
    }
}(window.app, window.jQuery));
