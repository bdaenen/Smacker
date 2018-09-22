(function(smack, $) {
    'use strict';
    var user = smack.getUser();
    if (user) {
        smack.$mainContent.find('#user-tag').text(', ' + user.tag);
    }
}(window.smack, window.jQuery));
