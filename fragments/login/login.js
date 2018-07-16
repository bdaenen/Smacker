(function() {
  'use strict';
  var app = window.app;
  $('#login_form').on('submit', function(e) {
    e.preventDefault();

    var data = $(this).serializeObject();
    window.app.authenticate(data, function(user){
      if (user) {
        app.loadPage('/home/home', {userTag: user.tag});
      }
    });
  })
}());
