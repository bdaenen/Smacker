(function() {
    'use strict';

    window.config = {
      apiHost: 'http://127.0.0.1:3000',
      endpoints: {
        login: {
          login: '/login'
        },
        matches: {
          list: '/matches',
          detail: '/matches',
          add: '/matches/add'
        },
        characters: {
          list: '/characters'
        },
        stages: {
          list: '/stages'
        },
        users: {
          list: '/users',
          add: '/users/add',
          change_password: '/users/change_password'
        },
        teams: {
          list: '/teams'
        }
      }
    };

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });
}());
