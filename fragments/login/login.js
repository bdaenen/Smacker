(function(smack, $) {
  'use strict';
  $('#login_form').on('submit', function(e) {
    e.preventDefault();

    var data = $(this).serializeObject();
    smack.authenticate(data, function(user){
      if (user) {
        smack.loadPage('/home/home', {userTag: user.tag});
      }
    });
  })
}(window.smack, window.jQuery));
