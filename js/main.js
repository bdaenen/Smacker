(function() {
    'use strict';

    app.isAuthenticated(function(authenticated){
      if (!authenticated) {
        return app.loadPage('/login/login');
      }
      else {

      }
    });
}());
