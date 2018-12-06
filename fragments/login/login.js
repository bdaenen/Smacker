(function(app, $) {
  'use strict';
  $('#login_form').on('submit', function(e) {
    e.preventDefault();

    var data = $(this).serializeObject();
    app.authenticate(data, function(user){
      if (user) {
        app.loadPage('/home/home', {userTag: user.tag});
      }
    });
  })
}(window.app, window.jQuery));
