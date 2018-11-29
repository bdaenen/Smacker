(function() {
    'use strict';

    window.config = {
      apiHost: 'https://smashtrack.benn0.be',
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
          list: '/characters',
          byUser: '/stats/user/characters'
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
